import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from '../../i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const t = (key: string) => i18n.t(key);

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          padding: '48px 24px',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1F1A14', margin: '0 0 8px' }}>
            {t('errorBoundary.title')}
          </h2>
          <p style={{ color: '#6B5D3F', fontSize: '14px', margin: '0 0 24px' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#F5C518',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '2px',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {t('errorBoundary.retry')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
