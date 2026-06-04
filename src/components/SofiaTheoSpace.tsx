import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Download, MessageSquare, Play, Video, Image as ImageIcon, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SofiaIA } from './SofiaIA';
import DonationSupportCard from './DonationSupportCard';

export default function SofiaTheoSpace() {
  const { t, i18n } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'ebooks' | 'chat' | 'drawings' | 'cartoons'>('chat');

  const currentLang = (i18n.language && i18n.language.substring(0, 2)) || 'pt';

  // Content dictionaries
  const dict = {
    pt: {
      title: "Espaço Sofia & Theo",
      subtitle: "Universo lúdico e educativo dos nossos personagens favoritos. Baixe e-books, brinque de colorir ou desabafe com a Sofia IA.",
      tabEbooks: "E-books de Desenvolvimento",
      tabChat: "Conversar com Sofia IA",
      tabDrawings: "Desenhos para Colorir",
      tabCartoons: "Vídeos e Desenhos (Em breve)",
      ebookSubtitle: "Biblioteca gratuita de guias práticos sobre nutrição, comportamento, rotinas e direitos.",
      drawSubtitle: "Imagens incríveis de Sofia & Theo criadas para imprimir, colorir e entreter as crianças.",
      cartoonSubtitle: "Em breve: Animações e episódios curtos dos desenhos de Sofia e Theo para acalmar e ensinar.",
      chatNotice: "A Sofia é sua tutora virtual 24h. Sinta-se livre para desabafar ou fazer perguntas sobre diagnóstico, crises e educação. Esta ferramenta é 100% gratuita e de uso livre.",
      downloadFile: "Baixar PDF Gratis",
      downloadColoring: "Salvar Imagem",
      soonTitle: "Animações e Desenhos Lúdicos",
      soonDesc: "Nossa equipe de animadores já está trabalhando no primeiro mini-episódio de 'Sofia & Theo: Descobrindo o Mundo'. Vídeos lúdicos com cores relaxantes e áudios suaves perfeitamente pensados para crianças com hipersensibilidade sensorial.",
      supportText: "Para nos ajudar a continuar criando episódios de desenho animado e e-books gratuitos, considere fazer uma doação de qualquer valor!"
    },
    en: {
      title: "Sofia & Theo Space",
      subtitle: "The playful and educational universe of our characters. Download eBooks, print coloring pages, or open a chat with Sofia AI.",
      tabEbooks: "Educational eBooks",
      tabChat: "Chat with Sofia AI",
      tabDrawings: "Coloring Book Sheets",
      tabCartoons: "Cartoons & videos (Soon)",
      ebookSubtitle: "Free library of practical child guides regarding language, eating habits, diagnostics, and rights.",
      drawSubtitle: "Stunning graphics of Sofia & Theo ready to print, paint, and sensory engage atypical children.",
      cartoonSubtitle: "Coming soon: Cartoon videos of Sofia & Theo designed with smooth visual triggers to calm and educate.",
      chatNotice: "Sofia is your 24/7 virtual ally. Feel free to talk, vent, or resolve queries regarding autism traits, sensory processing, or school rights. 100% free with no registration required.",
      downloadFile: "Download Free PDF",
      downloadColoring: "Save Drawing Image",
      soonTitle: "Cartoon Episodes in Pre-Production",
      soonDesc: "Our illustration team is building the first animated pilot 'Sofia & Theo: Quiet Explorers'. Hand-drawn animations with calm color charts, smooth dynamic transitions, and relaxing sounds suited for hyper-sensitive toddlers.",
      supportText: "To help us continue releasing animated cartoon episodes and free ebooks, think about donating any micro gift to help Fábio Palacio Schwingel!"
    },
    es: {
      title: "Espacio Sofia & Theo",
      subtitle: "Universo lúdico y educativo de nuestros personajes favoritos. Descarga libros, colorea dibujos o habla con Sofía IA.",
      tabEbooks: "Libros Educativos",
      tabChat: "Chatear con Sofía IA",
      tabDrawings: "Dibujos para Colorear",
      tabCartoons: "Vídeos y Caricaturas (Pronto)",
      ebookSubtitle: "Colección gratuita de guías esenciales para familias sobre crianza, alimentación y salud.",
      drawSubtitle: "Imágenes de alta calidad de Sofía y Theo listas para imprimir, pintar y entretener.",
      cartoonSubtitle: "Próximamente: Animaciones y clips breves con tonos relajantes ideales para la autoregulación emotiva.",
      chatNotice: "Sofía es tu mentora virtual 24/7. Tienes libertad total para desahogarte o consultar sobre espectro autista y rutina familiar de forma gratuita.",
      downloadFile: "Descargar Guía Completa",
      downloadColoring: "Descargar Dibujo",
      soonTitle: "Caricaturas Educativas Infantiles",
      soonDesc: "Estamos diseñando la primera serie animada de 'Sofía y Theo'. Estos capítulos contarán con paletas de colores suaves, diálogos pausados y música de armonización ideales para mentes autistas.",
      supportText: "Para ayudarnos a financiar los dibujantes de la serie animada e ilustradores del proyecto, ¡por favor califica hacer una donación voluntaria!"
    },
    ja: {
      title: "ソフィア＆テオ・スペース",
      subtitle: "大人気キャラクターたちの遊びと学びのコンテンツ。電子書籍のダウンロード、ぬりえ画像、ソフィアAIとのフリートークを楽しめます。",
      tabEbooks: "教育的 e-books",
      tabChat: "ソフィアAIとチャット",
      tabDrawings: "キャラクターぬりえ",
      tabCartoons: "動画・アニメ（準備中）",
      ebookSubtitle: "自閉症のお子さんのしつけ、感覚調整、児童の権利などの課題に焦点をあてた無料の資料室です。",
      drawSubtitle: "自閉症のお子さんが飽きずに感覚的に集中できるよう、高コントラストで可愛い印刷用のぬりえデータです。",
      cartoonSubtitle: "近々登場：過敏症気味な幼児の心の安定と知育を促す、穏やかでスローテンポなアニメーション動画集です。",
      chatNotice: "ソフィアは24時間いつでも寄り添うあなたのバーチャルアドバイザーです。登録、制限、支払いは一切不要で、育児のお悩みや不安などをご自由にご相談ください。",
      downloadFile: "電子書籍をダウンロード",
      downloadColoring: "用紙をダウンロード",
      soonTitle: "知育アニメーション制作進行中",
      soonDesc: "アニメーションチームの手による『ソフィア＆テオ：世界のお友だち』の初回パイロットを作成中です。過度な刺激を排した目にやさしい寒色カラーパレット、穏やかなBGMで安心して見せられる専門動画を目指しています。",
      supportText: "アニメーションの開発や無料電子書籍の執筆など、個人インディー活動の更なる加速のため、皆様からの任意のご支援をお願いしています。"
    }
  };

  const c = dict[currentLang as keyof typeof dict] || dict['pt'];

  // E-books catalog with precise Google Drive high availability URLs mapped in previous versions
  const ebooks = [
    {
      id: 'eb1',
      title: t('vip.ebooks.crises.title') || "Guia de Crises no Autismo",
      description: t('vip.ebooks.crises.description') || "Aprenda estratégias baseadas em evidências para acalmar momentos de sobrecarga sensorial.",
      url: 'https://drive.google.com/file/d/1H4WwZKD7jqqbkMccFjc6PiyDTn0nqJPM/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/20'
    },
    {
      id: 'eb2',
      title: t('vip.ebooks.direitos.title') || "Direitos do Autista no Brasil",
      description: t('vip.ebooks.direitos.description') || "As principais garantias legais, transporte gratuito, fila preferencial e benefícios do INSS.",
      url: 'https://drive.google.com/file/d/1T9stxGqRGRA8w1sWqNB-9FnamWBwnzc0/view?usp=drivesdk',
      color: 'border-purple-100 bg-purple-50/20'
    },
    {
      id: 'eb3',
      title: t('vip.ebooks.seletividade.title') || "Seletividade Alimentar Prática",
      description: t('vip.ebooks.seletividade.description') || "Técnicas de dessensibilização e acolhimento para tornar o momento do prato mais calmo.",
      url: 'https://drive.google.com/file/d/1wIwhkQsuaJJqdtDfCjBPgjLirIj8AqKC/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/20'
    },
    {
      id: 'eb4',
      title: t('vip.ebooks.higiene.title') || "Higiene do Sono e Rotinas",
      description: t('vip.ebooks.higiene.description') || "Passo a passo lúdico para noites de descanso integral para a criança e para o casal.",
      url: 'https://drive.google.com/file/d/1rl_vcqm3uZWMCTz38MRi3KgxaRtYqJTp/view?usp=drivesdk',
      color: 'border-amber-100 bg-amber-50/20'
    },
    {
      id: 'eb5',
      title: t('vip.ebooks.diagnostico.title') || "O Primeiro Dia Pós Laudo",
      description: t('vip.ebooks.diagnostico.description') || "Conselhos práticos, acolhimento paterno de Fábio Palacio e dicas fundamentais de terapias.",
      url: 'https://drive.google.com/file/d/1GsICIFDJZb30xTT3AujMlsxEVre0iHzg/view?usp=drivesdk',
      color: 'border-indigo-100 bg-indigo-50/20'
    }
  ];

  // Coloring graphics representation (Pristine layout mock vectors)
  const drawings = [
    {
      id: 'dr1',
      title: "Theo e o Dinossauro",
      desc: "Theo explorando os dinossauros no parque lúdico.",
      url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop",
    },
    {
      id: 'dr2',
      title: "Sofia e as Estrelas da Calmaria",
      desc: "A fada Sofia regulando a respiração junto a constelações.",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop",
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 font-sans text-gray-900 leading-relaxed">
      {/* Dynamic Header */}
      <div className="text-center bg-gradient-to-r from-sky-50 via-sky-100/50 to-indigo-50 rounded-[2.5rem] p-8 md:p-10 border border-sky-100/60 mb-10 shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-3xl select-none animate-bounce">
            🦖
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#0F2F4A] tracking-tight mb-3">
          {c.title}
        </h1>
        <p className="text-slate-650 text-base max-w-xl mx-auto font-medium">
          {c.subtitle}
        </p>
      </div>

      {/* Sub menu tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2 pb-1.5 shrink-0">
        <button 
          onClick={() => setActiveSubTab('chat')}
          className={`px-5 py-3 rounded-xl font-bold transition-all shrink-0 text-sm flex items-center gap-2 ${activeSubTab === 'chat' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <MessageSquare size={16} />
          <span>{c.tabChat}</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('ebooks')}
          className={`px-5 py-3 rounded-xl font-bold transition-all shrink-0 text-sm flex items-center gap-2 ${activeSubTab === 'ebooks' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <BookOpen size={16} />
          <span>{c.tabEbooks}</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('drawings')}
          className={`px-5 py-3 rounded-xl font-bold transition-all shrink-0 text-sm flex items-center gap-2 ${activeSubTab === 'drawings' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <ImageIcon size={16} />
          <span>{c.tabDrawings}</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('cartoons')}
          className={`px-5 py-3 rounded-xl font-bold transition-all shrink-0 text-sm flex items-center gap-2 ${activeSubTab === 'cartoons' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Video size={16} />
          <span>{c.tabCartoons}</span>
        </button>
      </div>

      {/* Panels rendering based on active sub tab */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeSubTab === 'chat' && (
            <motion.div 
              key="chat_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Informational guide inside the chat tab */}
              <div className="bg-sky-50/50 border border-sky-200/50 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-center">
                <div className="w-12 h-12 bg-[#0EA5E9] text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm select-none text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    Sofia IA Tutor Livre e Gratuito
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                      Liberado para Todos
                    </span>
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">{c.chatNotice}</p>
                </div>
              </div>

              {/* Directly embed the exquisite Sofia IA component inside, passing isVip={true} to bypass any strictness! */}
              <div className="rounded-3xl overflow-hidden border-2 border-slate-150 shadow-inner max-w-4xl mx-auto h-[600px] bg-slate-950">
                <SofiaIA isVip={true} />
              </div>
            </motion.div>
          )}

          {activeSubTab === 'ebooks' && (
            <motion.div 
              key="ebooks_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">E-books de Desenvolvimento</h3>
                <p className="text-slate-500 text-sm mt-1">{c.ebookSubtitle}</p>
              </div>

              {/* Ebooks list rendering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ebooks.map((eb) => (
                  <div 
                    key={eb.id}
                    className={`p-6 rounded-[2rem] border border-slate-150 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${eb.color}`}
                  >
                    <div>
                      <div className="inline-flex p-3 bg-white rounded-xl text-[#0EA5E9] shadow-sm mb-4">
                        <BookOpen size={20} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 leading-snug mb-1">{eb.title}</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">{eb.description}</p>
                    </div>
                    <a 
                      href={eb.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all shadow-sm shadow-sky-500/10 flex items-center justify-center gap-2 text-sm active:scale-95"
                    >
                      <Download size={14} />
                      <span>{c.downloadFile}</span>
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'drawings' && (
            <motion.div 
              key="drawings_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Desenhos para Colorir</h3>
                <p className="text-slate-500 text-sm mt-1">{c.drawSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drawings.map((draw) => (
                  <div key={draw.id} className="bg-white rounded-[2rem] border border-slate-150 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 border bg-slate-50">
                        <img 
                          referrerPolicy="no-referrer"
                          src={draw.url} 
                          alt={draw.title} 
                          className="w-full h-full object-cover select-none" 
                        />
                      </div>
                      <h4 className="font-extrabold text-[#0F2F4A] text-lg leading-tight mb-1">{draw.title}</h4>
                      <p className="text-slate-500 text-xs font-medium mb-4 leading-normal">{draw.desc}</p>
                    </div>
                    <a 
                      href={draw.url}
                      download={`Coloring_ConectaTEA_${draw.id}.jpg`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#0EA5E9] hover:opacity-95 text-white font-bold rounded-xl text-center text-xs active:scale-95 transition-all inline-block truncate flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      {c.downloadColoring}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'cartoons' && (
            <motion.div 
              key="cartoons_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-150 p-8 md:p-10 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play size={24} className="fill-purple-600 font-bold ml-1" />
                </div>
                <h3 className="text-2xl font-black text-[#0F2F4A] mb-3">{c.soonTitle}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {c.soonDesc}
                </p>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 inline-flex items-center gap-2 text-purple-800 text-xs font-bold leading-none select-none">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span>Fase de Animação e Criação de Storyboard (2026/2027)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Donation Widget at bottom of Tab 5 */}
      <div className="border-t border-slate-100 pt-10 mt-12">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          {c.supportText}
        </p>
        <DonationSupportCard />
      </div>
    </div>
  );
}
