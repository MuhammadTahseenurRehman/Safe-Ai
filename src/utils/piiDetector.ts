// PII Detection and Obfuscation Engine
export interface PIIDetectedItem {
  type: string;
  original: string;
  position: number;
  category: string;
  dummy?: string;
}

export interface PIIReplacement {
  original: string;
  dummy: string;
  type: string;
  category: string;
  position: number;
}

export interface ObfuscationResult {
  obfuscatedText: string;
  replacements: PIIReplacement[];
}

export class PIIDetector {
  private patterns: Record<string, RegExp>;
  private dummyData: Record<string, string[]>;

  constructor() {
    this.patterns = {
      // Names (common patterns)
      name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      
      // Email addresses
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      
      // Phone numbers (various formats)
      phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
      
      // Social Security Numbers
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      
      // Credit Card Numbers
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      
      // Bank Account Numbers
      bankAccount: /\b\d{8,12}\b/g,
      
      // Addresses (basic pattern)
      address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Circle|Cir|Court|Ct)\b/g,
      
      // Dates (MM/DD/YYYY, DD/MM/YYYY, etc.)
      date: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
      
      // IP Addresses
      ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
      
      // URLs
      url: /https?:\/\/[^\s]+/g,
      
      // ZIP Codes
      zipCode: /\b\d{5}(-\d{4})?\b/g
    };
    
    this.dummyData = {
      name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'],
      email: ['john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com'],
      phone: ['555-123-4567', '555-987-6543', '555-456-7890'],
      ssn: ['XXX-XX-XXXX', '***-**-****'],
      creditCard: ['****-****-****-1234', '****-****-****-5678'],
      bankAccount: ['****1234', '****5678'],
      address: ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
      date: ['01/01/2024', '12/31/2023'],
      ipAddress: ['192.168.1.1', '10.0.0.1'],
      url: ['https://example.com', 'https://dummy-site.com'],
      zipCode: ['12345', '67890']
    };
  }

  // Detect PII in text
  detectPII(text: string): PIIDetectedItem[] {
    const detectedItems: PIIDetectedItem[] = [];
    
    Object.entries(this.patterns).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          detectedItems.push({
            type: this.getTypeLabel(type),
            original: match,
            position: text.indexOf(match),
            category: type
          });
        });
      }
    });
    
    return detectedItems;
  }

  // Get human-readable type labels
  private getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      name: 'Person Name',
      email: 'Email Address',
      phone: 'Phone Number',
      ssn: 'Social Security Number',
      creditCard: 'Credit Card Number',
      bankAccount: 'Bank Account Number',
      address: 'Address',
      date: 'Date',
      ipAddress: 'IP Address',
      url: 'URL',
      zipCode: 'ZIP Code'
    };
    return labels[type] || type;
  }

  // Generate dummy replacement
  private getDummyReplacement(type: string): string {
    const dummies = this.dummyData[type];
    if (dummies && dummies.length > 0) {
      return dummies[Math.floor(Math.random() * dummies.length)];
    }
    return `[${type.toUpperCase()}_XXXX]`;
  }

  // Obfuscate text by replacing PII with dummy data
  obfuscateText(text: string, detectedItems: PIIDetectedItem[]): ObfuscationResult {
    let obfuscatedText = text;
    const replacements: PIIReplacement[] = [];
    
    detectedItems.forEach(item => {
      const dummyValue = this.getDummyReplacement(item.category);
      obfuscatedText = obfuscatedText.replace(item.original, dummyValue);
      replacements.push({
        original: item.original,
        dummy: dummyValue,
        type: item.type,
        category: item.category,
        position: item.position
      });
    });
    
    return { obfuscatedText, replacements };
  }

  // De-obfuscate text by replacing dummy data with original PII
  deobfuscateText(text: string, replacements: PIIReplacement[]): string {
    let deobfuscatedText = text;
    
    replacements.forEach(replacement => {
      deobfuscatedText = deobfuscatedText.replace(replacement.dummy, replacement.original);
    });
    
    return deobfuscatedText;
  }
}

export const piiDetector = new PIIDetector();
