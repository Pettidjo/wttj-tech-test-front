import { DragStartEvent, DragMoveEvent, DragEndEvent } from '@dnd-kit/core'
import { ColumnType } from '../pages/JobShow'

const findColumn = (unique: string | null, columns: ColumnType[]) => {
  if (!unique) return null

  if (columns.some(c => c.id === unique)) {
    return columns.find(c => c.id === unique) ?? null
  }

  const id = String(unique)

  const itemWithColumnId = columns.flatMap(c => {
    const columnId = c.id
    return c.candidates.map(candidate => ({ itemId: candidate.email, columnId: columnId }))
  })

  const columnId = itemWithColumnId.find(i => i.itemId === id)?.columnId
  return columns.find(c => c.id === columnId) ?? null
}

export default function dragAndDropUtils(
  event: DragStartEvent | DragMoveEvent | DragEndEvent,
  columns: ColumnType[]
) {
  const { active, over, delta } = event

  const activeId = String(active.id)
  const overId = over ? String(over.id) : null

  const activeColumn = findColumn(activeId, columns)
  const overColumn = findColumn(overId, columns)

  const activeIndex = !activeColumn
    ? -1
    : activeColumn.candidates.findIndex(i => i.email === activeId)
  const overIndex = !overColumn ? -1 : overColumn.candidates.findIndex(i => i.email === overId)

  const newIndex = (overIndex: number, items: unknown[]) => {
    const putOnBelowLastItem = overIndex === items.length - 1 && delta.y > 0
    const modifier = putOnBelowLastItem ? 1 : 0
    return overIndex >= 0 ? overIndex + modifier : items.length + 1
  }

  return { activeId, overId, activeColumn, overColumn, activeIndex, overIndex, delta, newIndex }
}
