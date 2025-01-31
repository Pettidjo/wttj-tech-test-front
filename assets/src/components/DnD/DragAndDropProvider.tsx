import {
  closestCorners,
  DndContext,
  useSensors,
  useSensor,
  KeyboardSensor,
  DragMoveEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

type DragAndDropProviderProps = {
  children: React.ReactNode
  handleDragMove: (event: DragMoveEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

export default function DragAndDropProvider({
  children,
  handleDragMove,
  handleDragEnd,
}: DragAndDropProviderProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        tolerance: 5,
        // Require to press for 100ms to start dragging, this can reduce the chance of dragging accidentally due to page scroll
        delay: 100,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  )
}
