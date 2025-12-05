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
        padding: '24px 16px 40px 16px'
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
