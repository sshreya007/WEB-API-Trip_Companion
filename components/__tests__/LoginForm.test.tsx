import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginForm from '../LoginForm'
import { authAPI } from '@/lib/api/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/lib/api/auth')
jest.mock('@/lib/hooks/useAuth')
jest.mock('next/navigation')

describe('LoginForm Component', () => {
  let mockPush: jest.Mock
  let mockLogin: jest.Mock

  beforeEach(() => {
    mockPush = jest.fn()
    mockLogin = jest.fn()
    
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    
    ;(useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    })

    jest.clearAllMocks()
  })

  test('1. Should render email input field', () => {
    render(<LoginForm />)
    const emailInput = screen.getByPlaceholderText('Email')
    expect(emailInput).toBeTruthy()
  })

  test('2. Should render password input field', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput).toBeTruthy()
  })

  test('3. Should render login button', () => {
    render(<LoginForm />)
    const button = screen.getByRole('button', { name: /login/i })
    expect(button).toBeTruthy()
  })

  test('4. Should render forgot password link', () => {
    render(<LoginForm />)
    const link = screen.getByText('Forgot Password?')
    expect(link).toBeTruthy()
  })

  test('5. Should render tagline text', () => {
    render(<LoginForm />)
    const tagline = screen.getByText('Capturing Moments, Creating Memories')
    expect(tagline).toBeTruthy()
  })

  test('6. Should update email input when typing', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput.value).toBe('test@example.com')
  })

  test('7. Should update password input when typing', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    
    const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement
    await user.type(passwordInput, 'password123')
    
    expect(passwordInput.value).toBe('password123')
  })

  test('8. Password field should be type password', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput.getAttribute('type')).toBe('password')
  })

  test('9. Should call login API on form submit', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { email: 'user@example.com', role: 'user' },
        token: 'fake-token',
      },
    }
    
    ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })
    })
  })

  test('10. Should redirect to user dashboard for user role', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { email: 'user@example.com', role: 'user' },
        token: 'fake-token',
      },
    }
    
    ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/dashboard')
    })
  })

  test('11. Should redirect to admin dashboard for admin role', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { email: 'admin@example.com', role: 'admin' },
        token: 'fake-token',
      },
    }
    
    ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'admin@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'admin123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard')
    })
  })

  test('12. Should display error for invalid credentials', async () => {
    const mockResponse = {
      success: false,
      error: 'Invalid credentials',
    }
    
    ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'wrong@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      const error = screen.getByText('Invalid credentials')
      expect(error).toBeTruthy()
    })
  })

  test('13. Should show loading text when submitting', async () => {
    ;(authAPI.login as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    )
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    const loadingText = screen.getByText('Logging in...')
    expect(loadingText).toBeTruthy()
  })

  test('14. Should disable button during loading', async () => {
    ;(authAPI.login as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
  })

  test('15. Should handle network errors', async () => {
    ;(authAPI.login as jest.Mock).mockRejectedValue(new Error('Network error'))
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      const error = screen.getByText('An unexpected error occurred')
      expect(error).toBeTruthy()
    })
  })
})