import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getTranslation, Language } from '@/lib/i18n';
import { Evidence } from '@/types';
import { Plus, Download, Share2, Trash2, Eye, Edit2, Image as ImageIcon, Video, Music, FileText, MapPin } from 'lucide-react';

interface GalleryContext {
  language: Language;
}

const Gallery: React.FC = () => {
  const { language } = useOutletContext<GalleryContext>();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('is_deleted', false)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setEvidence(data || []);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'en' ? 'Are you sure?' : 'እርግጠኛ ነዎት?')) return;
    
    try {
      const { error } = await supabase
        .from('evidence')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      setEvidence(evidence.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting evidence:', error);
    }
  };

  const handleUpdateDescription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .update({ description: editDescription })
        .eq('id', id);

      if (error) throw error;
      setEvidence(evidence.map(e => 
        e.id === id ? { ...e, description: editDescription } : e
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating evidence:', error);
    }
  };

  const getEvidenceIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      photo: <ImageIcon className="w-6 h-6" />,
      video: <Video className="w-6 h-6" />,
      audio: <Music className="w-6 h-6" />,
      document: <FileText className="w-6 h-6" />,
      gps_location: <MapPin className="w-6 h-6" />,
    };
    return icons[type] || <FileText className="w-6 h-6" />;
  };

  const filteredEvidence = evidence.filter(e => 
    !filterType || e.evidence_type === filterType
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{getTranslation(language, 'gallery')}</h1>
        <Button className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          {getTranslation(language, 'add')}
        </Button>
      </div>

      {/* Filter */}
      <Card className="p-4 bg-card border border-border">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={filterType === '' ? 'default' : 'outline'}
            onClick={() => setFilterType('')}
          >
            {language === 'en' ? 'All' : 'ሁሉም'}
          </Button>
          {['photo', 'video', 'audio', 'document', 'gps_location'].map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
            >
              {getTranslation(language, type as any)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.map(item => (
          <Card key={item.id} className="bg-card border border-border overflow-hidden hover:shadow-lg transition">
            {/* Thumbnail */}
            <div className="h-48 bg-muted flex items-center justify-center">
              <div className="text-muted-foreground">
                {getEvidenceIcon(item.evidence_type)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{item.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.upload_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {getTranslation(language, item.evidence_type as any)}
                </Badge>
              </div>

              {/* Description */}
              {editingId === item.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 border border-border rounded text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateDescription(item.id)}
                      className="bg-primary text-primary-foreground"
                    >
                      {getTranslation(language, 'save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      {getTranslation(language, 'cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || (language === 'en' ? 'No description' : 'መግለጫ የለም')}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  {getTranslation(language, 'view')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditDescription(item.description || '');
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <Card className="p-12 text-center bg-card border border-border">
          <p className="text-muted-foreground">
            {language === 'en' ? 'No evidence found' : 'ማስረጃ አልተገኘም'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Gallery;
