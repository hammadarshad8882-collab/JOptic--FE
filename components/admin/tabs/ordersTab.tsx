"use client";

import { fetchWithAuth } from "@/api/fetchWithAuth";
import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-[#fef3c7] text-[#b45309] border-[#fcd34d]",
  Confirmed: "bg-[#dbeafe] text-[#1d4ed8] border-[#93c5fd]",
  Shipped: "bg-[#f3e8ff] text-[#7c3aed] border-[#c4b5fd]",
  Delivered: "bg-[#dcfce7] text-[#15803d] border-[#86efac]",
  Cancelled: "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]",
};

const STATUS_DOT_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-[#b45309]",
  Confirmed: "bg-[#1d4ed8]",
  Shipped: "bg-[#7c3aed]",
  Delivered: "bg-[#15803d]",
  Cancelled: "bg-[#dc2626]",
};

const STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersTab({ orders, onUpdateOrderStatus }: any) {
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [initialOrders, setInitialOrders] = useState<Order[]>([]);

  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // =====================================================
  // GET ORDERS
  // =====================================================

  useEffect(() => {
    const getOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/getall`,
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setInitialOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/updateStatus/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Update local state
      setInitialOrders((prevOrders) =>
        prevOrders.map((order: any) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order,
        ),
      );

      // Close status popup
      setStatusMenuOpen(null);

      // Update parent state if function exists
      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(orderId, newStatus);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = initialOrders.filter((order: any) => {
    if (orderFilter === "all") {
      return true;
    }

    return order.status === orderFilter;
  });

  // =====================================================
  // TOGGLE ORDER
  // =====================================================

  const toggleOrder = (orderId: string) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));

    // Close status menu when changing order
    setStatusMenuOpen(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex h-[400px] w-full items-center justify-center overflow-hidden">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-[#111827] font-medium text-2xl">Orders</h2>

          <p className="text-[#4b5563] text-xs mt-0.5">
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
            "all",
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
          ] as const
        ).map((status) => {
          const count =
            status === "all"
              ? initialOrders.length
              : initialOrders.filter((order: any) => order.status === status)
                  .length;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setOrderFilter(status as any)}
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
                    ? "bg-[#111827] text-white border-[#111827]"
                    : "border-[#e5e7eb] text-[#374151] hover:border-[#9ca3af] hover:text-[#111827]"
                }
              `}
            >
              {status === "all" ? `All (${count})` : `${status} (${count})`}
            </button>
          );
        })}
      </div>

      {/* =================================================
          ORDERS LIST
      ================================================= */}

      <div className="space-y-3">
        {filteredOrders.map((order: any) => {
          const totalItems =
            order.items?.reduce(
              (total: number, item: any) => total + item.quantity,
              0,
            ) || 0;

          const isExpanded = expandedOrder === order.id;

          const isStatusOpen = statusMenuOpen === order.id;

          const isUpdating = updatingOrderId === order.id;

          return (
            <div
              key={order.orderNumber}
              className="
                  relative
                  bg-[#ffffff]
                  border
                  border-[#e5e7eb]
                  rounded-2xl
                  hover:border-[#d1d5db]
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
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* CUSTOMER */}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#111827] text-sm font-medium">
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
                            ${STATUS_COLORS[order.status as OrderStatus]}
                          `}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-[#4b5563] text-[10px] mt-0.5 font-mono">
                      {order.orderNumber}
                    </p>

                    <p className="text-[#374151] text-[10px] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div className="text-right shrink-0">
                    <p className="text-[#111827] font-semibold">
                      PKR {order.totalAmount}
                    </p>

                    <p className="text-[#4b5563] text-[10px]">
                      {totalItems} item
                      {totalItems !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* PRODUCT IMAGES */}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex -space-x-1.5">
                    {order.items
                      ?.slice(0, 3)
                      .map((item: any, index: number) => (
                        <div
                          key={index}
                          className="
                                w-7
                                h-7
                                rounded-lg
                                overflow-hidden
                                border
                                border-[#e5e7eb]
                                bg-[#ffffff]
                              "
                        >
                          <img
                            src={
                              item.product?.variants?.[0]?.image ||
                              item.product?.image ||
                              ""
                            }
                            alt=""
                            className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                          />
                        </div>
                      ))}

                    {order.items?.length > 3 && (
                      <div
                        className="
                            w-7
                            h-7
                            rounded-lg
                            bg-[#f3f4f6]
                            border
                            border-[#d1d5db]
                            flex
                            items-center
                            justify-center
                            text-[9px]
                            text-[#374151]
                          "
                      >
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* ARROW */}

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`
                        transition-transform
                        duration-200
                        ${isExpanded ? "rotate-180" : ""}
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
                      border-[#e5e7eb]
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
                        label: "Email",
                        value: order.email,
                      },
                      {
                        label: "Phone",
                        value: order.phone,
                      },
                      {
                        label: "Address",
                        value: order.address,
                      },
                      {
                        label: "City",
                        value: order.city,
                      },
                    ].map((field) => (
                      <div key={field.label}>
                        <p
                          className="
                                text-[#374151]
                                text-[10px]
                                uppercase
                                tracking-wide
                              "
                        >
                          {field.label}
                        </p>

                        <p
                          className="
                                text-[#374151]
                                text-xs
                                mt-0.5
                              "
                        >
                          {field.value || "-"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* =================================================
                        ITEMS
                    ================================================= */}

                  <div>
                    <p
                      className="
                          text-[#374151]
                          text-[10px]
                          uppercase
                          tracking-wide
                          mb-2
                        "
                    >
                      Items
                    </p>

                    <div className="space-y-2">
                      {order.items?.map((item: any, index: number) => (
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
                                  bg-[#ffffff]
                                  shrink-0
                                "
                          >
                            <img
                              src={item.product.variants[0].image || ""}
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
                                    text-[#111827]
                                    text-sm
                                    truncate
                                  "
                            >
                              {item.product?.name}
                            </p>

                            <p
                              className="
                                    text-[#4b5563]
                                    text-[10px]
                                  "
                            >
                              {item.color || "Default"}
                              {" · "}
                              Qty {item.quantity}
                            </p>
                          </div>

                          {/* PRICE */}

                          <p
                            className="
                                  text-[#374151]
                                  text-sm
                                  shrink-0
                                "
                          >
                            PKR{" "}
                            {(
                              Number(item.product?.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* =================================================
                        STATUS
                    ================================================= */}

                  <div className="relative pt-1">
                    <p
                      className="
                          text-[#374151]
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
                        setStatusMenuOpen(isStatusOpen ? null : order.id)
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
                          ${STATUS_COLORS[order.status as OrderStatus]}
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
                              ${STATUS_DOT_COLORS[order.status as OrderStatus]}
                            `}
                        />

                        <span className="text-xs capitalize">
                          {isUpdating ? "Updating..." : order.status}
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
                            ${isStatusOpen ? "rotate-180" : ""}
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
                            bg-[#ffffff]
                            border
                            border-[#e5e7eb]
                            shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                            overflow-y-auto
                          
                          "
                      >
                        {STATUSES.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={isUpdating}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className="
                                  w-full
                                  flex
                                  items-center
                                  justify-between
                                  px-3
                                  py-2.5
                                  rounded-lg
                                  text-left
                                  hover:bg-[#f3f4f6]
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
                                      ${STATUS_DOT_COLORS[status]}
                                    `}
                              />

                              <span
                                className="
                                      text-[#374151]
                                      text-xs
                                      capitalize
                                    "
                              >
                                {status}
                              </span>
                            </div>

                            {/* SELECTED */}

                            {order.status === status && (
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
                        ))}
                      </div>
                    )}
                  </div>

                  {/* =================================================
                        FINAL STATUS
                    ================================================= */}

                  {(order.status === "Delivered" ||
                    order.status === "Cancelled") && (
                    <p
                      className={`
                          text-xs
                          px-3
                          py-2
                          rounded-xl
                          border
                          text-center
                          ${STATUS_COLORS[order.status as OrderStatus]}
                        `}
                    >
                      Order {order.status}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <p
              className="
                text-[#374151]
                font-['Fraunces']
                text-lg
              "
            >
              {initialOrders.length === 0
                ? "No orders found"
                : `No ${orderFilter} orders found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
