import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log the error to an error reporting service here (e.g., Sentry)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-red-100 dark:border-red-900/30 shadow-xl text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
              We've encountered an unexpected error while loading this module. Our engineering team has been notified.
            </p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Reload Page
              </button>
              <Link 
                to="/"
                className="w-full flex items-center justify-center px-4 py-2.5 bg-surface dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" /> Return to Dashboard
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left bg-surface dark:bg-gray-950 p-4 rounded-xl overflow-auto text-xs text-red-500 font-mono">
                <p className="font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
