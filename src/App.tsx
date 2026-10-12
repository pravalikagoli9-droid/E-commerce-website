import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
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
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 bg-[#0F0F0F] border text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'border-[#C5A880]/50 text-[#F0ECE8]'
              : toast.type === 'error'
              ? 'border-[#A86464]/50 text-[#F5C2C2]'
              : 'border-[#333] text-[#DDD]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#A86464] shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#888] shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentPage } = useStore();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#000000] text-[#F0ECE8]">
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
      </div>
      <Footer />
    </main>
  );
};

export function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#000000] text-[#F0ECE8] selection:bg-[#E2D9CE] selection:text-[#000000] font-sans">
        <Navbar />
        <MainContent />
        <CartDrawer />
        <SearchModal />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}

export default App;
