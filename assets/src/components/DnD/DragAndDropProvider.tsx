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
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  )
}
