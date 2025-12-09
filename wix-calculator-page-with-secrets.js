// ============================================
// WIX PAGE CODE - Calculator Page (with Secrets Manager)
// ============================================
// Deze versie gebruikt Wix Secrets Manager voor veilige API key opslag
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

// ===== PAGE LOAD =====
$w.onReady(function () {
  console.log('✅ Calculator page loaded');
  
  // Listen for messages from calculator iframe
  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleCalculatorMessage);
  }
});

// ===== MESSAGE HANDLER =====
function handleCalculatorMessage(event) {
  // Check if message is from our calculator
  if (event.data && event.data.type === 'GREEN_MARINE_LEAD') {
    console.log('📨 Lead data received:', event.data.data);
    
    const leadData = event.data.data;
    
    // Save to Wix CMS first
    saveToWixCMS(leadData)
      .then((wixLead) => {
        console.log('✅ Saved to Wix CMS:', wixLead._id);
        
        // Then send to Pipedrive
        return sendToPipedrive(leadData);
      })
      .then((pipedriveResult) => {
        console.log('✅ Sent to Pipedrive - Person:', pipedriveResult.person.id, 'Note:', pipedriveResult.note.id);
      })
      .catch((error) => {
        console.error('❌ Error saving lead:', error);
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
  
  return wixData.insert('Leads', leadToInsert);
}

// ===== SEND TO PIPEDRIVE =====
async function sendToPipedrive(leadData) {
  const recommendation = leadData.recommendation;
  
  // Haal API credentials op uit Secrets Manager
  const PIPEDRIVE_API_KEY = await getSecret('PIPEDRIVE_API_KEY');
  const PIPEDRIVE_COMPANY_DOMAIN = await getSecret('PIPEDRIVE_COMPANY_DOMAIN');
  
  console.log('🔄 Connecting to Pipedrive...');
  
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
    throw new Error('Failed to create person in Pipedrive');
  }
  
  const personId = personResult.data.id;
  console.log('✅ Person created:', personId);
  
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
  console.log('✅ Note added:', noteResult.data.id);
  
  return {
    person: personResult.data,
    note: noteResult.data
  };
}

// ===== HELPER: Test Pipedrive Connection =====
// Roep deze functie aan in de browser console om te testen:
// testPipedriveConnection()
export async function testPipedriveConnection() {
  try {
    const PIPEDRIVE_API_KEY = await getSecret('PIPEDRIVE_API_KEY');
    const PIPEDRIVE_COMPANY_DOMAIN = await getSecret('PIPEDRIVE_COMPANY_DOMAIN');
    
    console.log('🔄 Testing Pipedrive connection...');
    
    const response = await fetch(`https://${PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/api/v1/users?api_token=${PIPEDRIVE_API_KEY}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Pipedrive connection successful!');
      console.log('Users:', result.data);
    } else {
      console.error('❌ Pipedrive connection failed:', result);
    }
  } catch (error) {
    console.error('❌ Error testing Pipedrive:', error);
  }
}
