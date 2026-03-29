import { GoogleGenAI, Type } from "@google/genai";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { db as clientDb } from "./src/lib/firebase.ts";
import { collection, addDoc, serverTimestamp, getDocs, query, where, limit, writeBatch, doc } from "firebase/firestore";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "fabiopalacioschwingel@gmail.com",
    pass: process.env.SMTP_PASS || "", // User needs to provide an App Password
  },
});

export async function logSystemError(db: any, errorData: any) {
  try {
    let collectionName = "system_logs";
    if (errorData.type === "performance" || errorData.type === "conversion") {
      collectionName = "system_metrics";
    } else if (errorData.type === "ux") {
      collectionName = "system_audits";
    }

    try {
      await addDoc(collection(clientDb, collectionName), {
        ...errorData,
        timestamp: serverTimestamp(),
        status: "pending", // pending analysis
      });
      console.log(`[Mordomo TEA IA] Novo log registrado em ${collectionName}.`);
    } catch (err: any) {
      console.error(`[Mordomo TEA IA] Falha ao registrar log no Firestore:`, err);
    }
  } catch (err) {
    console.error("[Mordomo TEA IA] Falha ao registrar log:", err);
  }
}

export function startMordomoIA(db: any) {
  console.log("[Mordomo TEA IA] Assistente iniciado. Monitorando o sistema silenciosamente...");

  // Run analysis every day at 00:00 (or every minute for testing if needed, but let's do daily)
  // For the sake of the user seeing it work, let's also expose an endpoint to trigger it manually.
  cron.schedule("0 0 * * *", async () => {
    await runAnalysisAndReport(db);
  });
}

export async function runAnalysisAndReport(db: any) {
  console.log("[Mordomo TEA IA] Iniciando análise do sistema...");

  try {
    // 1. Gather pending logs from all collections
    const logsQuery = query(collection(clientDb, "system_logs"), where("status", "==", "pending"), limit(50));
    const metricsQuery = query(collection(clientDb, "system_metrics"), where("status", "==", "pending"), limit(50));
    const auditsQuery = query(collection(clientDb, "system_audits"), where("status", "==", "pending"), limit(50));

    const [logsSnap, metricsSnap, auditsSnap] = await Promise.all([
      getDocs(logsQuery),
      getDocs(metricsQuery),
      getDocs(auditsQuery),
    ]);
    
    if (logsSnap.empty && metricsSnap.empty && auditsSnap.empty) {
      console.log("[Mordomo TEA IA] Nenhum log novo encontrado. Sistema operando perfeitamente.");
      return { status: 'no_logs' };
    }

    const errors = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const metrics = metricsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const audits = auditsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const allData = { errors, metrics, audits };

    // 2. Analyze with Gemini and request JSON output
    const prompt = `
      Você é o "Mordomo TEA IA", um Engenheiro de Software Sênior e Arquiteto de Sistemas trabalhando na plataforma "Conecta TEA".
      Sua função é analisar os logs recentes do sistema (Erros, Performance, Conversões e UX), identificar gargalos, causas raiz e propor melhorias ou soluções.
      
      REGRAS DE SEGURANÇA:
      - Você NUNCA deve alterar o código de produção automaticamente.
      - Suas sugestões devem ser claras, acionáveis e seguras.
      
      Aqui estão os logs recentes do sistema (formato JSON):
      ${JSON.stringify(allData, null, 2)}
      
      Por favor, gere um relatório e sugestões de correção.
      A resposta DEVE ser um JSON válido com a seguinte estrutura:
      {
        "report": {
          "criticalErrors": "Resumo dos erros críticos",
          "recurringErrors": "Resumo dos erros recorrentes",
          "brokenFlows": "Resumo de fluxos quebrados (UX)",
          "slowPages": "Resumo de páginas lentas",
          "conversionDropPoints": "Resumo de quedas de conversão",
          "top3UrgentActions": ["Ação 1", "Ação 2", "Ação 3"],
          "emailText": "O texto completo que será enviado por e-mail para o admin, formatado de forma profissional, incluindo todas as seções acima."
        },
        "suggestions": [
          {
            "problemSummary": "Resumo do problema",
            "rootCauseHypothesis": "Hipótese da causa raiz",
            "impactedFiles": ["arquivo1.ts", "arquivo2.tsx"],
            "recommendedFix": "Correção recomendada",
            "codePatchProposal": "Proposta de código (opcional)",
            "severity": "low" | "medium" | "high" | "critical"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            report: {
              type: Type.OBJECT,
              properties: {
                criticalErrors: { type: Type.STRING },
                recurringErrors: { type: Type.STRING },
                brokenFlows: { type: Type.STRING },
                slowPages: { type: Type.STRING },
                conversionDropPoints: { type: Type.STRING },
                top3UrgentActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                emailText: { type: Type.STRING }
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  problemSummary: { type: Type.STRING },
                  rootCauseHypothesis: { type: Type.STRING },
                  impactedFiles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedFix: { type: Type.STRING },
                  codePatchProposal: { type: Type.STRING },
                  severity: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from Gemini");
    
    const result = JSON.parse(resultText);

    // 3. Save Suggestions
    if (result.suggestions && Array.isArray(result.suggestions)) {
      const batch = writeBatch(clientDb);
      result.suggestions.forEach((suggestion: any) => {
        const ref = doc(collection(clientDb, "system_fix_suggestions"));
        batch.set(ref, {
          ...suggestion,
          createdAt: serverTimestamp(),
          status: "open"
        });
      });
      await batch.commit();
    }

    // 4. Save Report
    if (result.report) {
      await addDoc(collection(clientDb, "system_reports"), {
        ...result.report,
        createdAt: serverTimestamp(),
      });
    }

    // 5. Send Email
    const emailText = result.report?.emailText || "Relatório gerado, mas sem texto de e-mail.";
    if (process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: '"Mordomo TEA IA" <' + (process.env.SMTP_USER || "fabiopalacioschwingel@gmail.com") + '>',
        to: "fabiopalacioschwingel@gmail.com",
        subject: "[Conecta TEA] Relatório Diário de Auditoria - Mordomo TEA IA",
        text: emailText,
      });
      console.log("[Mordomo TEA IA] Relatório enviado por e-mail com sucesso.");
    } else {
      console.log("[Mordomo TEA IA] E-mail não enviado: SMTP_PASS não configurado no .env.");
    }

    // 6. Mark logs as analyzed
    const updateBatch = writeBatch(clientDb);
    const markAnalyzed = (docs: any[]) => {
      docs.forEach(d => {
        updateBatch.update(d.ref, { status: "analyzed", analyzedAt: serverTimestamp() });
      });
    };
    markAnalyzed(logsSnap.docs);
    markAnalyzed(metricsSnap.docs);
    markAnalyzed(auditsSnap.docs);
    await updateBatch.commit();
    return { status: 'success' };
  } catch (error) {
    console.error("[Mordomo TEA IA] Erro durante a análise:", error);
  }
}
