import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in widget:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full min-h-[200px] bg-[#FEF2F2] border border-[#FCA5A5] rounded-[12px] p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-10 h-10 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <h4 className="text-[14px] font-semibold text-[#0F172A] mb-1">
            {this.props.fallbackTitle || 'Widget Unavailable'}
          </h4>
          <p className="text-[13px] text-[#64748B] max-w-[200px] mx-auto">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-3 py-1.5 bg-white border border-[#E2E8F0] text-[#0F172A] text-[12px] font-medium rounded-[6px] hover:bg-[#F1F5F9] transition-colors shadow-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
