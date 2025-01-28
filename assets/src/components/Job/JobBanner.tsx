import { Text } from '@welcome-ui/text'
import { Box } from '@welcome-ui/box'

export default function JobBanner({ jobName }: { jobName: string | undefined }) {
  return (
    <Box backgroundColor="neutral-70" p={20} alignItems="center">
      <Text variant="h5" color="white" m={0}>
        {jobName}
      </Text>
    </Box>
  )
}
