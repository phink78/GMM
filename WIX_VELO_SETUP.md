# Wix Velo Setup Guide for Green Marine Calculator

## Step 1: Create the Leads Collection

1. Go to **Wix Editor** → **Database** (sidebar)
2. Click **Create Collection** → name it `"Leads"`
3. Add the following fields:

| Field Name | Type | Notes |
|---|---|---|
| firstName | Text | Required |
| lastName | Text | Required |
| email | Email | Required |
| phone | Phone | Required |
| customerType | Text | particulier / zakelijk |
| boatType | Text | sloep, zeilboot, motorboot, etc. |
| boatLength | Number | Meters |
| boatWeight | Number | Kilograms |
| currentDrive | Text | buitenboord / binnenboord |
| waterType | Text | binnenwater / kustwater / beide |
| tripDuration | Text | 2-4 / 4-8 / 8+ |
| recommendedMotor | Text | e.g., GM 6kW |
| recommendedMotorPower | Number | kW |
| recommendedBattery | Number | kWh |
| recommendedSpeed | Number | km/h |
| recommendedTime | Number | hours |
| submittedAt | Date | Auto-set to now |

---

## Step 2: Create the Wix Page

1. Go to **Editor** → **Add Page**
2. Name it `Calculator` (slug: `/calculator`)
3. Open the page in edit mode

---

## Step 3: Add UI Elements to the Page

Use the **Add** panel to drag elements onto your page. Set their **IDs** exactly as shown:

### **Step 1: Customer Type Container**
- Container ID: `step1Container`
  - Text: "Type klant - Bent u particulier of zakelijk?"
  - Button ID: `particulierButton` → label: "Particulier"
  - Button ID: `zakelijkButton` → label: "Zakelijk"

### **Step 2: Boat Type Container**
- Container ID: `step2Container` (initially hidden)
  - Text: "Type boot - Wat voor boot heeft u?"
  - Dropdown ID: `boatTypeDropdown`
    - Options: Sloep, Zeilboot, Motorboot, Speedboot, Werkboot, Anders

### **Step 3: Boat Specs Container**
- Container ID: `step3Container` (initially hidden)
  - Text: "Boot specificaties"
  - Label + Slider: `boatLengthInput` (min: 3, max: 20, step: 0.5)
  - Display Text ID: `boatLengthDisplay` (shows current value)
  - Label + Slider: `boatWeightInput` (min: 500, max: 20000, step: 100)
  - Display Text ID: `boatWeightDisplay` (shows current value)
  - Button ID: `specsNextButton` → label: "Volgende"

### **Step 4: Current Drive Container**
- Container ID: `step4Container` (initially hidden)
  - Text: "Huidige aandrijving"
  - Dropdown ID: `currentDriveDropdown`
    - Options: Buitenboord, Binnenboord

### **Step 5: Water Type Container**
- Container ID: `step5Container` (initially hidden)
  - Text: "Vaargebied"
  - Dropdown ID: `waterTypeDropdown`
    - Options: Binnenwater, Kustwater, Beide

### **Step 6: Trip Duration Container**
- Container ID: `step6Container` (initially hidden)
  - Text: "Gemiddelde vaartocht"
  - Dropdown ID: `tripDurationDropdown`
    - Options: 2-4 uur, 4-8 uur, 8+ uur

### **Results Container**
- Container ID: `resultsContainer` (initially hidden)
  - Text: "Jouw aanbeveling"
  - Text ID: `motorNameDisplay` (shows motor name)
  - Text ID: `motorPowerDisplay` (shows kW)
  - Text ID: `batteryCapacityDisplay` (shows kWh)
  - Text ID: `cruisingSpeedDisplay` (shows km/h)
  - Text ID: `cruisingTimeDisplay` (shows hours)
  - Text ID: `tipText` (shows tip/calculation info)
  - Button ID: `contactFormButton` → label: "Vraag offerte aan"
  - Button ID: `resetButton` → label: "Opnieuw berekenen"

### **Contact Form Container**
- Container ID: `contactFormContainer` (initially hidden)
  - Text: "Vraag offerte aan"
  - Text Input ID: `firstNameInput` → placeholder: "Voornaam *"
  - Text Input ID: `lastNameInput` → placeholder: "Achternaam *"
  - Email Input ID: `emailInput` → placeholder: "E-mail *"
  - Phone Input ID: `phoneInput` → placeholder: "Telefoonnummer *"
  - Text ID: `formErrorText` (for error messages)
  - Button ID: `submitLeadButton` → label: "Offerte aanvragen"
  - Button ID: `backFromFormButton` → label: "← Terug"

### **Success Container**
- Container ID: `successContainer` (initially hidden)
  - Text: "✓ Bedankt voor uw aanvraag! We nemen binnen 24 uur contact met u op."
  - Button ID: `homeButton` → label: "Terug naar home" (links to `/`)

### **Progress Bar (optional)**
- Container ID: `progressContainer`
  - Text ID: `progressText` → "Stap 1 van 6"
  - Div ID: `progressBar` (CSS: `height: 6px; background: #3CEF2F;`)

---

## Step 4: Add Page Code

1. Click **Code** (top right)
2. Go to the **Page** tab
3. Paste the content from `velo-calculator-page.js` (see attached file)

---

## Step 5: Create Backend Modules

1. In **Editor**, click **Code** (top right)
2. Go to **Backend** section (left sidebar in Code panel)
3. Create two new files:

### **File: `backend/calculator-backend.js`**
Paste content from `velo-calculator-backend.js`

### **File: `backend/leads-backend.js`**
Paste content from `velo-leads-backend.js`

---

## Step 6: Set Initial Visibility

Before publishing, ensure:
- `step1Container` = **Visible** ✓
- `step2Container` = **Hidden** (will show after Step 1)
- `step3Container` = **Hidden**
- `step4Container` = **Hidden**
- `step5Container` = **Hidden**
- `step6Container` = **Hidden**
- `resultsContainer` = **Hidden**
- `contactFormContainer` = **Hidden**
- `successContainer` = **Hidden**

---

## Step 7: Test & Publish

1. Click **Preview** (Cmd+P)
2. Go through the calculator flow:
   - Select customer type → should advance to boat type
   - Select boat type → should show boat specs
   - Move sliders → should update display
   - Click "Volgende" → advance to current drive
   - Continue through all steps
   - See results → click "Vraag offerte aan" → fill form → submit
3. Check **Database** → **Leads** collection for the new record
4. If all works: **Publish** the site

---

## Optional: Styling

Add CSS to match Green Marine branding:

```css
/* In Wix Editor: Settings → Custom CSS */

.gm-button {
  background: #3CEF2F;
  color: #262526;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
}

.gm-button:hover {
  background: #2BC41E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(60, 239, 47, 0.3);
}

.gm-container {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(68, 68, 150, 0.1);
}

.gm-progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.gm-progress-fill {
  height: 100%;
  background: #3CEF2F;
  transition: width 0.3s ease;
}
```

---

## Troubleshooting

- **"Code imports not recognized"** → Make sure files are in `/backend/` folder
- **"Dropdown not changing"** → Check that dropdown option values match code (`'2-4'`, `'4-8'`, `'8+'`)
- **"Lead not saving"** → Check Leads collection is created and fields match
- **"Calculator not calculating"** → Check backend/calculator-backend.js is imported correctly

---

Done! Your Green Marine calculator is now live in Wix with full lead capture. 🎉
