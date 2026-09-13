
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, AlertCircle, CheckCircle, Clock, Users, BarChart3, Plus } from 'lucide-react';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState('dashboard');

  const t = {
    en: {
      title: 'Land Dispute Resolution System',
      subtitle: 'Digital Complaint Management Platform',
      dashboard: 'Dashboard',
      newComplaint: 'New Complaint',
      tracking: 'Track Cases',
      reports: 'Reports',
      settings: 'Settings',
      overview: 'Overview',
      totalCases: 'Total Cases',
      pending: 'Pending',
      underInvestigation: 'Under Investigation',
      resolved: 'Resolved',
      newComplaintBtn: 'File New Complaint',
      caseId: 'Case ID',
      status: 'Status',
      location: 'Location',
      type: 'Type',
      date: 'Date',
      submitter: 'Submitter',
      ownershipDispute: 'Ownership Dispute',
      boundaryIssue: 'Boundary Issue',
      illegalOccupancy: 'Illegal Occupancy',
      documentIssue: 'Document Issue',
      leaseDispute: 'Lease Dispute',
      registered: 'Registered',
      screening: 'Screening',
      investigation: 'Investigation',
      legalReview: 'Legal Review',
      decided: 'Decided',
      implemented: 'Implemented',
      closed: 'Closed',
      recentCases: 'Recent Cases',
      statusDistribution: 'Status Distribution',
      casesByType: 'Cases by Type',
      avgResolutionTime: 'Avg Resolution Time',
      days: 'days',
      parcelId: 'Parcel ID',
      description: 'Description',
      submittedOn: 'Submitted on',
      investigator: 'Investigator',
    },
    am: {
      title: 'የይዞታ ጉዳይ አፈታት ሥርዓት',
      subtitle: 'ዲጂታል ቅሬታ አስተዳደር መድረክ',
      dashboard: 'ዋና ሳሪ',
      newComplaint: 'አዲስ ቅሬታ',
      tracking: 'ጉዳዮች ክትትል',
      reports: 'ሪፖርቶች',
      settings: 'ቅንብሮች',
      overview: 'አጠቃላይ ትዕዛዝ',
      totalCases: 'ጠቅላላ ጉዳዮች',
      pending: 'በመጠባበቅ ላይ',
      underInvestigation: 'በምርመራ ላይ',
      resolved: 'የተፈቱ',
      newComplaintBtn: 'አዲስ ቅሬታ ያስቀምጡ',
      caseId: 'ጉዳይ መለያ',
      status: 'ሁኔታ',
      location: 'ስፍራ',
      type: 'ዓይነት',
      date: 'ቀን',
      submitter: 'ቅሬታ አቅራቢ',
      ownershipDispute: 'የባለቤትነት ክርክር',
      boundaryIssue: 'የድንበር ጉዳይ',
      illegalOccupancy: 'ሕገወጥ ይዞታ',
      documentIssue: 'የሰነድ ጉዳይ',
      leaseDispute: 'የሊዝ ክርክር',
      registered: 'ተመዝግቦ',
      screening: 'ማጣራት',
      investigation: 'ምርመራ',
      legalReview: 'ሕጋዊ ግምገማ',
      decided: 'ውሳኔ ተሰጠ',
      implemented: 'በአፈጻጸም ላይ',
      closed: 'ተዘግቷል',
      recentCases: 'ቅርብ ጉዳዮች',
      statusDistribution: 'ሁኔታ ስርጭት',
      casesByType: 'ጉዳዮች በአይነት',
      avgResolutionTime: 'አማካይ አፈታት ጊዜ',
      days: 'ቀናት',
      parcelId: 'ፓርሰል መለያ',
      description: 'መግለጫ',
      submittedOn: 'ላከ በ',
      investigator: 'ተመራማሪ',
    }
  };

  const lang = t[language];

  // Sample data
  const dashboardStats = [
    { label: lang.totalCases, value: '247', icon: FileText, color: 'bg-blue-500' },
    { label: lang.pending, value: '45', icon: Clock, color: 'bg-yellow-500' },
    { label: lang.underInvestigation, value: '78', icon: AlertCircle, color: 'bg-orange-500' },
    { label: lang.resolved, value: '124', icon: CheckCircle, color: 'bg-green-500' },
  ];

  const recentCases = [
    { id: 'SWPR-LDM-C-2024-001', type: lang.ownershipDispute, status: lang.investigation, location: 'Addis Ababa', date: '2024-09-10', submitter: 'Abebe Assefa' },
    { id: 'SWPR-LDM-C-2024-002', type: lang.boundaryIssue, status: lang.legalReview, location: 'Dire Dawa', date: '2024-09-08', submitter: 'Almaz Tekle' },
    { id: 'SWPR-LDM-C-2024-003', type: lang.illegalOccupancy, status: lang.screening, location: 'Hawassa', date: '2024-09-05', submitter: 'Dawit Mengesha' },
    { id: 'SWPR-LDM-C-2024-004', type: lang.documentIssue, status: lang.registered, location: 'Mekelle', date: '2024-09-01', submitter: 'Fikadu Wolde' },
  ];

  const caseTypes = [
    { name: lang.ownershipDispute, count: 52 },
    { name: lang.boundaryIssue, count: 48 },
    { name: lang.illegalOccupancy, count: 71 },
    { name: lang.documentIssue, count: 43 },
    { name: lang.leaseDispute, count: 33 },
  ];

  const statusColors: Record<string, string> = {
    [lang.registered]: 'bg-blue-100 text-blue-800',
    [lang.screening]: 'bg-purple-100 text-purple-800',
    [lang.investigation]: 'bg-orange-100 text-orange-800',
    [lang.legalReview]: 'bg-indigo-100 text-indigo-800',
    [lang.decided]: 'bg-green-100 text-green-800',
    [lang.implemented]: 'bg-cyan-100 text-cyan-800',
    [lang.closed]: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{lang.title}</h1>
          <p className="text-slate-600">{lang.subtitle}</p>
        </div>
        <Button 
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          variant="outline"
          className="text-sm"
        >
          {language === 'en' ? 'አማርኛ' : 'English'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">{lang.dashboard}</TabsTrigger>
          <TabsTrigger value="newComplaint">{lang.newComplaint}</TabsTrigger>
          <TabsTrigger value="tracking">{lang.tracking}</TabsTrigger>
          <TabsTrigger value="reports">{lang.reports}</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{lang.recentCases}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-slate-200">
                  <tr className="text-slate-600 font-semibold">
                    <th className="text-left py-3 px-2">{lang.caseId}</th>
                    <th className="text-left py-3 px-2">{lang.type}</th>
                    <th className="text-left py-3 px-2">{lang.status}</th>
                    <th className="text-left py-3 px-2">{lang.location}</th>
                    <th className="text-left py-3 px-2">{lang.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-mono text-blue-600">{caseItem.id}</td>
                      <td className="py-3 px-2 text-slate-700">{caseItem.type}</td>
                      <td className="py-3 px-2">
                        <Badge className={statusColors[caseItem.status]}>{caseItem.status}</Badge>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{caseItem.location}</td>
                      <td className="py-3 px-2 text-slate-600">{caseItem.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{lang.casesByType}</h3>
              <div className="space-y-3">
                {caseTypes.map((type, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-slate-700">{type.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${(type.count / 71) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-8">{type.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{lang.avgResolutionTime}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-700">{lang.decided}</span>
                  <span className="text-2xl font-bold text-green-600">28 {lang.days}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <span className="text-slate-700">{lang.investigation}</span>
                  <span className="text-2xl font-bold text-orange-600">45 {lang.days}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="text-slate-700">{lang.screening}</span>
                  <span className="text-2xl font-bold text-blue-600">7 {lang.days}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* New Complaint Tab */}
        <TabsContent value="newComplaint" className="space-y-6">
          <Card className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{lang.newComplaintBtn}</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang.submitter}</label>
                <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang.location}</label>
                <input type="text" placeholder="Address" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang.type}</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{lang.ownershipDispute}</option>
                  <option>{lang.boundaryIssue}</option>
                  <option>{lang.illegalOccupancy}</option>
                  <option>{lang.documentIssue}</option>
                  <option>{lang.leaseDispute}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang.parcelId}</label>
                <input type="text" placeholder="e.g., PAR-2024-001" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang.description}</label>
                <textarea rows={5} placeholder="Detailed description of the complaint..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                {lang.newComplaintBtn}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Case Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{lang.tracking}</h2>
            <div className="space-y-4">
              {recentCases.map((caseItem) => (
                <div key={caseItem.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono font-bold text-blue-600">{caseItem.id}</p>
                      <p className="text-sm text-slate-600 mt-1">{caseItem.type}</p>
                    </div>
                    <Badge className={statusColors[caseItem.status]}>{caseItem.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <p><span className="font-semibold">{lang.location}:</span> {caseItem.location}</p>
                    <p><span className="font-semibold">{lang.submittedOn}:</span> {caseItem.date}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Upload Evidence</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{lang.reports}</h2>
            <div className="space-y-3">
              {['Daily Report', 'Weekly Report', 'Monthly Report', 'Annual Report'].map((report, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-700">{report}</span>
                  </div>
                  <Button variant="outline" size="sm">Generate</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 text-center text-slate-600 text-sm border-t border-slate-200 pt-6">
        <p>Land Dispute Resolution System v1.0</p>
      </div>
    </div>
  );
};

export default Index;
