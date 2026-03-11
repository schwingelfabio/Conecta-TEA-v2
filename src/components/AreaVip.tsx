import React from 'react';
import { motion } from 'framer-motion';
import { Book, PlayCircle, Download, ExternalLink, Crown } from 'lucide-react';
import { UserProfile } from '../types';
import PlanosVip from './PlanosVip';

interface AreaVipProps {
  userProfile: UserProfile | null;
}

const ebooks = [
  { id: 1, title: 'E-book 1', url: 'https://drive.google.com/file/d/1H4WwZKD7jqqbkMccFjc6PiyDTn0nqJPM/view?usp=drivesdk' },
  { id: 2, title: 'E-book 2', url: 'https://drive.google.com/file/d/1T9stxGqRGRA8w1sWqNB-9FnamWBwnzc0/view?usp=drivesdk' },
  { id: 3, title: 'E-book 3', url: 'https://drive.google.com/file/d/1GsICIFDJZb30xTT3AujMlsxEVre0iHzg/view?usp=drivesdk' },
  { id: 4, title: 'E-book 4', url: 'https://drive.google.com/file/d/1aFcrP3_-16aRFRypJ-tlrqO1WdXygBNC/view?usp=drivesdk' },
  { id: 5, title: 'E-book 5', url: 'https://drive.google.com/file/d/14g7yE7Yk6Aa__QM309PoFY_fjUL4EL2p/view?usp=drivesdk' },
  { id: 6, title: 'E-book 6', url: 'https://drive.google.com/file/d/1rl_vcqm3uZWMCTz38MRi3KgxaRtYqJTp/view?usp=drivesdk' },
  { id: 7, title: 'E-book 7', url: 'https://drive.google.com/file/d/1wIwhkQsuaJJqdtDfCjBPgjLirIj8AqKC/view?usp=drivesdk' },
];

const videos = [
  { id: 1, title: 'Vídeo 1', url: 'https://youtube.com/shorts/NwxAkaOBFho?si=Bui2iwlfHTXWdQLQ' },
  { id: 2, title: 'Vídeo 2', url: 'https://youtube.com/shorts/B5rIqICOJro?feature=shared' },
  { id: 3, title: 'Vídeo 3', url: 'https://youtube.com/shorts/vowGqn1_Fbs?si=7IGFZzs7_oJTETER' },
  { id: 4, title: 'Vídeo 4', url: 'https://youtube.com/shorts/_Rf-ROpUMeY?si=gpKxjj6K7YRBMVJi' },
  { id: 5, title: 'Vídeo 5', url: 'https://youtube.com/shorts/BOBEmYWj2b8?si=l86Shq093_l7rr9N' },
  { id: 6, title: 'Vídeo 6', url: 'https://youtube.com/shorts/a6f8mxS5RZM?si=8bBAVsaSQ2hjwG_t' },
];

const AreaVip: React.FC<AreaVipProps> = ({ userProfile }) => {
  if (!userProfile?.isVip && userProfile?.role !== 'admin') {
    return <PlanosVip userProfile={userProfile} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center">
          <Crown size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Área VIP</h1>
          <p className="text-slate-500">Conteúdos exclusivos para assinantes</p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center space-x-3 mb-8">
          <Book className="text-brand-primary" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">E-books Exclusivos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ebooks.map((ebook) => (
            <motion.div
              key={ebook.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
                <Book size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 flex-1">{ebook.title}</h3>
              <a
                href={ebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center space-x-2 w-full py-3 bg-slate-50 hover:bg-brand-primary hover:text-white text-slate-700 font-medium rounded-xl transition-colors"
              >
                <Download size={18} />
                <span>Baixar / Acessar</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-3 mb-8">
          <PlayCircle className="text-brand-secondary" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">Vídeos Exclusivos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center mb-4">
                <PlayCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 flex-1">{video.title}</h3>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center space-x-2 w-full py-3 bg-slate-50 hover:bg-brand-secondary hover:text-white text-slate-700 font-medium rounded-xl transition-colors"
              >
                <ExternalLink size={18} />
                <span>Assistir</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AreaVip;
