export const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim())

export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export const isValidPincode = (v: string) => /^\d{6}$/.test(v.trim())

export const isValidOTP = (v: string) => /^\d{6}$/.test(v.trim())

export const isValidPassword = (v: string) => v.length >= 8

export const isValidName = (v: string) => v.trim().length >= 2

export const isValidUPI = (v: string) =>
  /^[\w.\-]{3,}@[a-zA-Z]{3,}$/.test(v.trim())
