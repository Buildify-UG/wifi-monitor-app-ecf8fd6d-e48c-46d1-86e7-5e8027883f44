import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, Zap, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NetworkMetric {
  timestamp: string;
  signal: number;
  latency: number;
  speed: number;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [signalStrength, setSignalStrength] = useState(85);
  const [latency, setLatency] = useState(12);
  const [downloadSpeed, setDownloadSpeed] = useState(94.5);
  const [uploadSpeed, setUploadSpeed] = useState(28.3);
  const [metrics, setMetrics] = useState<NetworkMetric[]>([
    { timestamp: '12:00', signal: 80, latency: 15, speed: 92 },
    { timestamp: '12:05', signal: 82, latency: 13, speed: 95 },
    { timestamp: '12:10', signal: 85, latency: 12, speed: 94.5 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate network metrics changes
      const newSignal = Math.max(20, Math.min(100, 85 + (Math.random() - 0.5) * 20));
      const newLatency = Math.max(5, Math.min(50, 12 + (Math.random() - 0.5) * 10));
      const newSpeed = Math.max(50, Math.min(150, 94.5 + (Math.random() - 0.5) * 30));

      setSignalStrength(newSignal);
      setLatency(newLatency);
      setDownloadSpeed(newSpeed);
      setUploadSpeed(Math.max(10, newSpeed * 0.3));

      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

      setMetrics(prev => {
        const updated = [...prev.slice(-8), {
          timestamp: timeStr,
          signal: newSignal,
          latency: newLatency,
          speed: newSpeed,
        }];
        return updated;
      });

      // Randomly simulate connection status
      if (Math.random() > 0.98) {
        setIsConnected(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal: number) => {
    if (signal >= 75) return 'text-green-500';
    if (signal >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalBars = (signal: number) => {
    if (signal >= 75) return 4;
    if (signal >= 50) return 3;
    if (signal >= 25) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {isConnected ? (
              <Wifi className="w-8 h-8 text-green-500" />
            ) : (
              <WifiOff className="w-8 h-8 text-red-500" />
            )}
            <h1 className="text-3xl font-bold text-gray-800">WiFi Monitor</h1>
          </div>
          <p className="text-gray-600">
            {isConnected ? '✓ Connected to Network' : '✗ No Connection'}
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Signal Strength */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Signal className="w-4 h-4" />
                Signal Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {signalStrength.toFixed(0)}%
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-1 rounded-sm ${
                      i < getSignalBars(signalStrength)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latency */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {latency.toFixed(1)}ms
              </div>
              <p className="text-xs text-gray-500">
                {latency < 20 ? '✓ Excellent' : latency < 50 ? '⚠ Good' : '✗ Poor'}
              </p>
            </CardContent>
          </Card>

          {/* Download Speed */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Download
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {downloadSpeed.toFixed(1)}
              </div>
              <p className="text-xs text-gray-500">Mbps</p>
            </CardContent>
          </Card>

          {/* Upload Speed */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {uploadSpeed.toFixed(1)}
              </div>
              <p className="text-xs text-gray-500">Mbps</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signal Strength Chart */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Signal Strength Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" stroke="#999" />
                  <YAxis domain={[0, 100]} stroke="#999" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="signal"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Speed Chart */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Download Speed Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Latency Chart */}
        <Card className="bg-white shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Latency Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
