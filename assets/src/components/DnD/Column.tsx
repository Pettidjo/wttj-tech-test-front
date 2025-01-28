import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CandidateCard from '../Candidate'
import { Box } from '@welcome-ui/box'
import { Candidate } from '../../api'
import type { ColumnType } from '../../pages/JobShow/index'
import ColumnName from './ColumnName'

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
        <ColumnName columnName={column.name} candidates={candidates} />
        {candidates.map(candidate => (
          <CandidateCard key={candidate.email} candidate={candidate} />
        ))}
      </Box>
    </SortableContext>
  )
}
