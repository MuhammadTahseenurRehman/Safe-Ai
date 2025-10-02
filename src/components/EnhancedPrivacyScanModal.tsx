import React, { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, Edit3, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Typography } from './ui/typography';
import { Card, CardContent } from './ui/card';
import { PIIDetectedItem } from '../utils/piiDetector';

interface EnhancedPrivacyScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedItems: PIIDetectedItem[];
  originalText: string;
  onSendSecurely: (selectedItems: PIIDetectedItem[]) => void;
}

export default function EnhancedPrivacyScanModal({ 
  isOpen, 
  onClose, 
  detectedItems = [], 
  originalText = '', 
  onSendSecurely 
}: EnhancedPrivacyScanModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showOriginal, setShowOriginal] = useState(false);

  if (!isOpen) return null;

  const handleItemToggle = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleSendSecurely = () => {
    const itemsToObfuscate = Array.from(selectedItems).map(index => detectedItems[index]);
    onSendSecurely(itemsToObfuscate);
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedItems.size === detectedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(detectedItems.map((_, index) => index)));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <Typography variant="h3" weight="semibold">
              Enhanced Privacy Scan Results
            </Typography>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Description */}
          <div className="mb-6">
            <Typography variant="p2" className="text-gray-600 dark:text-gray-400">
              Found {detectedItems.length} sensitive items obfuscated with dummy data. 
              We will use dummy data when you send the AI a message, so that no sensitive 
              information is sent to third-party models.
            </Typography>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="send-obfuscated"
              defaultChecked
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="send-obfuscated" className="text-sm text-gray-700 dark:text-gray-300">
              Send Obfuscated (right-click on any text to edit/unobfuscate)
            </label>
          </div>

          {/* Content Preview */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="p2" weight="medium">
                  Your Content (Right-click on any text to add custom protection)
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOriginal(!showOriginal)}
                >
                  {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showOriginal ? 'Hide Original' : 'Show Original'}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                <Typography variant="p3" className="whitespace-pre-wrap">
                  {showOriginal ? originalText : 'Content with obfuscated PII will be shown here...'}
                </Typography>
              </div>
            </CardContent>
          </Card>

          {/* Detected Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="h4" weight="semibold">
                All Detected Entities ({detectedItems.length} items)
              </Typography>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedItems.size === detectedItems.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {detectedItems.map((item, index) => (
              <Card key={index} className={`${selectedItems.has(index) ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(index)}
                          onChange={() => handleItemToggle(index)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Typography variant="p2" weight="medium">
                          {item.type}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded">
                            Will be replaced with {item.dummy || 'Dummy Data'}
                          </span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <Typography variant="p3" className="text-gray-500 dark:text-gray-400 mb-1">
                            Original:
                          </Typography>
                          <Typography variant="p3" className="font-mono bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded">
                            {item.original}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="p3" className="text-gray-500 dark:text-gray-400 mb-1">
                            Obfuscated:
                          </Typography>
                          <Typography variant="p3" className="font-mono bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                            {item.dummy || 'Dummy Data'}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Unobfuscate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendSecurely} className="bg-blue-600 hover:bg-blue-700">
            <Shield className="w-4 h-4 mr-2" />
            Send Securely
          </Button>
        </div>
      </div>
    </div>
  );
}
