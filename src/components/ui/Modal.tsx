import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogProps, styled, Box } from '@mui/material'

interface ModalProps extends DialogProps {
  title?: string
  type?: 'sheet' | 'modal'
  icon?: React.ReactNode
  onClose: () => void
}

const StyledDialog = styled(Dialog)<{ type?: string }>(({ type }) => ({
  '& .MuiDialog-paper': {
    borderRadius: type === 'sheet' ? '20px 20px 0 0' : '20px',
    backgroundColor: 'var(--color-surface)',
    boxShadow: type === 'sheet' ? 'var(--shadow-sheet)' : 'var(--shadow-lg)',
    padding: type === 'sheet' ? '8px 16px 22px' : '22px 20px 18px',
  },

  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(14, 28, 40, 0.45)',
  },
}))

const Grip = styled(Box)({
  width: '38px',
  height: '4px',
  borderRadius: '999px',
  backgroundColor: 'var(--color-border-strong)',
  margin: '6px auto 14px',
})

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ title, type = 'modal', icon, onClose, children, ...props }, ref) => (
    <StyledDialog
      ref={ref}
      type={type}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(type === 'sheet' && {
            margin: 0,
            maxHeight: '92vh',
            width: '100%',
          }),
          ...(type === 'modal' && {
            maxWidth: '320px',
          }),
        },
      }}
      {...props}
    >
      {type === 'sheet' && <Grip />}

      {icon && (
        <Box
          sx={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            backgroundColor: 'var(--color-error-tint)',
            color: 'var(--color-error-strong)',
          }}
        >
          {icon}
        </Box>
      )}

      {title && (
        <DialogTitle
          sx={{
            fontSize: '19px',
            fontWeight: 700,
            color: 'var(--color-fg1)',
            letterSpacing: '-0.01em',
            marginBottom: '14px',
            padding: 0,
          }}
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
    </StyledDialog>
  ),
)

Modal.displayName = 'Modal'
