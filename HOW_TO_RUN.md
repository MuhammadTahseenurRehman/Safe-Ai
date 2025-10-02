# How to Run SafestAI

## Quick Start

### 1. Navigate to the project folder:
```bash
cd safest-ai
```

### 2. Install dependencies (if not already done):
```bash
npm install
```

### 3. Start the development server:
```bash
npm start
```

The app will automatically open in your browser at **http://localhost:3000**

## What You Should See

### Landing Page Features:

#### Header (Top):
- **Left Side:**
  - SAFEST AI logo with purple/blue gradient
  - Green status indicator dot (shows active protection)
  - Text: "SAFEST AI" and "Privacy Protection Ready"

- **Right Side:**
  - "Guest Mode" button (white outline)
  - User profile button (purple) showing "Jim123@gmail.com"
  - Click user button to see dropdown with:
    - Manage Subscription
    - Settings
    - Log Out

#### Main Content (Center):
1. **Animated Logo** - Purple/blue gradient with glow effect
2. **Title** - "Welcome to Safest AI" with gradient text
3. **Subtitle** - Privacy-first AI assistant description
4. **Three Feature Cards:**
   - Automatic PII Protection (purple icon)
   - Context Preservation (blue icon)
   - Real-time Processing (green icon)

5. **Demo Section:**
   - Title: "How you can obfuscated the following information"
   - Badges showing: Person Names, Business Names, E-mail, Address, SSN, Dates
   - Text input area
   - "Analyze & Protect" button

6. **CTA Button:**
   - Large purple "Start Secure Session" button

#### Bottom Section:
- Three circular icons with descriptions:
  - End-to-End Security
  - Smart Detection
  - Compliance Ready

## Testing the Privacy Scan Modal

1. In the demo section, enter test text:
   ```
   My name is John Smith and my email is john@example.com. 
   My SSN is 123-45-6789 and I live at 555-123-4567.
   The date is 10/02/2025.
   ```

2. Click **"Analyze & Protect"**

3. The Enhanced Privacy Scan Results modal will open showing:
   - All detected entities
   - Three action buttons for each:
     - **OBFUSCATE** (purple) - Auto-replace
     - **EDIT** (blue) - Customize replacement
     - **IGNORE** (gray) - Skip
   - Live preview at the top
   - Count of protected items at bottom
   - "Send Securely" button

## Troubleshooting

### If the page looks different:

1. **Clear your browser cache:**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

2. **Check the browser console:**
   - Press `F12` to open DevTools
   - Look for any errors in the Console tab

3. **Verify all components exist:**
   ```bash
   ls src/components/
   ```
   Should show:
   - AIQueryInterface.jsx
   - EnhancedPrivacyScanModal.jsx
   - KeyManagement.jsx
   - LandingPage.jsx
   - UseCaseTemplates.jsx
   - ui/ (folder)

4. **Restart the dev server:**
   - Press `Ctrl + C` in the terminal
   - Run `npm start` again

## Dark Theme

The entire app uses a dark theme:
- Background: Very dark blue-black (#0a0a0f)
- Cards: Semi-transparent gray
- Text: White primary, gray secondary
- Accents: Purple (#9333ea) and blue gradients

## Next Steps

Once the landing page loads:
1. Test the demo section with sample sensitive data
2. Click "Analyze & Protect" to see the privacy scan modal
3. Try the different action buttons (Obfuscate, Edit, Ignore)
4. Click "Start Secure Session" to enter the main app

---

**Need Help?** Check the browser console (F12) for errors or check that all dependencies are installed with `npm install`.

