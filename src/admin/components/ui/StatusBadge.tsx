interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, string> = {
  // order statuses
  delivered:   'bg-green-100 text-green-700',
  confirmed:   'bg-blue-100 text-blue-700',
  processing:  'bg-blue-100 text-blue-700',
  shipped:     'bg-indigo-100 text-indigo-700',
  pending:     'bg-amber-100 text-amber-700',
  cancelled:   'bg-red-100 text-red-700',
  returned:    'bg-purple-100 text-purple-700',
  // product statuses
  active:      'bg-green-100 text-green-700',
  draft:       'bg-gray-100 text-gray-700',
  out_of_stock:'bg-red-100 text-red-700',
  // return statuses
  approved:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
  // coupon / banner
  inactive:    'bg-gray-100 text-gray-500',
  scheduled:   'bg-blue-100 text-blue-700',
  expired:     'bg-gray-100 text-gray-500',
  // staff
  suspended:   'bg-red-100 text-red-700',
  // inventory
  low:         'bg-amber-100 text-amber-700',
  healthy:     'bg-green-100 text-green-700',
  // general
  blocked:     'bg-red-100 text-red-700',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/ /g, '_')
  const style = STATUS_STYLES[key] ?? 'bg-gray-100 text-gray-600'
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} ${style}`}>
      {label}
    </span>
  )
}
