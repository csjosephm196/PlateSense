import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-red-700 font-medium">Something went wrong loading this component.</p>
            <p className="text-red-500 text-sm mt-1">{this.state.error?.message}</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff0f0' }}>
                    <h1 style={{ color: '#d32f2f' }}>Something went wrong.</h1>
                    <h3 style={{ color: '#333' }}>{this.state.error && this.state.error.toString()}</h3>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: '#666' }}>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
