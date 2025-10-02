import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import obfuscationEngine from '../utils/obfuscationEngine';
import keyManager, { KEY_LEVELS } from '../utils/keyManager';

export default function AIQueryInterface() {
  const [originalText, setOriginalText] = useState('');
  const [obfuscatedText, setObfuscatedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [deobfuscatedResponse, setDeobfuscatedResponse] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [suggestedKeys, setSuggestedKeys] = useState([]);
  const [showObfuscated, setShowObfuscated] = useState(true);
  const [clientId, setClientId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [copied, setCopied] = useState(false);

  // Detect sensitive info when text changes
  useEffect(() => {
    if (originalText) {
      const suggestions = obfuscationEngine.detectSensitiveInfo(originalText);
      setSuggestedKeys(suggestions);
    } else {
      setSuggestedKeys([]);
    }
  }, [originalText]);

  // Load keys based on context
  useEffect(() => {
    const keys = keyManager.getKeysForInquiry({
      clientId: clientId || undefined,
      subjectId: subjectId || undefined,
      includesSuggested: false
    });
    setSelectedKeys(keys);
  }, [clientId, subjectId]);

  const handleObfuscate = () => {
    if (!originalText) return;
    
    // Combine selected keys with accepted suggested keys
    const allKeys = [...selectedKeys, ...suggestedKeys.filter(k => k.accepted)];
    const result = obfuscationEngine.obfuscate(originalText, allKeys);
    setObfuscatedText(result);
  };

  const handleDeobfuscate = () => {
    if (!aiResponse) return;
    
    const allKeys = [...selectedKeys, ...suggestedKeys.filter(k => k.accepted)];
    const result = obfuscationEngine.deobfuscate(aiResponse, allKeys);
    setDeobfuscatedResponse(result);
  };

  const acceptSuggestion = (index) => {
    const newSuggestions = [...suggestedKeys];
    newSuggestions[index].accepted = !newSuggestions[index].accepted;
    setSuggestedKeys(newSuggestions);
  };

  const saveSuggestionAsKey = (suggestion, level) => {
    keyManager.addKey(level, {
      type: suggestion.type,
      original: suggestion.original,
      replacement: suggestion.replacement,
      method: suggestion.method,
      parameter: suggestion.parameter,
      category: suggestion.category
    }, level === KEY_LEVELS.CLIENT ? clientId : level === KEY_LEVELS.SUBJECT ? subjectId : null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateAI = () => {
    // This is a placeholder. In production, you'd send obfuscatedText to an AI API
    setAiResponse(`[AI Response to your query]\n\nBased on the information provided, here are some insights...\n\n${obfuscatedText.substring(0, 200)}...`);
  };

  return (
    <div className="space-y-6">
      {/* Context Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Context (Optional)</CardTitle>
          <CardDescription>
            Specify client or subject to apply relevant keys automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Client ID</label>
              <Input
                placeholder="e.g., client-2024-001"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject ID</label>
              <Input
                placeholder="e.g., legal-case-123"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              />
            </div>
          </div>
          {selectedKeys.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedKeys.length} key(s) active for this context
            </div>
          )}
        </CardContent>
      </Card>

      {/* Original Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Enter Your Sensitive Data</CardTitle>
          <CardDescription>
            Type or paste the information you want to send to AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: John Smith from Acme Corp earned $250,000 on 3/15/2024. His SSN is 123-45-6789 and email is john@acmecorp.com..."
            className="min-h-[150px]"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          <Button onClick={handleObfuscate} className="w-full" disabled={!originalText}>
            <Sparkles className="w-4 h-4 mr-2" />
            Obfuscate Data
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Keys */}
      {suggestedKeys.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              Sensitive Information Detected
            </CardTitle>
            <CardDescription>
              We found potentially sensitive information. Select items to obfuscate:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedKeys.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={suggestion.accepted || false}
                      onChange={() => acceptSuggestion(index)}
                      className="w-4 h-4"
                    />
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {suggestion.category}
                      </Badge>
                      <div className="text-sm">
                        <span className="font-mono bg-red-100 px-2 py-1 rounded">
                          {suggestion.original}
                        </span>
                        <span className="mx-2">→</span>
                        <span className="font-mono bg-green-100 px-2 py-1 rounded">
                          {suggestion.replacement || `[${suggestion.method}]`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {suggestion.accepted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveSuggestionAsKey(suggestion, KEY_LEVELS.MASTER)}
                    >
                      Save as Key
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Obfuscated Text Output */}
      {obfuscatedText && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">2. Obfuscated Data (Safe to Share)</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(obfuscatedText)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <CardDescription>
              This version is safe to send to AI services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={obfuscatedText}
              readOnly
              className="min-h-[150px] font-mono text-sm bg-white"
            />
            <Button onClick={simulateAI} className="w-full" variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              Send to AI (Simulated)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Response Input */}
      {aiResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. AI Response (Obfuscated)</CardTitle>
            <CardDescription>
              Paste the AI's response here to de-obfuscate it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={aiResponse}
              onChange={(e) => setAiResponse(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <Button onClick={handleDeobfuscate} className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              De-obfuscate Response
            </Button>
          </CardContent>
        </Card>
      )}

      {/* De-obfuscated Response */}
      {deobfuscatedResponse && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">4. Original Data Restored</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowObfuscated(!showObfuscated)}
              >
                {showObfuscated ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <CardDescription>
              AI response with your original data restored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={deobfuscatedResponse}
              readOnly
              className="min-h-[150px] bg-white"
            />
          </CardContent>
        </Card>
      )}

      {/* Active Keys Display */}
      {selectedKeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Keys ({selectedKeys.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedKeys.map((key) => (
                <Badge key={key.id} variant="secondary">
                  {key.level}: {key.original} → {key.replacement || `[${key.method}]`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
