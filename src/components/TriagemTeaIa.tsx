import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle2, Lock, Unlock, Zap, Shield, Sparkles, Brain, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/monitoring';
import AdBanner from './AdBanner';
import DonationSupportCard from './DonationSupportCard';

export default function TriagemTeaIa() {
  const { t, i18n } = useTranslation();
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [concern, setConcern] = useState('');

  const txt = {
    pt: {
      introTitle: "Triagem TEA IA Inteligente",
      introSubtitle: "Tecnologia de apoio e escuta empática para detectar sinais de alerta precoces e preparar as famílias com informação confiável.",
      howItWorks: "Como funciona a Triagem IA?",
      explain1: "1. Identificação Inicial",
      explain1Desc: "Você insere o nome da sua criança e escolhe a principal área de desafio ou comportamento hoje.",
      explain2: "2. Análise Instantânea",
      explain2Desc: "A IA Sofia processa os termos comuns mapeados a partir de diretrizes clínicas internacionais.",
      explain3: "3. Relatório de Primeiros Passos",
      explain3Desc: "Você recebe sugestões imediatas e práticas de acolhimento físico, emocional e de comunicação de forma aberta e gratuita.",
      buttonStart: "Iniciar Triagem Agora (Gratuito)",
      notDoctor: "Importante: Nenhuma resposta ou relatório aqui gerado substitui a avaliação presencial de uma junta médica multidisciplinar, terapeuta ocupacional, fonoaudiólogo ou psicólogo.",
      hi: "Oi. Eu sou a Sofia. Eu sei que você está cansado(a).",
      breath: "Respire fundo. Você não precisa mais passar por isso sozinho(a). Você está em um lugar seguro agora. Para eu te ajudar, qual é o nome da sua criança?",
      placeholder: "Nome da criança...",
      continue: "Continuar",
      sleep: "O que mais está tirando o seu sono em relação",
      child: "à criança",
      toChild: "ao/à",
      today: "hoje?",
      concerns: [
        { id: 'comportamento', label: 'Comportamento e Agressividade' },
        { id: 'fala', label: 'Atraso na Fala e Comunicação' },
        { id: 'crises', label: 'Crises de Choro e Sobrecarga' },
        { id: 'desespero', label: 'Desespero total, não sei por onde começar' }
      ],
      notFailing: "Você não está falhando.",
      normalFear: "Cuidar de uma criança com desenvolvimento atípico exige muito de nós. É perfeitamente normal sentir medo ou exaustão. Preparamos esse relatório de primeiros passos exclusivo para ajudar você e",
      yourChild: "sua criança",
      step1Title: "Acolhimento imediato e regulação",
      step1Desc: "Sua primeira ação hoje é garantir a segurança e regulação física. Crie um espaço de 'fuga' com luzes baixas, ofereça conforto sem pressionar por conversas. Use uma postura calma.",
      step2Title: "Entendendo o Comportamento e Comunicação",
      step2Desc: "Muitas vezes, as crises são a única forma disponível que a criança encontra para dizer 'estou saturada(o)'. Tente rastrear o que aconteceu minutos antes (ruído, fome, quebra brusca de rotina) e anote para levar na consulta médica.",
      step3Title: "A importância do acompanhamento multiprofissional",
      step3Desc: "Consulte um fonoaudiólogo para avaliação do atraso de linguagem e um psicólogo com especialização em análise do comportamento para orientação familiar prática.",
      supportTitle: "Apoie o Conecta TEA",
      supportDesc: "Nossa tecnologia de Inteligência Artificial é mantida exclusivamente através de contribuições e doações de pais que acreditam na causa. Se as dicas ajudaram você, colabore!",
      donateReportBtn: "Apoiar este projeto com Pix ou PayPal"
    },
    en: {
      introTitle: "Intelligent Triage ASD AI",
      introSubtitle: "Supportive AI technology to detect early warning signs and prepare families with reliable clinical resources.",
      howItWorks: "How does Triage AI work?",
      explain1: "1. Profile Setup",
      explain1Desc: "Enter your child's name and choose the main challenge area or sensory behavioral concern today.",
      explain2: "2. Instant Processing",
      explain2Desc: "Sofia AI processes the input mapped against clinical guidelines for early autism screening.",
      explain3: "3. Direct Report Card",
      explain3Desc: "Get immediate visual instructions regarding communication, physical space, and crisis guidance.",
      buttonStart: "Start Triage Today (Free)",
      notDoctor: "Notice: No report generated here replaces face-to-face evaluations with qualified therapists, neurologists, psychiatrists, or pediatric professionals.",
      hi: "Hi. I'm Sofia. I know you're tired.",
      breath: "Take a deep breath. You don't have to go through this alone anymore. You're in a safe place. To help you, what is your child's name?",
      placeholder: "Child's name...",
      continue: "Continue",
      sleep: "What is keeping you awake regarding",
      child: "the child",
      toChild: "",
      today: "today?",
      concerns: [
        { id: 'comportamento', label: 'Behavior and Aggressiveness' },
        { id: 'fala', label: 'Speech and Communication Delay' },
        { id: 'crises', label: 'Crying Spells and Meltdowns' },
        { id: 'desespero', label: 'Total despair, I don\'t know where to start' }
      ],
      notFailing: "You are not failing.",
      normalFear: "Caring for an atypical child takes a lot from us. It is perfectly normal to feel tired or afraid. We have prepared this personal steps report to guide you and",
      yourChild: "your child",
      step1Title: "Immediate comfort and calming down",
      step1Desc: "Your primary strategy today is to secure a physically safe and regulated space. Create a low-stimulation corner with lower dim lights and soft objects.",
      step2Title: "Evaluating Behavior and Triggers",
      step2Desc: "Sensory crises are often the child's raw voice communicating total brain overload. Start compiling notes on daily triggers (high pitches, foods, sudden routine changes) to take to specialists.",
      step3Title: "The path of professional intervention",
      step3Desc: "Reach out to speech therapists to analyze language progression, and clinical child psychologists to structure behavioral adaptation strategies.",
      supportTitle: "Support Conecta TEA",
      supportDesc: "Our smart AI assistance is kept running entirely through kind voluntary donations of parents. Consider supporting our micro-startup to help other searchers!",
      donateReportBtn: "Support the Project with Paypal/Card"
    },
    es: {
      introTitle: "Triaje TEA IA Inteligente",
      introSubtitle: "Tecnología de apoyo y escucha empática para identificar señales tempranas y preparar a las familias.",
      howItWorks: "¿Cómo funciona el Triaje IA?",
      explain1: "1. Registro Básico",
      explain1Desc: "Escribe el nombre de tu hijo(a) y selecciona el principal desafío que le quita el sueño hoy.",
      explain2: "2. Análisis Inteligente",
      explain2Desc: "Nuestra IA procesa los síntomas comunes y pautas alineadas con manuales de salud.",
      explain3: "3. Informe de Acción Primario",
      explain3Desc: "Genera sugerencias prácticas de contención, comunicación y desregulación de forma abierta y totalmente gratis.",
      buttonStart: "Comenzar el Triaje (Gratis)",
      notDoctor: "Nota: Ninguna información sustituye de ningún modo el diagnóstico formal y multidisciplinario de los neurólogos, pediatras o terapeutas autorizados.",
      hi: "Hola. Soy Sofía. Sé que estás cansado(a).",
      breath: "Respira hondo. Ya no tienes que pasar por esto solo(a). Estás en un lugar seguro ahora. Para ayudarte, ¿cuál es el nombre de tu hijo(a)?",
      placeholder: "Nombre del niño...",
      continue: "Continuar",
      sleep: "Qué te quita el sueño con respecto a",
      child: "el niño",
      toChild: "a",
      today: "hoy?",
      concerns: [
        { id: 'comportamento', label: 'Comportamiento y Agresividad' },
        { id: 'fala', label: 'Retraso en el Habla y Comunicación' },
        { id: 'crises', label: 'Crisis de Llanto y Sobrecarga' },
        { id: 'desespero', label: 'Desesperación total, no sé por dónde empezar' }
      ],
      notFailing: "No estás fallando.",
      normalFear: "Criar un niño con desarrollo atípico demanda un esfuerzo enorme. Es natural sentir miedo o fragilidad. Diseñamos este informe inicial de primeros auxilios para apoyarte a ti y a",
      yourChild: "tu hijo(a)",
      step1Title: "Acolhimiento inmediato y calma sensorial",
      step1Desc: "Tu primera acción es facilitar un entorno seguro alejado de ruidos intensos o luces de oficina. Brinda palabras suaves y mantén un tono de voz bajo.",
      step2Title: "Registrar hábitos y antecedentes",
      step2Desc: "Las crisis suelen ser formas rústicas de decir 'mi cerebro colapsó'. Comienza una pequeña bitácora diaria indicando qué pasó antes de los llantos para compartir en consulta médica.",
      step3Title: "Buscar orientación clínica",
      step3Desc: "Se recomienda agendar citas psicológicas de comportamiento infantil o terapia del lenguaje para un plan de tratamiento apropiado.",
      supportTitle: "Apoya a Conecta TEA",
      supportDesc: "Nuestra infraestructura tecnológica de IA se mantiene libre de muros de pago únicamente con aportes voluntarios de padres solidarios. ¡Colabora hoy!",
      donateReportBtn: "Apoya este proyecto"
    },
    ja: {
      introTitle: "自閉症 AI チェック (Triagem)",
      introSubtitle: "早期警告サインの検出や、ご家族の不安を少しでも払拭するための実用的AIツールです。",
      howItWorks: "AIチェックの流れ",
      explain1: "1. お子さんの詳細",
      explain1Desc: "お名前と、今日最もお悩みになっている行動の項目を選択して回答します。",
      explain2: "2. お悩みの整理",
      explain2Desc: "ソフィアAIが、標準的な自閉症スクリーニングのガイドラインに適合したアドバイスをマップします。",
      explain3: "3. 手引きの確認",
      explain3Desc: "専門医に相談する前に役立つ実用ノートがすべて無料・登録不要で構築されます。",
      buttonStart: "チェックを受ける（無料）",
      notDoctor: "注意：本システムで作成される初期ガイダンスは、医師、療育機関、専門の臨床心理士によるアセスメントや正式な診断を代替するものでは断じてありません。",
      hi: "こんにちは、ソフィアです。あなたが疲れていることは分かっています。",
      breath: "深呼吸してください。もう一人で抱え込む必要はありません。ここは安全な場所です。あなたを助けるために、お子さんの名前を教えてください。",
      placeholder: "子供の名前...",
      continue: "続ける",
      sleep: "今日、お子さんのことで眠れない悩みは何ですか？",
      child: "お子さん",
      toChild: "",
      today: "",
      concerns: [
        { id: 'comportamento', label: '行動と攻撃性' },
        { id: 'fala', label: '言葉の遅れとコミュニケーション' },
        { id: 'crises', label: '泣き叫ぶ発作やパニック' },
        { id: 'desespero', label: 'どうしていいかわからず、完全に絶望している' }
      ],
      notFailing: "あなたは失敗していません。",
      normalFear: "特性のあるお子さんを育てるのは大変なエネルギーがいります。不安や恐怖を感じるのも当然のことです。あなたとお子さんを助けるために、最初のステップレポートを用意しました：",
      yourChild: "お子さん",
      step1Title: "今すぐ落ち着ける環境作り",
      step1Desc: "今日の最優先事項は感覚を落ち着かせることです。刺激を最小限にした暗めの専用スペースを用意し、無理に語りかけたり体を固定しないでください。",
      step2Title: "引き金（トリガー）の分析",
      step2Desc: "パニック発作は子供脳の過飽和を訴えるサインです。直前に何が起きていたか（急な予定変更、不快な高音など）を記録し、病院での問診時に役立てましょう。",
      step3Title: "専門的なサポートの検討",
      step3Desc: "言語発達の評価や、課題への具体的な対処を行う言語聴覚士（ST）や応用行動分析専門家によるアプローチを検討してください。",
      supportTitle: "Conecta TEA プロジェクトを支援",
      supportDesc: "本AIサービスは保護者の皆様の自発的な寄付によって完全に広告を省き運営されています。応援をお願いいたします！",
      donateReportBtn: "寄付で応援する"
    }
  };

  const currentLang = (i18n.language && i18n.language.substring(0, 2)) || 'pt';
  const c = txt[currentLang as keyof typeof txt] || txt['pt'];

  const nextStep = () => {
    trackEvent(`triagem_step_${step}_completed`);
    setStep(step + 1);
  };

  const handleStart = () => {
    trackEvent('triagem_started');
    setIsStarted(true);
  };

  // Explainer Landing state
  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 font-sans text-gray-900">
        <div className="text-center py-10 px-6 bg-gradient-to-tr from-purple-50 via-purple-100/30 to-sky-50 rounded-[3rem] border border-purple-100 mb-10 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-md shadow-purple-500/20">
            <Brain size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F2F4A] tracking-tight leading-tight mb-4">
            {c.introTitle}
          </h1>
          <p className="text-slate-600 font-medium max-w-xl mx-auto text-base">
            {c.introSubtitle}
          </p>

          <a 
            href="https://triagem-tea-ia-oficial.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 mx-auto active:scale-95 text-center inline-flex"
          >
            {c.buttonStart}
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Info Grid */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-10">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            {c.howItWorks}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
              <div>
                <h4 className="font-bold text-slate-900">{c.explain1}</h4>
                <p className="text-slate-500 text-sm">{c.explain1Desc}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
              <div>
                <h4 className="font-bold text-slate-900">{c.explain2}</h4>
                <p className="text-slate-500 text-sm">{c.explain2Desc}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
              <div>
                <h4 className="font-bold text-slate-900">{c.explain3}</h4>
                <p className="text-slate-500 text-sm">{c.explain3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical notice */}
        <div className="bg-amber-50/50 border border-amber-250 p-6 rounded-2xl text-center flex flex-col items-center max-w-2xl mx-auto mb-12">
          <Shield size={20} className="text-amber-600 mb-2" />
          <p className="text-xs font-semibold text-amber-800 leading-relaxed">
            {c.notDoctor}
          </p>
        </div>

        {/* Strategic Donation Widget */}
        <div className="border-t pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seja um Apoiador</p>
          <DonationSupportCard />
        </div>
      </div>
    );
  }

  // Active step process
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-8 px-4 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-purple-500 fill-purple-500" />
            </div>
            <h1 className="text-2.5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              {c.hi}
            </h1>
            <p className="text-base text-slate-600 mb-8 leading-relaxed">
              {c.breath}
            </p>
            <input 
              type="text" 
              placeholder={c.placeholder} 
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full text-center text-semibold text-lg p-4 border border-slate-200 rounded-2xl mb-8 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
            <button 
              disabled={!childName}
              onClick={nextStep}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {c.continue} <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center leading-tight">
              {c.sleep} {childName ? `${c.toChild} ${childName}` : c.child} {c.today}
            </h2>
            <div className="space-y-3 mb-8">
              {c.concerns.map(cn => (
                <button
                  key={cn.id}
                  onClick={() => { setConcern(cn.id); nextStep(); }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                >
                  <span className="font-bold">{cn.label}</span>
                  <ArrowRight className="text-slate-300 group-hover:text-purple-500 h-5 w-5" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            {/* The report */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl mb-8 border-t-8 border-purple-500">
              <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">
                {c.notFailing}
              </h2>
              <p className="text-slate-600 text-base mb-8 leading-relaxed text-center">
                {c.normalFear} <strong className="text-purple-700">{childName || c.yourChild}</strong>.
              </p>
              
              {/* Strategic Advice Cards - FREE to view under the new guidelines! */}
              <div className="space-y-6">
                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex gap-3 items-start mb-2">
                    <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                    <h3 className="font-extrabold text-slate-900 text-lg">{c.step1Title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 font-medium pl-9 leading-relaxed">{c.step1Desc}</p>
                </div>

                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex gap-3 items-start mb-2">
                    <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                    <h3 className="font-extrabold text-slate-900 text-lg">{c.step2Title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 font-medium pl-9 leading-relaxed">{c.step2Desc}</p>
                </div>

                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex gap-3 items-start mb-2">
                    <CheckCircle2 className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                    <h3 className="font-extrabold text-slate-900 text-lg">{c.step3Title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 font-medium pl-9 leading-relaxed">{c.step3Desc}</p>
                </div>
              </div>

              {/* Strategic Donation Appeal immediately inside the report card */}
              <div className="mt-12 bg-gradient-to-r from-sky-50 to-purple-50 border border-sky-100 rounded-3xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-150">
                  <Gift className="w-6 h-6 text-[#0EA5E9]" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">{c.supportTitle}</h4>
                <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed max-w-lg mx-auto">
                  {c.supportDesc}
                </p>
                <div className="inline-block max-w-md">
                  <DonationSupportCard />
                </div>
              </div>
            </div>
            
            {/* Disclaimer in PDF report summary */}
            <div className="bg-amber-50/40 p-4 border border-amber-150 text-amber-900 text-xs rounded-xl font-medium text-center">
              {c.notDoctor}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdBanner className="mt-8" />
    </div>
  );
}
