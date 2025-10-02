import { useState, useEffect } from 'react';
import { Paperclip, Send, Settings } from 'lucide-react';
import { Typography } from './components/ui/typography';
import { Button } from './components/ui/button';
import Navbar from './components/Navbar';
import EnhancedPrivacyScanModal from './components/EnhancedPrivacyScanModal';
import ApiKeyModal from './components/ApiKeyModal';
import { piiDetector, PIIDetectedItem } from './utils/piiDetector';
import { openaiService, ChatMessage } from './services/openaiService';
import { useTheme } from './hooks/useTheme';
import './App.css';

// Enhanced chat interface with PII protection
function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [detectedItems, setDetectedItems] = useState<PIIDetectedItem[]>([]);
  const [originalText, setOriginalText] = useState('');
  const [hasApiKey, setHasApiKey] = useState(!!openaiService.getApiKey());

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if API key is set
    if (!hasApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    // Detect PII in the message
    const detected = piiDetector.detectPII(inputValue);
    
    if (detected.length > 0) {
      // Show privacy scan modal
      setDetectedItems(detected);
      setOriginalText(inputValue);
      setShowPrivacyModal(true);
    } else {
      // No PII detected, send directly
      await sendMessageToAI(inputValue, []);
    }
  };

  const sendMessageToAI = async (text: string, piiReplacements: PIIDetectedItem[] = []) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Obfuscate the text if PII was detected
      let obfuscatedText = text;
      if (piiReplacements.length > 0) {
        const obfuscationResult = piiDetector.obfuscateText(text, piiReplacements);
        obfuscatedText = obfuscationResult.obfuscatedText;
      }

      // Send to OpenAI
      const aiResponse = await openaiService.sendMessage(messages, obfuscatedText);
      
      // De-obfuscate the response if we had PII replacements
      let finalResponse = aiResponse;
      if (piiReplacements.length > 0) {
        const replacements = piiDetector.obfuscateText(text, piiReplacements).replacements;
        finalResponse = piiDetector.deobfuscateText(aiResponse, replacements);
      }

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: finalResponse,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendSecurely = (selectedItems: PIIDetectedItem[]) => {
    setShowPrivacyModal(false);
    sendMessageToAI(originalText, selectedItems);
  };

  const handleApiKeySave = (apiKey: string) => {
    openaiService.setApiKey(apiKey);
    setHasApiKey(true);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Enter your message here..."
                    className="w-full px-4 py-3 pr-20 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowApiKeyModal(true)}
                      className="w-8 h-8"
                      title="API Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="w-8 h-8"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground'
                  }`}
                >
                  <Typography variant="p2">{message.content}</Typography>
                  <Typography variant="p3" className="text-xs opacity-70 mt-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-card text-card-foreground max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <Typography variant="p2">Typing...</Typography>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!isEmpty && (
        <div className="bg-background p-4 border-t border-border">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter your message here..."
                className="w-full px-4 py-3 pr-20 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowApiKeyModal(true)}
                  className="w-8 h-8"
                  title="API Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8 h-8"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <Typography variant="p3" className="text-green-600">
              Privacy Protection Ready
            </Typography>
          </div>
          <div className="flex justify-center mt-1">
              <Typography variant="p3" className="text-muted-foreground">
                Available Credits: 5000 words
              </Typography>
          </div>
        </div>
      )}

      {/* Modals */}
      <EnhancedPrivacyScanModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        detectedItems={detectedItems}
        originalText={originalText}
        onSendSecurely={handleSendSecurely}
      />
      
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
      />
    </div>
  );
}

function App() {
  const { theme } = useTheme();

  // Initialize theme on app load
  useEffect(() => {
    // Theme is automatically initialized by useTheme hook
  }, [theme]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;
