import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fullScreen?: boolean;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      const content = (
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-xl font-bold mb-2 text-slate-900">Ops! Algo deu errado.</h1>
          <p className="mb-4 text-slate-500">Não foi possível carregar este conteúdo.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      );

      if (this.props.fullScreen) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            {content}
          </div>
        );
      }

      return content;
    }

    return this.props.children;
  }
}
