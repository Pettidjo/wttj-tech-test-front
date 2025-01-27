import { Card } from '@welcome-ui/card'
import { Candidate } from '../../api'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: candidate.email,
  })

  const style = {
    cursor: 'grab',
    transform: CSS.Transform.toString(transform),
  }

  return (
    <Card m={10} ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card.Body>{candidate.email}</Card.Body>
    </Card>
  )
}

export default CandidateCard
