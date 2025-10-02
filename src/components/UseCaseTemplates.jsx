import React from 'react';
import { FileText, BarChart3, Heart, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import keyManager, { KEY_LEVELS } from '../utils/keyManager';

const templates = {
  legal: {
    name: 'Legal Documents',
    icon: FileText,
    description: 'Protect client confidentiality while analyzing legal documents',
    keys: [
      { type: 'text', original: 'Client Name', replacement: 'Party A', category: 'name' },
      { type: 'text', original: 'Opposing Party', replacement: 'Party B', category: 'name' },
      { type: 'text', original: 'Attorney Name', replacement: 'Counsel', category: 'name' },
      { type: 'text', original: 'Case Number', replacement: 'Case-XXXX', category: 'identifier' },
      { type: 'date', original: 'Case Date', method: 'offsetDays', parameter: 60, category: 'date' },
      { type: 'number', original: 'Settlement Amount', method: 'multiply', parameter: 1.3, category: 'financial' },
      { type: 'text', original: 'Court Name', replacement: 'District Court', category: 'location' },
    ],
    example: `Case: Smith v. Johnson\nCase Number: 2024-CV-12345\nDate Filed: 3/15/2024\nSettlement Amount: $125,000\nPlaintiff Attorney: Michael Roberts`,
    obfuscatedExample: `Case: Party A v. Party B\nCase Number: Case-XXXX\nDate Filed: 5/14/2024\nSettlement Amount: $162,500\nPlaintiff Attorney: Counsel`
  },
  healthcare: {
    name: 'Healthcare & Medical',
    icon: Heart,
    description: 'Maintain HIPAA compliance while understanding medical information',
    keys: [
      { type: 'text', original: 'Patient Name', replacement: 'Patient', category: 'name' },
      { type: 'text', original: 'Doctor Name', replacement: 'Provider', category: 'name' },
      { type: 'text', original: 'MRN', replacement: 'MRN-0000', category: 'identifier' },
      { type: 'date', original: 'DOB', method: 'yearOnly', category: 'date' },
      { type: 'date', original: 'Visit Date', method: 'offsetDays', parameter: 45, category: 'date' },
      { type: 'text', original: 'SSN', replacement: '000-00-0000', category: 'ssn' },
      { type: 'text', original: 'Address', replacement: 'General Location', category: 'location' },
    ],
    example: `Patient: Jane Doe\nDOB: 5/12/1985\nMRN: 789456\nProvider: Dr. Sarah Chen\nVisit: 3/20/2024\nDiagnosis: Type 2 Diabetes\nSSN: 123-45-6789`,
    obfuscatedExample: `Patient: Patient\nDOB: 1985\nMRN: MRN-0000\nProvider: Provider\nVisit: 5/4/2024\nDiagnosis: Type 2 Diabetes\nSSN: 000-00-0000`
  },
  dataAnalysis: {
    name: 'Data Analysis',
    icon: BarChart3,
    description: 'Get AI insights without exposing proprietary business data',
    keys: [
      { type: 'text', original: 'Company Name', replacement: 'Company X', category: 'organization' },
      { type: 'text', original: 'Product Name', replacement: 'Product A', category: 'product' },
      { type: 'text', original: 'Client Name', replacement: 'Client ID', category: 'name' },
      { type: 'number', original: 'Revenue', method: 'multiply', parameter: 0.87, category: 'financial' },
      { type: 'number', original: 'Units Sold', method: 'round', parameter: 1000, category: 'metric' },
      { type: 'number', original: 'Profit Margin', method: 'add', parameter: 5, category: 'percentage' },
      { type: 'date', original: 'Quarter Date', method: 'removeDay', category: 'date' },
    ],
    example: `Q1 2024 Report - Acme Corp\n\nProduct: Widget Pro\nRevenue: $2,450,000\nUnits Sold: 15,234\nProfit Margin: 23.5%\nTop Client: MegaCorp Inc\nQuarter End: 3/31/2024`,
    obfuscatedExample: `Q1 2024 Report - Company X\n\nProduct: Product A\nRevenue: $2,131,500\nUnits Sold: 15,000\nProfit Margin: 28.5%\nTop Client: Client ID\nQuarter End: 3/2024`
  }
};

export default function UseCaseTemplates() {
  const loadTemplate = (templateKey) => {
    const template = templates[templateKey];
    
    if (window.confirm(`Load "${template.name}" template?\n\nThis will add ${template.keys.length} keys to your Master keys.`)) {
      template.keys.forEach(key => {
        keyManager.addKey(KEY_LEVELS.MASTER, {
          type: key.type,
          original: key.original,
          replacement: key.replacement,
          method: key.method,
          parameter: key.parameter,
          category: key.category
        });
      });
      
      alert(`Template loaded! ${template.keys.length} keys added to Master level.`);
    }
  };

  const exportTemplate = (templateKey) => {
    const template = templates[templateKey];
    const data = JSON.stringify({
      name: template.name,
      description: template.description,
      keys: template.keys
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safestai-template-${templateKey}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Pre-configured Templates</h2>
        <p className="text-muted-foreground">
          Quick-start templates for common use cases. Load them to get started immediately.
        </p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(templates).map(([key, template]) => {
          const Icon = template.icon;
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportTemplate(key)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Includes {template.keys.length} Keys:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {template.keys.slice(0, 4).map((key, idx) => (
                      <li key={idx}>• {key.original}</li>
                    ))}
                    {template.keys.length > 4 && (
                      <li>• ...and {template.keys.length - 4} more</li>
                    )}
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs font-semibold mb-2 text-red-600">Before:</div>
                  <pre className="text-xs whitespace-pre-wrap">{template.example}</pre>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="text-xs font-semibold mb-2 text-green-600">After:</div>
                  <pre className="text-xs whitespace-pre-wrap">{template.obfuscatedExample}</pre>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => loadTemplate(key)}
                >
                  Load Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Template Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Create Your Own Templates</CardTitle>
          <CardDescription>
            You can create custom templates by:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to the <strong>Key Management</strong> tab</li>
            <li>Add your custom keys for your specific use case</li>
            <li>Export your keys using the <strong>Export Keys</strong> button</li>
            <li>Share the exported file with your team or save it for later</li>
          </ol>
        </CardContent>
      </Card>

      {/* Use Case Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Other Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Financial Planning</h4>
              <p className="text-sm text-muted-foreground">
                Analyze investment portfolios while keeping account numbers and balances private
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">HR & Recruitment</h4>
              <p className="text-sm text-muted-foreground">
                Review resumes and employee data without exposing personal information
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Research & Academia</h4>
              <p className="text-sm text-muted-foreground">
                Analyze research data while maintaining participant anonymity
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Customer Support</h4>
              <p className="text-sm text-muted-foreground">
                Get AI help with customer issues without sharing PII
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
