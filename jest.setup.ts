import '@testing-library/jest-dom'

// Silence zustand persist warnings in tests
beforeEach(() => {
  localStorage.clear()
})
