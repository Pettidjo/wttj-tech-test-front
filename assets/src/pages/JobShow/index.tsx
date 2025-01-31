import { useEffect, useCallback, useState } from 'react'
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

const magicNumber: number = 16384

const initialObject: CandidatesByStatus = {
  new: [],
  interview: [],
  hired: [],
  rejected: [],
}

function JobShow() {
  const { jobId } = useParams()

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

  const findContainer = useCallback((id: Statuses | number, candidates: CandidatesByStatus) => {
    if (id in candidates) return id

    const container = Object.keys(candidates).find(key =>
      candidates[key as keyof CandidatesByStatus]?.some((item: Candidate) => item.id === id)
    )

    return container || null
  }, [])

  const findItem = useCallback((id: number, candidates: CandidatesByStatus) => {
    return Object.values(candidates)
      .flatMap(a => a)
      .find(c => c.id === id)
  }, [])

  const calculateNewPosition = useCallback(
    (prevPosition: number, nextPosition: number, magicNumber: number): number => {
      if (prevPosition === nextPosition) {
        return magicNumber
      } else if (prevPosition !== 0 && nextPosition === 0) {
        return prevPosition + magicNumber
      } else {
        return (prevPosition + nextPosition) / 2
      }
    },
    []
  )

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
      const itemExistsInOtherContainer = Object.keys(items).some(
        key =>
          key !== activeContainer &&
          items[key as keyof CandidatesByStatus]?.some(c => c.id === item.id)
      )

      if (itemExistsInOtherContainer) {
        const containerWithDuplicate = Object.keys(items).find(key =>
          items[key as keyof CandidatesByStatus]?.some(c => c.id === item.id)
        ) as Statuses

        if (containerWithDuplicate) {
          items[containerWithDuplicate] = items[containerWithDuplicate]?.filter(
            c => c.id !== item.id
          )
        }
        return items
      }

      const prevPosition = items[overContainer][overIndex - 1]?.position || 0
      const nextPosition = items[overContainer][overIndex]?.position || 0
      const newPosition = calculateNewPosition(prevPosition, nextPosition, magicNumber)

      return {
        ...items,
        [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
        [overContainer]: insertAtIndex(items[overContainer], overIndex, {
          ...item,
          position: newPosition,
        }),
      }
    },
    [calculateNewPosition]
  )

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event
    const activeId = active?.id as number
    const overId = over?.id as number | Statuses

    if (!overId) return

    const activeContainer = findContainer(activeId, sortedCandidates) as Statuses
    const overContainer = findContainer(overId, sortedCandidates) as Statuses

    if (!activeContainer || !overContainer || activeContainer === overContainer) return

    setSortedCandidates(prev => {
      const candidate = findItem(activeId, sortedCandidates)

      if (!prev[activeContainer] || !prev[overContainer] || !candidate) return prev

      const activeIndex = active.data.current?.sortable?.index ?? -1
      const overIndex = over?.data.current?.sortable?.index ?? -1

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
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activeId = active?.id as number
    const overId = over?.id as number

    // If no movement has been made, we stop here
    if (!over || !overId) return
    const activeContainer = active.data.current?.sortable.containerId as Statuses
    const overContainer = over.data.current?.sortable.containerId as Statuses
    const activeIndex = active.data.current?.sortable?.index ?? -1
    const overIndex = over.data.current?.sortable?.index ?? -1

    if (activeIndex === -1 || overIndex === -1) return

    const candidate = findItem(activeId, sortedCandidates)
    if (!candidate) return

    setSortedCandidates(prev => {
      if (!prev[activeContainer] || !prev[overContainer]) return prev

      let updatedCandidates = { ...prev }

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

      // Update the candidate's position before mutation
      const updatedCandidate = {
        ...candidate,
        position: updatedCandidates[overContainer]?.[overIndex]?.position ?? candidate.position,
      }
      mutate(updatedCandidate)

      return updatedCandidates
    })
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
