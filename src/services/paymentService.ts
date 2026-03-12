/**
 * Integração com PagSeguro (PagBank)
 * Checkout de planos do app Conecta TEA.
 */

export const createPagSeguroCheckout = async (
  planType: 'mensal' | 'anual',
  userId: string,
  userEmail: string
) => {
  try {
    // 1. Validação robusta de parâmetros
    if (!planType || !userId || !userEmail) {
      throw new Error('Dados obrigatórios ausentes para iniciar o pagamento.');
    }

    // 2. Chamada à API
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planType,
        userId,
        userEmail: userEmail.toLowerCase().trim()
      })
    });

    // 3. Tratamento de erro da resposta
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao criar checkout no servidor');
    }

    const data = await response.json();

    // 4. Validação da URL de retorno
    if (!data?.url || typeof data.url !== 'string') {
      throw new Error('A resposta do checkout não trouxe uma URL válida.');
    }

    // 5. Abertura segura da URL
    window.open(data.url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert('Erro ao iniciar o pagamento. Tente novamente mais tarde.');
  }
};

/**
 * Retorna a chave Pix para pagamento manual.
 * Atenção: isto NÃO é um código Pix Copia e Cola EMV.
 */
export const getPixKey = () => {
  return 'fabiopalacioschwingel@gmail.com';
};
