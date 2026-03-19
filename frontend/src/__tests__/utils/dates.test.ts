import { isOverdue, formatDueDate } from '../../utils/dates'

describe('isOverdue', () => {
  it('returns true for past date with pending status', () => {
    expect(isOverdue('2020-01-01', 'pending')).toBe(true)
  })

  it('returns false for future date', () => {
    expect(isOverdue('2099-12-31', 'pending')).toBe(false)
  })

  it('returns false when due_date is null', () => {
    expect(isOverdue(null, 'pending')).toBe(false)
  })

  it('returns false for completed status regardless of date', () => {
    expect(isOverdue('2020-01-01', 'completed')).toBe(false)
  })

  it('returns false for in-progress status with future date', () => {
    expect(isOverdue('2099-12-31', 'in-progress')).toBe(false)
  })
})

describe('formatDueDate', () => {
  it('returns empty string for null', () => {
    expect(formatDueDate(null)).toBe('')
  })

  it('formats date correctly', () => {
    const result = formatDueDate('2026-03-19')
    expect(result).toMatch(/mar/i)
    expect(result).toMatch(/2026/)
  })
})
