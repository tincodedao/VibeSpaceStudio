import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[VibeSpace Crash Caught]', error, errorInfo);
  }

  private handleResetStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-white">
          <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-white/10 bg-slate-900/90 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-lg font-bold text-white">Đã xảy ra lỗi hiển thị</h2>
            <p className="text-xs text-white/60">
              {this.state.error?.message || 'Có lỗi khi khôi phục trạng thái từ bộ nhớ đệm trình duyệt.'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} />
                Tải lại trang
              </button>
              <button
                onClick={this.handleResetStorage}
                className="py-2 px-3 text-xs font-medium rounded-xl bg-white/10 text-white/80 hover:bg-white/15 flex items-center justify-center gap-1.5 transition-colors"
                title="Xóa bộ nhớ đệm và tải lại"
              >
                <Trash2 size={14} />
                Đặt lại Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
