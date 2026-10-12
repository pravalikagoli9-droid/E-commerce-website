import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ProductCompareModal } from './components/ProductCompareModal';
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
          className={`pointer-events-auto px-4 py-3 bg-[#1E1714] border text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'border-[#BFA175]/60 text-[#FAF8F5]'
              : toast.type === 'error'
              ? 'border-[#A86464] text-[#F5C2C2]'
              : 'border-[#3E342F] text-[#E5DDD3]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#BFA175] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#A86464] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#BFA175] shrink-0" />}
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1E1714] text-[#FAF8F5] border border-[#BFA175]/40 shadow-2xl px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 text-xs">
        <Scale className="w-4 h-4 text-[#BFA175]" />
        <span className="font-serif text-sm tracking-wide">Comparison Salon</span>
        <span className="text-[11px] font-mono bg-[#342721] text-[#E5DDD3] px-1.5 py-0.5 border border-[#4D3C33]">
          {compareList.length} {compareList.length === 1 ? 'creation' : 'creations'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-3 py-1.5 bg-[#FAF8F5] text-[#1E1714] text-[10px] font-semibold uppercase tracking-[0.16em] hover:bg-white transition-colors cursor-pointer"
        >
          Review Differences
        </button>
        <button
          onClick={clearCompare}
          className="text-[10px] text-[#A8988B] hover:text-[#FAF8F5] underline cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentPage } = useStore();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-[#1E1714]">
      <div className="flex-1">
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
      </div>
      <Footer />
    </main>
  );
};

export function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-[#1E1714] selection:bg-[#E7E0D6] selection:text-[#1E1714] font-sans">
        <Navbar />
        <MainContent />
        <CartDrawer />
        <SearchModal />
        <QuickViewModal />
        <ProductCompareModal />
        <CompareBottomDock />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}

export default App;
