import { useEffect, useCallback, useState, memo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useJob, useCandidates, useUpdateCandidate } from '../../hooks'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { Candidate, CandidatesByStatus } from '../../api'
import Column from '../../components/DnD/Column'
import JobBanner from '../../components/Job/JobBanner'
import Alert from '../../components/UI/Alert'
import DragAndDropProvider from '../../components/DnD/DragAndDropProvider'

import { DragMoveEvent, DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { insertAtIndex, removeAtIndex } from '../../utils/array'

type Statuses = 'new' | 'interview' | 'hired' | 'rejected'
const COLUMNS: Statuses[] = ['new', 'interview', 'hired', 'rejected']

const MOVEMENT_THRESHOLD = 10 // Minimum motion threshold in pixels
const magicNumber: number = 16384

const initialObject: CandidatesByStatus = {
  new: [],
  interview: [],
  hired: [],
  rejected: [],
}

function JobShow() {
  const { jobId } = useParams()
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null)

  const { job } = useJob(jobId)
  const { isLoading, candidates, isFetching } = useCandidates(jobId)
  const { mutate, isError } = useUpdateCandidate(jobId)
  const [sortedCandidates, setSortedCandidates] = useState<CandidatesByStatus>(initialObject)

  useEffect(() => {
    if (!candidates) return

    const sortedCandidates = COLUMNS.reduce(
      (acc, column) => {
        acc[column] = [...(candidates[column] || [])].sort((a, b) => a.position - b.position)
        return acc
      },
      { ...initialObject }
    )

    setSortedCandidates(sortedCandidates)
  }, [candidates, isFetching])

  const findContainer = useCallback(
    (id: Statuses | number) => {
      if (id in sortedCandidates) return id

      const container = Object.keys(sortedCandidates).find(key =>
        sortedCandidates[key as keyof CandidatesByStatus]?.some((item: Candidate) => item.id === id)
      )

      return container || null
    },
    [sortedCandidates]
  )

  const findItem = useCallback(
    (id: number) => {
      return Object.values(sortedCandidates)
        .flatMap(a => a)
        .find(c => c.id === id)
    },
    [sortedCandidates]
  )

  const calculateNewPosition = (
    prevPosition: number,
    nextPosition: number,
    magicNumber: number
  ): number => {
    if (prevPosition === nextPosition) {
      return magicNumber
    } else if (prevPosition !== 0 && nextPosition === 0) {
      return prevPosition + magicNumber
    } else {
      return (prevPosition + nextPosition) / 2
    }
  }

  const moveBetweenContainers = useCallback(
    (
      items: CandidatesByStatus,
      activeContainer: Statuses,
      activeIndex: number,
      overContainer: Statuses,
      overIndex: number,
      item: Candidate
    ) => {
      if (!items[activeContainer] || !items[overContainer]) return items

      // Check if element already exists in another container
      if (findContainer(item.id) !== activeContainer) {
        console.warn(`The item ${item.id} already exists elsewhere and will not be added.`)
        return items
      }

      const prevPosition = items[overContainer][overIndex - 1]?.position || 0
      const nextPosition = items[overContainer][overIndex]?.position || 0
      const newPosition = calculateNewPosition(prevPosition, nextPosition, magicNumber)

      // Check for duplicates before updating
      if (items[overContainer].some(c => c.id === item.id)) {
        console.warn(`Duplicate detected for item ${item.id} in column ${overContainer}.`)
        return items
      }

      return {
        ...items,
        [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
        [overContainer]: insertAtIndex(items[overContainer], overIndex, {
          ...item,
          position: newPosition,
        }),
      }
    },
    [findContainer]
  )

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { over, active } = event
      const activeId = active?.id as number
      const overId = over?.id as number | Statuses

      if (!overId) return

      const activeContainer = findContainer(activeId) as Statuses
      const overContainer = findContainer(overId) as Statuses

      const currentMousePosition = { x: event.delta.x, y: event.delta.y }
      if (
        lastMousePosition.current &&
        Math.abs(lastMousePosition.current.x - currentMousePosition.x) < MOVEMENT_THRESHOLD &&
        Math.abs(lastMousePosition.current.y - currentMousePosition.y) < MOVEMENT_THRESHOLD
      ) {
        return // Prevents updates if movement is too small
      }

      lastMousePosition.current = currentMousePosition

      if (!activeContainer || !overContainer || activeContainer === overContainer) return

      setSortedCandidates(prev => {
        const candidate = findItem(activeId)

        if (!prev[activeContainer] || !prev[overContainer] || !candidate) return prev

        const activeIndex = active.data.current?.sortable.index
        const overIndex = over?.data.current?.sortable.index || 0

        const alreadyMoved =
          prev[activeContainer] &&
          prev[overContainer] &&
          prev[overContainer].some(c => c.id === activeId)

        if (alreadyMoved) {
          return prev // Avoids a looping update
        }

        const candidateUpdatedStatus = { ...candidate, status: overContainer }

        return moveBetweenContainers(
          prev,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          candidateUpdatedStatus
        )
      })
    },
    [findContainer, findItem, moveBetweenContainers]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      const activeId = active?.id as number
      const overId = over?.id as number

      // If no movement has been made, we stop here
      if (!over || !overId) return
      const activeContainer = active.data.current?.sortable.containerId as Statuses
      const overContainer = over.data.current?.sortable.containerId as Statuses
      const activeIndex = active.data.current?.sortable.index
      const overIndex = over.data.current?.sortable.index || 0

      const candidate = findItem(activeId)
      if (!candidate) return

      setSortedCandidates(prev => {
        if (!prev[activeContainer] || !prev[overContainer]) return prev

        let updatedCandidates = prev

        if (activeContainer === overContainer) {
          // Reorder the column using arrayMove
          const updatedColumn = arrayMove(prev[overContainer], activeIndex, overIndex)

          // Calculate new position
          const prevPosition = updatedColumn[overIndex - 1]?.position ?? 0
          const nextPosition = updatedColumn[overIndex + 1]?.position ?? 0
          const newPosition = calculateNewPosition(prevPosition, nextPosition, magicNumber)

          updatedColumn[overIndex] = { ...updatedColumn[overIndex], position: newPosition }

          updatedCandidates = { ...prev, [overContainer]: updatedColumn }
        } else {
          // Move between containers
          updatedCandidates = moveBetweenContainers(
            prev,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            candidate
          )
        }
        mutate({ ...candidate })
        return updatedCandidates
      })
    },
    [findItem, moveBetweenContainers, mutate]
  )

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
          <DragAndDropProvider handleDragMove={handleDragMove} handleDragEnd={handleDragEnd}>
            <Box p={20}>
              <Flex gap={10}>
                {Object.keys(sortedCandidates).map(c => (
                  <Column id={c} key={c} items={sortedCandidates[c as Statuses] || []} />
                ))}
              </Flex>
            </Box>
          </DragAndDropProvider>
        </Box>
      )}
    </>
  )
}

export default JobShow
