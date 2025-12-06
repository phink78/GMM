// Velo Backend Module: Lead Saving
// File: backend/leads-backend.js

import wixData from 'wix-data';

export async function saveLead(leadData) {
  try {
    const newLead = {
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
    };
    
    const result = await wixData.insert('Leads', newLead);
    console.log('Lead saved:', result._id);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to save lead: ${error.message}`);
  }
}
