import React from 'react';
import { Crown, Check, Heart, Zap, ShieldCheck, AlertCircle, Users } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { analytics } from '../services/logger';
import { motion } from 'framer-motion';

export default function PlanosVip({ isVip }: { isVip?: boolean }) {
  const { t, i18n } = useTranslation();

  const handleCheckout = (url: string, planType: 'monthly' | 'annual') => {
    if (planType === 'monthly') {
      analytics.trackEvent('vip_monthly_click');
    } else {
      analytics.trackEvent('vip_annual_click');
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 relative font-sans">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black opacity-80"></div>
      
      <div className="relative z-10 py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        
        {/* 1. HERO EMOTIONAL BLOCK */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            {(i18n.language === 'pt' ? 'E se seu filho precisasse de ajuda... e você não pudesse pagar?' : i18n.language === 'ja' ? 'What if your child needed help… and you couldn’t afford it?' : 'What if your child needed help… and you couldn’t afford it?')}
          </h2>
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            {(i18n.language === 'pt' ? 'Milhares de famílias enfrentam essa realidade todos os dias.' : i18n.language === 'ja' ? 'Thousands of families face this reality every day.' : 'Thousands of families face this reality every day.')}
          </p>
        </div>

        {/* 2. IMPACT STATEMENT */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center max-w-3xl mx-auto mb-12 backdrop-blur-sm">
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-4">
            {(i18n.language === 'pt' ? 'Esta plataforma existe para ajudar famílias que se sentem perdidas, com medo e sem apoio.' : i18n.language === 'ja' ? 'This platform exists to help families who feel lost, scared, and without support.' : 'This platform exists to help families who feel lost, scared, and without support.')}
          </p>
          <p className="text-sky-400 font-bold text-2xl">
            {(i18n.language === 'pt' ? 'Você pode mudar isso.' : i18n.language === 'ja' ? 'You can change that.' : 'You can change that.')}
          </p>
        </div>

        {/* 3. URGENCY BLOCK */}
        <div className="flex flex-col items-center justify-center gap-3 mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 px-4 py-2 rounded-full font-bold border border-rose-500/20">
            <AlertCircle size={20} />
            {(i18n.language === 'pt' ? 'Neste momento, famílias esperam por ajuda.' : i18n.language === 'ja' ? 'Right now, families are waiting for help.' : 'Right now, families are waiting for help.')}
          </div>
          <p className="text-slate-300 font-medium">
            {(i18n.language === 'pt' ? 'Seu apoio hoje pode alcançá-las imediatamente.' : i18n.language === 'ja' ? 'Your support today can reach them immediately.' : 'Your support today can reach them immediately.')}
          </p>
        </div>

        {/* 4. VIP OFFER SECTION */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-white">
            {(i18n.language === 'pt' ? 'Seja VIP. Mude Vidas Hoje.' : i18n.language === 'ja' ? 'Become a VIP. Change Lives Today.' : 'Become a VIP. Change Lives Today.')}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          
          {/* PLAN 1 - MONTHLY */}
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex flex-col relative">
            <h4 className="text-2xl font-bold text-white mb-2">
              {(i18n.language === 'pt' ? 'Apoio Mensal' : i18n.language === 'ja' ? 'Support Monthly' : 'Support Monthly')}
            </h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-white">{(i18n.language === 'pt' ? 'R$ 19,90' : i18n.language === 'ja' ? 'US$ 3.99' : 'US$ 3.99')}</span>
              <span className="text-slate-500 font-medium">/ {(i18n.language === 'pt' ? 'mês' : i18n.language === 'ja' ? 'month' : 'month')}</span>
            </div>
            <p className="text-sky-400 font-medium mb-8">
              {(i18n.language === 'pt' ? 'Menos que um café. Impacto real.' : i18n.language === 'ja' ? 'Less than a coffee. Real impact.' : 'Less than a coffee. Real impact.')}
            </p>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="text-sky-500 shrink-0 mt-0.5" size={20} />
                <span>{(i18n.language === 'pt' ? 'Ajude famílias imediatamente' : i18n.language === 'ja' ? 'Help families immediately' : 'Help families immediately')}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="text-sky-500 shrink-0 mt-0.5" size={20} />
                <span>{(i18n.language === 'pt' ? 'Mantenha a plataforma viva' : i18n.language === 'ja' ? 'Keep the platform alive' : 'Keep the platform alive')}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="text-sky-500 shrink-0 mt-0.5" size={20} />
                <span>{(i18n.language === 'pt' ? 'Acesso antecipado' : i18n.language === 'ja' ? 'Early access' : 'Early access')}</span>
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCheckout((i18n.language === 'pt' ? 'https://pag.ae/81AiqTpHL' : i18n.language === 'ja' ? 'https://buy.stripe.com/cNifZigaB9XM8jK9Td2wU02' : 'https://buy.stripe.com/cNifZigaB9XM8jK9Td2wU02'), 'monthly')}
              disabled={isVip}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                isVip
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
              }`}
            >
              {isVip ? t('vip.activePlan') : ((i18n.language === 'pt' ? 'Ajudar uma Família Agora' : i18n.language === 'ja' ? 'Help a Family Now' : 'Help a Family Now'))}
            </motion.button>
          </div>

          {/* PLAN 2 - ANNUAL (PRIMARY - PROMOTIONAL POSTER) */}
          <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl border-2 border-amber-500/50 font-sans text-center flex flex-col justify-between md:-translate-y-4 group">
            {/* Outer Glow effect on hover */}
            <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            {/* Background Image & Overlays */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" 
                alt="Earth at night" 
                className="w-full h-full object-cover opacity-70 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950/95"></div>
              <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-amber-900/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 min-h-[700px]">
              
              {/* TOP TEXT */}
              <div className="mt-2 mb-6">
                <p className="text-amber-200/80 text-xs font-bold tracking-widest uppercase mb-2 drop-shadow-md">
                  {i18n.language === 'en' ? "Some families can't afford help…" : i18n.language === 'ja' ? "一部の家族は助けを得る余裕がありません…" : "Algumas famílias não podem pagar..."}
                </p>
                <p className="text-white text-base font-bold drop-shadow-lg">
                  {i18n.language === 'en' ? "You can change that today." : i18n.language === 'ja' ? "あなたは今日それを変えることができます。" : "Você pode mudar isso hoje."}
                </p>
              </div>

              {/* MAIN TITLE */}
              <div className="mb-6">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 leading-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                  {i18n.language === 'en' ? "Become the reason" : i18n.language === 'ja' ? "理由になる" : "Seja o motivo pelo qual"}<br/>
                  {i18n.language === 'en' ? "a family gets help" : i18n.language === 'ja' ? "ある家族が助けを得る" : "uma família recebe ajuda"}
                </h2>
              </div>

              {/* CENTER BADGE */}
              <div className="flex justify-center mb-6">
                <div className="bg-amber-500/10 border border-amber-400/40 backdrop-blur-md text-amber-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  {i18n.language === 'en' ? "1 YEAR MEMBERSHIP" : i18n.language === 'ja' ? "1年間のメンバーシップ" : "ASSINATURA DE 1 ANO"}
                </div>
              </div>

              {/* VISUAL (Family silhouette & Heart) */}
              <div className="flex justify-center items-center mb-8 relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150"></div>
                <div className="relative flex items-center justify-center">
                  <Users className="text-slate-300/40 absolute -ml-10 mt-2" size={40} />
                  <Heart className="text-amber-400 fill-amber-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)] z-10 animate-pulse" size={56} />
                </div>
              </div>

              {/* BENEFITS */}
              <div className="mb-8 text-left max-w-[260px] mx-auto w-full">
                <ul className="space-y-3">
                  {[
                    i18n.language === 'en' ? "Help families in real need" : i18n.language === 'ja' ? "本当に困っている家族を助ける" : "Ajude famílias que realmente precisam",
                    i18n.language === 'en' ? "Keep this platform alive" : i18n.language === 'ja' ? "このプラットフォームを維持する" : "Mantenha esta plataforma viva",
                    i18n.language === 'en' ? "Get early access to new tools" : i18n.language === 'ja' ? "新しいツールへの早期アクセス" : "Acesso antecipado a novas ferramentas",
                    i18n.language === 'en' ? "Be part of something bigger" : i18n.language === 'ja' ? "もっと大きな何かの一部になる" : "Faça parte de algo maior"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-100 text-sm font-medium">
                      <div className="bg-amber-500/20 p-1 rounded-full">
                        <Check className="text-amber-400 shrink-0" size={14} />
                      </div>
                      <span className="drop-shadow-md">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRICE SECTION */}
              <div className="mb-6 mt-auto">
                <div className="text-4xl font-black text-white drop-shadow-lg mb-1">
                  {(i18n.language === 'pt' ? 'R$ 199,00' : i18n.language === 'ja' ? '$39.99' : '$39.99')} <span className="text-lg text-amber-200/80 font-medium">/ {(i18n.language === 'pt' ? 'ano' : i18n.language === 'ja' ? 'year' : 'year')}</span>
                </div>
                <p className="text-amber-400 text-xs font-bold tracking-wide drop-shadow-md">
                  {i18n.language === 'en' ? "Less than $0.11 per day to change lives" : i18n.language === 'ja' ? "人生を変えるのに1日あたり約15円" : "Menos de R$0,55 por dia para mudar vidas"}
                </p>
              </div>

              {/* CTA BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ["0px 0px 0px rgba(245, 158, 11, 0)", "0px 0px 30px rgba(245, 158, 11, 0.5)", "0px 0px 0px rgba(245, 158, 11, 0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => handleCheckout((i18n.language === 'pt' ? 'https://pag.ae/81AirzxhL' : i18n.language === 'ja' ? 'https://buy.stripe.com/cNibJ2bUlfi643u5CX2wU03' : 'https://buy.stripe.com/cNibJ2bUlfi643u5CX2wU03'), 'annual')}
                disabled={isVip}
                className={`w-full font-black text-base py-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-6 ${
                  isVip
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                }`}
              >
                {isVip ? t('vip.activePlan') : ((i18n.language === 'pt' ? 'AJUDAR UMA FAMÍLIA AGORA' : i18n.language === 'ja' ? '今すぐ家族を助ける' : 'HELP A FAMILY NOW'))}
              </motion.button>

              {/* BOTTOM TEXT */}
              <div className="text-xs font-medium text-slate-300/80 space-y-1">
                <p>{i18n.language === 'en' ? "If you don’t help… nothing changes." : i18n.language === 'ja' ? "あなたが助けなければ… 何も変わりません。" : "Se você não ajudar... nada muda."}</p>
                <p className="text-white font-bold">{i18n.language === 'en' ? "If you do… everything can." : i18n.language === 'ja' ? "もし助ければ… すべてが変わる可能性があります。" : "Se você ajudar... tudo pode mudar."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. EMOTIONAL TRIGGER BLOCK */}
        <div className="text-center mb-12">
          <p className="text-slate-400 text-xl italic mb-2">
            {(i18n.language === 'pt' ? '"Se ninguém ajudar... nada muda."' : i18n.language === 'ja' ? '"誰も助けなければ… 何も変わりません。"' : '"If nobody helps… nothing changes."')}
          </p>
          <p className="text-white text-2xl font-bold">
            {(i18n.language === 'pt' ? '"Mas se você ajudar... tudo pode mudar."' : i18n.language === 'ja' ? '"もしあなたが助ければ… すべてが変わる可能性があります。"' : '"But if you do… everything can."')}
          </p>
        </div>

        {/* 6. TRUST / SAFETY */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400 font-medium border-t border-slate-800 pt-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span>{(i18n.language === 'pt' ? 'Cancele a qualquer momento. Sem risco.' : i18n.language === 'ja' ? 'いつでもキャンセル可能。リスクはありません。' : 'Cancel anytime. No risk.')}</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            <span>{(i18n.language === 'pt' ? 'Isso não é uma doação. É uma missão.' : i18n.language === 'ja' ? 'これは寄付ではありません。使命です。' : 'This is not a donation. It’s a mission.')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
