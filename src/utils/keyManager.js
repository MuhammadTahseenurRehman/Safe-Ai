/**
 * SafestAI Key Management System
 * Handles hierarchical key storage and retrieval
 */

export const KEY_LEVELS = {
  MASTER: 'master',
  INQUIRY: 'inquiry',
  CLIENT: 'client',
  ENTERPRISE: 'enterprise',
  SUBJECT: 'subject',
  SUGGESTED: 'suggested'
};

export class KeyManager {
  constructor() {
    this.loadKeys();
  }

  /**
   * Load keys from localStorage
   */
  loadKeys() {
    try {
      const stored = localStorage.getItem('safestai_keys');
      this.keys = stored ? JSON.parse(stored) : {
        [KEY_LEVELS.MASTER]: [],
        [KEY_LEVELS.INQUIRY]: [],
        [KEY_LEVELS.CLIENT]: {},
        [KEY_LEVELS.ENTERPRISE]: [],
        [KEY_LEVELS.SUBJECT]: {},
        [KEY_LEVELS.SUGGESTED]: []
      };
    } catch (error) {
      console.error('Error loading keys:', error);
      this.keys = {
        [KEY_LEVELS.MASTER]: [],
        [KEY_LEVELS.INQUIRY]: [],
        [KEY_LEVELS.CLIENT]: {},
        [KEY_LEVELS.ENTERPRISE]: [],
        [KEY_LEVELS.SUBJECT]: {},
        [KEY_LEVELS.SUGGESTED]: []
      };
    }
  }

  /**
   * Save keys to localStorage
   */
  saveKeys() {
    try {
      localStorage.setItem('safestai_keys', JSON.stringify(this.keys));
    } catch (error) {
      console.error('Error saving keys:', error);
    }
  }

  /**
   * Add a key at a specific level
   */
  addKey(level, key, identifier = null) {
    const keyWithId = {
      ...key,
      id: this.generateKeyId(),
      createdAt: new Date().toISOString(),
      level
    };

    switch (level) {
      case KEY_LEVELS.MASTER:
      case KEY_LEVELS.INQUIRY:
      case KEY_LEVELS.ENTERPRISE:
      case KEY_LEVELS.SUGGESTED:
        if (!this.keys[level]) this.keys[level] = [];
        this.keys[level].push(keyWithId);
        break;

      case KEY_LEVELS.CLIENT:
      case KEY_LEVELS.SUBJECT:
        if (!identifier) {
          throw new Error(`Identifier required for ${level} level keys`);
        }
        if (!this.keys[level][identifier]) {
          this.keys[level][identifier] = [];
        }
        this.keys[level][identifier].push(keyWithId);
        break;

      default:
        throw new Error(`Invalid key level: ${level}`);
    }

    this.saveKeys();
    return keyWithId;
  }

  /**
   * Remove a key
   */
  removeKey(keyId) {
    // Search through all levels
    for (const level in this.keys) {
      if (Array.isArray(this.keys[level])) {
        this.keys[level] = this.keys[level].filter(k => k.id !== keyId);
      } else if (typeof this.keys[level] === 'object') {
        for (const identifier in this.keys[level]) {
          this.keys[level][identifier] = this.keys[level][identifier].filter(k => k.id !== keyId);
        }
      }
    }
    this.saveKeys();
  }

  /**
   * Update a key
   */
  updateKey(keyId, updates) {
    let found = false;
    
    for (const level in this.keys) {
      if (Array.isArray(this.keys[level])) {
        const index = this.keys[level].findIndex(k => k.id === keyId);
        if (index !== -1) {
          this.keys[level][index] = { ...this.keys[level][index], ...updates };
          found = true;
          break;
        }
      } else if (typeof this.keys[level] === 'object') {
        for (const identifier in this.keys[level]) {
          const index = this.keys[level][identifier].findIndex(k => k.id === keyId);
          if (index !== -1) {
            this.keys[level][identifier][index] = { 
              ...this.keys[level][identifier][index], 
              ...updates 
            };
            found = true;
            break;
          }
        }
      }
    }
    
    if (found) {
      this.saveKeys();
    }
    return found;
  }

  /**
   * Get all keys for a specific inquiry
   * Combines master, client, subject, enterprise, and inquiry-specific keys
   */
  getKeysForInquiry(options = {}) {
    const { clientId, subjectId, inquiryId, includesSuggested = false } = options;
    let allKeys = [];

    // Always include master keys
    allKeys = [...this.keys[KEY_LEVELS.MASTER]];

    // Add enterprise keys
    if (this.keys[KEY_LEVELS.ENTERPRISE]) {
      allKeys = [...allKeys, ...this.keys[KEY_LEVELS.ENTERPRISE]];
    }

    // Add client-specific keys
    if (clientId && this.keys[KEY_LEVELS.CLIENT][clientId]) {
      allKeys = [...allKeys, ...this.keys[KEY_LEVELS.CLIENT][clientId]];
    }

    // Add subject-specific keys
    if (subjectId && this.keys[KEY_LEVELS.SUBJECT][subjectId]) {
      allKeys = [...allKeys, ...this.keys[KEY_LEVELS.SUBJECT][subjectId]];
    }

    // Add inquiry-specific keys
    if (inquiryId) {
      const inquiryKeys = this.keys[KEY_LEVELS.INQUIRY].filter(
        k => k.inquiryId === inquiryId
      );
      allKeys = [...allKeys, ...inquiryKeys];
    }

    // Add suggested keys if requested
    if (includesSuggested && this.keys[KEY_LEVELS.SUGGESTED]) {
      allKeys = [...allKeys, ...this.keys[KEY_LEVELS.SUGGESTED]];
    }

    // Remove duplicates based on original value
    const uniqueKeys = allKeys.reduce((acc, key) => {
      const exists = acc.find(k => 
        k.original === key.original && k.type === key.type
      );
      if (!exists) {
        acc.push(key);
      }
      return acc;
    }, []);

    return uniqueKeys;
  }

  /**
   * Get keys by level
   */
  getKeysByLevel(level, identifier = null) {
    if (level === KEY_LEVELS.CLIENT || level === KEY_LEVELS.SUBJECT) {
      if (!identifier) return [];
      return this.keys[level][identifier] || [];
    }
    return this.keys[level] || [];
  }

  /**
   * Get all clients
   */
  getClients() {
    return Object.keys(this.keys[KEY_LEVELS.CLIENT]);
  }

  /**
   * Get all subjects
   */
  getSubjects() {
    return Object.keys(this.keys[KEY_LEVELS.SUBJECT]);
  }

  /**
   * Clear inquiry-level keys
   */
  clearInquiryKeys() {
    this.keys[KEY_LEVELS.INQUIRY] = [];
    this.saveKeys();
  }

  /**
   * Clear suggested keys
   */
  clearSuggestedKeys() {
    this.keys[KEY_LEVELS.SUGGESTED] = [];
    this.saveKeys();
  }

  /**
   * Promote a suggested key to another level
   */
  promoteKey(keyId, newLevel, identifier = null) {
    let keyToPromote = null;

    // Find the key in suggested
    const index = this.keys[KEY_LEVELS.SUGGESTED].findIndex(k => k.id === keyId);
    if (index !== -1) {
      keyToPromote = this.keys[KEY_LEVELS.SUGGESTED][index];
      this.keys[KEY_LEVELS.SUGGESTED].splice(index, 1);
    }

    if (keyToPromote) {
      const newKey = { ...keyToPromote, level: newLevel };
      delete newKey.id; // Remove old ID
      return this.addKey(newLevel, newKey, identifier);
    }

    return null;
  }

  /**
   * Generate unique key ID
   */
  generateKeyId() {
    return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export keys to JSON
   */
  exportKeys() {
    return JSON.stringify(this.keys, null, 2);
  }

  /**
   * Import keys from JSON
   */
  importKeys(jsonString, merge = false) {
    try {
      const importedKeys = JSON.parse(jsonString);
      
      if (merge) {
        // Merge with existing keys
        for (const level in importedKeys) {
          if (Array.isArray(importedKeys[level])) {
            this.keys[level] = [...(this.keys[level] || []), ...importedKeys[level]];
          } else if (typeof importedKeys[level] === 'object') {
            this.keys[level] = { ...(this.keys[level] || {}), ...importedKeys[level] };
          }
        }
      } else {
        // Replace all keys
        this.keys = importedKeys;
      }
      
      this.saveKeys();
      return true;
    } catch (error) {
      console.error('Error importing keys:', error);
      return false;
    }
  }

  /**
   * Get statistics about stored keys
   */
  getStatistics() {
    const stats = {
      total: 0,
      byLevel: {},
      byType: {}
    };

    for (const level in this.keys) {
      let levelCount = 0;
      
      if (Array.isArray(this.keys[level])) {
        levelCount = this.keys[level].length;
        this.keys[level].forEach(key => {
          stats.byType[key.type] = (stats.byType[key.type] || 0) + 1;
        });
      } else if (typeof this.keys[level] === 'object') {
        for (const identifier in this.keys[level]) {
          levelCount += this.keys[level][identifier].length;
          this.keys[level][identifier].forEach(key => {
            stats.byType[key.type] = (stats.byType[key.type] || 0) + 1;
          });
        }
      }
      
      stats.byLevel[level] = levelCount;
      stats.total += levelCount;
    }

    return stats;
  }
}

export default new KeyManager();
