import { expect, test } from 'vitest'

import { render } from '../../test-utils'
import JobBanner from './JobBanner'

test('renders Jobname', () => {
  const jobName: string = 'Software Engineer'

  const { getByText } = render(<JobBanner jobName={jobName} />)

  expect(getByText('Software Engineer')).toBeInTheDocument()
})
