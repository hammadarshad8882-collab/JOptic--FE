"use client"
import { useState,useEffect } from 'react';
import type { OrderStatus } from '../../types';
import { useRouter } from 'next/navigation';
import { products as initialProducts } from '../../data/products';
import { useSelector, useDispatch } from 'react-redux';

import type { RootState } from '@/store/store';
import ProductTab from '@/components/admin/tabs/productTab';
import AddTab from '@/components/admin/tabs/addTab';
import OrdersTab from '@/components/admin/tabs/ordersTab';

type AdminTab = 'dashboard' | 'products' | 'add' | 'orders';

export default function AdminPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [products, setProducts] = useState(initialProducts);
  const orders = useSelector((state: RootState) => state.orders.items);
  const [tab, setTab] = useState<AdminTab>('products');
  const [variants, setVariants] = useState([
  {
    color: '',
    image: '',
    images: [] as string[],
    stock: 0,
  },
]);
const [authLoading, setAuthLoading] = useState(true);
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const checkAdmin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!data.success || !data.user) {
        router.replace("/login");
        return;
      }

      // Check role
      if (data.user.role !== "ADMIN") {
        router.replace("/");
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Admin authentication failed:", error);
      router.replace("/login");
    } finally {
      setAuthLoading(false);
    }
  };

  checkAdmin();
}, [router]);




  const onDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

 

  // Dashboard stats
  const pendingCount = orders.filter((o) => {}).length;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M5.34 5.34 3.93 3.93M12 20v2M12 2v2" />
        </svg>
      ),
    },
    {
      id: 'add',
      label: 'Add Item',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
  ];
if (authLoading) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
    </div>
  );
}

if (!user) {
  return null;
}
  return (
    <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Outfit', sans-serif" }}>
     
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-56px)]">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[#1a1a1a] pt-6 px-3 gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                tab === t.id
                  ? 'bg-white text-black font-medium'
                  : 'text-[#555] hover:text-white hover:bg-[#111]'
              }`}
            >
              {t.icon}
              {t.label}
              {t.id === 'orders' && pendingCount > 0 && (
                <span className="ml-auto bg-[#f0b429] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-b border-[#1a1a1a] bg-[#050505] sticky top-14 z-40">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-all border-b-2 ${
                tab === t.id
                  ? 'text-white border-white'
                  : 'text-[#444] border-transparent'
              }`}
            >
              <span className="relative">
                {t.icon}
                {t.id === 'orders' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f0b429] text-black text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6 overflow-x-hidden">
          {tab === 'products' && (
            <ProductTab
              setTab={setTab}
              onDeleteProduct={onDeleteProduct}
            />
          )}

          {tab === 'add' && <AddTab />}

          {tab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateOrderStatus={()=>{}}
            />
          )}
        </main>
      </div>
    </div>
  );
}
