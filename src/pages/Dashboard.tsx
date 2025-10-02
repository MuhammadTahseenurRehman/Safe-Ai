import { useState } from 'react';
import { Typography } from '../components/ui/typography';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  MessageSquare, 
  Shield, 
  FileText, 
  Settings, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    totalMessages: 1247,
    protectedData: 89,
    privacyScore: 95,
    activeSessions: 3
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'message',
      description: 'Protected sensitive data in conversation',
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'privacy',
      description: 'Automatically masked 3 PII items',
      timestamp: '15 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'file',
      description: 'Processed document with privacy protection',
      timestamp: '1 hour ago',
      status: 'completed'
    }
  ]);

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" weight="semibold">
              Dashboard
            </Typography>
            <Typography variant="p2" className="text-muted-foreground">
              Overview of your privacy-protected AI interactions
            </Typography>
          </div>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Protected Data
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.protectedData}</div>
              <p className="text-xs text-muted-foreground">
                PII items secured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Privacy Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.privacyScore}%</div>
              <p className="text-xs text-muted-foreground">
                Excellent protection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sessions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest privacy-protected interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-primary" />}
                      {activity.type === 'privacy' && <Shield className="w-4 h-4 text-primary" />}
                      {activity.type === 'file' && <FileText className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Insights</CardTitle>
              <CardDescription>
                Your privacy protection summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Email Protection</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Name Detection</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Document Analysis</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Real-time Scanning</span>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
