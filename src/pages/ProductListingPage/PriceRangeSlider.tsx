import { useState, useEffect } from 'react'
import { formatINR } from '@utils/format'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])

  useEffect(() => {
    setLocalMin(value[0])
    setLocalMax(value[1])
  }, [value[0], value[1]])

  const span = max - min
  const minPercent = ((localMin - min) / span) * 100
  const maxPercent = ((localMax - min) / span) * 100

  function handleCommit() {
    onChange([localMin, localMax])
  }

  return (
    <div className="px-1 py-2">
      <div className="flex justify-between mb-4">
        <span className="text-xs font-medium bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700">
          {formatINR(localMin)}
        </span>
        <span className="text-xs font-medium bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700">
          {formatINR(localMax)}
        </span>
      </div>

      <div className="relative h-5 flex items-center mx-2">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1 bg-gray-200 rounded" />
        {/* Active track */}
        <div
          className="absolute h-1 bg-brand-red rounded"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        {/* Min range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={localMin}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), localMax - 500)
            setLocalMin(v)
          }}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="range-thumb absolute inset-x-0"
          style={{ zIndex: localMin > max - 2000 ? 5 : 3 }}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMin}
        />
        {/* Max range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={localMax}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), localMin + 500)
            setLocalMax(v)
          }}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="range-thumb absolute inset-x-0"
          style={{ zIndex: 4 }}
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMax}
        />

        {/* Visual thumb — min */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-red rounded-full shadow pointer-events-none z-10"
          style={{ left: `calc(${minPercent}% - 8px)` }}
        />
        {/* Visual thumb — max */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-red rounded-full shadow pointer-events-none z-10"
          style={{ left: `calc(${maxPercent}% - 8px)` }}
        />
      </div>
    </div>
  )
}
