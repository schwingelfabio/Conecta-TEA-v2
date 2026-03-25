export type SofiaMode = 'normal' | 'exaustao' | 'crise' | 'suspeita_tea' | 'culpa' | 'urgencia';

export interface SofiaUser {
  id: string;
  name?: string;
  email?: string;
  createdAt: Date;
}

export interface SofiaSession {
  id: string;
  userId?: string;
  startedAt: Date;
  endedAt?: Date;
  mode: SofiaMode;
  emotionSummary?: string;
  urgentFlag: boolean;
}

export interface SofiaMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'sofia';
  text: string;
  timestamp: Date;
  detectedIntent?: string;
  detectedEmotion?: string;
}

export interface SofiaSummary {
  id: string;
  sessionId: string;
  summaryText: string;
  feelings: string[];
  orientations: string[];
  nextSteps: string[];
  resources: Array<{ title: string; url: string }>;
}

export interface SofiaSafetyEvent {
  id: string;
  sessionId: string;
  type: 'autoagressao' | 'risco_crianca' | 'violencia' | 'colapso' | 'abandono' | 'urgencia_grave';
  severity: 'media' | 'alta' | 'critica';
  timestamp: Date;
  details: string;
}

export interface SofiaResponse {
  text: string;
  emotion: string;
  isEmergency: boolean;
  suggestedAction?: string;
  detectedMode?: SofiaMode;
}
