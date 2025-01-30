import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCandidates, getJob, getJobs, updateCandidate } from '../api'
import { Candidate } from '../api'

export const useJobs = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  })

  return { isLoading, error, jobs: data }
}

export const useJob = (jobId?: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  })

  return { isLoading, error, job: data }
}

export const useCandidates = (jobId?: string) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: () => getCandidates(jobId),
    refetchOnWindowFocus: true,
    enabled: !!jobId,
  })

  return { isLoading, error, candidates: data, isFetching }
}

export const useUpdateCandidate = (jobId?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (candidate: Candidate) => updateCandidate(candidate, jobId),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
    },
  })

  return mutation
}
