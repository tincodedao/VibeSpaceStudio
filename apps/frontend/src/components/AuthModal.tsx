import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Sparkles, Loader2, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, isLoading } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        closeAuthModal();
      }
    } else {
      const res = await signUp(email, password, displayName);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Đăng ký thành công! Hãy kiểm tra email hoặc đăng nhập.');
        setMode('signin');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl glass-panel specular-rim bg-slate-900/80 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">VibeSpace Cloud</h3>
                <p className="text-xs text-white/50">Đồng bộ nhạc, hình nền & danh sách việc</p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 mt-4 mb-4 rounded-xl bg-white/5 border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LogIn size={14} />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              Đăng ký
            </button>
          </div>

          {/* Alert messages */}
          {errorMessage && (
            <div className="p-3 mb-4 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-4 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block mb-1 text-xs text-white/70">Tên hiển thị</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-white/40" size={15} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="VD: Alex Nguyen"
                    className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 text-xs text-white/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-white/40" size={15} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-white/70">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-white/40" size={15} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 px-4 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={15} />
                  Đang xử lý...
                </>
              ) : mode === 'signin' ? (
                'Đăng nhập ngay'
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-center text-white/40">
            Dữ liệu cá nhân được mã hóa và lưu trữ an toàn trên Supabase PostgreSQL.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
