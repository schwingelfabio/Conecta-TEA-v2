import React from 'react';
import { Crown, Check, Heart, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function PlanosVip({ isVip }: { isVip?: boolean }) {
  const handleCheckout = (url: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para assinar um plano.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <Crown className="text-amber-500" size={32} />
          Área VIP Conecta TEA
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Apoie nossa comunidade e tenha acesso a recursos exclusivos para ajudar no desenvolvimento e bem-estar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-sky-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold mb-2">Plano Mensal</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-gray-900">R$ 19,90</span>
            <span className="text-gray-500">/mês</span>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="text-green-500" size={20} />
              Selo VIP no perfil
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="text-green-500" size={20} />
              Vídeos exclusivos
            </li>
          </ul>

          <button
            onClick={() => handleCheckout('https://pag.ae/81AiqTpHL')}
            disabled={isVip}
            className={`w-full font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              isVip
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
          >
            {isVip ? 'Plano Ativo' : 'Assinar Mensal'}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-amber-200 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col scale-105 z-10">
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">
            Melhor Valor
          </div>

          <h3 className="text-xl font-bold mb-2">Plano Anual</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-gray-900">R$ 199,00</span>
            <span className="text-gray-500">/ano</span>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="text-green-500" size={20} />
              Tudo do plano mensal
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="text-green-500" size={20} />
              Economize 2 meses
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Check className="text-green-500" size={20} />
              Acesso antecipado
            </li>
          </ul>

          <button
            onClick={() => handleCheckout('https://pag.ae/81AirzxhL')}
            disabled={isVip}
            className={`w-full font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 ${
              isVip
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isVip ? 'Plano Ativo' : 'Assinar Anual'}
          </button>
        </div>
      </div>
    </div>
  );
}
