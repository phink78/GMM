import React, { useState } from 'react';

// ============================================
// GREEN MARINE CALCULATOR v2.1
// ============================================
// Updated: 05-12-2025 (meeting feedback Douwe)
// 
// Features:
// - Cruising speed calculation (70% of hull speed)
// - Boat types from website form (sloep, zeilboot, motorboot, speedboot, werkboot, anders)
// - Drive types: geen/binnenboord (buitenboord removed)
// - Time ranges: 2-4, 4-8, 8+ uur (0-2 removed)
// - Prominent results with motor recommendation
// - USPs from website
// - Sliders for length/weight
//
// TODO: 
// - Koppeling met Wix database (Find your Green Marine)
// - Koppeling met Pipedrive (wacht op info van Douwe)
// ============================================

export default function GreenMarineCalculator() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    customerType: '',
    boatType: '',
    boatLength: 6,
    boatWeight: 2000,
    currentDrive: '',
    waterType: '',
    tripDuration: '',
    // Contact fields
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Green Marine brand colors
  const colors = {
    deepseaBlue: '#444496',
    marineGreen: '#3CEF2F',
    marineGreenDark: '#2BC41E',
    charcoalBlack: '#262526',
    prettyWhite: '#FFFFFF',
    kingOrange: '#FF6D00',
    lightGray: '#f5f7f9'
  };

  // Motor database (simplified - expand with actual Green Marine products)
  const motors = [
    { name: 'GM 2kW', power: 2, maxWeight: 1500, batteryOptions: [5, 10] },
    { name: 'GM 4kW', power: 4, maxWeight: 3000, batteryOptions: [10, 15, 20] },
    { name: 'GM 6kW', power: 6, maxWeight: 5000, batteryOptions: [15, 20, 30] },
    { name: 'GM 10kW', power: 10, maxWeight: 8000, batteryOptions: [20, 30, 40] },
    { name: 'GM 16kW', power: 16, maxWeight: 12000, batteryOptions: [30, 40, 50] },
    { name: 'GM 25kW', power: 25, maxWeight: 20000, batteryOptions: [40, 50, 60] }
  ];

  // Calculate recommendations based on Douwe's formula
  const calculateRecommendation = () => {
    const length = parseFloat(formData.boatLength) || 6;
    const weight = parseFloat(formData.boatWeight) || 2000;
    
    // Duration mapping to hours
    const durationMap = {
      '2-4': 3,
      '4-8': 6,
      '8+': 10
    };
    const desiredHours = durationMap[formData.tripDuration] || 6;

    // Hull speed calculation (Froude formula)
    // Hull speed in km/h = 4.5 * sqrt(LWL in meters)
    const maxHullSpeed = 4.5 * Math.sqrt(length);
    
    // Cruising speed is 70% of hull speed (per Douwe's tool)
    const cruisingSpeed = maxHullSpeed * 0.7;

    // Power requirement calculation
    // Based on displacement and speed
    // Simplified formula: Power (kW) = (displacement in tons)^0.67 * (speed in knots)^3 / 150
    const displacementTons = weight / 1000;
    const cruisingSpeedKnots = cruisingSpeed / 1.852;
    
    // Required power at cruising speed
    let requiredPowerCruising = Math.pow(displacementTons, 0.67) * Math.pow(cruisingSpeedKnots, 3) / 150;
    
    // Apply 30% safety margin (per Douwe's tool)
    requiredPowerCruising = requiredPowerCruising * 1.3;
    
    // Max power (volgas) is approximately 6x cruising power for displacement hulls
    const maxPower = requiredPowerCruising * 6;

    // Find suitable motor
    const suitableMotor = motors.find(m => m.power >= requiredPowerCruising && m.maxWeight >= weight) 
      || motors[motors.length - 1];

    // Battery capacity needed for desired cruising time
    const batteryCapacity = requiredPowerCruising * desiredHours;
    
    // Find closest battery option
    const recommendedBattery = suitableMotor.batteryOptions.find(b => b >= batteryCapacity) 
      || suitableMotor.batteryOptions[suitableMotor.batteryOptions.length - 1];

    // Actual cruising time with recommended battery
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
      // Volgas time for comparison
      volgasTime: (recommendedBattery / maxPower).toFixed(1)
    };
  };

  const steps = [
    {
      id: 'customerType',
      title: 'Type klant',
      subtitle: 'Bent u particulier of zakelijk?',
      options: [
        { value: 'particulier', label: 'Particulier', icon: '/uploads/particulier.png' },
        { value: 'zakelijk', label: 'Zakelijk', icon: '/uploads/zakelijk.png' }
      ],
      hasIcons: true
    },
    {
      id: 'boatType',
      title: 'Type boot',
      subtitle: 'Wat voor boot heeft u?',
      options: [
        { value: 'sloep', label: 'Sloep' },
        { value: 'zeilboot', label: 'Zeilboot' },
        { value: 'motorboot', label: 'Motorboot' },
        { value: 'speedboot', label: 'Speedboot' },
        { value: 'werkboot', label: 'Werkboot' },
        { value: 'anders', label: 'Anders' }
      ],
      hasIcons: false
    },
    {
      id: 'boatSpecs',
      title: 'Boot specificaties',
      subtitle: 'Vul de gegevens van uw boot in',
      type: 'input'
    },
    {
      id: 'currentDrive',
      title: 'Huidige aandrijving',
      subtitle: 'Wat voor motor heeft uw boot nu?',
      options: [
        { value: 'geen', label: 'Geen motor' },
        { value: 'binnenboord', label: 'Binnenboord' }
      ],
      hasIcons: false
    },
    {
      id: 'waterType',
      title: 'Vaargebied',
      subtitle: 'Waar vaart u voornamelijk?',
      options: [
        { value: 'binnenwater', label: 'Binnenwater' },
        { value: 'kustwater', label: 'Kustwater' },
        { value: 'beide', label: 'Beide' }
      ],
      hasIcons: false
    },
    {
      id: 'tripDuration',
      title: 'Gemiddelde vaartocht',
      subtitle: 'Hoe lang vaart u gemiddeld?',
      options: [
        { value: '2-4', label: '2-4 uur' },
        { value: '4-8', label: '4-8 uur' },
        { value: '8+', label: '8+ uur' }
      ],
      hasIcons: false
    }
  ];

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-advance to next step
    setTimeout(() => {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        setShowResults(true);
      }
    }, 300);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecsSubmit = () => {
    setStep(step + 1);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    const submissionData = {
      // Customer info
      customerType: formData.customerType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      // Boat specs
      boatType: formData.boatType,
      boatLength: formData.boatLength,
      boatWeight: formData.boatWeight,
      currentDrive: formData.currentDrive,
      waterType: formData.waterType,
      tripDuration: formData.tripDuration,
      // Calculated recommendation
      recommendedMotor: recommendation?.motor,
      recommendedMotorPower: recommendation?.motorPower,
      recommendedBattery: recommendation?.batteryCapacity,
      estimatedCruisingTime: recommendation?.estimatedCruisingTime,
      cruisingSpeed: recommendation?.cruisingSpeed,
      // Metadata
      submissionDate: new Date().toISOString(),
      source: 'calculator'
    };

    console.log('Form submission data:', submissionData);

    // ===========================================
    // TODO: KOPPELING MET WIX EN PIPEDRIVE
    // ===========================================
    // Optie 1: Wix Forms API
    // await fetch('https://www.wixapis.com/...', { ... });
    //
    // Optie 2: Wix Velo backend functie
    // await wixData.insert('FindYourGreenMarine', submissionData);
    //
    // Optie 3: Webhook naar Zapier/Make die doorstuurt naar Pipedrive
    // await fetch('https://hooks.zapier.com/...', { ... });
    // ===========================================

    // Placeholder success
    alert('Bedankt voor uw aanvraag! We nemen binnen 24 uur contact met u op.');
  };

  const currentStep = steps[step];
  const recommendation = showResults ? calculateRecommendation() : null;

  return (
    <div style={{
      fontFamily: '"Quicksand", "Segoe UI", sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: colors.prettyWhite,
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(68, 68, 150, 0.12)'
    }}>
      
      {/* Header */}
      <div style={{
        background: colors.deepseaBlue,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src="/uploads/logo_gmTekengebied_1green_marine.png" 
          alt="Green Marine" 
          style={{
            height: '40px',
            width: 'auto'
          }}
        />
      </div>

      {/* Accent bar */}
      <div style={{
        height: '4px',
        background: `linear-gradient(90deg, ${colors.kingOrange} 0%, ${colors.marineGreen} 100%)`
      }} />

      {/* Intro Text */}
      <div style={{
        padding: '20px 24px',
        textAlign: 'center',
        borderBottom: `1px solid ${colors.lightGray}`
      }}>
        <h2 style={{
          margin: '0 0 6px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: colors.charcoalBlack
        }}>
          Ontdek welke motor bij jouw boot past
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          In <span style={{ color: colors.kingOrange, fontWeight: '600' }}>2 minuten</span> een persoonlijke aanbeveling
        </p>
      </div>

      {/* Progress Bar */}
      {!showResults && !showContactForm && (
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${colors.lightGray}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '13px', color: '#666' }}>
              Stap {step + 1} van {steps.length}
            </span>
            <span style={{ fontSize: '13px', color: colors.kingOrange, fontWeight: '600' }}>
              {Math.round(((step + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div style={{
            height: '6px',
            backgroundColor: colors.lightGray,
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((step + 1) / steps.length) * 100}%`,
              backgroundColor: colors.marineGreen,
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Content Area */}
      <div style={{ padding: '32px 24px' }}>
        
        {/* Step Content */}
        {!showResults && !showContactForm && (
          <>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '22px',
              fontWeight: '700',
              color: colors.charcoalBlack
            }}>
              {currentStep.title}
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '15px',
              color: '#666'
            }}>
              {currentStep.subtitle}
            </p>

            {/* Options Grid */}
            {currentStep.options && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: currentStep.hasIcons ? '1fr 1fr' : (currentStep.options.length <= 3 ? '1fr' : 'repeat(2, 1fr)'),
                gap: '12px'
              }}>
                {currentStep.options.map(option => {
                  const isSelected = formData[currentStep.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(currentStep.id, option.value)}
                      className="option-button"
                      style={{
                        padding: currentStep.hasIcons ? '24px 20px' : '18px 20px',
                        backgroundColor: isSelected ? colors.deepseaBlue : colors.prettyWhite,
                        border: `2px solid ${isSelected ? colors.deepseaBlue : '#e0e0e0'}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: currentStep.hasIcons ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: currentStep.hasIcons ? '12px' : '0',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {currentStep.hasIcons && option.icon && (
                        <img 
                          src={option.icon} 
                          alt="" 
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'contain',
                            filter: isSelected 
                              ? 'brightness(0) invert(1)' 
                              : 'sepia(1) saturate(5) hue-rotate(200deg) brightness(0.4)',
                            transition: 'filter 0.2s ease'
                          }}
                        />
                      )}
                      <span style={{
                        fontSize: currentStep.hasIcons ? '15px' : '16px',
                        fontWeight: '600',
                        color: isSelected ? colors.prettyWhite : colors.charcoalBlack,
                        transition: 'color 0.2s ease'
                      }}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Slider Fields for Boat Specs */}
            {currentStep.type === 'input' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '12px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.deepseaBlue
                    }}>
                      Lengte waterlijn (LWL)
                    </label>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: colors.charcoalBlack
                    }}>
                      {formData.boatLength || 6} <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>meter</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    step="0.5"
                    value={formData.boatLength || 6}
                    onChange={(e) => handleInputChange('boatLength', e.target.value)}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, ${colors.marineGreen} 0%, ${colors.marineGreen} ${((formData.boatLength || 6) - 3) / 17 * 100}%, #e0e0e0 ${((formData.boatLength || 6) - 3) / 17 * 100}%, #e0e0e0 100%)`,
                      outline: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '6px'
                  }}>
                    <span>3m</span>
                    <span>20m</span>
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '12px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.deepseaBlue
                    }}>
                      Waterverplaatsing
                    </label>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: colors.charcoalBlack
                    }}>
                      {formData.boatWeight || 2000} <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>kg</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="100"
                    value={formData.boatWeight || 2000}
                    onChange={(e) => handleInputChange('boatWeight', e.target.value)}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, ${colors.marineGreen} 0%, ${colors.marineGreen} ${((formData.boatWeight || 2000) - 500) / 19500 * 100}%, #e0e0e0 ${((formData.boatWeight || 2000) - 500) / 19500 * 100}%, #e0e0e0 100%)`,
                      outline: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '6px'
                  }}>
                    <span>500 kg</span>
                    <span>20.000 kg</span>
                  </div>
                </div>

                <button
                  onClick={handleSpecsSubmit}
                  style={{
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: colors.prettyWhite,
                    backgroundColor: colors.marineGreen,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Volgende
                </button>
              </div>
            )}

            {/* Back Button */}
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ← Terug
              </button>
            )}
          </>
        )}

        {/* Results */}
        {showResults && !showContactForm && (
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: `${colors.kingOrange}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <span style={{ fontSize: '32px', color: colors.kingOrange }}>✓</span>
              </div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '22px',
                fontWeight: '700',
                color: colors.charcoalBlack
              }}>
                Jouw aanbeveling
              </h2>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#666'
              }}>
                Op basis van jouw bootgegevens
              </p>
            </div>

            {/* Main Recommendation Card */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.deepseaBlue} 0%, #363680 100%)`,
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '20px',
              color: colors.prettyWhite,
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '13px',
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Aanbevolen motor
              </p>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '36px',
                fontWeight: '700'
              }}>
                {recommendation.motor}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Motorvermogen</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>
                    {recommendation.motorPower} <span style={{ fontSize: '14px' }}>kW</span>
                  </p>
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Batterijcapaciteit</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700' }}>
                    {recommendation.batteryCapacity} <span style={{ fontSize: '14px' }}>kWh</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                backgroundColor: colors.lightGray,
                borderRadius: '14px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#666',
                  textTransform: 'uppercase'
                }}>Vaartijd kruissnelheid</p>
                <p style={{
                  margin: '6px 0 0 0',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.marineGreenDark
                }}>
                  {recommendation.estimatedCruisingTime} <span style={{ fontSize: '14px' }}>uur</span>
                </p>
              </div>
              <div style={{
                backgroundColor: colors.lightGray,
                borderRadius: '14px',
                padding: '18px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#666',
                  textTransform: 'uppercase'
                }}>Kruissnelheid</p>
                <p style={{
                  margin: '6px 0 0 0',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.deepseaBlue
                }}>
                  {recommendation.cruisingSpeed} <span style={{ fontSize: '14px' }}>km/h</span>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{
              backgroundColor: `${colors.kingOrange}10`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '13px',
              color: colors.charcoalBlack,
              lineHeight: '1.6',
              borderLeft: `4px solid ${colors.kingOrange}`
            }}>
              <strong style={{ color: colors.kingOrange }}>💡 Tip:</strong> Bij kruissnelheid ({recommendation.cruisingSpeed} km/h) 
              verbruikt u slechts {recommendation.requiredPowerCruising} kW. 
              Volgas ({recommendation.maxHullSpeed} km/h) geeft ~{recommendation.volgasTime} uur vaartijd.
            </div>

            {/* CTA Button - PROMINENT */}
            <button
              onClick={() => setShowContactForm(true)}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '18px',
                fontWeight: '700',
                color: colors.prettyWhite,
                background: `linear-gradient(135deg, ${colors.marineGreen} 0%, ${colors.marineGreenDark} 100%)`,
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${colors.marineGreen}40`,
                marginBottom: '12px'
              }}
            >
              🎯 Ontdek de prijs
            </button>

            <button
              onClick={() => {
                setShowResults(false);
                setStep(0);
              }}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                color: '#666',
                backgroundColor: 'transparent',
                border: `1px solid #ddd`,
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              Opnieuw berekenen
            </button>
          </>
        )}

        {/* Contact Form */}
        {showContactForm && (
          <>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '22px',
              fontWeight: '700',
              color: colors.charcoalBlack
            }}>
              Vraag offerte aan
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '15px',
              color: '#666'
            }}>
              Ontvang een persoonlijke offerte voor de {recommendation?.motor}
            </p>

            <form onSubmit={handleContactSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.deepseaBlue,
                    marginBottom: '6px'
                  }}>Voornaam *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '10px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.deepseaBlue,
                    marginBottom: '6px'
                  }}>Achternaam *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '10px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: colors.deepseaBlue,
                  marginBottom: '6px'
                }}>E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: colors.deepseaBlue,
                  marginBottom: '6px'
                }}>Telefoonnummer *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: colors.prettyWhite,
                  backgroundColor: colors.marineGreen,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Verstuur aanvraag
              </button>

              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ← Terug naar resultaten
              </button>
            </form>
          </>
        )}
      </div>

      {/* Minimal footer */}
      {!showContactForm && (
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${colors.lightGray}`,
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#888'
          }}>
            Berekening op basis van kruissnelheid · 30% veiligheidsmarge
          </p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        
        input:focus {
          border-color: ${colors.marineGreen} !important;
          outline: none;
        }
        
        .option-button:hover {
          background-color: ${colors.deepseaBlue} !important;
          border-color: ${colors.deepseaBlue} !important;
        }
        
        .option-button:hover span {
          color: ${colors.prettyWhite} !important;
        }
        
        .option-button:hover img {
          filter: brightness(0) invert(1) !important;
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        input[type=range] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${colors.marineGreen};
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          margin-top: -10px;
        }
        
        input[type=range]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${colors.marineGreen};
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        input[type=range]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }
        
        input[type=range]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
