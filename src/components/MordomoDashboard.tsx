import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, AlertTriangle, CheckCircle, Clock, Shield, Zap, Mail, Code, Bug } from 'lucide-react';

export default function MordomoDashboard() {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const suggSnap = await getDocs(query(collection(db, 'system_fix_suggestions'), orderBy('createdAt', 'desc'), limit(20)));
        setSuggestions(suggSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const repSnap = await getDocs(query(collection(db, 'system_reports'), orderBy('createdAt', 'desc'), limit(10)));
        setReports(repSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Error fetching Mordomo data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const triggerAnalysis = async () => {
    try {
      await fetch('/api/mordomo/trigger', { method: 'POST' });
      alert('Análise iniciada! Verifique seu e-mail em alguns minutos.');
    } catch (e) {
      alert('Erro ao iniciar análise.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Mordomo TEA IA
          </h1>
          <p className="text-gray-500 mt-1">Painel de Controle e Auditoria de Sistemas</p>
        </div>
        <button 
          onClick={triggerAnalysis}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Forçar Análise Agora
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'suggestions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sugestões de Correção
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'reports' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Histórico de Relatórios
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              {suggestions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhuma sugestão pendente</h3>
                  <p className="text-gray-500">O sistema está operando perfeitamente.</p>
                </div>
              ) : (
                suggestions.map(s => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{s.problemSummary}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getSeverityColor(s.severity)}`}>
                          {s.severity}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Hipótese da Causa Raiz
                          </h4>
                          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">{s.rootCauseHypothesis}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Correção Recomendada
                          </h4>
                          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">{s.recommendedFix}</p>
                        </div>
                      </div>

                      {s.impactedFiles && s.impactedFiles.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" /> Arquivos Impactados
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {s.impactedFiles.map((file: string, i: number) => (
                              <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {s.codePatchProposal && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <Bug className="w-4 h-4" /> Proposta de Código
                          </h4>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                            {s.codePatchProposal}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {reports.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhum relatório gerado</h3>
                </div>
              ) : (
                reports.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Relatório de {r.createdAt?.toDate().toLocaleDateString() || 'Data Desconhecida'}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Erros Críticos</h4>
                        <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">{r.criticalErrors}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">Erros Recorrentes</h4>
                        <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded">{r.recurringErrors}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2">Fluxos Quebrados (UX)</h4>
                        <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">{r.brokenFlows}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Páginas Lentas</h4>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{r.slowPages}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-indigo-600 mb-2">Top 3 Ações Urgentes</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {r.top3UrgentActions?.map((action: string, i: number) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
