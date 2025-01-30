import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CandidateCard from '../Candidate'
import { Box } from '@welcome-ui/box'
import { Candidate } from '../../api'
import ColumnName from './ColumnName'

export default function Column({ id, items }: { id: string; items: Candidate[] }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <Box w={300} border={1} backgroundColor="white" borderColor="neutral-30" borderRadius="md">
      <ColumnName columnName={id} candidates={items} />
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <div ref={setNodeRef}>
          {items.map(item => (
            <CandidateCard key={item.id} candidate={item} />
          ))}
        </div>
      </SortableContext>
    </Box>
  )
}
