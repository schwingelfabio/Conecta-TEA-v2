import React from 'react';
import VideoGallery from './VideoGallery';
import { PlayCircle } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
            <PlayCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Galeria de Vídeos</h1>
            <p className="text-slate-500">Conteúdo educativo e informativo sobre o autismo.</p>
          </div>
        </div>
      </div>
      
      <VideoGallery />
    </div>
  );
}
