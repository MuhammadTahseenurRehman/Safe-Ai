// OpenAI API Service
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = localStorage.getItem('openai_api_key') || '';
    this.baseURL = 'https://api.openai.com/v1';
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async sendMessage(messages: ChatMessage[], obfuscatedContent: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not found. Please set your API key in settings.');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages,
            {
              role: 'user',
              content: obfuscatedContent
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API key or connection failed');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
