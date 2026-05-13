import { useState } from 'react'
import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OrderCard } from '@components/account/OrderCard'
import { MOCK_ORDERS } from '@data/orders'
import { OrderStatus } from '@typedefs/enums'
import { cn } from '@utils/cn'

type Filter = 'all' | OrderStatus

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All Orders',  value: 'all' },
  { label: 'Pending',     value: OrderStatus.PENDING },
  { label: 'Delivered',   value: OrderStatus.DELIVERED },
  { label: 'Cancelled',   value: OrderStatus.CANCELLED },
  { label: 'Returns',     value: OrderStatus.RETURNED },
]

export const OrdersPage = () => {
  const [active, setActive] = useState<Filter>('all')

  const filtered = active === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === active)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-400">{MOCK_ORDERS.length} orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all',
              active === value
                ? 'bg-brand-red text-white'
                : 'bg-white text-gray-600 border border-[#E0E0E0] hover:border-brand-red hover:text-brand-red',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Order list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyOrders />
      )}
    </div>
  )
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <Package size={28} className="text-gray-300" />
      </div>
      <div>
        <p className="font-semibold text-gray-700">No orders here</p>
        <p className="text-sm text-gray-400 mt-1">Your orders will appear here once you shop</p>
      </div>
      <Link
        to="/"
        className="mt-2 px-6 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-[#A8001A] transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  )
}
