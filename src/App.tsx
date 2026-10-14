import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { MotionStudioModal } from './components/MotionStudioModal';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { AccountView } from './views/AccountView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { FaqView } from './views/FaqView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { PolicyView } from './views/PolicyView';
import { GiftingView } from './views/GiftingView';
import { OffersView } from './views/OffersView';
import { TrackingView } from './views/TrackingView';
import { CheckCircle2, AlertCircle, Info, Scale } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 bg-[#392C2A] border text-xs shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'border-[#C9878D]/70 text-[#FAF7F2]'
              : toast.type === 'error'
              ? 'border-[#D97979] text-[#FFE8E8]'
              : 'border-[#E8DED4]/30 text-[#E8D8C8]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#C9878D] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#D97979] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#D6B77A] shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

const CompareBottomDock: React.FC = () => {
  const { compareList, setIsCompareOpen, clearCompare } = useStore();
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#392C2A] text-[#FAF7F2] border border-[#C9878D]/50 shadow-2xl px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 text-xs">
        <Scale className="w-4 h-4 text-[#D6B77A]" />
        <span className="font-serif text-sm tracking-wide">Product Comparison</span>
        <span className="text-[11px] font-mono bg-[#4D3D3A] text-[#E8D8C8] px-1.5 py-0.5 border border-[#64504D]">
          {compareList.length} {compareList.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-3.5 py-1.5 bg-[#C9878D] text-white text-[10px] font-semibold uppercase tracking-[0.16em] hover:bg-[#B56F75] transition-colors cursor-pointer shadow-sm"
        >
          Compare Now
        </button>
        <button
          onClick={clearCompare}
          className="text-[10px] text-[#E8D8C8] hover:text-white underline cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('VELMORA UI Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F8F4ED] text-[#30231F]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D6B77A] font-semibold mb-2">
            VELMORA Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#5A3E36] mb-3">
            An unexpected error occurred
          </h2>
          <p className="text-xs text-[#30231F]/80 max-w-md mb-6 leading-relaxed">
            We apologize for the inconvenience. Please return to the homepage or reload the catalog.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-6 py-2.5 bg-[#5A3E36] hover:bg-[#48322B] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm"
          >
            Return to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const { currentPage } = useStore();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#F8F4ED] text-[#30231F]">
      <div className="flex-1">
        <ErrorBoundary>
          {currentPage === 'home' && <HomeView />}
          {currentPage === 'shop' && <ShopView />}
          {currentPage === 'product-detail' && <ProductDetailView />}
          {currentPage === 'checkout' && <CheckoutView />}
          {currentPage === 'order-confirmation' && <OrderConfirmationView />}
          {currentPage === 'account' && <AccountView />}
          {currentPage === 'admin' && <AdminView />}
          {currentPage === 'about' && <AboutView />}
          {currentPage === 'faq' && <FaqView />}
          {currentPage === 'blog' && <BlogView />}
          {currentPage === 'contact' && <ContactView />}
          {currentPage === 'policies' && <PolicyView />}
          {currentPage === 'gifting' && <GiftingView />}
          {currentPage === 'offers' && <OffersView />}
          {currentPage === 'tracking' && <TrackingView />}
        </ErrorBoundary>
      </div>
      <Footer />
    </main>
  );
};

const AppShell: React.FC = () => {
  const { isMotionStudioOpen, setIsMotionStudioOpen } = useStore();

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#30231F] selection:bg-[#D6B77A]/30 selection:text-[#30231F] font-sans">
      <Navbar />
      <MainContent />
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ProductCompareModal />
      <CompareBottomDock />
      <MotionStudioModal
        isOpen={isMotionStudioOpen}
        onClose={() => setIsMotionStudioOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}

export default App;
