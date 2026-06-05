import { Box, Skeleton, Card, CardContent } from '@mui/material'

export function TripCardSkeleton() {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width={100} height={24} />
        </Box>
      </CardContent>
    </Card>
  )
}

export function TripDetailSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="50%" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" sx={{ mb: 3 }} />
      {[1, 2, 3].map((i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={60} />
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export function FormSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" height={56} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width="100%" height={48} />
        <Skeleton variant="rectangular" width="100%" height={48} />
      </Box>
    </Box>
  )
}
