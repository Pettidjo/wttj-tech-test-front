import {
  closestCorners,
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  KeyboardSensor,
  DragMoveEvent,
  DragEndEvent,
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
    useSensor(PointerSensor),
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
