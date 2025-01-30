import { arrayMove as dndKitArrayMove } from '@dnd-kit/sortable'
import { Candidate } from '../api'

export const removeAtIndex = (array: Candidate[], index: number) => {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

export const insertAtIndex = (array: Candidate[], index: number, item: Candidate) => {
  return [...array.slice(0, index), item, ...array.slice(index)]
}

export const arrayMove = (array: Candidate[], oldIndex: number, newIndex: number) => {
  return dndKitArrayMove(array, oldIndex, newIndex)
}
