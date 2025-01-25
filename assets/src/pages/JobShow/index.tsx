import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJob, useCandidates } from '../../hooks'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { Text } from '@welcome-ui/text'
import { Candidate } from '../../api'
import Column from '../../components/DnD/Column'

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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

type Statuses = 'new' | 'interview' | 'hired' | 'rejected'
const COLUMNS: Statuses[] = ['new', 'interview', 'hired', 'rejected']

export type Column = {
  id: string
  name: string
  candidates: Candidate[]
}

function JobShow() {
  const { jobId } = useParams()
  const { job } = useJob(jobId)
  const { isLoading, candidates } = useCandidates(jobId)
  const [columnsSorted, setColumns] = useState<Column[]>([])

  useEffect(() => {
    if (!candidates) return

    const newColumns = COLUMNS.map(column => ({
      id: column,
      name: column,
      candidates: candidates[column] ?? [],
    }))

    newColumns.forEach((column: Column) => {
      column.candidates.sort((a, b) => a.position - b.position)
    })

    setColumns(newColumns)
  }, [candidates])

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null
    }

    if (columnsSorted.some(c => c.id === unique)) {
      return columnsSorted.find(c => c.id === unique) ?? null
    }

    const id = String(unique)

    const itemWithColumnId = columnsSorted.flatMap(c => {
      const columnId = c.id
      return c.candidates.map(candidate => ({ itemId: candidate.email, columnId: columnId }))
    })

    const columnId = itemWithColumnId.find(i => i.itemId === id)?.columnId
    return columnsSorted.find(c => c.id === columnId) ?? null
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over, delta } = event
    const activeId = String(active.id)
    const overId = over ? String(over.id) : null

    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null
    }

    setColumns(prevState => {
      const activeItems = activeColumn.candidates
      const overItems = overColumn.candidates
      const activeIndex = activeItems.findIndex(i => i.email === activeId)
      const overIndex = overItems.findIndex(i => i.email === overId)

      const newIndex = () => {
        const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0
        const modifier = putOnBelowLastItem ? 1 : 0
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      return prevState.map(c => {
        if (c.id === activeColumn.id) {
          c.candidates = activeItems.filter(i => i.email !== activeId)
          return c
        } else if (c.id === overColumn.id) {
          c.candidates = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length),
          ]
          return c
        } else {
          return c
        }
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activeId = String(active.id)
    const overId = over ? String(over.id) : null
    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null
    }

    const activeIndex = activeColumn.candidates.findIndex(i => i.email === activeId)
    const overIndex = overColumn.candidates.findIndex(i => i.email === overId)

    if (activeIndex !== overIndex) {
      setColumns(prevState => {
        return prevState.map(column => {
          if (column.id === activeColumn.id) {
            column.candidates = arrayMove(overColumn.candidates, activeIndex, overIndex)
            return column
          } else {
            return column
          }
        })
      })
    }

    console.log(columnsSorted)
  }

  return (
    <>
      <Box backgroundColor="neutral-70" p={20} alignItems="center">
        <Text variant="h5" color="white" m={0}>
          {job?.name}
        </Text>
      </Box>

      {isLoading ? (
        <Box p={20}>
          <Flex justify="center">
            <progress value={undefined} />
          </Flex>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <Box p={20}>
            <Flex gap={10}>
              {columnsSorted.map(column => (
                <Column key={column.id} column={column} candidates={column.candidates} />
              ))}
            </Flex>
          </Box>
        </DndContext>
      )}
    </>
  )
}

export default JobShow
