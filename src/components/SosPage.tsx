import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SosCard } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Printer, Save, Edit2, Phone, MapPin, AlertTriangle, HeartPulse, ShieldAlert, ShieldCheck, IdCard, Crown, Download, MessageCircle, X, Camera } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import Avatar from './Avatar';
import DonationSupportCard from './DonationSupportCard';

interface SosPageProps {
  userProfile: UserProfile | null;
  authReady?: boolean;
  onLoginClick?: () => void;
  onNavigate?: (tab: string) => void;
  isGuest?: boolean;
  isAdmin?: boolean;
  isVip?: boolean;
  initialSection?: 'card' | 'tools';
}

const SosPage: React.FC<SosPageProps> = ({ userProfile, authReady, onLoginClick, onNavigate, isGuest, isAdmin, isVip, initialSection = 'card' }) => {
  const { t, i18n } = useTranslation();
  const effectiveVip = Boolean(isVip || isAdmin);
  const [sosCard, setSosCard] = useState<SosCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSosTool, setActiveSosTool] = useState<string | null>(null);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const cardDownloadRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    childName: '',
    birthDate: '',
    bloodType: '',
    allergies: '',
    observations: '',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
    homeAddress: '',
    workAddress: '',
    city: '',
    state: '',
    responsibleName: '',
    emergencyNote: ''
  });

  useEffect(() => {
    const fetchSosCard = () => {
      try {
        setError(null);
        setLoading(true);
        // Load exclusively from browser local storage!
        const savedData = localStorage.getItem('conecta_local_carteirinha');
        if (savedData) {
          const data = JSON.parse(savedData) as SosCard;
          setSosCard(data);
          setFormData({
            childName: data.childName || '',
            birthDate: data.birthDate || '',
            bloodType: data.bloodType || '',
            allergies: data.allergies || '',
            observations: data.observations || '',
            contact1Name: data.contact1Name || '',
            contact1Phone: data.contact1Phone || '',
            contact2Name: data.contact2Name || '',
            contact2Phone: data.contact2Phone || '',
            homeAddress: data.homeAddress || '',
            workAddress: data.workAddress || '',
            city: data.city || '',
            state: data.state || '',
            responsibleName: data.responsibleName || '',
            emergencyNote: data.emergencyNote || ''
          });
        } else {
          // If no card is saved locally, prefill with defaults
          setFormData({
            childName: userProfile?.displayName || '',
            birthDate: '',
            bloodType: '',
            allergies: '',
            observations: '',
            contact1Name: userProfile?.displayName || '',
            contact1Phone: '',
            contact2Name: '',
            contact2Phone: '',
            homeAddress: '',
            workAddress: '',
            city: userProfile?.city || '',
            state: userProfile?.state || '',
            responsibleName: userProfile?.displayName || '',
            emergencyNote: ''
          });
          setIsEditing(true);
        }
      } catch (err) {
        console.error("[LocalCard] Error reading from browser storage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSosCard();
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const generatedId = sosCard?.id || `local_${Math.random().toString(36).substring(2, 9)}`;
      const generatedOfficialId = sosCard?.officialId || `CTEA-${Math.floor(100000 + Math.random() * 900000)}`;

      const payload: SosCard = {
        id: generatedId,
        userId: userProfile?.uid || 'local_user',
        officialId: generatedOfficialId,
        ...formData,
        createdAt: sosCard?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save exclusively to the browser (localStorage) as specified!
      localStorage.setItem('conecta_local_carteirinha', JSON.stringify(payload));
      setSosCard(payload);
      setIsEditing(false);
    } catch (err) {
      console.error("[LocalCard] Error writing to browser storage:", err);
      setError("Não foi possível salvar os dados no navegador.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCardImage = async () => {
    if (cardDownloadRef.current === null) return;
    setSaving(true);
    try {
      // toPng options configured for pristine high resolution mobile downloads
      const dataUrl = await toPng(cardDownloadRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          margin: '0',
          borderRadius: '0px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Carteirinha_ConectaTEA_${formData.childName || 'Card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('[DownloadCard] failed:', err);
      alert("Tivemos um problema temporário ao baixar. Por favor, tire um print screen da tela para salvar a carteirinha no seu celular.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadQR = async () => {
    if (qrRef.current === null) return;
    try {
      const dataUrl = await toPng(qrRef.current, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `QR-SOS-${sosCard?.childName || 'Card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#0EA5E9] to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-100">
            <IdCard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Carteirinha Digital</h1>
            <p className="text-slate-500 font-medium mt-1">Salva de forma privativa e segura apenas no seu navegador</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            type="button" 
            onClick={() => setIsEditing(!isEditing)} 
            className="flex items-center space-x-2 border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-all font-bold text-slate-700 shadow-sm"
          >
            <Edit2 size={16} />
            <span>{isEditing ? "Ver Carteirinha" : "Editar Dados"}</span>
          </button>
          {!isEditing && sosCard && (
            <button 
              onClick={handleDownloadCardImage} 
              className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-[#0EA5E9] hover:opacity-95 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              <Download size={16} />
              <span>Salvar no Celular</span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing_form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 print:hidden"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <IdCard className="text-[#0EA5E9]" />
              Formulário da Carteirinha
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-base font-bold text-[#0F2F4A] border-b pb-2">Informações da Criança</h3>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nome da Criança</label>
                  <input required type="text" name="childName" value={formData.childName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" placeholder="Ex: Lucas Henrique" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Data de Nascimento</label>
                  <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" placeholder="Ex: Parobé" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">UF (Estado)</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" placeholder="Ex: RS" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo Sanguíneo (Opcional)</label>
                  <input type="text" name="bloodType" placeholder="Ex: A+" value={formData.bloodType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Alergias (Opcional)</label>
                  <input type="text" name="allergies" placeholder="Medicamentos, alimentos..." value={formData.allergies} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Observações de Crise ou Comportamento</label>
                  <textarea name="observations" placeholder="Ex: Tem alta sensibilidade a barulhos de motos. Costuma se tapar debaixo de cobertores para regular." value={formData.observations} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none min-h-[80px]" />
                </div>

                <div className="space-y-4 md:col-span-2 mt-4">
                  <h3 className="text-base font-bold text-[#0F2F4A] border-b pb-2">Informações do Responsável (Contatos de Emergência)</h3>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Responsável</label>
                  <input required type="text" name="responsibleName" value={formData.responsibleName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" placeholder="Nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone Principal de Emergência</label>
                  <input required type="tel" name="contact1Phone" placeholder="(00) 00000-0000" value={formData.contact1Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Contato 2 (Opcional)</label>
                  <input type="text" name="contact2Name" value={formData.contact2Name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" placeholder="Familiar ou terapeuta" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone do Contato 2 (Opcional)</label>
                  <input type="tel" name="contact2Phone" placeholder="(00) 00000-0000" value={formData.contact2Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Endereço Residencial (Opcional)</label>
                  <input type="text" name="homeAddress" placeholder="Rua, Número, Bairro" value={formData.homeAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 outline-none" />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
                {sosCard && (
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Salvando..." : "Salvar no Navegador"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="card_presentation"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {sosCard ? (
              <>
                {/* Physical Card Layout wrapped for pristine file downloads */}
                <div 
                  ref={cardDownloadRef} 
                  className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 print:shadow-none print:border-2 print:border-slate-300 relative"
                >
                  {/* Card Front style header */}
                  <div className="bg-gradient-to-r from-sky-500 via-[#0EA5E9] to-indigo-600 p-6 md:p-8 text-white flex justify-between items-center relative">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                        <HeartPulse size={30} className="text-white fill-white/20 font-black animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-2.5xl font-black tracking-tight leading-none">Conecta TEA</h2>
                        <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest mt-1.5 block">Carteirinha de Identificação de Crise</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                        {sosCard.officialId}
                      </span>
                    </div>
                  </div>

                  {/* Body columns */}
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left details */}
                    <div className="md:col-span-8 space-y-5">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nome Completo</h3>
                        <p className="text-2xl font-black text-slate-900 leading-tight">{sosCard.childName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data de Nascimento</h3>
                          <p className="text-base font-bold text-slate-800">
                            {sosCard.birthDate ? new Date(sosCard.birthDate + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo Sanguíneo</h3>
                          <p className="text-base font-bold text-red-600">{sosCard.bloodType || 'Não Informado'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Cidade / UF</h3>
                          <p className="text-base font-bold text-slate-800">{sosCard.city} / {sosCard.state}</p>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Responsável</h3>
                          <p className="text-base font-bold text-slate-800 leading-tight">
                            {sosCard.responsibleName}
                          </p>
                        </div>
                      </div>

                      {sosCard.allergies && (
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-red-500">Alergias</h3>
                          <p className="text-sm font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 inline-block">{sosCard.allergies}</p>
                        </div>
                      )}

                      {sosCard.observations && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Observações de Acolhimento</h4>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">{sosCard.observations}</p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Contatos de Emergência</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 bg-sky-50 px-4 py-3 rounded-xl border border-sky-100">
                            <Phone size={16} className="text-[#0EA5E9]" />
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-none mb-1">{sosCard.responsibleName}</p>
                              <p className="text-xs font-bold text-[#0EA5E9] font-mono leading-none">{sosCard.contact1Phone}</p>
                            </div>
                          </div>
                          {sosCard.contact2Phone && (
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                              <Phone size={16} className="text-slate-500" />
                              <div>
                                <p className="text-xs font-black text-slate-900 leading-none mb-1">{sosCard.contact2Name || "Contato Adicional"}</p>
                                <p className="text-xs font-bold text-slate-600 font-mono leading-none">{sosCard.contact2Phone}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: scan QR setup and emergency visual representation */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 text-center">
                      <div className="mb-4">
                        <span className="text-[10px] font-black tracking-widest text-[#0EA5E9] uppercase block mb-1">Acesso à Ficha</span>
                        <p className="text-[9px] text-slate-400 max-w-[150px] mx-auto leading-normal">Aponte a câmera para ver esta ficha médica digitalizada.</p>
                      </div>

                      <div ref={qrRef} className="bg-white p-3.5 rounded-2xl border border-slate-150 inline-block">
                        <QRCode 
                          value={`${window.location.origin}/emergencia/${sosCard.id}`} 
                          size={110} 
                          level="H" 
                        />
                      </div>

                      <div className="mt-6 flex flex-col items-center">
                        <div className="flex items-center gap-1 text-slate-400 mb-1 justify-center">
                          <ShieldAlert size={12} className="text-indigo-600 animate-bounce" />
                          <span className="text-[9px] uppercase tracking-widest font-bold">Código Único</span>
                        </div>
                        <p className="text-xs font-black font-mono text-slate-800">{sosCard.officialId}</p>
                        <p className="text-[8px] text-slate-350 tracking-wider font-semibold uppercase mt-1">Conecta TEA Guardião</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-center">
                    <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase leading-none">
                      Esta pessoa tem Transtorno do Espectro Autista (TEA). Por lei, ela possui atendimento prioritário.
                    </p>
                  </div>
                </div>

                {/* Additional controls and explanations */}
                <div className="text-center max-w-lg mx-auto space-y-4 print:hidden">
                  <p className="text-slate-550 text-xs leading-relaxed max-w-sm mx-auto">
                    * Após salvar, você pode gerar a imagem para guardar no celular clicando no botão <strong>Salvar no Celular</strong> acima ou imprimir o arquivo.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={handlePrint}
                      className="px-6 py-2.5 border border-slate-200 hover:bg-slate-55 rounded-xl font-bold text-slate-600 text-sm shadow-sm transition-all"
                    >
                      Imprimir Ficha
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                      Editar Informações
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-4">
                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0EA5E9] mx-auto mb-6">
                  <IdCard size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Crie sua Carteirinha do Theo</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Guarde de forma offline e imediata os dados de identificação e contatos da criança caso ocorra alguma crise em público ou emergência.
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md text-sm"
                >
                  Inserir Dados e Gerar
                </button>
              </div>
            )}

            {/* Strategic Donation Appeal at the bottom of Tab 4 */}
            <div className="border-t border-slate-100 pt-10 print:hidden">
              <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Conectando Amor com Generosidade</p>
              <DonationSupportCard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .max-w-2xl {
            visibility: visible;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 650px;
          }
          .max-w-2xl * {
            visibility: visible;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
};

export default SosPage;
