import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getTranslation, Language } from '@/lib/i18n';
import { Case } from '@/types';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface CasesContext {
  language: Language;
}

const Cases: React.FC = () => {
  const { language } = useOutletContext<CasesContext>();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.complaint_subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      investigation: 'bg-purple-100 text-purple-800',
      decision_pending: 'bg-orange-100 text-orange-800',
      decided: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{getTranslation(language, 'cases')}</h1>
        <Button className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          {getTranslation(language, 'newComplaint')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card border border-border">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              placeholder={getTranslation(language, 'search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-border"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">{language === 'en' ? 'All Status' : 'ሁሉም ሁኔታ'}</option>
            <option value="registered">{getTranslation(language, 'registered')}</option>
            <option value="screening">{getTranslation(language, 'screening')}</option>
            <option value="investigation">{getTranslation(language, 'investigation')}</option>
            <option value="decision_pending">{getTranslation(language, 'decisionPending')}</option>
            <option value="decided">{getTranslation(language, 'decided')}</option>
            <option value="closed">{getTranslation(language, 'closed')}</option>
          </select>
        </div>
      </Card>

      {/* Cases Table */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Case ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(caseItem => (
                <tr key={caseItem.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-sm font-medium">{caseItem.case_id}</td>
                  <td className="px-6 py-4 text-sm">{caseItem.complaint_subject}</td>
                  <td className="px-6 py-4 text-sm">{caseItem.complaint_type}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={getStatusColor(caseItem.status)}>
                      {getTranslation(language, caseItem.status as any)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">{caseItem.priority}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(caseItem.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredCases.length === 0 && (
        <Card className="p-12 text-center bg-card border border-border">
          <p className="text-muted-foreground">
            {language === 'en' ? 'No cases found' : 'ጉዳይ አልተገኘም'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Cases;
