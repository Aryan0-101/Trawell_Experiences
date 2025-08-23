import { Component, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('[App Error]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '2rem', fontFamily: 'system-ui'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600}}>Something went wrong.</h1>
          <p>Please check the browser console for details. Fix the issue then reload.</p>
          {this.state.error && (
            <pre style={{background:'#fee', padding:'1rem', borderRadius:8, whiteSpace:'pre-wrap'}}>
              {String(this.state.error.message || this.state.error)}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
