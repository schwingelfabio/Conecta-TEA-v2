import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface PlanosVipProps {
  userProfile: UserProfile | null;
}

const PlanosVip: React.FC<PlanosVipProps> = ({ userProfile }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planType: 'mensal' | 'anual') => {
    if (!userProfile) return;
    
    setLoading(planType);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: userProfile.uid,
          userEmail: userProfile.email,
          userName: userProfile.displayName
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar sessão de checkout');
      }

      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar checkout. Tente novamente mais tarde.');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'mensal',
      name: 'Plano Mensal',
      price: '29,90',
      period: '/mês',
      description: 'Ideal para quem quer experimentar todos os recursos.',
      features: [
        'Acesso total à Área VIP',
        'Consultoria IA Ilimitada',
        'Selo VIP no Perfil',
        'Conteúdos Exclusivos',
        'Suporte Prioritário'
      ],
      icon: <Zap className="text-brand-primary" size={24} />,
      buttonText: 'Assinar Mensal',
      popular: false
    },
    {
      id: 'anual',
      name: 'Plano Anual',
      price: '299,00',
      period: '/ano',
      description: 'A melhor escolha para o acompanhamento a longo prazo.',
      features: [
        'Tudo do plano Mensal',
        'Economia de 2 meses',
        'Mentorias em Grupo',
        'Materiais para Download',
        'Acesso Antecipado a Recursos'
      ],
      icon: <Star className="text-amber-500" size={24} />,
      buttonText: 'Assinar Anual',
      popular: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">Potencialize sua Jornada</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Torne-se um membro VIP e tenha acesso a ferramentas exclusivas desenvolvidas por especialistas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-3xl border-2 transition-all ${
              plan.popular 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105' 
                : 'bg-white text-slate-900 border-slate-100 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Mais Popular
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-white/10' : 'bg-slate-50'}`}>
                {plan.icon}
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>A partir de</p>
                <div className="flex items-baseline justify-end">
                  <span className="text-sm font-bold mr-1">R$</span>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm font-medium ml-1 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className={`text-sm mb-8 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${plan.popular ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary'}`}>
                    <Check size={14} />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCheckout(plan.id as 'mensal' | 'anual')}
              disabled={loading !== null}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
                plan.popular 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              } disabled:opacity-50`}
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processando Assinatura...</span>
                </>
              ) : (
                <>
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={24} />
          </div>
          <h4 className="font-bold text-slate-900 mb-2">Pagamento Seguro</h4>
          <p className="text-sm text-slate-500">Processado via PagSeguro com criptografia de ponta a ponta.</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={24} />
          </div>
          <h4 className="font-bold text-slate-900 mb-2">Acesso Imediato</h4>
          <p className="text-sm text-slate-500">Recursos liberados assim que o pagamento for confirmado.</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={24} />
          </div>
          <h4 className="font-bold text-slate-900 mb-2">Suporte Exclusivo</h4>
          <p className="text-sm text-slate-500">Canal direto com nossa equipe para tirar todas as suas dúvidas.</p>
        </div>
      </div>
    </div>
  );
};

export default PlanosVip;
