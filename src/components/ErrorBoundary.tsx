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
        <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 my-4">
          <p className="mb-3 text-slate-500 text-sm">Tivemos um problema ao carregar esta parte.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors"
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
