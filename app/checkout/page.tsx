'use client';

import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { RootState } from '@/store/store';
import { clearCart } from '@/store/slics/cart';
import { setUser } from '@/store/slics/auth';
import { addOrder } from '@/store/slics/orders';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setuser] = useState<any>(null);
  const User =useSelector((state:RootState)=>state.auth.user);
  

useEffect(() => {
  const checkUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!data.success || !data.user) {
        router.replace('/login?redirect=/checkout');
        return;
      }
      dispatch(setUser(data.user));      
      setuser(data.user);

    } catch (error) {
      console.error('Auth check failed:', error);
      router.replace('/');
    } finally {
      setAuthLoading(false);
    }
  };

  checkUser();
}, [router]);
useEffect(() => {
  if (user) {
    setFormData((prev) => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
    }));
  }
}, [user]);
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    phone: '',
    address: '',
    city: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if(!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill all the fields", {
        style: {
          background: "#111",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #1a1a1a",
        },
      });
      return;
    }
   try {
    setIsLoading(true);
    const orderId = `LNS-${Math.floor(10000 + Math.random() * 90000)}`;

  const orderItems = cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, color: item.selectedColor, }));

    const newOrder = {
      orderNumber: orderId,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      items: orderItems,
      userId: user.id,
      totalAmount: Number(total.toFixed(2)),
      createdAt: new Date().toISOString(),
    };

     const placeOrder = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/orders/createOrder`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(newOrder),
  }
);

      const data = await placeOrder.json();

      if(data.success) {
        dispatch(addOrder(newOrder));
        dispatch(clearCart());
        setCreatedOrderId(orderId);
        setIsSuccess(true);
        setIsLoading(false);
      }
      else {
        console.log(data);
        setIsLoading(false);
      }
  }
  catch(err) {
    console.log(err);
    setIsLoading(false);
  }
  finally {
    setIsLoading(false);
  }
  };
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

if (!user) {
  return null;
}
  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-white font-['Fraunces'] text-2xl mb-2">Order Placed Successfully!</h2>
        <p className="text-[#888] text-sm mb-1">Thank you for your order.</p>
        <p className="text-[#aaa] font-mono text-xs bg-[#111] px-3 py-1.5 rounded-lg border border-[#1a1a1a] mb-6">
          Order ID: {createdOrderId}
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-2xl hover:bg-[#e0e0e0] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  
  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
      <div className="flex items-center gap-2 mb-5">
        <Link href="/cart" className="text-[#666] hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-white font-['Fraunces'] text-2xl">Checkout</h1>
      </div>

      {/* Cart Summary */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 mb-5">
        <p className="text-[#555] text-[10px] tracking-[0.3em] uppercase font-medium mb-3">Items Summary</p>
        <div className="space-y-3 max-h-48 overflow-y-auto mb-3 pr-1">
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0e0e0e] shrink-0 border border-[#1c1c1c]">
                <Image src={item.product.variants.find((v: any) => v.color === item.selectedColor)?.image || item.product.variants[0].image} alt={item.product.name} fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{item.product.name}</p>
                <p className="text-[#555] text-[9px]">{item.selectedColor} · Qty {item.quantity}</p>
              </div>
              <p className="text-white text-xs font-semibold shrink-0">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1c1c1c] pt-3 space-y-2 text-xs">
          <div className="flex justify-between text-[#777]">
            <span>Subtotal</span>
            <span className="text-white">PKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#777]">
            <span>Shipping</span>
            <span className="text-white">{shipping === 0 ? 'Free' : `PKR${shipping.toFixed(2)}`}</span>
          </div>
          <div className="border-t border-[#1c1c1c] pt-2 flex justify-between text-sm font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white text-base">PKR {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-[#777] text-[10px] uppercase tracking-wide mb-1.5">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@example.com"
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#444] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-[#777] text-[10px] uppercase tracking-wide mb-1.5">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#444] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[#777] text-[10px] uppercase tracking-wide mb-1.5">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#444] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-[#777] text-[10px] uppercase tracking-wide mb-1.5">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Apt 4B"
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#444] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-[#777] text-[10px] uppercase tracking-wide mb-1.5">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="New York"
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#444] focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-4 bg-white text-black font-semibold text-sm rounded-2xl hover:bg-[#e0e0e0] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Placing Order...' : `Place Order · PKR${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
