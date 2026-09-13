import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { getTranslation, Language } from '@/lib/i18n';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface DashboardContext {
  language: Language;
}

interface CaseStats {
  total: number;
  new: number;
  investigation: number;
  pendingDecision: number;
  decided: number;
  closed: number;
}

interface CaseData {
  name: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const { language } = useOutletContext<DashboardContext>();
  const [stats, setStats] = useState<CaseStats>({
    total: 0,
    new: 0,
    investigation: 0,
    pendingDecision: 0,
    decided: 0,
    closed: 0,
  });
  const [casesByType, setCasesByType] = useState<CaseData[]>([]);
  const [casesByStatus, setCasesByStatus] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch case statistics
      const { data: cases, error } = await supabase
        .from('cases')
        .select('status, complaint_type');

      if (error) throw error;

      if (cases) {
        // Calculate stats
        const stats: CaseStats = {
          total: cases.length,
          new: cases.filter(c => c.status === 'registered').length,
          investigation: cases.filter(c => c.status === 'investigation').length,
          pendingDecision: cases.filter(c => c.status === 'decision_pending').length,
          decided: cases.filter(c => c.status === 'decided').length,
          closed: cases.filter(c => c.status === 'closed').length,
        };
        setStats(stats);

        // Group by complaint type
        const typeMap: Record<string, number> = {};
        cases.forEach(c => {
          typeMap[c.complaint_type] = (typeMap[c.complaint_type] || 0) + 1;
        });
        setCasesByType(
          Object.entries(typeMap).map(([name, count]) => ({ name, count }))
        );

        // Group by status
        const statusMap: Record<string, number> = {};
        cases.forEach(c => {
          statusMap[c.status] = (statusMap[c.status] || 0) + 1;
        });
        setCasesByStatus(
          Object.entries(statusMap).map(([name, count]) => ({ name, count }))
        );
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{getTranslation(language, 'home')}</h1>
        <p className="text-muted-foreground mt-2">
          {language === 'en' 
            ? 'Welcome to Land Dispute Resolution System' 
            : 'ወደ የይዞታ አስተዳደርና ቅሬታ አፈታት ሥርዓት እንኳን ደህና መጡ'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          icon={AlertCircle} 
          label={getTranslation(language, 'totalCases')} 
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label={getTranslation(language, 'newCases')} 
          value={stats.new}
          color="bg-green-500"
        />
        <StatCard 
          icon={Clock} 
          label={getTranslation(language, 'underInvestigation')} 
          value={stats.investigation}
          color="bg-yellow-500"
        />
        <StatCard 
          icon={AlertCircle} 
          label={getTranslation(language, 'pendingDecisions')} 
          value={stats.pendingDecision}
          color="bg-orange-500"
        />
        <StatCard 
          icon={CheckCircle} 
          label={getTranslation(language, 'decidedCases')} 
          value={stats.decided}
          color="bg-purple-500"
        />
        <StatCard 
          icon={CheckCircle} 
          label={getTranslation(language, 'closedCases')} 
          value={stats.closed}
          color="bg-pink-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Status */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'en' ? 'Cases by Status' : 'ጉዳዮች በሁኔታ'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={casesByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cases by Type */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'en' ? 'Cases by Type' : 'ጉዳዮች በዓይነት'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={casesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {casesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-primary text-primary-foreground">
          {getTranslation(language, 'newComplaint')}
        </Button>
        <Button variant="outline">
          {getTranslation(language, 'search')}
        </Button>
        <Button variant="outline">
          {getTranslation(language, 'reports')}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
