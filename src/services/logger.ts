type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
}

class LoggerService {
  private logs: LogEntry[] = [];

  private log(level: LogLevel, module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data
    };
    
    this.logs.push(entry);
    
    // In production, this would send to a service like Datadog, Sentry, or Cloud Logging
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    if (data) {
      consoleMethod(`[${entry.timestamp}] [${level.toUpperCase()}] [${module}] ${message}`, data);
    } else {
      consoleMethod(`[${entry.timestamp}] [${level.toUpperCase()}] [${module}] ${message}`);
    }
  }

  info(module: string, message: string, data?: any) {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: any) {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: any) {
    this.log('error', module, message, data);
  }

  getLogs() {
    return this.logs;
  }
}

class AnalyticsService {
  trackEvent(eventName: string, properties?: Record<string, any>) {
    // In production, this would send to Mixpanel, Google Analytics, or Amplitude
    console.log(`[ANALYTICS] Event: ${eventName}`, properties || {});
  }

  trackSessionStart(sessionId: string, mode: string) {
    this.trackEvent('sofia_session_started', { sessionId, mode });
  }

  trackSessionEnd(sessionId: string, durationSeconds: number, messagesCount: number) {
    this.trackEvent('sofia_session_ended', { sessionId, durationSeconds, messagesCount });
  }

  trackInteraction(sessionId: string, intent?: string, emotion?: string) {
    this.trackEvent('sofia_interaction', { sessionId, intent, emotion });
  }

  trackEmergency(sessionId: string, trigger: string) {
    this.trackEvent('sofia_emergency_triggered', { sessionId, trigger });
  }
}

export const logger = new LoggerService();
export const analytics = new AnalyticsService();
