import { expect, test } from 'vitest'
import { render } from '../../test-utils'
import ColumnName from './ColumnName'
import { Candidate } from '../../api'

test('renders column name and candidates length', () => {
  const columnName = 'Hello'
  const candidates = [
    {
      id: 1,
      email: 'email@test.toto',
      position: 23,
      status: 'new',
    },
    {
      id: 2,
      email: 'email2@test.toto',
      position: 23,
      status: 'new',
    },
    {
      id: 3,
      email: 'email3@test.toto',
      position: 23,
      status: 'new',
    },
  ] as Candidate[]

  const { getByText } = render(<ColumnName columnName={columnName} candidates={candidates} />)
  expect(getByText('Hello')).toBeInTheDocument()
  expect(getByText('3')).toBeInTheDocument()
})
