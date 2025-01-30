import { expect, test } from 'vitest'
import { render } from '../../test-utils'
import Column from '../../components/DnD/Column'
import { Candidate } from '../../api'

test('renders Columns', () => {
  const id = 'new'
  const candidates: Candidate[] = [
    { id: 10, email: 'test@example.com', position: 1, status: 'new' },
    { id: 11, email: 'test2@example.com', position: 2, status: 'new' },
  ]

  const { getByText } = render(<Column id={id} items={candidates} />)
  expect(getByText('new')).toBeInTheDocument()
  expect(getByText('email: test@example.com')).toBeInTheDocument()
  expect(getByText('email: test2@example.com')).toBeInTheDocument()
})
