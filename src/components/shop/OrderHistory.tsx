"use client";

import Image from "next/image";
import { Package, Truck, ExternalLink, Calendar, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Order } from "@/lib/customer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface OrderHistoryProps {
  orders: { node: Order }[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm text-center">
        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes pedidos</h3>
        <p className="text-slate-500 max-w-sm mb-8">
          Cuando realices tu primera compra, aquí podrás ver el historial completo y el estado de cada envío.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center bg-slate-900 text-white font-medium px-8 py-3.5 rounded-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map(({ node: order }) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(order.processedAt).toLocaleDateString("es-UY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const trackingInfo = order.successfulFulfillments?.[0]?.trackingInfo?.[0];

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div 
        className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center cursor-pointer select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold text-slate-900">Pedido #{order.orderNumber}</h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              order.fulfillmentStatus === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' :
              order.fulfillmentStatus === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-700'
            }`}>
              {order.fulfillmentStatus === 'FULFILLED' ? 'Completado' :
               order.fulfillmentStatus === 'IN_PROGRESS' ? 'En proceso' : 
               order.fulfillmentStatus || 'Pendiente'}
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              ${order.totalPrice.amount} <span className="text-slate-500 text-xs font-medium">{order.totalPrice.currencyCode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
          {trackingInfo?.url && (
            <a 
              href={trackingInfo.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-2xl transition-all active:scale-95 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Truck className="w-4 h-4" />
              Rastrear Envío
            </a>
          )}
          <button className="hidden md:flex p-3 text-slate-400 group-hover:text-slate-900 transition-colors rounded-full group-hover:bg-slate-50">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </button>
        </div>
        
        {/* Mobile expand button visible only flex-col context */}
        <div className="w-full flex justify-center md:hidden border-t border-slate-100 pt-4 mt-2">
           <button className="flex items-center gap-2 text-sm font-medium text-slate-500">
             {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
             <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
           </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-6 md:p-8">
              <h5 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Productos en tu pedido</h5>
              <div className="space-y-4">
                {order.lineItems?.edges?.map(({ node }, index) => (
                  <div key={index} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow relative group transition-shadow">
                    <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden relative shrink-0">
                      {node.variant?.image?.url ? (
                        <Image
                          src={node.variant.image.url}
                          alt={node.variant.image.altText || node.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-slate-900 truncate">{node.title}</p>
                      {node.variant?.title && node.variant.title !== "Default Title" && (
                        <p className="text-sm font-medium text-slate-500 mt-0.5">{node.variant.title}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Cant.</p>
                      <p className="text-sm font-bold text-slate-900">{node.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  {trackingInfo?.number && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Número de Seguimiento</span>
                      <span className="font-semibold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm shadow-sm inline-block">
                        {trackingInfo.number}
                      </span>
                    </div>
                  )}
                </div>
                {order.statusUrl && (
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors bg-white hover:bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 shadow-sm md:w-auto w-full justify-center"
                  >
                    Ver recibo en Shopify
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
