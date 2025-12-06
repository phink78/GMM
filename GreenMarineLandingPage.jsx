import React from 'react';
import GreenMarineCalculator from './GreenMarineCalculator';

// ============================================
// GREEN MARINE LANDING PAGE
// ============================================
// Calculator + USPs + Google Reviews + Contact
// Mobile-first (60% mobile traffic per Douwe)
// ============================================

export default function GreenMarineLandingPage() {
  
  const colors = {
    deepseaBlue: '#444496',
    marineGreen: '#3CEF2F',
    marineGreenDark: '#2BC41E',
    charcoalBlack: '#262526',
    prettyWhite: '#FFFFFF',
    kingOrange: '#FF6D00',
    lightGray: '#f5f7f9'
  };

  const usps = [
    'Ontwikkeld voor een leven lang plezier',
    'Zeer robuust, ook geschikt voor professioneel gebruik',
    '5 jaar garantie',
    'Systemen voor boten van 5 tot 50 meter lengte'
  ];

  // Placeholder reviews - replace with actual Google Reviews API data
  const reviews = [
    {
      name: 'Johan de V.',
      rating: 5,
      text: 'Uitstekende service en een prachtige motor. Stil, krachtig en betrouwbaar.',
      date: 'november 2025'
    },
    {
      name: 'Marieke B.',
      rating: 5,
      text: 'Eindelijk elektrisch varen zonder zorgen. Top advies gehad van het team.',
      date: 'oktober 2025'
    },
    {
      name: 'Peter K.',
      rating: 5,
      text: 'Na 2 seizoenen nog steeds super tevreden. Geen onderhoud, gewoon genieten.',
      date: 'september 2025'
    }
  ];

  return (
    <div style={{
      fontFamily: '"Quicksand", "Segoe UI", sans-serif',
      backgroundColor: colors.lightGray,
      minHeight: '100vh',
      color: colors.charcoalBlack
    }}>
      
      {/* Sticky Header Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: colors.prettyWhite,
        borderBottom: `1px solid #e0e0e0`,
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <img 
          src="/uploads/logo_gmTekengebied_1green_marine.png" 
          alt="Green Marine" 
          style={{ height: '32px', width: 'auto' }}
        />
        <a 
          href="tel:+31853031"; 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: colors.kingOrange,
            color: colors.prettyWhite,
            padding: '10px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <span>📞</span> Bel ons
        </a>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px 16px 120px 16px' /* extra bottom padding to account for sticky bar */
      }}>
        
        {/* Calculator */}
        <GreenMarineCalculator />

        {/* USPs Section */}
        <section style={{
          backgroundColor: colors.prettyWhite,
          borderRadius: '20px',
          padding: '28px 24px',
          marginTop: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: colors.charcoalBlack
          }}>
            Dit is waarom je kiest voor Green Marine
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {usps.map((usp, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <span style={{
                  color: colors.marineGreen,
                  fontSize: '20px',
                  lineHeight: '1.2'
                }}>✓</span>
                <span style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: colors.charcoalBlack
                }}>{usp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Google Reviews Section */}
        <section style={{
          backgroundColor: colors.prettyWhite,
          borderRadius: '20px',
          padding: '28px 24px',
          marginTop: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: colors.charcoalBlack
            }}>
              Klanten over Green Marine
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: colors.kingOrange, fontSize: '18px' }}>★★★★★</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>5.0</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {reviews.map((review, i) => (
              <div key={i} style={{
                backgroundColor: colors.lightGray,
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: colors.charcoalBlack
                  }}>{review.name}</span>
                  <span style={{ color: colors.kingOrange, fontSize: '14px' }}>
                    {'★'.repeat(review.rating)}
                  </span>
                </div>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: colors.charcoalBlack
                }}>
                  "{review.text}"
                </p>
                <span style={{
                  fontSize: '12px',
                  color: '#888'
                }}>{review.date}</span>
              </div>
            ))}
          </div>

          <a 
            href="https://www.google.com/maps/place/Green+Marine+Motors" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: colors.deepseaBlue,
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Bekijk alle reviews op Google →
          </a>
        </section>

        {/* Trust Footer */}
        <section style={{
          textAlign: 'center',
          padding: '32px 16px',
          color: '#666',
          fontSize: '13px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '16px'
          }}>
            <span>🇩🇪 Made in Germany</span>
            <span>🇳🇱 Assembled in NL</span>
            <span>🔋 Direct-drive technologie</span>
          </div>
          <p style={{ margin: 0 }}>
            © 2025 Green Marine Motors
          </p>
        </section>
      </main>

      {/* Sticky Bottom CTA Bar (mobile-first) */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'linear-gradient(90deg, rgba(68,68,150,0.04), rgba(255,255,255,0.98))',
        borderTop: '1px solid #e9e9e9',
        gap: '12px'
      }}>
        <a href="#embedded-calculator" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(68,68,150,0.06)'
          }}>
            ⚓
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <strong style={{ fontSize: '15px', color: '#262526' }}>Start calculator</strong>
            <span style={{ fontSize: '12px', color: '#666' }}>Bereken in 2 minuten</span>
          </div>
        </a>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="tel:+31853031" style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#FF6D00',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700
          }}>Bel ons</a>

          <a href="#calculator-contact-form" style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#3CEF2F',
            color: '#111',
            textDecoration: 'none',
            fontWeight: 700
          }}>Vraag offerte</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        
        * { 
          box-sizing: border-box; 
          margin: 0;
          padding: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
