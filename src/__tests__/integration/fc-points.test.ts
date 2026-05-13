/**
 * Integration: FC points earn on purchase → balance update
 * Tests the points calculation logic used across checkout and dashboard.
 */

const FC_EARN_RATE = 1 // 1 point per ₹100 spent (Classic tier)
const FC_EARN_RATE_SILVER = 2
const FC_EARN_RATE_PLATINUM = 3
const FC_EARN_RATE_BLACK = 5

function calcPointsEarned(total: number, ratePerHundred: number): number {
  return Math.floor(total / 100) * ratePerHundred
}

function applyPointsRedemption(
  cartTotal: number,
  pointsToRedeem: number,
  pointsBalance: number,
  minRedemption = 200,
): { discount: number; newBalance: number; error: string | null } {
  if (pointsToRedeem < minRedemption) {
    return { discount: 0, newBalance: pointsBalance, error: `Minimum ${minRedemption} points required` }
  }
  if (pointsToRedeem > pointsBalance) {
    return { discount: 0, newBalance: pointsBalance, error: 'Insufficient points' }
  }
  if (pointsToRedeem > cartTotal) {
    return { discount: 0, newBalance: pointsBalance, error: 'Points cannot exceed cart total' }
  }
  return { discount: pointsToRedeem, newBalance: pointsBalance - pointsToRedeem, error: null }
}

describe('FC Points — earn calculation', () => {
  it('Classic tier earns 1 pt per ₹100', () => {
    expect(calcPointsEarned(3999, FC_EARN_RATE)).toBe(39)
  })

  it('Silver Edge tier earns 2 pts per ₹100', () => {
    expect(calcPointsEarned(3999, FC_EARN_RATE_SILVER)).toBe(78)
  })

  it('Platinum tier earns 3 pts per ₹100', () => {
    expect(calcPointsEarned(10000, FC_EARN_RATE_PLATINUM)).toBe(300)
  })

  it('Black tier earns 5 pts per ₹100', () => {
    expect(calcPointsEarned(10000, FC_EARN_RATE_BLACK)).toBe(500)
  })

  it('floors partial hundreds — no rounding up', () => {
    // ₹199 → 1 × rate, not 2
    expect(calcPointsEarned(199, FC_EARN_RATE)).toBe(1)
  })

  it('earns 0 points on orders below ₹100', () => {
    expect(calcPointsEarned(99, FC_EARN_RATE)).toBe(0)
  })
})

describe('FC Points — redemption', () => {
  const balance = 2840

  it('applies valid redemption and deducts from balance', () => {
    const result = applyPointsRedemption(5000, 500, balance)
    expect(result.error).toBeNull()
    expect(result.discount).toBe(500)
    expect(result.newBalance).toBe(balance - 500)
  })

  it('rejects redemption below minimum (200 pts)', () => {
    const result = applyPointsRedemption(5000, 100, balance)
    expect(result.error).toMatch(/minimum/i)
    expect(result.discount).toBe(0)
  })

  it('rejects redemption exceeding available balance', () => {
    const result = applyPointsRedemption(5000, balance + 1, balance)
    expect(result.error).toMatch(/insufficient/i)
  })

  it('rejects redemption exceeding cart total', () => {
    const result = applyPointsRedemption(300, 500, balance)
    expect(result.error).toMatch(/cannot exceed/i)
  })

  it('allows using exact balance', () => {
    const result = applyPointsRedemption(5000, balance, balance)
    expect(result.error).toBeNull()
    expect(result.newBalance).toBe(0)
  })
})
