"use client";
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              {this.props.fallbackTitle || 'Terjadi Kesalahan'}
            </h2>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              Halaman mengalami masalah teknis. Coba refresh atau kembali ke beranda.
            </p>

            {/* Error Details (dev mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-8 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer font-bold uppercase tracking-widest mb-2">
                  Detail Error (Developer)
                </summary>
                <pre className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-4 overflow-auto max-h-40 font-mono">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-orange text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-orange/20"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Halaman
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
