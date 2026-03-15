import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, Globe } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

export default function ExternalNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('autismo');

  const topics = [
    { id: 'autismo', label: 'Geral' },
    { id: 'autismo educação', label: 'Educação' },
    { id: 'autismo saúde', label: 'Saúde' },
    { id: 'autismo direitos', label: 'Direitos' },
    { id: 'autismo tecnologia', label: 'Tecnologia' },
    { id: 'autismo pesquisa', label: 'Pesquisa' },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = encodeURIComponent(topic);
        const url = `https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok') {
          setNews(data.items);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [topic]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Notícias na Web</h2>
            <p className="text-sm text-slate-500">Últimas notícias sobre autismo</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                topic === t.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description.replace(/<[^>]*>?/gm, '') }} />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(item.pubDate).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1 text-sky-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ler matéria <ExternalLink size={14} />
                </span>
              </div>
            </a>
          ))}
          {news.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhuma notícia encontrada para este tópico.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
