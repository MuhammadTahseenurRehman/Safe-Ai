import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Upload, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import keyManager, { KEY_LEVELS } from '../utils/keyManager';

export default function KeyManagement() {
  const [keys, setKeys] = useState({ master: [], client: {}, enterprise: [], subject: {} });
  const [stats, setStats] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({
    level: KEY_LEVELS.MASTER,
    type: 'text',
    original: '',
    replacement: '',
    method: 'multiply',
    parameter: '',
    identifier: ''
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = () => {
    setKeys({
      master: keyManager.getKeysByLevel(KEY_LEVELS.MASTER),
      inquiry: keyManager.getKeysByLevel(KEY_LEVELS.INQUIRY),
      enterprise: keyManager.getKeysByLevel(KEY_LEVELS.ENTERPRISE),
      client: keyManager.keys[KEY_LEVELS.CLIENT],
      subject: keyManager.keys[KEY_LEVELS.SUBJECT]
    });
    setStats(keyManager.getStatistics());
  };

  const handleAddKey = () => {
    try {
      const identifier = [KEY_LEVELS.CLIENT, KEY_LEVELS.SUBJECT].includes(newKey.level)
        ? newKey.identifier
        : null;

      keyManager.addKey(newKey.level, {
        type: newKey.type,
        original: newKey.original,
        replacement: newKey.replacement,
        method: newKey.method,
        parameter: newKey.parameter
      }, identifier);

      setNewKey({
        level: KEY_LEVELS.MASTER,
        type: 'text',
        original: '',
        replacement: '',
        method: 'multiply',
        parameter: '',
        identifier: ''
      });
      setShowAddForm(false);
      loadKeys();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteKey = (keyId) => {
    if (window.confirm('Are you sure you want to delete this key?')) {
      keyManager.removeKey(keyId);
      loadKeys();
    }
  };

  const handleExport = () => {
    const data = keyManager.exportKeys();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safestai-keys-${Date.now()}.json`;
    a.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = keyManager.importKeys(e.target.result, false);
        if (success) {
          alert('Keys imported successfully!');
          loadKeys();
        } else {
          alert('Failed to import keys. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderKeysList = (keysList, title) => {
    if (!keysList || keysList.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-3">{title} ({keysList.length})</h3>
        <div className="space-y-2">
          {keysList.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline">{key.type}</Badge>
                  {key.category && <Badge variant="secondary">{key.category}</Badge>}
                </div>
                <div className="text-sm font-mono">
                  <span className="text-red-600">{key.original}</span>
                  <span className="mx-2">→</span>
                  <span className="text-green-600">
                    {key.replacement || `[${key.method}${key.parameter ? `: ${key.parameter}` : ''}]`}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteKey(key.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Key Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.total || 0}</div>
              <div className="text-sm text-muted-foreground">Total Keys</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.byLevel?.master || 0}</div>
              <div className="text-sm text-muted-foreground">Master Keys</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.byType?.text || 0}</div>
              <div className="text-sm text-muted-foreground">Text Keys</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.byType?.number || 0}</div>
              <div className="text-sm text-muted-foreground">Number Keys</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Key
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Keys
        </Button>
        <Button variant="outline" asChild>
          <label>
            <Upload className="w-4 h-4 mr-2" />
            Import Keys
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      {/* Add Key Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Key</CardTitle>
            <CardDescription>Create a new obfuscation key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Key Level</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  value={newKey.level}
                  onChange={(e) => setNewKey({ ...newKey, level: e.target.value })}
                >
                  <option value={KEY_LEVELS.MASTER}>Master</option>
                  <option value={KEY_LEVELS.ENTERPRISE}>Enterprise</option>
                  <option value={KEY_LEVELS.CLIENT}>Client-Based</option>
                  <option value={KEY_LEVELS.SUBJECT}>Subject-Based</option>
                  <option value={KEY_LEVELS.INQUIRY}>Inquiry</option>
                </select>
              </div>

              {[KEY_LEVELS.CLIENT, KEY_LEVELS.SUBJECT].includes(newKey.level) && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Identifier</label>
                  <Input
                    placeholder="e.g., client-001 or legal-case"
                    value={newKey.identifier}
                    onChange={(e) => setNewKey({ ...newKey, identifier: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  value={newKey.type}
                  onChange={(e) => setNewKey({ ...newKey, type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Original Value</label>
                <Input
                  placeholder="Value to obfuscate"
                  value={newKey.original}
                  onChange={(e) => setNewKey({ ...newKey, original: e.target.value })}
                />
              </div>

              {newKey.type === 'text' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Replacement Value</label>
                  <Input
                    placeholder="Replacement text"
                    value={newKey.replacement}
                    onChange={(e) => setNewKey({ ...newKey, replacement: e.target.value })}
                  />
                </div>
              )}

              {(newKey.type === 'number' || newKey.type === 'date') && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Method</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      value={newKey.method}
                      onChange={(e) => setNewKey({ ...newKey, method: e.target.value })}
                    >
                      {newKey.type === 'number' && (
                        <>
                          <option value="multiply">Multiply</option>
                          <option value="divide">Divide</option>
                          <option value="add">Add</option>
                          <option value="subtract">Subtract</option>
                          <option value="logarithmic">Logarithmic</option>
                          <option value="round">Round</option>
                        </>
                      )}
                      {newKey.type === 'date' && (
                        <>
                          <option value="offsetDays">Offset Days</option>
                          <option value="removeDay">Remove Day</option>
                          <option value="yearOnly">Year Only</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Parameter</label>
                    <Input
                      placeholder="e.g., 100 or 30"
                      value={newKey.parameter}
                      onChange={(e) => setNewKey({ ...newKey, parameter: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddKey}>Add Key</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Your Keys</CardTitle>
          <CardDescription>Manage your obfuscation keys by level</CardDescription>
        </CardHeader>
        <CardContent>
          {renderKeysList(keys.master, 'Master Keys')}
          {renderKeysList(keys.enterprise, 'Enterprise Keys')}
          {renderKeysList(keys.inquiry, 'Inquiry Keys')}
          
          {Object.keys(keys.client).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Client-Based Keys</h3>
              {Object.entries(keys.client).map(([clientId, clientKeys]) => (
                <div key={clientId} className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Client: {clientId}
                  </h4>
                  {renderKeysList(clientKeys, '')}
                </div>
              ))}
            </div>
          )}

          {Object.keys(keys.subject).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Subject-Based Keys</h3>
              {Object.entries(keys.subject).map(([subjectId, subjectKeys]) => (
                <div key={subjectId} className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Subject: {subjectId}
                  </h4>
                  {renderKeysList(subjectKeys, '')}
                </div>
              ))}
            </div>
          )}

          {stats.total === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No keys yet. Add your first key to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
