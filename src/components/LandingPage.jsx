import React, { useState } from 'react';
import { Shield, FileText, Lock, Zap, ChevronRight, Sparkles, AlertCircle, User, Settings, LogOut, CreditCard } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import EnhancedPrivacyScanModal from './EnhancedPrivacyScanModal';

export default function LandingPage({ onStartSession }) {
  const [demoText, setDemoText] = useState('');
  const [obfuscatedItems, setObfuscatedItems] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const detectSensitiveData = (text) => {
    const items = [];
    
    // Detect names
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = text.match(namePattern) || [];
    names.forEach(name => items.push({ type: 'Person Names', value: name }));
    
    // Detect emails
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailPattern) || [];
    emails.forEach(email => items.push({ type: 'E-mail', value: email }));
    
    // Detect phone numbers
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = text.match(phonePattern) || [];
    phones.forEach(phone => items.push({ type: 'Address', value: phone }));
    
    // Detect SSN
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssns = text.match(ssnPattern) || [];
    ssns.forEach(ssn => items.push({ type: 'SSN', value: ssn }));
    
    // Detect dates
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
    const dates = text.match(datePattern) || [];
    dates.forEach(date => items.push({ type: 'Dates', value: date }));
    
    return items;
  };

  const handleAnalyze = () => {
    if (demoText.trim()) {
      const detected = detectSensitiveData(demoText);
      setObfuscatedItems(detected);
      setShowScanModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0f]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">SAFEST AI</h1>
              <p className="text-xs text-gray-400">Privacy Protection Ready</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              Guest Mode
            </Button>
            
            <div className="relative">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-4 h-4" />
                <span>Jim123@gmail.com</span>
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-white font-medium">Jim123@gmail.com</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Manage Subscription</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center space-x-2 border-t border-gray-700">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Welcome to Safest AI
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your privacy-first AI assistant that automatically protects sensitive information while preserving context. Start a conversation to experience secure AI interactions.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Automatic PII Protection</h3>
                <p className="text-sm text-gray-400">
                  Detects and masks sensitive data automatically
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Context Preservation</h3>
                <p className="text-sm text-gray-400">
                  Maintains meaning while securing your data
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Real-time Processing</h3>
                <p className="text-sm text-gray-400">
                  Instant privacy analysis and protection
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Section */}
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-8 mb-8">
              <div className="flex items-start space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    How you can obfuscated the following information.
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">Person Names</Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">Business Names</Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">E-mail</Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">Address</Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">SSN</Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">Dates</Badge>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Enter example text..."
                  className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px] text-left"
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Privacy Protection: Ready</span>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleAnalyze}
                    disabled={!demoText.trim()}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze & Protect
                  </Button>
                </div>
              </div>

            </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
            onClick={() => onStartSession()}
          >
            Start Secure Session
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-gray-500 mt-6">
            Your data never leaves your device unprotected. All obfuscation happens locally.
          </p>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="border-t border-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">End-to-End Security</h3>
              <p className="text-sm text-gray-400">
                Military-grade encryption ensures your data stays private
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Detection</h3>
              <p className="text-sm text-gray-400">
                AI-powered recognition of sensitive information patterns
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance Ready</h3>
              <p className="text-sm text-gray-400">
                HIPAA, GDPR, and other regulatory standards supported
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p className="text-sm">© 2024 Safest AI. All rights reserved.</p>
          <p className="text-xs mt-2">Your privacy is our priority</p>
        </div>
      </footer>

      {/* Enhanced Privacy Scan Modal */}
      <EnhancedPrivacyScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        detectedItems={obfuscatedItems}
        originalText={demoText}
      />
    </div>
  );
}
