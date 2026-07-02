import React from 'react';
import { Brain, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface LandingPageProps {
  onLogin?: () => void;
  onShowTerms?: () => void;
  onGuestLogin?: (targetTab?: string) => void;
  onNavigate?: (path: string, tab: string) => void;
}

const content = {
  pt: {
    tag: "Tecnologia Assistiva",
    title: "Triagem TEA IA – Entenda os sinais de forma rápida e simples",
    subtitle: "Uma ferramenta que ajuda você a identificar possíveis sinais de autismo em poucos minutos.",
    btn1: "Fazer Triagem Agora",
    whatIsTitle: "O que é?",
    whatIsDesc: "A Triagem TEA IA é uma ferramenta que utiliza inteligência artificial para ajudar a identificar sinais comportamentais relacionados ao autismo. É um primeiro passo para quem busca orientação.",
    whatForTitle: "Para que serve?",
    for1: "Ajudar pais e responsáveis com dúvidas",
    for2: "Identificar possíveis sinais precoces",
    for3: "Orientar sobre próximos passos",
    howWorksTitle: "Como funciona?",
    howWorksSub: "Leva menos de 3 minutos.",
    step1Title: "1. Grave um pequeno vídeo",
    step1Desc: "De 1 a 3 minutos",
    step2Title: "2. A inteligência artificial analisa",
    step2Desc: "Processamento rápido e seguro",
    step3Title: "3. Receba uma orientação",
    step3Desc: "Informação inicial clara",
    ctaTitle: "Quanto antes entender, mais cedo você pode ajudar.",
    ctaBtn: "Fazer Triagem Gratuita",
    footer: "Esta ferramenta não substitui avaliação médica. Em caso de dúvidas, procure um profissional especializado."
  },
  en: {
    tag: "Assistive Technology",
    title: "ASD AI Triage – Understand the signs quickly and simply",
    subtitle: "A tool that helps you identify possible signs of autism in just a few minutes.",
    btn1: "Start Triage Now",
    whatIsTitle: "What is it?",
    whatIsDesc: "ASD AI Triage is a tool that uses artificial intelligence to help identify behavioral signs related to autism. It is a first step for those seeking guidance.",
    whatForTitle: "What is it for?",
    for1: "Help parents and guardians with doubts",
    for2: "Identify possible early signs",
    for3: "Guide on next steps",
    howWorksTitle: "How does it work?",
    howWorksSub: "It takes less than 3 minutes.",
    step1Title: "1. Record a short video",
    step1Desc: "From 1 to 3 minutes",
    step2Title: "2. Artificial intelligence analyzes",
    step2Desc: "Fast and secure processing",
    step3Title: "3. Receive guidance",
    step3Desc: "Clear initial information",
    ctaTitle: "The sooner you understand, the sooner you can help.",
    ctaBtn: "Start Free Triage",
    footer: "This tool does not replace a medical evaluation. If in doubt, seek a specialized professional."
  },
  es: {
    tag: "Tecnología Asistiva",
    title: "Triaje TEA IA – Entienda los signos de forma rápida y sencilla",
    subtitle: "Una herramienta que le ayuda a identificar posibles signos de autismo en pocos minutos.",
    btn1: "Hacer Triaje Ahora",
    whatIsTitle: "¿Qué es?",
    whatIsDesc: "El Triaje TEA IA es una herramienta que utiliza inteligencia artificial para ayudar a identificar signos conductuales relacionados con el autismo. Es un primer paso para quienes buscan orientación.",
    whatForTitle: "¿Para qué sirve?",
    for1: "Ayudar a padres y tutores con dudas",
    for2: "Identificar posibles signos tempranos",
    for3: "Orientar sobre los próximos pasos",
    howWorksTitle: "¿Cómo funciona?",
    howWorksSub: "Toma menos de 3 minutos.",
    step1Title: "1. Grabe un pequeño video",
    step1Desc: "De 1 a 3 minutos",
    step2Title: "2. La inteligencia artificial analiza",
    step2Desc: "Procesamiento rápido y seguro",
    step3Title: "3. Reciba orientación",
    step3Desc: "Información inicial clara",
    ctaTitle: "Cuanto antes entienda, más pronto podrá ayudar.",
    ctaBtn: "Hacer Triaje Gratis",
    footer: "Esta herramienta no sustituye la evaluación médica. En caso de dudas, busque un profesional especializado."
  },
  ja: {
    tag: "支援技術 (Assistive Technology)",
    title: "自閉症 AI トリアージ – 兆候を迅速かつ簡単に理解する",
    subtitle: "わずか数分で自閉症の可能性のある兆候を特定するのに役立つツール。",
    btn1: "今すぐトリアージを開始",
    whatIsTitle: "これは何ですか？",
    whatIsDesc: "自閉症 AI トリアージは、人工知能を使用して自閉症に関連する行動の兆候を特定するのに役立つツールです。これは指導を求める人々にとっての第一歩です。",
    whatForTitle: "何のために使いますか？",
    for1: "疑問を持つ親や保護者を支援する",
    for2: "可能性のある初期の兆候を特定する",
    for3: "次のステップについて案内する",
    howWorksTitle: "どのように機能しますか？",
    howWorksSub: "3分未満で完了します。",
    step1Title: "1. 短い動画を録画する",
    step1Desc: "1〜3分間",
    step2Title: "2. 人工知能が分析する",
    step2Desc: "迅速かつ安全な処理",
    step3Title: "3. ガイダンスを受け取る",
    step3Desc: "明確な初期情報",
    ctaTitle: "早く理解すればするほど、早く助けることができます。",
    ctaBtn: "無料トリアージを開始",
    footer: "このツールは医学的評価に代わるものではありません。疑問がある場合は、専門家にご相談ください。"
  }
};

type LangKey = keyof typeof content;

export default function LandingPage({}: LandingPageProps) {
  const TRIAGEM_URL = "https://triagem-tea-ia-oficial.vercel.app/";
  const { i18n } = useTranslation();
  
  const currentLang = (i18n.language?.substring(0, 2) as LangKey) || 'pt';
  const t = content[currentLang] || content.pt;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      {/* Top Bar with Language Selector */}
      <div className="absolute top-0 w-full p-4 flex justify-end z-50">
        <div className="opacity-90 hover:opacity-100 transition-opacity">
          <LanguageSelector />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-70"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 font-semibold text-sm mb-6">
              <Brain size={18} />
              <span>{t.tag}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.subtitle}
            </p>
            <a 
              href={TRIAGEM_URL}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              {t.btn1}
            </a>
          </motion.div>
        </div>
      </section>

      {/* O que é */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.whatIsTitle}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t.whatIsDesc}
          </p>
        </div>
      </section>

      {/* Para que serve */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">{t.whatForTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-sky-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">{t.for1}</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">{t.for2}</p>
            </div>
            <div className="bg-sky-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">{t.for3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">{t.howWorksTitle}</h2>
          <p className="text-center text-slate-500 font-medium mb-12">{t.howWorksSub}</p>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <Camera size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t.step1Title}</h3>
              <p className="text-slate-600">{t.step1Desc}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t.step2Title}</h3>
              <p className="text-slate-600">{t.step2Desc}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t.step3Title}</h3>
              <p className="text-slate-600">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 px-6 bg-white text-center flex-grow flex flex-col justify-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">
            {t.ctaTitle}
          </h2>
          <a 
            href={TRIAGEM_URL}
            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
          >
            {t.ctaBtn}
          </a>
        </div>
      </section>

      {/* Aviso Importante (Footer) */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-slate-50 text-center mt-auto">
        <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
