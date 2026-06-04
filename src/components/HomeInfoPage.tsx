import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, Sparkles, MessageSquare, ShieldAlert, Star, Shield, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface HomeInfoPageProps {
  onNavigate: (tab: any) => void;
}

export default function HomeInfoPage({ onNavigate }: HomeInfoPageProps) {
  const { t, i18n } = useTranslation();
  const isPt = i18n.language === 'pt' || i18n.language === 'pt-BR';

  const texts = {
    pt: {
      welcome: "Bem-vindo ao Conecta TEA",
      subtitle: "A primeira rede social do mundo projetada exclusivamente para famílias com Transtorno do Espectro Autista (TEA).",
      creatorNote: "Criada com amor e empatia por Fábio Palacio Schwingel, pai da Victória (5 anos, Parobé-RS).",
      missionTitle: "Nossa Missão Especial",
      missionDesc: "Ser o porto seguro digital que toda família com autismo merece ter desde o primeiro dia de dúvidas. Unindo tecnologia inteligente, acolhimento humano real e privacidade inabalável.",
      projectsTitle: "Os Nossos Pilares e Projetos",
      conectaDesc: "Uma comunidade acolhedora onde pais, cuidadores, terapeutas e profissionais compartilham vitórias diárias, desabafos reais e trocam dicas essenciais de rotina, direitos e desenvolvimento.",
      triagemTitle: "Triagem TEA IA",
      triagemDesc: "Um assistente inteligente de triagem precoce que escuta as preocupações dos pais e gera orientações organizadas para auxiliar as famílias antes de consultas com médicos e terapeutas.",
      charactersTitle: "Conheça os Nossos Personagens",
      sofiaName: "Sofia - A Guia IA Amiga",
      sofiaDesc: "Sempre acolhedora e atenta, a Sofia é nossa assistente virtual 24h. Ela entende as dores e dúvidas de cada família, oferendo empatia, escuta ativa e regulação sensorial rápida nos momentos de crise.",
      theoName: "Theo - O Pequeno Explorador",
      theoDesc: "Theo representa a pureza, a curiosidade infinita e a beleza de enxergar o mundo sob uma perspectiva única. Ele ensina que cada passo no desenvolvimento, por menor que seja, merece ser celebrado com muita festa.",
      notDoctor: "Aviso importante: Nenhuma ferramenta do Conecta TEA substitui a avaliação de uma junta médica multidisciplinar ou o laudo de profissionais especializados.",
      exploreBtn: "Acessar Comunidade",
      startTriageBtn: "Conhecer a Triagem",
      cardPromoTitle: "Carteirinha de Emergência do Theo",
      cardPromoDesc: "Gere e baixe no seu celular a carteirinha digital com informações de contato, alergias, tipo sanguíneo e instruções rápidas para crises em público.",
      cardPromoBtn: "Criar Minha Carteirinha"
    },
    en: {
      welcome: "Welcome to Conecta TEA",
      subtitle: "The world's first social network designed exclusively for families with Autism Spectrum Disorder (ASD).",
      creatorNote: "Created with love and empathy by Fábio Palacio Schwingel, father of Victória (5 years old, Parobé-RS).",
      missionTitle: "Our Special Mission",
      missionDesc: "To be the safe digital harbor that every family with autism deserves to have from the very first day of questions. Combining smart AI technology, real human support, and absolute privacy.",
      projectsTitle: "Our Pillars and Projects",
      conectaDesc: "A warm community where parents, caregivers, and therapists share daily victories, real struggles, and exchange essential tips on routine, rights, and sensory development.",
      triagemTitle: "Triage TEA AI",
      triagemDesc: "An intelligent early screening assistant that listens to parent concerns and organizes helpful guidance documents to prepare families before their specialist appointments.",
      charactersTitle: "Meet Our Characters",
      sofiaName: "Sofia - The Friendly AI Guide",
      sofiaDesc: "Always warm and attentive, Sofia is our 24/7 virtual guide. She understands the difficulties of families, providing empathy, active listening, and sensory SOS Support.",
      theoName: "Theo - The Little Explorer",
      theoDesc: "Theo represents purity, infinite curiosity, and the beauty of seeing the world through a unique perspective. He teaches us to celebrate every milestone, no matter how small.",
      notDoctor: "Important notice: No tool on Conecta TEA replaces a comprehensive multidisciplinary medical evaluation or official specialist diagnostic documents.",
      exploreBtn: "Access Community",
      startTriageBtn: "Discover Triage AI",
      cardPromoTitle: "Theo's Emergency ID Card",
      cardPromoDesc: "Generate and download a digital ID card to your phone with emergency contacts, blood type, allergies, and quick public crisis instructions.",
      cardPromoBtn: "Create My ID Card"
    },
    es: {
      welcome: "Bienvenido a Conecta TEA",
      subtitle: "La primera red social del mundo diseñada exclusivamente para familias con Trastorno del Espectro Autista (TEA).",
      creatorNote: "Creada con amor y empatía por Fábio Palacio Schwingel, padre de Victória (5 años, Parobé-RS).",
      missionTitle: "Nuestra Misión Especial",
      missionDesc: "Ser el refugio digital seguro que toda familia con autismo merece tener desde el primer día de dudas. Combinando tecnología inteligente, apoyo humano real y privacidad inquebrantable.",
      projectsTitle: "Nuestros Pilares y Proyectos",
      conectaDesc: "Una comunidad cálida donde padres, cuidadores y terapeutas comparten victorias diarias, desahogos reales e intercambian consejos cruciales sobre rutinas, derechos y bienestar.",
      triagemTitle: "Triaje TEA IA",
      triagemDesc: "Un asistente inteligente de triaje temprano que escucha las inquietudes de los padres y organiza un informe de primeros pasos para ayudar a las familias antes de sus citas médicas.",
      charactersTitle: "Conoce a Nuestros Personajes",
      sofiaName: "Sofía - La Guía IA Amiga",
      sofiaDesc: "Siempre cálida y atenta, Sofía es nuestra asistente virtual 24/7. Ella comprende los desafíos de las familias, ofreciendo empatía, escucha activa y un espacio seguro de apoyo emocional.",
      theoName: "Theo - El Pequeño Explorador",
      theoDesc: "Theo representa la pureza, la curiosidad infinita y la belleza de ver el mundo desde una perspectiva única. Nos enseña a celebrar cada pequeño hito en el desarrollo con profunda alegría.",
      notDoctor: "Aviso importante: Ninguna herramienta de Conecta TEA reemplaza la evaluación médica multidisciplinaria o el informe de profesionales calificados.",
      exploreBtn: "Acceder a la Comunidad",
      startTriageBtn: "Descubrir Triaje IA",
      cardPromoTitle: "Tarjeta de Emergencia de Theo",
      cardPromoDesc: "Crea y descarga en tu celular la identificación digital con contactos de emergencia, tipo de sangre, alergias y pautas rápidas de crisis sensorial.",
      cardPromoBtn: "Crear Mi Identificación"
    },
    ja: {
      welcome: "Conecta TEA へようこそ",
      subtitle: "自閉症スペクトラム障害（ASD）を抱えるご家族のために設計された、世界初の専用ソーシャルネットワーク。",
      creatorNote: "ブラジルのビクトリアちゃん（5歳、ASD）の父、Fábio Palacio Schwingel が愛と共感を込めて開発しました。",
      missionTitle: "私たちの特別な使命",
      missionDesc: "自閉症を抱えるすべてのご家族が、最初に疑問を抱いたその瞬間から寄り添う安心のデジタルポートになること。インテリジェントなAI技術、心温まる人間のサポート、そして強固なプライバシー保護を組み合わせています。",
      projectsTitle: "主なプロジェクトと柱",
      conectaDesc: "日々のささやかな喜びや保護者の本音での対話、ルーティンや児童権利、感覚調整に関わる実用的な知識や投稿を共有し合う、温かいコミュニティスペースです。",
      triagemTitle: "自閉症 AI チェック (Triagem)",
      triagemDesc: "保護者の気がかりな兆候を丁寧にお聞きし、専門医やテラピストとの面談に向けてわかりやすいファーストステップ資料を整理するインテリジェントチェックシステムです。",
      charactersTitle: "キャラクターの紹介",
      sofiaName: "ソフィア - 親身に寄り添うAIガイド",
      sofiaDesc: "24時間いつでもあなたをサポートする仮想アドバイザー。一人一人の悩みに深く共鳴し、心理的安定や、非常時の感覚緊急リセット（SOS）のための手助けをします。",
      theoName: "テオ - 好奇心旺盛な小さな冒険家",
      theoDesc: "自閉症を持つ子供たちの無垢な心、無限の好奇心、そして独自の視点を表現しています。日々のちいさな一歩が、どれだけ素晴らしいお祝い事になるかを教えてくれます。",
      notDoctor: "重要なお知らせ：Conecta TEAの各種ツールは、医師等の専門家による対面診断、医療行為、または専門的な診断書の獲得を代替するものではございません。",
      exploreBtn: "コミュニティを開く",
      startTriageBtn: "AIチェックを調べる",
      cardPromoTitle: "テオの緊急デジタルデマンドカード",
      cardPromoDesc: "アレルギー、連絡先、緊急時対処マニュアル等をスマホに保管できるデジタルカードをいつでも生成・ダウンロード可能です。",
      cardPromoBtn: "カードを作成する"
    }
  };

  const currentLang = (i18n.language && i18n.language.substring(0, 2)) || 'pt';
  const txt = texts[currentLang as keyof typeof texts] || texts['pt'];

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 font-sans text-gray-900 leading-relaxed">
      {/* Hero Header */}
      <div className="text-center py-12 md:py-16 bg-gradient-to-tr from-sky-50/70 via-sky-100/30 to-purple-50/80 rounded-[3rem] px-6 border border-sky-100 mb-12 shadow-sm">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showText={false} className="w-20 h-20 shadow-lg shadow-sky-200/50 rounded-3xl" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-[#0F2F4A] tracking-tight mb-4"
        >
          {txt.welcome}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium"
        >
          {txt.subtitle}
        </motion.p>
        <div className="mt-6 inline-block bg-white/80 backdrop-blur-md border border-slate-100 px-6 py-2 rounded-full text-xs font-bold text-[#0EA5E9] shadow-sm">
          {txt.creatorNote}
        </div>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onNavigate('feed')}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-505/20 flex items-center gap-2"
          >
            {txt.exploreBtn}
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => onNavigate('triagem')}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Brain size={18} className="text-[#0EA5E9]" />
            {txt.startTriageBtn}
          </button>
        </div>
      </div>

      {/* Mission Area */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
          <Heart size={32} className="fill-purple-300 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{txt.missionTitle}</h2>
          <p className="text-slate-600 text-base">{txt.missionDesc}</p>
        </div>
      </div>

      {/* Core Projects Section */}
      <h2 className="text-2.5xl font-black text-[#0F2F4A] tracking-tight mb-8 text-center uppercase">{txt.projectsTitle}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Social Feed card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-sky-200 transition-all shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Rede Social Conecta TEA</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {txt.conectaDesc}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('feed')}
            className="w-full py-3.5 bg-slate-50 hover:bg-sky-50 text-sky-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group text-sm"
          >
            {txt.exploreBtn}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Triage tool card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-purple-200 transition-all shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <Brain size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">{txt.triagemTitle}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {txt.triagemDesc}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('triagem')}
            className="w-full py-3.5 bg-slate-50 hover:bg-purple-50 text-purple-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group text-sm"
          >
            {txt.startTriageBtn}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Characters Showcase */}
      <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 mb-12 border border-slate-150">
        <h2 className="text-2.5xl font-black text-[#0F2F4A] tracking-tight mb-8 text-center uppercase">{txt.charactersTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sofia */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center select-none text-2xl">
                👩‍⚕️
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{txt.sofiaName}</h3>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider">Sofia IA</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {txt.sofiaDesc}
            </p>
          </div>

          {/* Theo */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center select-none text-2xl">
                🦖
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{txt.theoName}</h3>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Acolhimento Lúdico</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {txt.theoDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Carteirinha promo */}
      <div className="bg-gradient-to-br from-indigo-550 via-indigo-600 to-sky-600 rounded-[2.5rem] p-8 text-white mb-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Totalmente Prático e Seguro
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">
            {txt.cardPromoTitle}
          </h2>
          <p className="text-white/90 text-sm leading-relaxed mb-6">
            {txt.cardPromoDesc}
          </p>
          <button 
            onClick={() => onNavigate('carteirinha')}
            className="px-6 py-3 bg-white text-indigo-700 hover:bg-slate-50 font-black rounded-xl transition-all shadow-md text-sm active:scale-95"
          >
            {txt.cardPromoBtn}
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Medical disclaimer note */}
      <div className="bg-amber-50/50 border border-amber-150 rounded-2xl p-6 text-center text-xs font-semibold text-amber-800 leading-relaxed max-w-2xl mx-auto">
        <Shield size={18} className="mx-auto mb-2 text-amber-600" />
        <p>{txt.notDoctor}</p>
      </div>
    </div>
  );
}
