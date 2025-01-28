import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJob, useCandidates, useUpdateCandidate } from '../../hooks'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { Candidate } from '../../api'
import Column from '../../components/DnD/Column'
import JobBanner from './JobBanner'
import Alert from './Alert'

import {
  closestCorners,
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  KeyboardSensor,
  DragMoveEvent,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import dragAndDropUtils from '../../hooks/DragAndDropUtils'

type Statuses = 'new' | 'interview' | 'hired' | 'rejected'
const COLUMNS: Statuses[] = ['new', 'interview', 'hired', 'rejected']
const POSITION: number = 16384

export type ColumnType = {
  id: Statuses
  name: Statuses
  candidates: Candidate[]
}

function JobShow() {
  const { jobId } = useParams()
  const { job } = useJob(jobId)
  const { isLoading, candidates } = useCandidates(jobId)
  const { mutate: updateCandidate, isError } = useUpdateCandidate(jobId)
  const [initialColumn, setInitialColumn] = useState<Statuses | null>(null)
  const [columnsSorted, setColumns] = useState<ColumnType[]>([])

  useEffect(() => {
    if (!candidates) return

    const newColumns = COLUMNS.map(column => ({
      id: column,
      name: column,
      candidates: candidates[column] ?? [],
    }))

    newColumns.forEach((column: ColumnType) => {
      column.candidates.sort((a, b) => a.position - b.position)
    })

    setColumns(newColumns)
  }, [candidates])

  const candidatesNewPosition = (candidates: Candidate[]) => {
    return candidates.map((candidate, index) => {
      const newPos = POSITION * (index + 1)
      return { ...candidate, position: newPos }
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { activeColumn } = dragAndDropUtils(event, columnsSorted)
    setInitialColumn(activeColumn?.id ?? null)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { activeId, activeIndex, overIndex, activeColumn, overColumn, newIndex } =
      dragAndDropUtils(event, columnsSorted)

    if (!activeColumn || !overColumn) {
      return null
    }

    if (activeColumn === overColumn) {
      if (activeIndex !== overIndex) {
        setColumns(prevState => {
          return prevState.map(column => {
            if (column.id === activeColumn.id) {
              column.candidates = arrayMove(overColumn.candidates, activeIndex, overIndex)
              column.candidates = candidatesNewPosition(column.candidates)
              return column
            } else {
              return column
            }
          })
        })
      }
    } else {
      setColumns(prevState => {
        const activeItems = activeColumn.candidates
        const overItems = overColumn.candidates

        return prevState.map(c => {
          if (c.id === activeColumn.id) {
            c.candidates = activeItems.filter(i => i.email !== activeId)
            c.candidates = candidatesNewPosition(c.candidates)
            return c
          } else if (c.id === overColumn.id) {
            const newIndexes = newIndex(overIndex, overItems)
            c.candidates = [
              ...overItems.slice(0, newIndexes),
              { ...activeItems[activeIndex], status: overColumn.name },
              ...overItems.slice(newIndexes, overItems.length),
            ]
            c.candidates = candidatesNewPosition(c.candidates)

            return c
          } else {
            return c
          }
        })
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // const { activeColumn } = dragAndDropUtils(event, columnsSorted)

    // const col1 = columnsSorted.find(column => column.id === initialColumn)
    // const col2 = columnsSorted.find(column => column.id === activeColumn?.id)

    // col2?.candidates
    //   .slice(0)
    //   .reverse()
    //   .map(candidate => {
    //     console.log(candidate)
    //     updateCandidate(candidate)
    //   })

    // if (initialColumn !== activeColumn?.id)
    //   col1?.candidates
    //     .slice(0)
    //     .reverse()
    //     .map(candidate => {
    //       updateCandidate(candidate)
    //     })

    setInitialColumn(null)
  }

  return (
    <>
      <JobBanner jobName={job?.name} />

      {isError && <Alert message="Une erreur est survenue. Impossible de déplacer la carte." />}

      {isLoading ? (
        <Box p={20}>
          <Flex justify="center">
            <progress value={undefined} />
          </Flex>
        </Box>
      ) : (
        <Box style={{ height: '100%' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
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
        </Box>
      )}
    </>
  )
}

export default JobShow
