import '@testing-library/jest-dom'

// Mock next/navigation - MUST be before any imports
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation')
  return {
    ...actual,
    useRouter: jest.fn(),
    usePathname: jest.fn(() => ''),
    useSearchParams: jest.fn(() => ({
      get: jest.fn(),
    })),
  }
})

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})