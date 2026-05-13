import { formatINR, truncateText, formatDiscount } from '@utils/format'

describe('formatINR', () => {
  it('formats whole rupee amounts with ₹ symbol', () => {
    expect(formatINR(1000)).toMatch(/₹.*1,000/)
  })

  it('formats zero as ₹0', () => {
    expect(formatINR(0)).toMatch(/₹.*0/)
  })

  it('formats large amounts with Indian comma grouping', () => {
    expect(formatINR(100000)).toMatch(/₹.*1,00,000/)
  })

  it('rounds decimals — no paise shown', () => {
    const result = formatINR(999.99)
    expect(result).not.toContain('.')
  })
})

describe('truncateText', () => {
  it('returns the original string when within limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello')
  })

  it('truncates and appends ellipsis when over limit', () => {
    const result = truncateText('Hello World', 5)
    expect(result).toBe('Hello…')
  })

  it('returns full string when exactly at limit', () => {
    expect(truncateText('Hello', 5)).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(truncateText('', 5)).toBe('')
  })
})

describe('formatDiscount', () => {
  it('calculates 20% discount correctly', () => {
    expect(formatDiscount(1000, 800)).toBe(20)
  })

  it('calculates 0% when mrp equals selling price', () => {
    expect(formatDiscount(500, 500)).toBe(0)
  })

  it('rounds fractional discounts', () => {
    // (999 - 666) / 999 = 33.33...% → rounds to 33
    expect(formatDiscount(999, 666)).toBe(33)
  })

  it('returns 100% when selling price is 0', () => {
    expect(formatDiscount(500, 0)).toBe(100)
  })
})
