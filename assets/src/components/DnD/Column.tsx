import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CandidateCard from '../Candidate'
import { Text } from '@welcome-ui/text'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { Badge } from '@welcome-ui/badge'
import { Candidate } from '../../api'
import type { ColumnType } from '../../pages/JobShow/index'

export default function Column({
  column,
  candidates,
}: {
  column: ColumnType
  candidates: Candidate[]
}) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <SortableContext
      id={column.id}
      items={candidates.map((candidate: Candidate) => candidate.email)}
      strategy={rectSortingStrategy}
    >
      <Box
        key={column.id}
        ref={setNodeRef}
        w={300}
        border={1}
        backgroundColor="white"
        borderColor="neutral-30"
        borderRadius="md"
      >
        <Flex
          p={10}
          borderBottom={1}
          borderColor="neutral-30"
          alignItems="center"
          justify="space-between"
        >
          <Text color="black" m={0} textTransform="capitalize">
            {column.name}
          </Text>
          <Badge>{candidates.length}</Badge>
        </Flex>
        {candidates.map(candidate => (
          <CandidateCard key={candidate.email} candidate={candidate} />
        ))}
      </Box>
    </SortableContext>
  )
}
