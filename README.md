# SafestAI - Privacy-First AI Interactions

![SafestAI](https://img.shields.io/badge/SafestAI-Privacy%20First-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

SafestAI is a privacy-focused web application that allows users to leverage powerful AI services without compromising sensitive information. It acts as a privacy layer that obfuscates data before sending it to AI platforms and de-obfuscates the response back to its original form.

## 🎯 Core Problem

People and businesses want to use AI services like ChatGPT, Claude, or Gemini, but are concerned about sharing sensitive information such as:
- Personal identifiable information (PII)
- Confidential business data
- Protected health information (PHI)
- Legal documents with client details
- Financial records

## 💡 Solution

SafestAI provides a middleware solution that:
1. **Obfuscates** sensitive data before sending it to AI services
2. **Processes** the AI response
3. **De-obfuscates** the response back to original terms for the user

## ✨ Key Features

### Obfuscation Methods

#### 1. Text Replacement
Replace identifiable information with generic alternatives:
- Names: "John Smith" → "John Doe"
- Organizations: "Acme Corp" → "Company X"
- Locations: Keep or generalize as needed

#### 2. Numerical Modifications
Transform numbers using various methods:
- **Logarithmic**: Apply log transformation
- **Add Digits**: Append digits to mask true value
- **Move Decimal**: Shift decimal places
- **Mathematical Operations**: Multiply, divide, add, or subtract
- **Rounding**: Round to nearest value to hide specifics

#### 3. Date Handling
Modify dates to protect temporal information:
- **Offset Days**: Shift dates by a number of days
- **Remove Specificity**: Convert "5/1/2025" to "5/2025"
- **Year Only**: Show only the year

### Hierarchical Key Management System

Keys can be stored and managed at multiple levels:

- **Master Keys**: Default keys applied to all inquiries
- **Inquiry-Level Keys**: Single-use keys for specific queries
- **Client-Based Keys**: Reusable keys associated with specific clients
- **Enterprise Keys**: Shared across entire organization
- **Subject-Based Keys**: Topic-specific keys (e.g., legal, medical)
- **Suggested Keys**: Auto-recommended by the system

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd safest-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📖 Usage Guide

### Basic Workflow

1. **Enter Sensitive Data**: Type or paste your information in the query interface
2. **Review Suggestions**: SafestAI automatically detects sensitive information
3. **Select Keys**: Choose which suggestions to apply
4. **Obfuscate**: Click "Obfuscate Data" to transform your text
5. **Send to AI**: Copy the obfuscated text to your AI service
6. **Paste Response**: Copy the AI's response back
7. **De-obfuscate**: Restore the original data

### Use Case Templates

#### Legal Documents
- Protects client names, case numbers, dates, and financial information

#### Healthcare & Medical
- HIPAA-compliant obfuscation of patient information

#### Data Analysis
- Obscures proprietary business metrics and client information

## 🏗️ Project Structure

```
safest-ai/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn UI components
│   │   ├── AIQueryInterface.jsx
│   │   ├── KeyManagement.jsx
│   │   └── UseCaseTemplates.jsx
│   ├── utils/
│   │   ├── obfuscationEngine.js
│   │   └── keyManager.js
│   └── App.jsx
├── tailwind.config.js
└── package.json
```

## 🛡️ Security & Privacy

### Local-First Architecture
- All obfuscation happens **locally in your browser**
- Keys are stored in **localStorage**
- No data is sent to SafestAI servers
- You control what gets shared with AI services

## 🎨 Technology Stack

- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Lucide React**: Beautiful icons
- **LocalStorage API**: Client-side persistence

## 📝 Future Roadmap

- [ ] Integration with popular AI APIs
- [ ] Browser extension
- [ ] Team collaboration features
- [ ] Cloud sync with encryption
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**SafestAI** - Making AI accessible and safe for everyone 🛡️
