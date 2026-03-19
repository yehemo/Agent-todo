import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../../components/tasks/StatusBadge'

describe('StatusBadge', () => {
  it('renders Pending with gray styling', () => {
    render(<StatusBadge status="pending" />)
    const badge = screen.getByText('Pending')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-600')
  })

  it('renders In Progress with blue styling', () => {
    render(<StatusBadge status="in-progress" />)
    const badge = screen.getByText('In Progress')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('renders Completed with green styling', () => {
    render(<StatusBadge status="completed" />)
    const badge = screen.getByText('Completed')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100', 'text-green-700')
  })
})
