import { useMemo, useState } from 'react'
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  Typography,
} from '@mui/material'
import {
  CalendarMonth as CalendarMonthIcon,
  Clear as ClearIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import dayjs, { Dayjs } from 'dayjs'
import { Input } from './Input'

interface DateInputProps {
  label: string
  value: string
  min: string
  max: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  fullWidth?: boolean
}

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const MONTH_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  month: 'long',
  year: 'numeric',
})
const DATE_FORMATTER = new Intl.DateTimeFormat('es-AR')

function clampMonth(date: Dayjs, minDate: Dayjs, maxDate: Dayjs) {
  if (date.isBefore(minDate, 'month')) return minDate.startOf('month')
  if (date.isAfter(maxDate, 'month')) return maxDate.startOf('month')
  return date.startOf('month')
}

export function DateInput({
  label,
  value,
  min,
  max,
  onChange,
  error,
  helperText,
  disabled,
  fullWidth,
}: DateInputProps) {
  const minDate = useMemo(() => dayjs(min).startOf('day'), [min])
  const maxDate = useMemo(() => dayjs(max).startOf('day'), [max])
  const selectedDate = value ? dayjs(value).startOf('day') : null
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [visibleMonth, setVisibleMonth] = useState(() =>
    clampMonth(selectedDate || minDate, minDate, maxDate),
  )

  const calendarDays = useMemo(() => {
    const firstDay = visibleMonth.startOf('month')
    const gridStart = firstDay.subtract(firstDay.day(), 'day')
    return Array.from({ length: 42 }, (_, index) => gridStart.add(index, 'day'))
  }, [visibleMonth])

  const openCalendar = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return
    setVisibleMonth(clampMonth(selectedDate || minDate, minDate, maxDate))
    setAnchorEl(event.currentTarget)
  }

  const selectDate = (date: Dayjs) => {
    onChange(date.format('YYYY-MM-DD'))
    setAnchorEl(null)
  }

  const canGoPrevious = visibleMonth.isAfter(minDate, 'month')
  const canGoNext = visibleMonth.isBefore(maxDate, 'month')

  return (
    <>
      <Input
        label={label}
        value={selectedDate ? DATE_FORMATTER.format(selectedDate.toDate()) : ''}
        onClick={openCalendar}
        error={error}
        helperText={helperText}
        disabled={disabled}
        fullWidth={fullWidth}
        inputProps={{ readOnly: true, 'aria-label': label }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  aria-label={`Borrar ${label.toLowerCase()}`}
                  edge="end"
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation()
                    onChange('')
                  }}
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                aria-label={`Abrir calendario de ${label.toLowerCase()}`}
                edge="end"
                disabled={disabled}
                onClick={openCalendar}
              >
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ cursor: disabled ? 'default' : 'pointer' }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2,
              width: 320,
              borderRadius: 3,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <IconButton
            aria-label="Mes anterior"
            disabled={!canGoPrevious}
            onClick={() => setVisibleMonth((month) => month.subtract(1, 'month'))}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 600, textTransform: 'lowercase' }}>
            {MONTH_FORMATTER.format(visibleMonth.toDate()).toLocaleLowerCase('es-AR')}
          </Typography>
          <IconButton
            aria-label="Mes siguiente"
            disabled={!canGoNext}
            onClick={() => setVisibleMonth((month) => month.add(1, 'month'))}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            textAlign: 'center',
          }}
        >
          {WEEKDAYS.map((weekday, index) => (
            <Typography
              key={`${weekday}-${index}`}
              aria-hidden="true"
              sx={{ py: 0.75, color: 'text.secondary', fontSize: 12, fontWeight: 600 }}
            >
              {weekday}
            </Typography>
          ))}

          {calendarDays.map((date) => {
            const isOutsideMonth = !date.isSame(visibleMonth, 'month')
            const isOutsideRange = date.isBefore(minDate, 'day') || date.isAfter(maxDate, 'day')
            const isSelected = selectedDate?.isSame(date, 'day') || false

            return (
              <IconButton
                key={date.format('YYYY-MM-DD')}
                aria-label={DATE_FORMATTER.format(date.toDate())}
                disabled={isOutsideMonth || isOutsideRange}
                onClick={() => selectDate(date)}
                sx={{
                  width: 36,
                  height: 36,
                  mx: 'auto',
                  fontSize: 13,
                  ...(isSelected && {
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }),
                  ...(isOutsideMonth && { visibility: 'hidden' }),
                }}
              >
                {date.date()}
              </IconButton>
            )
          })}
        </Box>
      </Popover>
    </>
  )
}
