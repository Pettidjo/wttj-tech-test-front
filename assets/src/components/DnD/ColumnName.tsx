import { Text } from '@welcome-ui/text'
import { Flex } from '@welcome-ui/flex'
import { Badge } from '@welcome-ui/badge'
import { Candidate } from '../../api'
import { Statuses } from '../../pages/JobShow'

type ColumnNameType = {
  columnName: Statuses | string
  candidates: Candidate[]
}

export default function ColumnName({ columnName, candidates }: ColumnNameType) {
  return (
    <Flex
      p={10}
      borderBottom={1}
      borderColor="neutral-30"
      alignItems="center"
      justify="space-between"
    >
      <Text color="black" m={0} textTransform="capitalize">
        {columnName}
      </Text>
      <Badge>{candidates.length}</Badge>
    </Flex>
  )
}
