export type Job = {
  id: string
  name: string
}

export type Candidate = {
  id: number
  email: string
  status: 'new' | 'interview' | 'hired' | 'rejected'
  position: number
}

export type CandidatesByStatus = {
  new?: Candidate[]
  interview?: Candidate[]
  hired?: Candidate[]
  rejected?: Candidate[]
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await fetch(`http://localhost:4000/api/jobs`)
  const { data } = await response.json()
  return data
}

export const getJob = async (jobId?: string): Promise<Job | null> => {
  if (!jobId) return null
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`)
  const { data } = await response.json()
  return data
}

export const getCandidates = async (jobId?: string): Promise<CandidatesByStatus> => {
  if (!jobId) return {}
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}/candidates`)
  const { data } = await response.json()
  return data
}

export const updateCandidate = async (candidate: Candidate, jobId?: string): Promise<Response> => {
  const candidateBody = {
    candidate: candidate,
  }

  const response = await fetch(
    `http://localhost:4000/api/jobs/${jobId}/candidates/${candidate.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateBody),
    }
  )

  if (!response.ok) {
    const error = new Error('An error occurred while updating the candidate')
    throw error
  }

  return response.json()
}
