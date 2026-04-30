import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle2, Lock, Unlock, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/monitoring';
import AdBanner from './AdBanner';

export default function TriagemTeaIa() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [concern, setConcern] = useState('');

  const txt = {
    pt: {
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
      normalFear: "Cuidar de uma criança que pensa diferente exige muito de nós. É normal sentir medo. Preparei um relatório de primeiros passos exclusivo para você e para",
      yourChild: "sua criança",
      step1Title: "Passo 1: Não entre em pânico",
      step1Desc: "Sua primeira ação hoje é garantir a regulação. Tente criar um ambiente com luzes mais baixas...",
      step2Title: "Passo 2: Entendendo a Comunicação",
      step3Title: "Passo 3: Como agir em crises",
      unlockTitle: "Desbloquear Mapa Completo",
      unlockDesc: "Tenha acesso a todos os passos, chat 24h com a Sofia IA e ferramentas SOS.",
      becomeVip: "Tornar-se VIP (R$ 9,99/mês)",
      cancelAnytime: "Cancele quando quiser. Doações também aceitas.",
      lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio id est tristique mattis."
    },
    en: {
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
      normalFear: "Caring for a child who thinks differently takes a lot from us. It is normal to feel afraid. I have prepared an exclusive first steps report for you and",
      yourChild: "your child",
      step1Title: "Step 1: Don't panic",
      step1Desc: "Your first action today is to ensure regulation. Try to create a low-light environment...",
      step2Title: "Step 2: Understanding Communication",
      step3Title: "Step 3: How to act during meltdowns",
      unlockTitle: "Unlock Full Map",
      unlockDesc: "Get all steps, 24/7 chat with Sofia AI and SOS tools.",
      becomeVip: "Become VIP (US$ 9.99/mo)",
      cancelAnytime: "Cancel anytime. Donations accepted.",
      lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio id est tristique mattis."
    },
    es: {
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
      normalFear: "Cuidar de un niño que piensa diferente nos exige mucho. Es normal sentir miedo. He preparado un informe de primeros pasos exclusivo para ti y para",
      yourChild: "tu hijo(a)",
      step1Title: "Paso 1: No entres en pánico",
      step1Desc: "Tu primera acción hoy es asegurar la regulación. Intenta crear un ambiente con luz tenue...",
      step2Title: "Paso 2: Entendiendo la Comunicación",
      step3Title: "Paso 3: Cómo actuar en las crisis",
      unlockTitle: "Desbloquear Mapa Completo",
      unlockDesc: "Obtén todos los pasos, chat 24/7 con Sofia AI y herramientas SOS.",
      becomeVip: "Convertirse en VIP (US$ 9.99/mes)",
      cancelAnytime: "Cancela cuando quieras. Se aceptan donaciones.",
      lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio id est tristique mattis."
    },
    ja: {
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
      normalFear: "違う考え方をする子供を育てることは、私たちに多くのことを求めます。恐れを感じるのは普通のことです。あなたとお子さんのための特別な最初のステップレポートを用意しました。",
      yourChild: "お子さん",
      step1Title: "ステップ1: パニックにならないで",
      step1Desc: "今日の最初の行動は、落ち着かせることです。光を落とした環境を作るようにしてください...",
      step2Title: "ステップ2: コミュニケーションを理解する",
      step3Title: "ステップ3: パニック時の対応",
      unlockTitle: "完全なマップをロック解除",
      unlockDesc: "すべてのステップ、Sofia AIとの24時間チャット、SOSツールを入手してください。",
      becomeVip: "VIPになる (US$ 9.99/月)",
      cancelAnytime: "いつでもキャンセル可能。寄付も受け付けています。",
      lorem: "詳しくはこちらから確認できます。"
    }
  };

  const nextStep = () => {
    trackEvent(`triagem_step_${step}_completed`);
    setStep(step + 1);
  };

  const langMatch = i18n.language && i18n.language.substring(0, 2) || 'pt';
  const c = txt[langMatch as keyof typeof txt] || txt['pt'];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-sky-500 fill-sky-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4">
              {c.hi}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {c.breath}
            </p>
            <input 
              type="text" 
              placeholder={c.placeholder} 
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full text-center text-xl p-4 border border-slate-200 rounded-2xl mb-8 focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <button 
              disabled={!childName}
              onClick={nextStep}
              className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-600 disabled:opacity-50 transition-all"
            >
              {c.continue} <ArrowRight className="inline ml-2" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              {c.sleep} {childName ? `${c.toChild} ${childName}` : c.child} {c.today}
            </h2>
            <div className="space-y-3 mb-8">
              {c.concerns.map(cn => (
                <button
                  key={cn.id}
                  onClick={() => { setConcern(cn.id); nextStep(); }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                >
                  {cn.label}
                  <ArrowRight className="text-slate-300 group-hover:text-sky-500 h-5 w-5" />
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
            {/* O Alívio */}
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 text-center border-t-8 border-sky-400">
              <h2 className="text-3xl font-black text-slate-800 mb-4">
                {c.notFailing}
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {c.normalFear} {childName || c.yourChild}.
              </p>
              
              <div className="bg-sky-50 p-6 rounded-2xl flex items-center justify-between text-left mb-6">
                <div>
                  <h4 className="font-bold text-sky-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-sky-500"/> {c.step1Title}</h4>
                  <p className="text-sm text-sky-700 mt-1">{c.step1Desc}</p>
                </div>
              </div>

              {/* Blurred Paywall Area */}
              <div className="relative mt-8 group">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent z-10 flex flex-col items-center justify-end pb-8">
                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl max-w-sm text-center transform group-hover:scale-105 transition-transform">
                    <Lock className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                    <h3 className="text-xl font-bold mb-2">
                      {c.unlockTitle}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      {c.unlockDesc}
                    </p>
                    <a 
                      href={(langMatch === 'pt' ? 'https://buy.stripe.com/cNi9AU4rT5HwfMc3uP2wU05' : 'https://buy.stripe.com/28E9AU1fH3zobvWfdx2wU01')} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-3 rounded-xl font-black text-lg"
                    >
                      {c.becomeVip}
                    </a>
                    <p className="text-xs text-slate-400 mt-3">
                      {c.cancelAnytime}
                    </p>
                  </div>
                </div>
                
                <div className="blur-sm opacity-50 space-y-4 pointer-events-none select-none">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800">{c.step2Title}</h4>
                    <p className="text-sm text-slate-500 mt-2">{c.lorem}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800">{c.step3Title}</h4>
                    <p className="text-sm text-slate-500 mt-2">{c.lorem}</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdBanner className="mt-8" />
    </div>
  );
}
