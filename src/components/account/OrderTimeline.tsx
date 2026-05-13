import { Check, Circle } from 'lucide-react'
import type { TrackingEvent } from '@typedefs/order'
import { cn } from '@utils/cn'

interface OrderTimelineProps {
  events: TrackingEvent[]
}

export const OrderTimeline = ({ events }: OrderTimelineProps) => (
  <ol className="relative flex flex-col gap-0" aria-label="Order tracking timeline">
    {events.map((event, i) => {
      const isLast = i === events.length - 1
      return (
        <li key={i} className="flex gap-4">
          {/* Connector */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10',
                event.completed
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'bg-white border-[#E0E0E0] text-gray-300',
              )}
            >
              {event.completed ? <Check size={14} strokeWidth={3} /> : <Circle size={12} />}
            </div>
            {!isLast && (
              <div
                className={cn(
                  'w-0.5 flex-1 mt-1 mb-1 min-h-[24px]',
                  event.completed ? 'bg-brand-red/30' : 'bg-[#E8E8E8]',
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className={cn('pb-5', isLast && 'pb-0')}>
            <p className={cn('text-sm font-semibold', event.completed ? 'text-gray-900' : 'text-gray-400')}>
              {event.status}
            </p>
            {event.description && (
              <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
            )}
            {event.location && (
              <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
            )}
            {event.timestamp && (
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                {new Date(event.timestamp).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </li>
      )
    })}
  </ol>
)
