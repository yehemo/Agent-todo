import { render, screen } from '@testing-library/react'
import { PriorityBadge } from '../../components/tasks/PriorityBadge'

describe('PriorityBadge', () => {
  it('renders Low with green styling', () => {
    render(<PriorityBadge priority="low" />)
    const badge = screen.getByText('Low')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100', 'text-green-700')
  })

  it('renders Medium with yellow styling', () => {
    render(<PriorityBadge priority="medium" />)
    const badge = screen.getByText('Medium')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-700')
  })

  it('renders High with red styling', () => {
    render(<PriorityBadge priority="high" />)
    const badge = screen.getByText('High')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-red-100', 'text-red-700')
  })
})
