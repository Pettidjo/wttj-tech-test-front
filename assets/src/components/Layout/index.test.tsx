import { BrowserRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import { render } from '../../test-utils'
import Layout from '../Layout'

test('renders Layout', () => {
  const { getByText } = render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
  expect(getByText('Jobs')).toBeInTheDocument()
})
