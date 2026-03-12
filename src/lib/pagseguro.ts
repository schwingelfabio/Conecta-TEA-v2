export const getPixCopyPaste = () => {
  // Retorna a chave Pix configurada via variável de ambiente ou um placeholder
  return process.env.VITE_PIX_KEY || '12345678900';
};

export const createPagSeguroCheckout = async (planType: 'mensal' | 'anual', userId: string, userEmail: string) => {
  // Validação dos parâmetros
  if (!planType || !userId || !userEmail) {
    console.error('Parâmetros de checkout inválidos:', { planType, userId, userEmail });
    alert('Erro ao processar dados de assinatura. Tente novamente.');
    return;
  }

  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType,
        userId,
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao criar sessão de checkout');
    }

    const data = await response.json();
    
    if (data.url) {
      // Abre a URL com as flags de segurança solicitadas
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } else {
      throw new Error('URL de checkout não recebida');
    }
  } catch (err) {
    console.error('Erro no checkout:', err);
    alert('Erro ao iniciar checkout. Tente novamente mais tarde.');
  }
};
