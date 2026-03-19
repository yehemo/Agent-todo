import { render, screen } from '@testing-library/react'
import { DueDateLabel } from '../../components/tasks/DueDateLabel'

const pastDate = '2020-01-01'
const futureDate = '2099-12-31'

describe('DueDateLabel', () => {
  it('renders red text when due_date is past and status is not completed', () => {
    render(<DueDateLabel dueDate={pastDate} status="pending" />)
    const el = screen.getByText(/jan 1, 2020/i)
    expect(el).toHaveClass('text-red-500')
  })

  it('renders normal color when due_date is in the future', () => {
    render(<DueDateLabel dueDate={futureDate} status="pending" />)
    const el = screen.getByText(/dec 31, 2099/i)
    expect(el).not.toHaveClass('text-red-500')
  })

  it('renders nothing when due_date is null', () => {
    const { container } = render(<DueDateLabel dueDate={null} status="pending" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('does NOT render red for completed task even if past due', () => {
    render(<DueDateLabel dueDate={pastDate} status="completed" />)
    const el = screen.getByText(/jan 1, 2020/i)
    expect(el).not.toHaveClass('text-red-500')
  })
})
