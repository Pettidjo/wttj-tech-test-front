import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CandidateCard from '../Candidate'
import { Box } from '@welcome-ui/box'
import { Candidate } from '../../api'
import ColumnName from './ColumnName'

export default function Column({ id, items }: { id: string; items: Candidate[] }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <Box
        ref={setNodeRef}
        w={300}
        border={1}
        backgroundColor="white"
        borderColor="neutral-30"
        borderRadius="md"
      >
        <ColumnName columnName={id} candidates={items} />
        {items.map(item => (
          <CandidateCard key={item.id} candidate={item} />
        ))}
      </Box>
    </SortableContext>
  )
}
