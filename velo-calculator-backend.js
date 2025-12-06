// Velo Backend Module: Calculator Logic
// File: backend/calculator-backend.js

export async function calculateMotorRecommendation(formData) {
  const length = parseFloat(formData.boatLength) || 6;
  const weight = parseFloat(formData.boatWeight) || 2000;
  
  // Motor database (Green Marine products)
  const motors = [
    { name: 'GM 2kW', power: 2, maxWeight: 1500, batteryOptions: [5, 10] },
    { name: 'GM 4kW', power: 4, maxWeight: 3000, batteryOptions: [10, 15, 20] },
    { name: 'GM 6kW', power: 6, maxWeight: 5000, batteryOptions: [15, 20, 30] },
    { name: 'GM 10kW', power: 10, maxWeight: 8000, batteryOptions: [20, 30, 40] },
    { name: 'GM 16kW', power: 16, maxWeight: 12000, batteryOptions: [30, 40, 50] },
    { name: 'GM 25kW', power: 25, maxWeight: 20000, batteryOptions: [40, 50, 60] }
  ];
  
  // Duration mapping
  const durationMap = { '2-4': 3, '4-8': 6, '8+': 10 };
  const desiredHours = durationMap[formData.tripDuration] || 6;
  
  // Hull speed calculation (Froude formula)
  const maxHullSpeed = 4.5 * Math.sqrt(length);
  const cruisingSpeed = maxHullSpeed * 0.7; // 70% of hull speed
  
  // Power requirement
  const displacementTons = weight / 1000;
  const cruisingSpeedKnots = cruisingSpeed / 1.852;
  let requiredPowerCruising = Math.pow(displacementTons, 0.67) * Math.pow(cruisingSpeedKnots, 3) / 150;
  requiredPowerCruising = requiredPowerCruising * 1.3; // 30% safety margin
  
  const maxPower = requiredPowerCruising * 6;
  
  // Find suitable motor
  const suitableMotor = motors.find(m => m.power >= requiredPowerCruising && m.maxWeight >= weight) 
    || motors[motors.length - 1];
  
  // Battery calculation
  const batteryCapacity = requiredPowerCruising * desiredHours;
  const recommendedBattery = suitableMotor.batteryOptions.find(b => b >= batteryCapacity) 
    || suitableMotor.batteryOptions[suitableMotor.batteryOptions.length - 1];
  
  const actualCruisingTime = recommendedBattery / requiredPowerCruising;
  
  return {
    maxHullSpeed: maxHullSpeed.toFixed(1),
    cruisingSpeed: cruisingSpeed.toFixed(1),
    requiredPowerCruising: requiredPowerCruising.toFixed(2),
    maxPower: maxPower.toFixed(1),
    motor: suitableMotor.name,
    motorPower: suitableMotor.power,
    batteryCapacity: recommendedBattery,
    estimatedCruisingTime: actualCruisingTime.toFixed(1),
    volgasTime: (recommendedBattery / maxPower).toFixed(1)
  };
}
