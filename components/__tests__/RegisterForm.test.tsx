import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import RegisterForm from '../RegisterForm'
import * as authAPI from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

const mockPush = jest.fn()

jest.mock('@/lib/api/auth', () => ({
  authAPI: {
    register: jest.fn(),
  },
}))

describe('RegisterForm Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
    
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  test('16. Should render all input fields', () => {
    render(<RegisterForm />)
    
    expect(screen.getByPlaceholderText('First Name')).toBeTruthy()
    expect(screen.getByPlaceholderText('Last Name')).toBeTruthy()
    expect(screen.getByPlaceholderText('Username')).toBeTruthy()
    expect(screen.getByPlaceholderText('Email')).toBeTruthy()
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy()
    expect(screen.getByPlaceholderText('Confirm password')).toBeTruthy()
  })

  test('17. Should render terms checkbox', () => {
    render(<RegisterForm />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeTruthy()
  })

  test('18. Should render submit button', () => {
    render(<RegisterForm />)
    const button = screen.getByRole('button', { name: /create account/i })
    expect(button).toBeTruthy()
  })

  test('19. Should update first name input', async () => {
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('First Name') as HTMLInputElement
    await user.type(input, 'John')
    
    expect(input.value).toBe('John')
  })

  test('20. Should update email input', async () => {
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Email') as HTMLInputElement
    await user.type(input, 'john@example.com')
    
    expect(input.value).toBe('john@example.com')
  })

  test('21. Should toggle checkbox', async () => {
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    
    expect(checkbox.checked).toBe(false)
    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  

  test('22. Should call register API', async () => {
    const mockResponse = {
      success: true,
      data: { message: 'User registered' },
    }
    
    ;(authAPI.authAPI.register as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('First Name'), 'John')
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe')
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    await waitFor(() => {
      expect(authAPI.authAPI.register).toHaveBeenCalled()
    })
  })

  test('23. Should redirect after successful registration', async () => {
    const mockResponse = {
      success: true,
      data: { message: 'User registered' },
    }
    
    ;(authAPI.authAPI.register as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('First Name'), 'John')
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe')
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login?registered=true')
    })
  })

  test('24. Should show loading state', async () => {
    ;(authAPI.authAPI.register as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    )
    
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText('First Name'), 'John')
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe')
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    const loadingText = screen.getByText('Creating Account...')
    expect(loadingText).toBeTruthy()
  })
})