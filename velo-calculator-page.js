// Velo Page Code for Green Marine Calculator
// Add this to your Wix page's Code tab

import wixData from 'wix-data';
import { calculateMotorRecommendation } from 'backend/calculator-backend';

export function page_load() {
  // Initialize calculator state with Green Marine logic
  window.calculatorState = {
    customerType: '',
    boatType: '',
    boatLength: 6,
    boatWeight: 2000,
    currentDrive: '',
    waterType: '',
    tripDuration: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    recommendation: null
  };
  
  // Set initial slider display
  $w('#boatLengthInput').value = 6;
  $w('#boatWeightInput').value = 2000;
  updateLengthDisplay();
  updateWeightDisplay();
}

// ===== STEP 1: Customer Type =====
export function particulierButton_click() {
  window.calculatorState.customerType = 'particulier';
  $w('#step1Container').hide();
  $w('#step2Container').show();
  updateProgress(1);
}

export function zakelijkButton_click() {
  window.calculatorState.customerType = 'zakelijk';
  $w('#step1Container').hide();
  $w('#step2Container').show();
  updateProgress(1);
}

// ===== STEP 2: Boat Type =====
export function boatTypeDropdown_change(event) {
  window.calculatorState.boatType = event.value;
  if (event.value) {
    $w('#step2Container').hide();
    $w('#step3Container').show();
    updateProgress(2);
  }
}

// ===== STEP 3: Boat Specs =====
export function boatLengthInput_change(event) {
  window.calculatorState.boatLength = event.value;
  updateLengthDisplay();
}

export function boatWeightInput_change(event) {
  window.calculatorState.boatWeight = event.value;
  updateWeightDisplay();
}

function updateLengthDisplay() {
  $w('#boatLengthDisplay').text = `${window.calculatorState.boatLength} meter`;
}

function updateWeightDisplay() {
  $w('#boatWeightDisplay').text = `${window.calculatorState.boatWeight} kg`;
}

export function specsNextButton_click() {
  $w('#step3Container').hide();
  $w('#step4Container').show();
  updateProgress(3);
}

// ===== STEP 4: Current Drive =====
export function currentDriveDropdown_change(event) {
  window.calculatorState.currentDrive = event.value;
  if (event.value) {
    $w('#step4Container').hide();
    $w('#step5Container').show();
    updateProgress(4);
  }
}

// ===== STEP 5: Water Type =====
export function waterTypeDropdown_change(event) {
  window.calculatorState.waterType = event.value;
  if (event.value) {
    $w('#step5Container').hide();
    $w('#step6Container').show();
    updateProgress(5);
  }
}

// ===== STEP 6: Trip Duration =====
export function tripDurationDropdown_change(event) {
  window.calculatorState.tripDuration = event.value;
  if (event.value) {
    showResultsAsync();
  }
}

async function showResultsAsync() {
  $w('#step6Container').hide();
  $w('#progressBar').hide();
  $w('#progressText').hide();
  $w('#resultsContainer').show();
  
  try {
    // Call backend to calculate recommendation
    const rec = await calculateMotorRecommendation(window.calculatorState);
    window.calculatorState.recommendation = rec;
    
    // Display results
    $w('#motorNameDisplay').text = rec.motor;
    $w('#motorPowerDisplay').text = `${rec.motorPower} kW`;
    $w('#batteryCapacityDisplay').text = `${rec.batteryCapacity} kWh`;
    $w('#cruisingSpeedDisplay').text = `${rec.cruisingSpeed} km/h`;
    $w('#cruisingTimeDisplay').text = `${rec.estimatedCruisingTime} uur`;
    $w('#tipText').text = `💡 Bij kruissnelheid (${rec.cruisingSpeed} km/h) verbruikt u slechts ${rec.requiredPowerCruising} kW.`;
  } catch (error) {
    console.error('Calculation error:', error);
    $w('#errorText').text = 'Fout bij berekening. Probeer opnieuw.';
  }
}

// ===== LEAD FORM =====
export function contactFormButton_click() {
  $w('#resultsContainer').hide();
  $w('#contactFormContainer').show();
}

export async function submitLeadButton_click() {
  const { firstName, lastName, email, phone } = window.calculatorState;
  
  // Update from form inputs
  window.calculatorState.firstName = $w('#firstNameInput').value;
  window.calculatorState.lastName = $w('#lastNameInput').value;
  window.calculatorState.email = $w('#emailInput').value;
  window.calculatorState.phone = $w('#phoneInput').value;
  
  if (!window.calculatorState.firstName || !window.calculatorState.lastName || 
      !window.calculatorState.email || !window.calculatorState.phone) {
    $w('#formErrorText').text = 'Vul alle velden in.';
    return;
  }
  
  try {
    $w('#submitLeadButton').disable();
    $w('#submitLeadButton').label = 'Bezig met verzenden...';
    
    // Save lead to Wix collection
    await saveLead(window.calculatorState);
    
    $w('#contactFormContainer').hide();
    $w('#successContainer').show();
    
    // Optional: Reset after 3 seconds
    setTimeout(() => location.reload(), 3000);
  } catch (error) {
    console.error('Lead submission error:', error);
    $w('#formErrorText').text = 'Fout bij verzenden. Probeer opnieuw.';
  } finally {
    $w('#submitLeadButton').enable();
    $w('#submitLeadButton').label = 'Offerte aanvragen';
  }
}

export function backFromFormButton_click() {
  $w('#contactFormContainer').hide();
  $w('#resultsContainer').show();
}

export function resetButton_click() {
  location.reload();
}

// ===== HELPER FUNCTIONS =====
function updateProgress(step) {
  const totalSteps = 6;
  const progress = Math.round((step / totalSteps) * 100);
  $w('#progressBar').style.width = `${progress}%`;
  $w('#progressText').text = `Stap ${step} van ${totalSteps}`;
}

async function saveLead(leadData) {
  return await wixData.insert('Leads', {
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
    recommendedMotor: leadData.recommendation?.motor,
    recommendedMotorPower: leadData.recommendation?.motorPower,
    recommendedBattery: leadData.recommendation?.batteryCapacity,
    recommendedSpeed: leadData.recommendation?.cruisingSpeed,
    recommendedTime: leadData.recommendation?.estimatedCruisingTime,
    submittedAt: new Date()
  });
}

// Import backend function
import { saveLead } from 'backend/leads-backend';
