import { expect, test } from 'vitest'
import type { ColumnType } from '../../pages/JobShow/index'
import { render } from '../../test-utils'
import Column from '../../components/DnD/Column'

test('renders Columns', () => {
  const column: ColumnType = {
    id: 'new',
    name: 'new',
    candidates: [
      { id: 10, email: 'test@example.com', position: 1, status: 'new' },
      { id: 11, email: 'test2@example.com', position: 2, status: 'new' },
    ],
  }
  const { getByText } = render(<Column column={column} candidates={column.candidates} />)
  expect(getByText('new')).toBeInTheDocument()
  expect(getByText('test@example.com')).toBeInTheDocument()
  expect(getByText('test2@example.com')).toBeInTheDocument()
})
