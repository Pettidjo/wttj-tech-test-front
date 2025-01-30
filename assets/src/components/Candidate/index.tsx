import { Card } from '@welcome-ui/card'
import { Candidate } from '../../api'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: candidate.id,
  })

  const style = {
    cursor: 'grab',
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <Card m={10} ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card.Body>
        <p>id: {candidate.id}</p>
        <p>email: {candidate.email}</p>
        <p>position: {candidate.position}</p>
      </Card.Body>
    </Card>
  )
}

export default CandidateCard
