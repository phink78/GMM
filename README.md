# Green Marine Calculator & Landing Page

Versie 2.1 | 05-12-2025

## Bestanden

```
/GreenMarineCalculator.jsx   → De calculator component
/GreenMarineLandingPage.jsx  → Landingspagina met calculator + USPs + reviews
/logo_gmTekengebied_1green_marine.png → Logo
/particulier.png             → Icoon particulier
/zakelijk.png                → Icoon zakelijk
```

**Niet nodig:**
- `GreenMarineUI.jsx` → oude versie, mag weg

## Implementatie in Wix

### Optie 1: Wix Velo (Custom Element)
1. Ga naar Wix Editor → Dev Mode aanzetten
2. Voeg een Custom Element toe
3. Plak de React code of host extern en embed via iframe

### Optie 2: Iframe embed
1. Host de bestanden op Vercel/Netlify
2. Embed via HTML iframe in Wix

---

## TODO: Koppelingen

### Wix Database
De form data moet naar de collectie **"Find your Green Marine"** met deze velden:
- `Length of the boat` → formData.boatLength
- `Weight of the boat` → formData.boatWeight  
- `Type of boat` → formData.boatType
- `Current motor` → formData.currentDrive
- (+ contactgegevens en berekende motor)

### Pipedrive
Wacht op info van Douwe hoe de huidige koppeling werkt.

---

## Brand Colors (uit merkgids)

| Naam | Hex |
|------|-----|
| Deepsea Blue | #444496 |
| Marine Green | #3CEF2F |
| King Orange (accent) | #FF6D00 |
| Charcoal Black | #262526 |
| Pretty White | #FFFFFF |

---

## Fonts

- **Logo**: Afbeelding gebruiken (niet natekenen)
- **Tekst "Green Marine" in copy**: Neue Kabel
- **Body tekst**: Gilroy Light (of Quicksand als fallback)

---

## Berekening

De calculator gebruikt:
- **Hull speed**: 4.5 × √(LWL in meters)
- **Cruising speed**: 70% van hull speed
- **Veiligheidsmarge**: 30% (uit Douwe's rekentool)

---

## Nog te doen

- [ ] Icoontjes vervangen (Patrick levert aan)
- [ ] Wix/Pipedrive koppeling (wacht op Douwe)
- [ ] Motoren database verifiëren met Douwe
- [ ] Google Reviews koppelen of handmatig invullen
- [ ] Telefoonnummer in sticky header aanpassen

---

## Contact

Patrick Hink (PHNK)
