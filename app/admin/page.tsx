"use client";
import { useState, useEffect } from "react";
import type { OrderStatus } from "../../types";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "@/store/store";
import ProductTab from "@/components/admin/tabs/productTab";
import AddTab from "@/components/admin/tabs/addTab";
import OrdersTab from "@/components/admin/tabs/ordersTab";
import type { AdminTab } from "../../types";

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const orders = useSelector((state: RootState) => state.orders.items);
  const User = useSelector((state: RootState) => state.auth.user);
  const [tab, setTab] = useState<AdminTab>("products");

  useEffect(() => {
    // Check role
    if (!User || User.role !== "ADMIN") {
      router.replace("/");
      return;
    }
  }, []);
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const onDeleteProduct = (productId: string) => {
    setProducts(products.filter((p:any) => p.id !== productId));
  };

  const pendingCount = orders.filter((o:any) => {}).length;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "products",
      label: "Products",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M5.34 5.34 3.93 3.93M12 20v2M12 2v2" />
        </svg>
      ),
    },
    {
      id: "add",
      label: "Add Item",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
  ];

  if (!User || User.role !== "ADMIN") {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-56px)]">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[#e5e7eb] pt-6 px-3 gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                tab === t.id
                  ? "bg-[#111827] text-white font-medium"
                  : "text-[#374151] hover:text-[#111827] hover:bg-[#ffffff]"
              }`}
            >
              {t.icon}
              {t.label}
              {t.id === "orders" && pendingCount > 0 && (
                <span className="ml-auto bg-[#f0b429] text-[#111827] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-b border-[#e5e7eb] bg-[#f5f5f5] sticky top-14 z-40">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-all border-b-2 ${
                tab === t.id
                  ? "text-[#111827] border-[#111827]"
                  : "text-[#4b5563] border-transparent"
              }`}
            >
              <span className="relative">
                {t.icon}
                {t.id === "orders" && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f0b429] text-[#111827] text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
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
          {tab === "products" && (
            <ProductTab setTab={setTab} onDeleteProduct={onDeleteProduct} />
          )}

          {tab === "add" && <AddTab />}

          {tab === "orders" && (
            <OrdersTab orders={orders} onUpdateOrderStatus={() => {}} />
          )}
        </main>
      </div>
    </div>
  );
}
