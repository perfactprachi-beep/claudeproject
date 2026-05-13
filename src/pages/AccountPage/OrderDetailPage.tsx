import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Download, MapPin, CreditCard, Truck } from 'lucide-react'
import { MOCK_ORDERS } from '@data/orders'
import { OrderTimeline } from '@components/account/OrderTimeline'
import { OrderStatus } from '@typedefs/enums'
import { formatINR } from '@utils/format'
import { cn } from '@utils/cn'

const STATUS_COLOR: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:    'bg-amber-50 text-amber-700 border border-amber-200',
  [OrderStatus.CONFIRMED]:  'bg-blue-50 text-blue-700 border border-blue-200',
  [OrderStatus.PROCESSING]: 'bg-purple-50 text-purple-700 border border-purple-200',
  [OrderStatus.SHIPPED]:    'bg-indigo-50 text-indigo-700 border border-indigo-200',
  [OrderStatus.DELIVERED]:  'bg-green-50 text-green-700 border border-green-200',
  [OrderStatus.CANCELLED]:  'bg-red-50 text-red-700 border border-red-200',
  [OrderStatus.RETURNED]:   'bg-gray-100 text-gray-600 border border-gray-200',
}

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const order = MOCK_ORDERS.find((o) => o.id === orderId)

  if (!order) return <Navigate to="/account/orders" replace />

  const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Back + header */}
      <div>
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-red mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-bold font-serif text-gray-900 font-mono">{order.id}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Placed on {orderDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('px-3 py-1 rounded-full text-xs font-bold', STATUS_COLOR[order.status])}>
              {order.status}
            </span>
            {order.invoiceUrl && (
              <a
                href={order.invoiceUrl}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-red border border-brand-red/30 rounded-lg px-3 py-1.5 hover:bg-brand-red/5 transition-colors"
              >
                <Download size={13} /> Invoice
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* LEFT column */}
        <div className="flex flex-col gap-5">
          {/* Items */}
          <Section title="Items Ordered">
            <div className="flex flex-col divide-y divide-[#F5F5F5]">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0 border border-[#EBEBEB]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.brand}</p>
                    <p className="text-sm font-medium text-gray-900 leading-snug mt-0.5">{item.name}</p>
                    <div className="flex gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-500">Size: <strong>{item.size}</strong></span>
                      {item.colour && <span className="text-xs text-gray-500">Colour: <strong>{item.colour}</strong></span>}
                      <span className="text-xs text-gray-500">Qty: <strong>{item.quantity}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono text-gray-900">{formatINR(item.totalPrice)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">{formatINR(item.unitPrice)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Price breakdown */}
          <Section title="Price Details">
            <div className="flex flex-col gap-2 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              {order.discount > 0 && (
                <Row label="Discount" value={`- ${formatINR(order.discount)}`} valueClass="text-green-600" />
              )}
              <Row
                label="Delivery"
                value={order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}
                valueClass={order.deliveryCharge === 0 ? 'text-green-600' : undefined}
              />
              <div className="border-t border-[#EBEBEB] pt-2 mt-1">
                <Row label="Total Paid" value={formatINR(order.total)} bold />
              </div>
            </div>
          </Section>

          {/* Return CTA for delivered orders */}
          {order.status === OrderStatus.DELIVERED && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-1">Return / Exchange window</p>
              <p className="text-amber-700 text-xs">
                You can initiate a return or exchange within 30 days of delivery.
              </p>
              <button className="mt-3 text-xs font-bold text-brand-red hover:underline">
                Request Return or Exchange →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-5">
          {/* Tracking */}
          {order.tracking && order.tracking.events.length > 0 && (
            <Section title={<span className="flex items-center gap-2"><Truck size={15} />Tracking</span>}>
              {order.tracking.awb && (
                <p className="text-xs text-gray-500 mb-4 font-mono">
                  {order.tracking.courier} · AWB: {order.tracking.awb}
                </p>
              )}
              <OrderTimeline events={order.tracking.events} />
            </Section>
          )}

          {/* Delivery address */}
          <Section title={<span className="flex items-center gap-2"><MapPin size={15} />Delivery Address</span>}>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p className="text-gray-400 text-xs mt-1">{order.shippingAddress.mobile}</p>
            </div>
          </Section>

          {/* Payment */}
          <Section title={<span className="flex items-center gap-2"><CreditCard size={15} />Payment</span>}>
            <p className="text-sm text-gray-700 font-medium">{order.paymentMethod}</p>
            <p className="text-xs text-gray-400 mt-1">Amount paid: {formatINR(order.total)}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Row({
  label, value, valueClass, bold,
}: {
  label: string; value: string; valueClass?: string; bold?: boolean
}) {
  return (
    <div className={cn('flex justify-between', bold && 'font-bold text-gray-900')}>
      <span className={bold ? '' : 'text-gray-500'}>{label}</span>
      <span className={cn('font-mono', valueClass)}>{value}</span>
    </div>
  )
}
