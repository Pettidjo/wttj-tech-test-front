import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getJobs,
  getJob,
  getCandidates,
  updateCandidate,
  Job,
  Candidate,
  CandidatesByStatus,
} from './index'

describe('API functions', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getJobs', () => {
    it('should fetch and return jobs', async () => {
      const mockJobs: Job[] = [{ id: '1', name: 'Job 1' }]
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ data: mockJobs }),
      })

      const jobs = await getJobs()
      expect(jobs).toEqual(mockJobs)
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/jobs')
    })
  })

  describe('getJob', () => {
    it('should fetch and return a job by ID', async () => {
      const mockJob: Job = { id: '1', name: 'Job 1' }
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ data: mockJob }),
      })

      const job = await getJob('1')
      expect(job).toEqual(mockJob)
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/jobs/1')
    })

    it('should return null if no jobId is provided', async () => {
      const job = await getJob()
      expect(job).toBeNull()
    })
  })

  describe('getCandidates', () => {
    it('should fetch and return candidates by job ID', async () => {
      const mockCandidates: CandidatesByStatus = {
        new: [{ id: 1, email: 'test@test.com', status: 'new', position: 1 }],
      }
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ data: mockCandidates }),
      })

      const candidates = await getCandidates('1')
      expect(candidates).toEqual(mockCandidates)
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/jobs/1/candidates')
    })

    it('should return an empty object if no jobId is provided', async () => {
      const candidates = await getCandidates()
      expect(candidates).toEqual({})
    })
  })

  describe('updateCandidate', () => {
    it('should update a candidate and return the response', async () => {
      const mockCandidate: Candidate = { id: 1, email: 'test@test.com', status: 'new', position: 1 }
      const mockResponse = { success: true }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const response = await updateCandidate(mockCandidate, '1')
      expect(response).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/jobs/1/candidates/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate: mockCandidate }),
        })
      )
    })

    it('should throw an error if the response is not ok', async () => {
      const mockCandidate: Candidate = { id: 1, email: 'test@test.com', status: 'new', position: 1 }
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      await expect(updateCandidate(mockCandidate, '1')).rejects.toThrow(
        'An error occurred while updating the candidate'
      )
    })
  })
})
