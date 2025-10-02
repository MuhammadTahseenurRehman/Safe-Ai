/**
 * SafestAI Obfuscation Engine
 * Handles obfuscation and de-obfuscation of sensitive data
 */

export class ObfuscationEngine {
  constructor() {
    this.obfuscationMap = new Map();
  }

  /**
   * Text Replacement: Replace identifiable information with generic alternatives
   */
  obfuscateText(text, keys) {
    let obfuscatedText = text;
    const textKeys = keys.filter(k => k.type === 'text');
    
    textKeys.forEach(key => {
      const regex = new RegExp(key.original, 'gi');
      obfuscatedText = obfuscatedText.replace(regex, key.replacement);
      this.obfuscationMap.set(key.replacement, key.original);
    });
    
    return obfuscatedText;
  }

  /**
   * Numerical Modifications: Transform numbers using various methods
   */
  obfuscateNumber(number, method, parameter = null) {
    const num = parseFloat(number);
    
    switch (method) {
      case 'logarithmic':
        return Math.log10(num);
      
      case 'addDigits':
        // Add digits to the back
        return parseFloat(`${number}${parameter || '12345'}`);
      
      case 'moveDecimal':
        // Move decimal place
        const places = parameter || 2;
        return num / Math.pow(10, places);
      
      case 'multiply':
        return num * (parameter || 100);
      
      case 'divide':
        return num / (parameter || 100);
      
      case 'add':
        return num + (parameter || 1000);
      
      case 'subtract':
        return num - (parameter || 1000);
      
      case 'round':
        const roundTo = parameter || 100;
        return Math.round(num / roundTo) * roundTo;
      
      default:
        return num;
    }
  }

  /**
   * De-obfuscate numbers
   */
  deobfuscateNumber(obfuscatedNumber, method, parameter = null) {
    const num = parseFloat(obfuscatedNumber);
    
    switch (method) {
      case 'logarithmic':
        return Math.pow(10, num);
      
      case 'addDigits':
        const digitCount = (parameter || '12345').length;
        return parseFloat(obfuscatedNumber.toString().slice(0, -digitCount));
      
      case 'moveDecimal':
        const places = parameter || 2;
        return num * Math.pow(10, places);
      
      case 'multiply':
        return num / (parameter || 100);
      
      case 'divide':
        return num * (parameter || 100);
      
      case 'add':
        return num - (parameter || 1000);
      
      case 'subtract':
        return num + (parameter || 1000);
      
      case 'round':
        // Cannot perfectly de-obfuscate rounded numbers
        return num;
      
      default:
        return num;
    }
  }

  /**
   * Date Handling: Modify dates
   */
  obfuscateDate(dateString, method, parameter = null) {
    const date = new Date(dateString);
    
    switch (method) {
      case 'offsetDays':
        const offsetDays = parameter || 30;
        date.setDate(date.getDate() + offsetDays);
        return date.toISOString().split('T')[0];
      
      case 'removeDay':
        // Remove day specificity (e.g., 5/1/2025 -> 5/2025)
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      case 'yearOnly':
        return date.getFullYear().toString();
      
      default:
        return dateString;
    }
  }

  /**
   * De-obfuscate dates
   */
  deobfuscateDate(obfuscatedDate, method, parameter = null, originalDate = null) {
    switch (method) {
      case 'offsetDays':
        const date = new Date(obfuscatedDate);
        const offsetDays = parameter || 30;
        date.setDate(date.getDate() - offsetDays);
        return date.toISOString().split('T')[0];
      
      case 'removeDay':
      case 'yearOnly':
        // Cannot perfectly restore without original
        return originalDate || obfuscatedDate;
      
      default:
        return obfuscatedDate;
    }
  }

  /**
   * Main obfuscation function that applies all keys to text
   */
  obfuscate(text, keys) {
    let result = text;
    this.obfuscationMap.clear();
    
    // Apply text replacements
    keys.filter(k => k.type === 'text').forEach(key => {
      const regex = new RegExp(key.original, 'gi');
      result = result.replace(regex, (match) => {
        this.obfuscationMap.set(key.replacement, match);
        return key.replacement;
      });
    });
    
    // Apply number obfuscations
    keys.filter(k => k.type === 'number').forEach(key => {
      const regex = new RegExp(key.original, 'g');
      result = result.replace(regex, (match) => {
        const obfuscated = this.obfuscateNumber(match, key.method, key.parameter);
        this.obfuscationMap.set(obfuscated.toString(), match);
        return obfuscated;
      });
    });
    
    // Apply date obfuscations
    keys.filter(k => k.type === 'date').forEach(key => {
      const regex = new RegExp(key.original, 'g');
      result = result.replace(regex, (match) => {
        const obfuscated = this.obfuscateDate(match, key.method, key.parameter);
        this.obfuscationMap.set(obfuscated, match);
        return obfuscated;
      });
    });
    
    return result;
  }

  /**
   * Main de-obfuscation function
   */
  deobfuscate(text, keys) {
    let result = text;
    
    // Reverse text replacements
    keys.filter(k => k.type === 'text').forEach(key => {
      const regex = new RegExp(key.replacement, 'gi');
      result = result.replace(regex, key.original);
    });
    
    // Reverse number obfuscations (requires tracking original mappings)
    // This is a simplified version - in production, you'd need to store the mapping
    
    return result;
  }

  /**
   * Auto-detect sensitive information in text
   */
  detectSensitiveInfo(text) {
    const suggestions = [];
    
    // Detect names (simplified - looks for capitalized words)
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = text.match(namePattern);
    if (names) {
      names.forEach(name => {
        suggestions.push({
          type: 'text',
          original: name,
          replacement: 'John Doe',
          category: 'name',
          level: 'suggested'
        });
      });
    }
    
    // Detect email addresses
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailPattern);
    if (emails) {
      emails.forEach(email => {
        suggestions.push({
          type: 'text',
          original: email,
          replacement: 'user@example.com',
          category: 'email',
          level: 'suggested'
        });
      });
    }
    
    // Detect phone numbers
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = text.match(phonePattern);
    if (phones) {
      phones.forEach(phone => {
        suggestions.push({
          type: 'text',
          original: phone,
          replacement: '555-0100',
          category: 'phone',
          level: 'suggested'
        });
      });
    }
    
    // Detect SSN
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssns = text.match(ssnPattern);
    if (ssns) {
      ssns.forEach(ssn => {
        suggestions.push({
          type: 'text',
          original: ssn,
          replacement: '000-00-0000',
          category: 'ssn',
          level: 'suggested'
        });
      });
    }
    
    // Detect dates
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
    const dates = text.match(datePattern);
    if (dates) {
      dates.forEach(date => {
        suggestions.push({
          type: 'date',
          original: date,
          method: 'offsetDays',
          parameter: 30,
          category: 'date',
          level: 'suggested'
        });
      });
    }
    
    // Detect large numbers (potential financial data)
    const numberPattern = /\$?\d{1,3}(,\d{3})*(\.\d{2})?/g;
    const numbers = text.match(numberPattern);
    if (numbers) {
      numbers.forEach(number => {
        suggestions.push({
          type: 'number',
          original: number.replace(/[$,]/g, ''),
          method: 'multiply',
          parameter: 1.5,
          category: 'financial',
          level: 'suggested'
        });
      });
    }
    
    return suggestions;
  }
}

export default new ObfuscationEngine();
