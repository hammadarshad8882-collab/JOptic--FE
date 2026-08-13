'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

interface OrderItem {
  id: string;
  quantity: number;
  color?: string;
  product: {
    variants: any;
    id: string;
    name: string;
    image?: string;
    price: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  address?: string;
  city?: string;
}

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  "Cancelled",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    message: string;
    description: string;
    color: string;
    dot: string;
  }
> = {
  Pending: {
    label: 'Pending',
    message: 'Your order has been received.',
    description:
      'We have received your order and it is waiting for confirmation.',
    color:
      'bg-[#2a2000] text-[#f0b429] border-[#4a3800]',
    dot: 'bg-[#f0b429]',
  },

  Confirmed: {
    label: 'Confirmed',
    message: 'Your order has been confirmed.',
    description:
      'Your order has been confirmed and is being prepared.',
    color:
      'bg-[#001a2a] text-[#4fc3f7] border-[#003a5a]',
    dot: 'bg-[#4fc3f7]',
  },

  Shipped: {
    label: 'Shipped',
    message: 'Your order is on its way.',
    description:
      'Your order has been shipped and is currently on its way to you.',
    color:
      'bg-[#1a0030] text-[#ce93d8] border-[#3a0060]',
    dot: 'bg-[#ce93d8]',
  },

  Delivered: {
    label: 'Delivered',
    message: 'Your order has been delivered.',
    description:
      'Your order was successfully delivered. We hope you enjoy your purchase.',
    color:
      'bg-[#001a00] text-[#81c784] border-[#003a00]',
    dot: 'bg-[#81c784]',
  },

  Cancelled: {
    label: 'Cancelled',
    message: 'Your order has been cancelled.',
    description:
      'This order has been cancelled and will not be processed.',
    color:
      'bg-[#2a0000] text-[#ef9a9a] border-[#5a0000]',
    dot: 'bg-[#ef9a9a]',
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] =
    useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const auth = localStorage.getItem('lensco:auth');
    if (!auth || auth === 'null') {
      setLoading(false);
      return;
    }
    if (!user) {
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/orders/getOrderbyUserId/${user?.id}`,
        {
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to fetch orders'
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        'Error fetching orders:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);

      const res = await fetch(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to cancel order'
        );
      }

      // Update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: 'Cancelled',
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        'Error cancelling order:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to cancel order'
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusIndex = (
    status: OrderStatus
  ) => {
    return STATUS_STEPS.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">

        <div className="max-w-[1000px] mx-auto">

          <div className="animate-pulse">

            <div className="h-8 w-40 bg-[#151515] rounded-lg mb-3" />

            <div className="h-4 w-64 bg-[#151515] rounded mb-8" />

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-64
                    bg-[#0e0e0e]
                    border
                    border-[#1a1a1a]
                    rounded-2xl
                  "
                />
              ))}

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">

      <div className="max-w-[1000px] mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <h1 className="font-['Fraunces'] text-3xl">
            My Orders
          </h1>

          <p className="text-[#555] text-sm mt-1">
            Track your orders and see their current status.
          </p>

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {orders.length === 0 && (

          <div
            className="
              text-center
              py-20
              border
              border-[#1a1a1a]
              rounded-2xl
              bg-[#0a0a0a]
            "
          >

            <div
              className="
                w-12
                h-12
                mx-auto
                mb-4
                rounded-full
                bg-[#111]
                flex
                items-center
                justify-center
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <h2 className="text-white font-['Fraunces'] text-lg">
              {!user ? 'Please log in' : 'No orders yet'}
            </h2>

            <p className="text-[#444] text-xs mt-1">
              {!user ? 'You need to be logged in to view your orders.' : 'Your orders will appear here after you make a purchase.'}
            </p>

          </div>

        )}


        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="space-y-5">

          {orders.map((order) => {

            const config =
              STATUS_CONFIG[order.status];

            const currentIndex =
              getStatusIndex(order.status);

            const canCancel =
              order.status === 'Pending' ||
              order.status === 'Confirmed';

            const totalItems =
              order.items?.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              ) || 0;

            return (

              <div
                key={order.id}
                className="
                  bg-[#0b0b0b]
                  border
                  border-[#1a1a1a]
                  rounded-2xl
                  overflow-hidden
                "
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="p-5 border-b border-[#1a1a1a]">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-[#444] text-[10px] uppercase tracking-wider">
                        Order
                      </p>

                      <h2 className="text-white text-sm font-medium font-mono mt-1">
                        {order.orderNumber}
                      </h2>

                      <p className="text-[#444] text-[10px] mt-1">

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}

                      </p>

                    </div>


                    {/* STATUS */}

                    <div
                      className={`
                        shrink-0
                        flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-[10px]
                        capitalize
                        ${config.color}
                      `}
                    >

                      <span
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full
                          ${config.dot}
                        `}
                      />

                      {config.label}

                    </div>

                  </div>

                </div>


                {/* =================================================
                    STATUS MESSAGE
                ================================================= */}

                <div className="px-5 pt-5">

                  <div
                    className={`
                      p-4
                      rounded-xl
                      border
                      ${config.color}
                    `}
                  >

                    <div className="flex items-start gap-3">

                      <div
                        className={`
                          w-8
                          h-8
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          shrink-0
                          ${config.color}
                        `}
                      >

                        {order.status ===
                          'Pending' && (
                          <ClockIcon />
                        )}

                        {order.status ===
                          'Confirmed' && (
                          <CheckIcon />
                        )}

                        {order.status ===
                          'Shipped' && (
                          <TruckIcon />
                        )}

                        {order.status ===
                          'Delivered' && (
                          <PackageIcon />
                        )}

                        {order.status ===
                          'Cancelled' && (
                          <XIcon />
                        )}

                      </div>

                      <div>

                        <p className="text-sm font-medium">
                          {config.message}
                        </p>

                        <p className="text-[11px] opacity-60 mt-1">
                          {config.description}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    PROGRESS
                ================================================= */}

                {order.status !==
                  'Cancelled' && (

                  <div className="px-5 py-6">

                    <div className="relative">

                      {/* Progress line */}

                      <div
                        className="
                          absolute
                          left-[12px]
                          right-[12px]
                          top-[12px]
                          h-px
                          bg-[#222]
                        "
                      />

                      <div
                        className="
                          absolute
                          left-[12px]
                          top-[12px]
                          h-px
                          bg-white
                          transition-all
                        "
                        style={{
                          width: `${
                            currentIndex === 0
                              ? 0
                              : (currentIndex /
                                  (STATUS_STEPS.length -
                                    1)) *
                                100
                          }%`,
                        }}
                      />

                      <div
                        className="
                          relative
                          flex
                          justify-between
                        "
                      >

                        {STATUS_STEPS.map(
                          (
                            status,
                            index
                          ) => {

                            const completed =
                              index <=
                              currentIndex;

                            return (

                              <div
                                key={status}
                                className="
                                  flex
                                  flex-col
                                  items-center
                                  gap-2
                                "
                              >

                                <div
                                  className={`
                                    w-6
                                    h-6
                                    rounded-full
                                    border
                                    flex
                                    items-center
                                    justify-center
                                    z-10
                                    ${
                                      completed
                                        ? 'bg-white border-white'
                                        : 'bg-[#0b0b0b] border-[#333]'
                                    }
                                  `}
                                >

                                  {completed ? (
                                    <svg
                                      width="11"
                                      height="11"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000"
                                      strokeWidth="3"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                                  )}

                                </div>

                                <span
                                  className={`
                                    text-[9px]
                                    capitalize
                                    ${
                                      completed
                                        ? 'text-[#aaa]'
                                        : 'text-[#444]'
                                    }
                                  `}
                                >
                                  {status}
                                </span>

                              </div>

                            );
                          }
                        )}

                      </div>

                    </div>

                  </div>

                )}


                {/* =================================================
                    CANCELLED TIMELINE
                ================================================= */}

                {order.status ===
                  'Cancelled' && (

                  <div className="px-5 py-6">

                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-full bg-[#2a0000] border border-[#5a0000] flex items-center justify-center">

                        <XIcon />

                      </div>

                      <div>

                        <p className="text-[#ef9a9a] text-xs">
                          Order Cancelled
                        </p>

                        <p className="text-[#444] text-[10px] mt-1">
                          This order will not be processed.
                        </p>

                      </div>

                    </div>

                  </div>

                )}


                {/* =================================================
                    ITEMS
                ================================================= */}

                <div className="px-5 pb-5">

                  <div className="border-t border-[#1a1a1a] pt-5">

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-[#444] text-[10px] uppercase tracking-wide">
                        Items
                      </p>

                      <p className="text-[#444] text-[10px]">
                        {totalItems}{' '}
                        {totalItems === 1
                          ? 'item'
                          : 'items'}
                      </p>

                    </div>


                    <div className="space-y-3">

                      {order.items?.map(
                        (item) => (

                          <div
                            key={item.id}
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                w-12
                                h-12
                                rounded-xl
                                overflow-hidden
                                bg-[#111]
                                border
                                border-[#1a1a1a]
                                shrink-0
                              "
                            >

                              <img
                                src={
                                  item.product.variants[0].image
                                ||
                                  ''
                                }
                                alt=""
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                              />

                            </div>

                            <div className="flex-1 min-w-0">

                              <p className="text-white text-xs truncate">
                                {item.product.name}
                              </p>

                              <p className="text-[#444] text-[10px] mt-1">
                                {item.color ||
                                  'Default'}
                                {' · '}
                                Qty{' '}
                                {item.quantity}
                              </p>

                            </div>

                            <p className="text-[#aaa] text-xs shrink-0">
                              PKR{' '}
                              {(
                                item.product
                                  .price *
                                item.quantity
                              ).toLocaleString()}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                  className="
                    px-5
                    py-4
                    border-t
                    border-[#1a1a1a]
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p className="text-[#444] text-[10px]">
                      Total
                    </p>

                    <p className="text-white text-lg font-semibold mt-0.5">
                      PKR{' '}
                      {Number(
                        order.totalAmount
                      ).toLocaleString()}
                    </p>

                  </div>


                  {/* CANCEL */}

                  {/* {canCancel && (

                    <button
                      type="button"
                      disabled={
                        cancellingOrderId ===
                        order.id
                      }
                      onClick={() =>
                        cancelOrder(order.id)
                      }
                      className="
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        border-[#2a0000]
                        text-[#ef9a9a]
                        text-xs
                        hover:bg-[#2a0000]
                        transition-all
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {cancellingOrderId ===
                      order.id
                        ? 'Cancelling...'
                        : 'Cancel Order'}

                    </button>

                  )} */}

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </main>
  );
}


/* =====================================================
   ICONS
===================================================== */

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="1"
        y="3"
        width="15"
        height="13"
      />
      <polygon points="16 8 20 8 23 11 23 16 16 16" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
      />
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
      />
    </svg>
  );
}