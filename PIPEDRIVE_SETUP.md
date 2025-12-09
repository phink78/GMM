# Pipedrive Integratie Setup Guide

Deze guide legt uit hoe u de Green Marine Calculator koppelt aan Pipedrive CRM.

## 🎯 Overzicht

De lead flow is als volgt:
1. **Klant** vult calculator in op Wix website
2. **Calculator** (iframe) stuurt data via postMessage naar Wix pagina
3. **Wix pagina** slaat data op in Wix CMS (Leads collection)
4. **Wix pagina** stuurt data naar Pipedrive API
5. **Pipedrive** maakt een Person aan met een Note met alle calculator details

---

## 📋 Stap 1: Pipedrive API Key ophalen

1. Log in op uw Pipedrive account
2. Ga naar **Settings** (⚙️ rechtsboven)
3. Klik op **Personal preferences**
4. Scroll naar **API** sectie
5. Klik op **Copy** naast uw API token
6. Bewaar deze key veilig - u heeft hem zo nodig!

### Voorbeeld API key
```
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

---

## 🏢 Stap 2: Company Domain vinden

Uw Pipedrive company domain staat in de URL wanneer u bent ingelogd:

```
https://YOUR_COMPANY_DOMAIN.pipedrive.com
```

Bijvoorbeeld:
- URL: `https://greenmarine.pipedrive.com`
- Company domain: `greenmarine`

---

## 🔧 Stap 3: Wix CMS Database aanmaken

1. Open uw Wix website in de Editor
2. Ga naar **CMS** (☰ menu links)
3. Klik op **+ Create a Collection**
4. Naam: **Leads**
5. Voeg deze velden toe:

| Field Name | Field Type | Notes |
|-----------|-----------|--------|
| firstName | Text | - |
| lastName | Text | - |
| email | Text | - |
| phone | Text | - |
| customerType | Text | bijv. "particulier" of "zakelijk" |
| boatType | Text | bijv. "kajuitzeilboot" |
| boatLength | Number | in meters |
| boatWeight | Number | in kg |
| currentDrive | Text | bijv. "buitenboord" |
| waterType | Text | bijv. "zoet" |
| tripDuration | Number | in uren |
| recommendedMotor | Text | bijv. "Torqeedo Cruise 4.0" |
| recommendedMotorPower | Text | bijv. "4 kW" |
| recommendedBattery | Text | bijv. "Power 48-5000" |
| recommendedSpeed | Number | in km/h |
| recommendedTime | Number | in uren |
| submittedAt | Date & Time | Automatisch ingevuld |

6. Klik **Create**

---

## 🎨 Stap 4: Calculator Page aanmaken in Wix

1. Klik op **Pages** in de linker sidebar
2. Klik op **+ Add Page**
3. Kies **Blank Page**
4. Naam: **Calculator**

### HTML Embed toevoegen

1. Klik op **Add** (+) linksboven
2. Kies **Embed** → **HTML iframe**
3. Sleep het naar de pagina
4. Maak het fullscreen (of gewenste grootte)
5. Klik op **Enter Code**
6. Plak deze code:

```html
<iframe 
  src="https://phink78.github.io/GMM/calculator-embed.html" 
  style="width: 100%; height: 100vh; border: none;"
  title="Green Marine Calculator">
</iframe>
```

7. Klik **Update**

---

## 💻 Stap 5: Page Code toevoegen

1. Klik rechtsboven op **Dev Mode** schakelaar (om Velo/Code mode in te schakelen)
2. Accepteer de Developer Mode melding
3. Klik op de Calculator pagina in Pages menu
4. Klik op **••• (More Actions)** naast Calculator
5. Kies **Code**
6. Er opent nu een code editor onderaan

### Code invoeren

1. **Verwijder** alle bestaande code in het bestand
2. **Open** het bestand `wix-calculator-page-code.js` (in uw green-marine GitHub repository)
3. **Kopieer** de volledige inhoud
4. **Plak** in de Wix code editor
5. **Vervang** de configuratie:

```javascript
const PIPEDRIVE_API_KEY = 'PLAK_HIER_UW_API_KEY';
const PIPEDRIVE_COMPANY_DOMAIN = 'greenmarine'; // Pas aan!
```

### Voorbeeld configuratie

```javascript
const PIPEDRIVE_API_KEY = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t';
const PIPEDRIVE_COMPANY_DOMAIN = 'greenmarine';
```

6. Klik **Save** (Ctrl+S / Cmd+S)

---

## 🧪 Stap 6: Test de integratie

### Test in Preview Mode

1. Klik op **Preview** rechtsboven
2. Navigeer naar de Calculator pagina
3. Vul de calculator in met testgegevens
4. Klik op "Ontvang een persoonlijke offerte"
5. Vul het contact formulier in
6. Klik **Verzenden**
7. Open de browser console (F12) om logs te zien

### Controleer in Pipedrive

1. Ga naar Pipedrive
2. Open **Contacts** → **People**
3. Zoek uw test naam
4. Klik erop om te openen
5. Check of de **Note** is toegevoegd met calculator details

### Controleer in Wix CMS

1. Ga terug naar Wix Editor
2. Open **CMS** → **Leads**
3. Check of de nieuwe lead is toegevoegd
4. Controleer alle velden

---

## 🔍 Stap 7: Custom Fields in Pipedrive (Optioneel)

Als u de calculator data in specifieke Pipedrive velden wilt opslaan (i.p.v. alleen in een Note):

1. Ga in Pipedrive naar **Settings** → **Data fields** → **Person**
2. Klik **+ Add field**
3. Maak custom fields aan voor:
   - Boot type
   - Boot lengte
   - Boot gewicht
   - Klanttype
   - etc.
4. Noteer de **field key** van elk veld (bijv. `boat_type_field_hash`)
5. Pas de code in Wix aan:

```javascript
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
  // Custom fields toevoegen:
  'boat_type_field_hash': leadData.boatType,
  'boat_length_field_hash': leadData.boatLength,
  'boat_weight_field_hash': leadData.boatWeight
};
```

---

## 🚨 Troubleshooting

### "Failed to create person in Pipedrive"

**Oorzaak:** API key of company domain is onjuist

**Oplossing:**
1. Check of API key correct is gekopieerd (geen spaties)
2. Check of company domain correct is (zonder `.pipedrive.com`)
3. Test de connectie met de helper functie:

```javascript
// Plak in browser console op Calculator pagina:
testPipedriveConnection()
```

### Lead verschijnt niet in Wix CMS

**Oorzaak:** Collection naam of field namen komen niet overeen

**Oplossing:**
1. Check of collection naam exact **Leads** is (hoofdlettergevoelig!)
2. Check of alle field namen exact overeenkomen met de code
3. Check browser console voor error messages

### Calculator laadt niet in iframe

**Oorzaak:** URL is onjuist of GitHub Pages is niet gepubliceerd

**Oplossing:**
1. Test de URL direct in browser: `https://phink78.github.io/GMM/calculator-embed.html`
2. Check of calculator-embed.html gepushed is naar GitHub
3. Wacht 2-3 minuten voor GitHub Pages rebuild

### CORS errors in console

**Oorzaak:** Dit is normaal - postMessage werkt ondanks CORS warnings

**Oplossing:**
- Negeer CORS warnings - de postMessage API omzeilt deze restricties
- Check of data alsnog aankomt in Wix CMS en Pipedrive

---

## 📊 Data Mapping Overzicht

| Calculator Data | Wix CMS Field | Pipedrive Field |
|----------------|---------------|-----------------|
| Voornaam | firstName | name (deel 1) |
| Achternaam | lastName | name (deel 2) |
| Email | email | email (primary) |
| Telefoon | phone | phone (primary) |
| Klanttype | customerType | Note |
| Boot type | boatType | Note |
| Boot lengte | boatLength | Note |
| Boot gewicht | boatWeight | Note |
| Huidige motor | currentDrive | Note |
| Vaargebied | waterType | Note |
| Tocht duur | tripDuration | Note |
| Aanbevolen motor | recommendedMotor | Note |
| Motor vermogen | recommendedMotorPower | Note |
| Batterij | recommendedBattery | Note |
| Snelheid | recommendedSpeed | Note |
| Vaartijd | recommendedTime | Note |
| Datum | submittedAt | - |

---

## ✅ Checklist

- [ ] Pipedrive API key verkregen
- [ ] Company domain genoteerd
- [ ] Wix CMS "Leads" collection aangemaakt
- [ ] Alle 17 fields toegevoegd aan Leads collection
- [ ] Calculator page aangemaakt in Wix
- [ ] HTML iframe toegevoegd met calculator URL
- [ ] Dev Mode ingeschakeld in Wix
- [ ] Page code toegevoegd aan Calculator page
- [ ] API key en domain ingevuld in code
- [ ] Code opgeslagen
- [ ] Test uitgevoerd in Preview mode
- [ ] Lead zichtbaar in Wix CMS
- [ ] Person aangemaakt in Pipedrive
- [ ] Note met calculator details toegevoegd in Pipedrive
- [ ] Website gepubliceerd

---

## 🎉 Klaar!

Als alle stappen zijn doorlopen, werkt de volledige lead pipeline:

**Calculator** → **Wix CMS** → **Pipedrive**

Nieuwe leads verschijnen nu automatisch in Pipedrive met alle calculator details!

---

## 📞 Support

Bij vragen of problemen, check:
1. Browser console voor error messages (F12)
2. Wix Logs (Dev Tools → Logs in Editor)
3. Pipedrive API documentation: https://developers.pipedrive.com/docs/api/v1

---

**Laatste update:** December 2024  
**Versie:** 1.0
