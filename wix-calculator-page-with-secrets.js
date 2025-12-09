// ============================================
// WIX PAGE CODE - Calculator Page (with Secrets Manager + Logging)
// ============================================
// Deze versie gebruikt Wix Secrets Manager voor veilige API key opslag
// en logt alle events naar Vercel endpoint voor monitoring
// 
// SETUP:
// 1. Ga naar Settings → Secrets Manager in Wix
// 2. Voeg toe: PIPEDRIVE_API_KEY (je API key)
// 3. Voeg toe: PIPEDRIVE_COMPANY_DOMAIN (bijv. 'greenmarine')
// 4. Kopieer deze code naar je Calculator page
// 5. Save & Publish

import wixData from 'wix-data';
import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

// Log endpoint
const LOG_ENDPOINT = 'https://greenmarinemotors.com.vercel.app/api/wix-logs';

// ===== LOGGING HELPER =====
async function logToVercel(type, data, error = null) {
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        type: type,
        data: data,
        error: error ? {
          message: error.message,
          stack: error.stack
        } : null
      })
    });
  } catch (err) {
    // Fail silently - don't block lead processing if logging fails
    console.error('Failed to log to Vercel:', err);
  }
}

// ===== PAGE LOAD =====
$w.onReady(function () {
  console.log('Calculator page loaded');
  logToVercel('page_loaded', { page: 'calculator' });
  
  // Listen for messages from calculator iframe
  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleCalculatorMessage);
  }
});

// ===== MESSAGE HANDLER =====
function handleCalculatorMessage(event) {
  // Check if message is from our calculator
  if (event.data && event.data.type === 'GREEN_MARINE_LEAD') {
    console.log('Lead data received:', event.data.data);
    
    const leadData = event.data.data;
    
    // Log incoming lead
    logToVercel('lead_received', {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      boatType: leadData.boatType
    });
    
    // Save to Wix CMS first
    saveToWixCMS(leadData)
      .then((wixLead) => {
        console.log('Saved to Wix CMS:', wixLead);
        logToVercel('wix_cms_success', { leadId: wixLead._id });
        
        // Then send to Pipedrive
        return sendToPipedrive(leadData);
      })
      .then((pipedriveResult) => {
        console.log('Sent to Pipedrive:', pipedriveResult);
        logToVercel('pipedrive_success', { 
          personId: pipedriveResult.person.id,
          noteId: pipedriveResult.note.id 
        });
      })
      .catch((error) => {
        console.error('Error saving lead:', error);
        logToVercel('lead_error', { 
          firstName: leadData.firstName,
          email: leadData.email 
        }, error);
      });
  }
}

// ===== SAVE TO WIX CMS =====
async function saveToWixCMS(leadData) {
  const recommendation = leadData.recommendation;
  
  const leadToInsert = {
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    phone: leadData.phone,
    customerType: leadData.customerType,
    boatType: leadData.boatType,
    boatLength: leadData.boatLength,
    boatWeight: leadData.boatWeight,
    currentDrive: leadData.currentDrive,
    waterType: leadData.waterType,
    tripDuration: leadData.tripDuration,
    recommendedMotor: recommendation.motor,
    recommendedMotorPower: recommendation.motorPower,
    recommendedBattery: recommendation.batteryCapacity,
    recommendedSpeed: parseFloat(recommendation.cruisingSpeed),
    recommendedTime: parseFloat(recommendation.estimatedCruisingTime),
    submittedAt: new Date()
  };
  
  try {
    const result = await wixData.insert('Leads', leadToInsert);
    return result;
  } catch (error) {
    logToVercel('wix_cms_error', { email: leadData.email }, error);
    throw error;
  }
}

// ===== SEND TO PIPEDRIVE =====
async function sendToPipedrive(leadData) {
  const recommendation = leadData.recommendation;
  
  try {
    // Haal API credentials op uit Secrets Manager
    const PIPEDRIVE_API_KEY = await getSecret('PIPEDRIVE_API_KEY');
    const PIPEDRIVE_COMPANY_DOMAIN = await getSecret('PIPEDRIVE_COMPANY_DOMAIN');
    
    logToVercel('pipedrive_attempt', { 
      email: leadData.email,
      domain: PIPEDRIVE_COMPANY_DOMAIN 
    });
    
    // Step 1: Create Person in Pipedrive
    const personData = {
      name: `${leadData.firstName} ${leadData.lastName}`,
      email: [{
        value: leadData.email,
        primary: true,
        label: 'work'
      }],
      phone: [{
        value: leadData.phone,
        primary: true,
        label: 'work'
      }],
      visible_to: 3 // Zichtbaar voor hele bedrijf
    };
    
    const personResponse = await fetch(`https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/api/v1/persons?api_token=${PIPEDRIVE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personData)
    });
    
    const personResult = await personResponse.json();
    
    if (!personResult.success) {
      logToVercel('pipedrive_person_error', personResult);
      throw new Error('Failed to create person in Pipedrive');
    }
    
    const personId = personResult.data.id;
    
    // Step 2: Add Note with calculator details
    const noteData = {
      content: `
**Calculator Resultaten**

**Klanttype:** ${leadData.customerType}
**Boot:** ${leadData.boatType}
**Lengte:** ${leadData.boatLength}m
**Gewicht:** ${leadData.boatWeight}kg
**Huidige motor:** ${leadData.currentDrive}
**Vaargebied:** ${leadData.waterType}
**Gemiddelde tocht:** ${leadData.tripDuration}

**Aanbeveling:**
- Motor: ${recommendation.motor}
- Vermogen: ${recommendation.motorPower} kW
- Batterij: ${recommendation.batteryCapacity} kWh
- Vaartijd: ${recommendation.estimatedCruisingTime} uur
- Kruissnelheid: ${recommendation.cruisingSpeed} km/h
    `.trim(),
      person_id: personId,
      pinned_to_person_flag: true
    };
    
    const noteResponse = await fetch(`https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/api/v1/notes?api_token=${PIPEDRIVE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteData)
    });
    
    const noteResult = await noteResponse.json();
    
    return {
      person: personResult.data,
      note: noteResult.data
    };
  } catch (error) {
    logToVercel('pipedrive_error', { email: leadData.email }, error);
    throw error;
  }
}

// ===== HELPER: Test Pipedrive Connection =====
// Roep deze functie aan in de browser console om te testen:
// testPipedriveConnection()
export async function testPipedriveConnection() {
  try {
    logToVercel('test_connection_start', {});
    
    const PIPEDRIVE_API_KEY = await getSecret('PIPEDRIVE_API_KEY');
    const PIPEDRIVE_COMPANY_DOMAIN = await getSecret('PIPEDRIVE_COMPANY_DOMAIN');
    
    const response = await fetch(`https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/api/v1/users?api_token=${PIPEDRIVE_API_KEY}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Pipedrive connection successful!');
      console.log('Users:', result.data);
      logToVercel('test_connection_success', { userCount: result.data.length });
    } else {
      console.error('❌ Pipedrive connection failed:', result);
      logToVercel('test_connection_failed', result);
    }
  } catch (error) {
    console.error('❌ Error testing Pipedrive:', error);
    logToVercel('test_connection_error', {}, error);
  }
}
