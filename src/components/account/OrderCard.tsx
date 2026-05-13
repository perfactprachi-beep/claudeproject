import { Link } from 'react-router-dom'
import { ChevronRight, RotateCcw, Truck } from 'lucide-react'
import type { Order } from '@typedefs/order'
import { OrderStatus } from '@typedefs/enums'
import { formatINR } from '@utils/format'
import { cn } from '@utils/cn'

interface OrderCardProps {
  order: Order
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  [OrderStatus.PENDING]:    { label: 'Pending',    className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  [OrderStatus.CONFIRMED]:  { label: 'Confirmed',  className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  [OrderStatus.PROCESSING]: { label: 'Processing', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
  [OrderStatus.SHIPPED]:    { label: 'Shipped',    className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  [OrderStatus.DELIVERED]:  { label: 'Delivered',  className: 'bg-green-50 text-green-700 border border-green-200' },
  [OrderStatus.CANCELLED]:  { label: 'Cancelled',  className: 'bg-red-50 text-red-700 border border-red-200' },
  [OrderStatus.RETURNED]:   { label: 'Returned',   className: 'bg-gray-100 text-gray-600 border border-gray-200' },
}

const MAX_THUMBS = 3

export const OrderCard = ({ order }: OrderCardProps) => {
  const { label, className } = STATUS_CONFIG[order.status]
  const visibleItems = order.items.slice(0, MAX_THUMBS)
  const overflow = order.items.length - MAX_THUMBS

  const canTrack = [OrderStatus.SHIPPED, OrderStatus.PROCESSING, OrderStatus.CONFIRMED].includes(order.status)
  const canReturn = order.status === OrderStatus.DELIVERED
  const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block bg-white rounded-2xl border border-[#EBEBEB] p-4 sm:p-5 hover:border-[#C0001D]/30 hover:shadow-sm transition-all duration-200 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-400 font-mono">
            Order #{order.id}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{orderDate}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold', className)}>
            {label}
          </span>
          <ChevronRight
            size={16}
            className="text-gray-300 group-hover:text-brand-red transition-colors"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-2 mb-4">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="w-14 h-16 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0 border border-[#EBEBEB]"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-14 h-16 rounded-lg bg-[#F5F5F5] border border-[#EBEBEB] flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-gray-500">+{overflow}</span>
          </div>
        )}
        <div className="ml-auto text-right shrink-0">
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-bold font-mono text-gray-900">{formatINR(order.total)}</p>
          <p className="text-[11px] text-gray-400">{order.paymentMethod}</p>
        </div>
      </div>

      {/* CTAs */}
      {(canTrack || canReturn) && (
        <div
          className="flex gap-2 pt-3 border-t border-[#F5F5F5]"
          onClick={(e) => e.preventDefault()}
        >
          {canTrack && (
            <Link
              to={`/account/orders/${order.id}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:underline"
            >
              <Truck size={13} /> Track Order
            </Link>
          )}
          {canReturn && (
            <Link
              to={`/account/orders/${order.id}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-red hover:underline ml-4"
            >
              <RotateCcw size={13} /> Return / Exchange
            </Link>
          )}
        </div>
      )}
    </Link>
  )
}
