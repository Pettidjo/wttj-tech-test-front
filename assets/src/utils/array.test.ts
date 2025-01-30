import { describe, it, expect } from 'vitest'
import { removeAtIndex, insertAtIndex, arrayMove } from './array'
import { Candidate } from '../api'

describe('array utilities', () => {
  const candidates: Candidate[] = [
    {
      id: 1,
      position: 12,
      status: 'new',
      email: 'user1@wttj.co',
    },
    {
      id: 2,
      position: 20,
      status: 'new',
      email: 'user2@wttj.co',
    },
    {
      id: 3,
      position: 40,
      status: 'new',
      email: 'user3@wttj.co',
    },
  ]

  describe('removeAtIndex', () => {
    it('should remove an item at the specified index', () => {
      const result = removeAtIndex(candidates, 1)
      expect(result).toEqual([
        {
          id: 1,
          position: 12,
          status: 'new',
          email: 'user1@wttj.co',
        },
        {
          id: 3,
          position: 40,
          status: 'new',
          email: 'user3@wttj.co',
        },
      ])
    })

    it('should return the same array if index is out of bounds', () => {
      const result = removeAtIndex(candidates, 5)
      expect(result).toEqual(candidates)
    })
  })

  describe('insertAtIndex', () => {
    it('should insert an item at the specified index', () => {
      const newCandidate: Candidate = {
        id: 4,
        position: 52,
        status: 'new',
        email: 'user4@wttj.co',
      }
      const result = insertAtIndex(candidates, 1, newCandidate)
      expect(result).toEqual([
        {
          id: 1,
          position: 12,
          status: 'new',
          email: 'user1@wttj.co',
        },
        {
          id: 4,
          position: 52,
          status: 'new',
          email: 'user4@wttj.co',
        },
        {
          id: 2,
          position: 20,
          status: 'new',
          email: 'user2@wttj.co',
        },
        {
          id: 3,
          position: 40,
          status: 'new',
          email: 'user3@wttj.co',
        },
      ])
    })

    it('should insert an item at the end if index is out of bounds', () => {
      const newCandidate: Candidate = {
        id: 4,
        position: 52,
        status: 'new',
        email: 'user4@wttj.co',
      }
      const result = insertAtIndex(candidates, 5, newCandidate)
      expect(result).toEqual([
        {
          id: 1,
          position: 12,
          status: 'new',
          email: 'user1@wttj.co',
        },
        {
          id: 2,
          position: 20,
          status: 'new',
          email: 'user2@wttj.co',
        },
        {
          id: 3,
          position: 40,
          status: 'new',
          email: 'user3@wttj.co',
        },
        {
          id: 4,
          position: 52,
          status: 'new',
          email: 'user4@wttj.co',
        },
      ])
    })
  })

  describe('arrayMove', () => {
    it('should move an item from oldIndex to newIndex', () => {
      const result = arrayMove(candidates, 0, 2)
      expect(result).toEqual([
        {
          id: 2,
          position: 20,
          status: 'new',
          email: 'user2@wttj.co',
        },
        {
          id: 3,
          position: 40,
          status: 'new',
          email: 'user3@wttj.co',
        },
        {
          id: 1,
          position: 12,
          status: 'new',
          email: 'user1@wttj.co',
        },
      ])
    })
  })
})
