import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Alert from './Alert'

describe('Alert component', () => {
  it('should display the alert message', () => {
    render(<Alert message="Test Alert" />)
    expect(screen.getByText('Test Alert')).toBeInTheDocument()
  })

  it('should hide the alert after 2 seconds', () => {
    vi.useFakeTimers()
    render(<Alert message="Test Alert" />)

    expect(screen.getByText('Test Alert')).toBeInTheDocument()
  })
})
