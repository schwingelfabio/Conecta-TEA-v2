import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

const videos = [
  { id: 1, title: 'Vídeo 1', url: 'https://www.youtube.com/embed/NwxAkaOBFho' },
  { id: 2, title: 'Vídeo 2', url: 'https://www.youtube.com/embed/B5rIqICOJro' },
  { id: 3, title: 'Vídeo 3', url: 'https://www.youtube.com/embed/vowGqn1_Fbs' },
  { id: 4, title: 'Vídeo 4', url: 'https://www.youtube.com/embed/_Rf-ROpUMeY' },
  { id: 5, title: 'Vídeo 5', url: 'https://www.youtube.com/embed/BOBEmYWj2b8' },
  { id: 6, title: 'Vídeo 6', url: 'https://www.youtube.com/embed/a6f8mxS5RZM' },
];

export default function VideoGallery() {
  return (
    <section>
      <div className="flex items-center space-x-3 mb-8 px-4">
        <PlayCircle className="text-brand-secondary" size={32} />
        <h2 className="text-2xl font-bold text-slate-900">Vídeos Exclusivos</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
          >
            <h3 className="font-bold text-slate-900 mb-4 flex-1">{video.title}</h3>
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-slate-100">
              <Player
                url={video.url}
                width="100%"
                height="100%"
                controls={true}
                className="absolute top-0 left-0"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
