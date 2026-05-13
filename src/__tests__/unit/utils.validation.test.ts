import {
  isValidMobile,
  isValidEmail,
  isValidPincode,
  isValidOTP,
  isValidPassword,
  isValidName,
  isValidUPI,
} from '@utils/validation'

describe('isValidMobile', () => {
  it('accepts valid Indian mobile numbers starting with 6–9', () => {
    expect(isValidMobile('9876543210')).toBe(true)
    expect(isValidMobile('6543210987')).toBe(true)
    expect(isValidMobile('8000000000')).toBe(true)
  })

  it('rejects numbers starting with 0–5', () => {
    expect(isValidMobile('5876543210')).toBe(false)
    expect(isValidMobile('1234567890')).toBe(false)
  })

  it('rejects numbers with wrong length', () => {
    expect(isValidMobile('987654321')).toBe(false)   // 9 digits
    expect(isValidMobile('98765432100')).toBe(false) // 11 digits
  })

  it('trims whitespace before validating', () => {
    expect(isValidMobile(' 9876543210 ')).toBe(true)
  })
})

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('priya.sharma@gmail.co.in')).toBe(true)
  })

  it('rejects emails without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects emails without domain extension', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isValidPincode', () => {
  it('accepts exactly 6 digits', () => {
    expect(isValidPincode('400053')).toBe(true)
  })

  it('rejects 5 or 7 digits', () => {
    expect(isValidPincode('40005')).toBe(false)
    expect(isValidPincode('4000530')).toBe(false)
  })

  it('rejects non-numeric characters', () => {
    expect(isValidPincode('40005A')).toBe(false)
  })
})

describe('isValidOTP', () => {
  it('accepts exactly 6 digits', () => {
    expect(isValidOTP('123456')).toBe(true)
  })

  it('rejects OTPs shorter or longer than 6', () => {
    expect(isValidOTP('12345')).toBe(false)
    expect(isValidOTP('1234567')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('accepts passwords 8+ characters', () => {
    expect(isValidPassword('password')).toBe(true)
    expect(isValidPassword('longerpassword')).toBe(true)
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('short')).toBe(false)
    expect(isValidPassword('')).toBe(false)
  })
})

describe('isValidName', () => {
  it('accepts names with 2+ non-whitespace characters', () => {
    expect(isValidName('Priya')).toBe(true)
    expect(isValidName('A B')).toBe(true)
  })

  it('rejects names with fewer than 2 non-whitespace characters', () => {
    expect(isValidName('A')).toBe(false)
    expect(isValidName('  ')).toBe(false)
  })
})

describe('isValidUPI', () => {
  it('accepts valid UPI VPAs', () => {
    expect(isValidUPI('priya.sharma@okaxis')).toBe(true)
    expect(isValidUPI('9876543210@paytm')).toBe(true)
    expect(isValidUPI('user-name@upi')).toBe(true)
  })

  it('rejects VPAs without @', () => {
    expect(isValidUPI('priyanokaxis')).toBe(false)
  })

  it('rejects VPAs with too-short handle or bank part', () => {
    expect(isValidUPI('ab@ok')).toBe(false) // handle too short
    expect(isValidUPI('priya@ab')).toBe(false) // bank too short
  })
})
