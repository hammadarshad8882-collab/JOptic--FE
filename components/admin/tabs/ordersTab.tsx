// import { useEffect, useState } from 'react';
// import type { Order, OrderStatus } from '@/types';

// const STATUS_COLORS: Record<OrderStatus, string> = {
//   pending:   'bg-[#2a2000] text-[#f0b429] border-[#4a3800]',
//   confirmed: 'bg-[#001a2a] text-[#4fc3f7] border-[#003a5a]',
//   shipped:   'bg-[#1a0030] text-[#ce93d8] border-[#3a0060]',
//   delivered: 'bg-[#001a00] text-[#81c784] border-[#003a00]',
//   cancelled: 'bg-[#2a0000] text-[#ef9a9a] border-[#5a0000]',
// };

// const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
//   pending:   'confirmed',
//   confirmed: 'shipped',
//   shipped:   'delivered',
//   delivered: null,
//   cancelled: null,
// };


// export default function OrdersTab({ orders, onUpdateOrderStatus }:any) {
//   const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [initialOrders, setInitialOrders] = useState([]);

 
//  useEffect(() =>{
//     const getOrders = async () => {
//     const res = await fetch("http://localhost:5000/api/orders/getall",
//     {
//       credentials:'include'
//     }
//     )
//     const data = await res.json()
//    setInitialOrders(data.orders)
//   }
//     getOrders()
//  },[])
//   return (
//     <div>
//       <div className="flex items-baseline justify-between mb-4">
//         <div>
//           <h2 className="text-white font-['Fraunces'] text-2xl">Orders</h2>
//           <p className="text-[#444] text-xs mt-0.5">{orders.length} total orders</p>
//         </div>
//       </div>

//       {/* Status filter */}
//       <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
//         {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
//           <button
//             key={s}
//             onClick={() => setOrderFilter(s)}
//             className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
//               orderFilter === s
//                 ? 'bg-white text-black border-white'
//                 : 'border-[#1c1c1c] text-[#555] hover:border-[#333] hover:text-[#aaa]'
//             }`}
//           >
//             {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter((o:any) => o.status === s).length})`}
//           </button>
//         ))}
//       </div>

//       <div className="space-y-3">
//         {initialOrders.map((order:any) => (
//           <div key={order.orderNumber} className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all">
//             <button
//               className="w-full p-4 text-left"
//               onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="text-white text-sm font-medium">{order.customerName}</span>
//                     <span className={`text-[9px] px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[order.status as OrderStatus]}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                   <p className="text-[#444] text-[10px] mt-0.5 font-mono">{order.orderNumber}</p>
//                   <p className="text-[#333] text-[10px] mt-0.5">
//                     {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </p>
//                 </div>
//                 <div className="text-right shrink-0">
//                   <p className="text-white font-semibold">PKR {order.totalAmount}</p>
//                   <p className="text-[#444] text-[10px]">{order.items.reduce((s: number, i: { quantity: number; }) => s + i.quantity, 0)} item{order.items.reduce((s: number, i: { quantity: number; }) => s + i.quantity, 0) !== 1 ? 's' : ''}</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mt-3">
//                 <div className="flex -space-x-1.5">
//                   {order.items.slice(0, 3).map((item: any, i: any) => (
//                     <div key={i} className="w-7 h-7 rounded-lg overflow-hidden border border-[#1a1a1a] bg-[#111]">
//                       <img src={item.product.variants[0].image || item.product.image} alt="" className="w-full h-full object-cover" />
//                     </div>
//                   ))}
//                   {order.items.length > 3 && (
//                     <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[9px] text-[#555]">
//                       +{order.items.length - 3}
//                     </div>
//                   )}
//                 </div>
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#444"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className={`transition-transform duration-200 ${expandedOrder === order.id ? 'rotate-180' : ''}`}
//                 >
//                   <polyline points="6 9 12 15 18 9" />
//                 </svg>
//               </div>
//             </button>

//             {expandedOrder === order.id && (
//               <div className="border-t border-[#1a1a1a] p-4 space-y-4">
//                 {/* Customer info */}
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     { label: 'Email', value: order.email },
//                     { label: 'Phone', value: order.phone },
//                     { label: 'Address', value: order.address },
//                     { label: 'City', value: order.city },
//                   ].map((f) => (
//                     <div key={f.label}>
//                       <p className="text-[#333] text-[10px] uppercase tracking-wide">{f.label}</p>
//                       <p className="text-[#aaa] text-xs mt-0.5">{f.value}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Items */}
//                 <div>
//                   <p className="text-[#333] text-[10px] uppercase tracking-wide mb-2">Items</p>
//                   <div className="space-y-2">
//                     {order.items.map((item: any, i: any) => (
//                       <div key={i} className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#111] shrink-0">
//                           <img src={item.product.image} alt="" className="w-full h-full object-cover" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-white text-sm truncate">{item.product.name}</p>
//                           <p className="text-[#444] text-[10px]">{item.color} · Qty {item.quantity}</p>
//                         </div>
//                         <p className="text-[#aaa] text-sm shrink-0">${item.product.price * item.quantity}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Status actions */}
//                 {order.status !== 'delivered' && order.status !== 'cancelled' && (
//                   <div className="flex gap-2 pt-1">
//                     {STATUS_NEXT[order.status as  OrderStatus] && (
//                       <button
//                         onClick={() => onUpdateOrderStatus(order.id, STATUS_NEXT[order.status as OrderStatus])}
//                         className="flex-1 py-2.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-[#e0e0e0] transition-all capitalize"
//                       >
//                         Mark as {STATUS_NEXT[order.status as OrderStatus]}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
//                       className="py-2.5 px-4 border border-[#2a0000] text-[#ef9a9a] text-xs rounded-xl hover:bg-[#2a0000]/40 transition-all"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}

//                 {(order.status === 'delivered' || order.status === 'cancelled') && (
//                   <p className={`text-xs px-3 py-2 rounded-xl border text-center ${STATUS_COLORS[order.status as OrderStatus]}`}>
//                     Order {order.status}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {initialOrders.length === 0 && (
//           <div className="text-center py-16">
//             <p className="text-[#333] font-['Fraunces'] text-lg">No orders found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending:
    'bg-[#2a2000] text-[#f0b429] border-[#4a3800]',
  Confirmed:
    'bg-[#001a2a] text-[#4fc3f7] border-[#003a5a]',
  Shipped:
    'bg-[#1a0030] text-[#ce93d8] border-[#3a0060]',
  Delivered:
    'bg-[#001a00] text-[#81c784] border-[#003a00]',
  Cancelled:
    'bg-[#2a0000] text-[#ef9a9a] border-[#5a0000]',
};

const STATUS_DOT_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-[#f0b429]',
  Confirmed: 'bg-[#4fc3f7]',
  Shipped: 'bg-[#ce93d8]',
  Delivered: 'bg-[#81c784]',
  Cancelled: 'bg-[#ef9a9a]',
};

const STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function OrdersTab({
  orders,
  onUpdateOrderStatus,
}: any) {
  const [orderFilter, setOrderFilter] =
    useState<OrderStatus | 'all'>('all');

  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);

  const [initialOrders, setInitialOrders] =
    useState<Order[]>([]);

  const [statusMenuOpen, setStatusMenuOpen] =
    useState<string | null>(null);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  // =====================================================
  // GET ORDERS
  // =====================================================

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/getall`,
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

        setInitialOrders(data.orders || []);
      } catch (error) {
        console.error(
          'Error fetching orders:',
          error
        );
      }
    };

    getOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/updateStatus/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            'Failed to update order status'
        );
      }

      // Update local state
      setInitialOrders((prevOrders) =>
        prevOrders.map((order: any) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      // Close status popup
      setStatusMenuOpen(null);

      // Update parent state if function exists
      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(
          orderId,
          newStatus
        );
      }

    } catch (error) {
      console.error(
        'Error updating order status:',
        error
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = initialOrders.filter(
    (order: any) => {
      if (orderFilter === 'all') {
        return true;
      }

      return order.status === orderFilter;
    }
  );

  // =====================================================
  // TOGGLE ORDER
  // =====================================================

  const toggleOrder = (orderId: string) => {
    setExpandedOrder((current) =>
      current === orderId
        ? null
        : orderId
    );

    // Close status menu when changing order
    setStatusMenuOpen(null);
  };

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-baseline justify-between mb-4">

        <div>

          <h2 className="text-white font-['Fraunces'] text-2xl">
            Orders
          </h2>

          <p className="text-[#444] text-xs mt-0.5">
            {initialOrders.length} total orders
          </p>

        </div>

      </div>


      {/* =================================================
          FILTER
      ================================================= */}

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">

        {(
          [
            'all',
            'Pending',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Cancelled',
          ] as const
        ).map((status) => {

          const count =
            status === 'all'
              ? initialOrders.length
              : initialOrders.filter(
                  (order: any) =>
                    order.status === status
                ).length;

          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                setOrderFilter(status as any)
              }
              className={`
                shrink-0
                px-3
                py-1.5
                rounded-full
                text-xs
                font-medium
                border
                transition-all
                capitalize

                ${
                  orderFilter === status
                    ? 'bg-white text-black border-white'
                    : 'border-[#1c1c1c] text-[#555] hover:border-[#333] hover:text-[#aaa]'
                }
              `}
            >
              {status === 'all'
                ? `All (${count})`
                : `${status} (${count})`}
            </button>
          );
        })}

      </div>


      {/* =================================================
          ORDERS LIST
      ================================================= */}

      <div className="space-y-3">

        {filteredOrders.map(
          (order: any) => {

            const totalItems =
              order.items?.reduce(
                (
                  total: number,
                  item: any
                ) =>
                  total +
                  item.quantity,
                0
              ) || 0;

            const isExpanded =
              expandedOrder === order.id;

            const isStatusOpen =
              statusMenuOpen === order.id;

            const isUpdating =
              updatingOrderId === order.id;

            return (

              <div
                key={order.orderNumber}
                className="
                  relative
                  bg-[#0e0e0e]
                  border
                  border-[#1a1a1a]
                  rounded-2xl
                  hover:border-[#2a2a2a]
                  transition-all
                "
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <button
                  type="button"
                  className="
                    w-full
                    p-4
                    text-left
                  "
                  onClick={() =>
                    toggleOrder(order.id)
                  }
                >

                  <div className="flex items-start justify-between gap-3">

                    {/* CUSTOMER */}

                    <div className="min-w-0">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-white text-sm font-medium">
                          {order.customerName}
                        </span>

                        <span
                          className={`
                            text-[9px]
                            px-2
                            py-0.5
                            rounded-full
                            border
                            capitalize
                            ${
                              STATUS_COLORS[
                                order.status as OrderStatus
                              ]
                            }
                          `}
                        >
                          {order.status}
                        </span>

                      </div>

                      <p className="text-[#444] text-[10px] mt-0.5 font-mono">
                        {order.orderNumber}
                      </p>

                      <p className="text-[#333] text-[10px] mt-0.5">

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


                    {/* TOTAL */}

                    <div className="text-right shrink-0">

                      <p className="text-white font-semibold">
                        PKR {order.totalAmount}
                      </p>

                      <p className="text-[#444] text-[10px]">
                        {totalItems}{' '}
                        item
                        {totalItems !== 1
                          ? 's'
                          : ''}
                      </p>

                    </div>

                  </div>


                  {/* PRODUCT IMAGES */}

                  <div className="flex items-center justify-between mt-3">

                    <div className="flex -space-x-1.5">

                      {order.items
                        ?.slice(0, 3)
                        .map(
                          (
                            item: any,
                            index: number
                          ) => (

                            <div
                              key={index}
                              className="
                                w-7
                                h-7
                                rounded-lg
                                overflow-hidden
                                border
                                border-[#1a1a1a]
                                bg-[#111]
                              "
                            >

                              <img
                                src={
                                  item.product
                                    ?.variants?.[0]
                                    ?.image ||
                                  item.product
                                    ?.image ||
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

                          )
                        )}

                      {order.items?.length >
                        3 && (

                        <div
                          className="
                            w-7
                            h-7
                            rounded-lg
                            bg-[#1a1a1a]
                            border
                            border-[#222]
                            flex
                            items-center
                            justify-center
                            text-[9px]
                            text-[#555]
                          "
                        >
                          +
                          {order.items.length -
                            3}
                        </div>

                      )}

                    </div>


                    {/* ARROW */}

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`
                        transition-transform
                        duration-200
                        ${
                          isExpanded
                            ? 'rotate-180'
                            : ''
                        }
                      `}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>

                  </div>

                </button>


                {/* =================================================
                    EXPANDED ORDER
                ================================================= */}

                {isExpanded && (

                  <div
                    className="
                      border-t
                      border-[#1a1a1a]
                      p-4
                      space-y-4
                    "
                  >

                    {/* =================================================
                        CUSTOMER INFO
                    ================================================= */}

                    <div className="grid grid-cols-2 gap-3">

                      {[
                        {
                          label: 'Email',
                          value: order.email,
                        },
                        {
                          label: 'Phone',
                          value: order.phone,
                        },
                        {
                          label: 'Address',
                          value: order.address,
                        },
                        {
                          label: 'City',
                          value: order.city,
                        },
                      ].map(
                        (field) => (

                          <div
                            key={
                              field.label
                            }
                          >

                            <p
                              className="
                                text-[#333]
                                text-[10px]
                                uppercase
                                tracking-wide
                              "
                            >
                              {field.label}
                            </p>

                            <p
                              className="
                                text-[#aaa]
                                text-xs
                                mt-0.5
                              "
                            >
                              {field.value ||
                                '-'}
                            </p>

                          </div>

                        )
                      )}

                    </div>


                    {/* =================================================
                        ITEMS
                    ================================================= */}

                    <div>

                      <p
                        className="
                          text-[#333]
                          text-[10px]
                          uppercase
                          tracking-wide
                          mb-2
                        "
                      >
                        Items
                      </p>

                      <div className="space-y-2">

                        {order.items?.map(
                          (
                            item: any,
                            index: number
                          ) => (

                            <div
                              key={index}
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              {/* IMAGE */}

                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-lg
                                  overflow-hidden
                                  bg-[#111]
                                  shrink-0
                                "
                              >

                                <img
                                  src={
                                    item.product.variants[0].image ||
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


                              {/* PRODUCT */}

                              <div
                                className="
                                  flex-1
                                  min-w-0
                                "
                              >

                                <p
                                  className="
                                    text-white
                                    text-sm
                                    truncate
                                  "
                                >
                                  {
                                    item.product
                                      ?.name
                                  }
                                </p>

                                <p
                                  className="
                                    text-[#444]
                                    text-[10px]
                                  "
                                >
                                  {item.color ||
                                    'Default'}
                                  {' · '}
                                  Qty{' '}
                                  {
                                    item.quantity
                                  }
                                </p>

                              </div>


                              {/* PRICE */}

                              <p
                                className="
                                  text-[#aaa]
                                  text-sm
                                  shrink-0
                                "
                              >
                                PKR{' '}
                                {(
                                  Number(
                                    item.product
                                      ?.price ||
                                      0
                                  ) *
                                  Number(
                                    item.quantity ||
                                      0
                                  )
                                ).toLocaleString()}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="relative pt-1">

                      <p
                        className="
                          text-[#333]
                          text-[10px]
                          uppercase
                          tracking-wide
                          mb-2
                        "
                      >
                        Order Status
                      </p>


                      {/* CURRENT STATUS */}

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          setStatusMenuOpen(
                            isStatusOpen
                              ? null
                              : order.id
                          )
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          justify-between
                          px-3
                          py-2.5
                          rounded-xl
                          border
                          transition-all
                          ${
                            STATUS_COLORS[
                              order.status as OrderStatus
                            ]
                          }
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        `}
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className={`
                              w-1.5
                              h-1.5
                              rounded-full
                              ${
                                STATUS_DOT_COLORS[
                                  order.status as OrderStatus
                                ]
                              }
                            `}
                          />

                          <span className="text-xs capitalize">

                            {isUpdating
                              ? 'Updating...'
                              : order.status}

                          </span>

                        </div>


                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`
                            transition-transform
                            duration-200
                            ${
                              isStatusOpen
                                ? 'rotate-180'
                                : ''
                            }
                          `}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>

                      </button>


                      {/* =================================================
                          CUSTOM STATUS POPUP
                      ================================================= */}

                      {isStatusOpen && (

                        <div
                          className="
                            absolute
                            left-0
                            right-0
                            top-full
                            mt-2
                            z-[9999]
                            p-1.5
                            rounded-xl
                            bg-[#111]
                            border
                            border-[#252525]
                            shadow-[0_15px_40px_rgba(0,0,0,0.6)]
                            overflow-y-auto
                          
                          "
                        >

                          {STATUSES.map(
                            (status) => (

                              <button
                                key={status}
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    status
                                  )
                                }
                                className="
                                  w-full
                                  flex
                                  items-center
                                  justify-between
                                  px-3
                                  py-2.5
                                  rounded-lg
                                  text-left
                                  hover:bg-[#1a1a1a]
                                  transition-all
                                  disabled:opacity-50
                                "
                              >

                                <div className="flex items-center gap-2.5">

                                  <span
                                    className={`
                                      w-2
                                      h-2
                                      rounded-full
                                      ${
                                        STATUS_DOT_COLORS[
                                          status
                                        ]
                                      }
                                    `}
                                  />

                                  <span
                                    className="
                                      text-[#aaa]
                                      text-xs
                                      capitalize
                                    "
                                  >
                                    {status}
                                  </span>

                                </div>


                                {/* SELECTED */}

                                {order.status ===
                                  status && (

                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>

                                )}

                              </button>

                            )
                          )}

                        </div>

                      )}

                    </div>


                    {/* =================================================
                        FINAL STATUS
                    ================================================= */}

                    {(order.status ===
                      'delivered' ||
                      order.status ===
                        'cancelled') && (

                      <p
                        className={`
                          text-xs
                          px-3
                          py-2
                          rounded-xl
                          border
                          text-center
                          ${
                            STATUS_COLORS[
                              order.status as OrderStatus
                            ]
                          }
                        `}
                      >
                        Order {order.status}
                      </p>

                    )}

                  </div>

                )}

              </div>
            );
          }
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredOrders.length ===
          0 && (

          <div className="text-center py-16">

            <p
              className="
                text-[#333]
                font-['Fraunces']
                text-lg
              "
            >
              {initialOrders.length ===
              0
                ? 'No orders found'
                : `No ${orderFilter} orders found`}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}