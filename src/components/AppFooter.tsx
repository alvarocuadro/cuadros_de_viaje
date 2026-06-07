import { GitHub as GitHubIcon } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'

const REPOSITORY_URL = 'https://github.com/alvarocuadro/cuadros_de_viaje'
const LICENSE_URL = `${REPOSITORY_URL}/blob/main/LICENSE`

export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: { xs: 2, sm: 3 },
        py: { xs: 2.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1.25, sm: 2 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography variant="caption" color="text.secondary">
            © {currentYear} Álvaro Cuadro · Uso exclusivo no comercial
          </Typography>
          <Link
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            underline="hover"
            color="text.secondary"
          >
            PolyForm Noncommercial 1.0.0
          </Link>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.25, sm: 2 },
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            href="https://www.geoapify.com/"
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            underline="hover"
            color="text.secondary"
          >
            Powered by Geoapify
          </Link>

          <Link
            href={REPOSITORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Clonar Cuadros de viaje desde GitHub"
            underline="hover"
            color="text.secondary"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <GitHubIcon sx={{ fontSize: 19 }} />
            Clonar desde GitHub
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
