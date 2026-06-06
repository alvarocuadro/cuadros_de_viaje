import { useMemo } from 'react'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import {
  searchAirlines,
  searchAirports,
  type AviationSuggestion,
} from '@/services/aviationSearch'

interface AviationAutocompleteProps {
  kind: 'airline' | 'airport'
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
}

export function AviationAutocomplete({
  kind,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
}: AviationAutocompleteProps) {
  const options = useMemo(
    () => (kind === 'airline' ? searchAirlines(value) : searchAirports(value)),
    [kind, value],
  )

  return (
    <Autocomplete<AviationSuggestion, false, false, true>
      freeSolo
      fullWidth
      disabled={disabled}
      options={options}
      value={null}
      inputValue={value}
      filterOptions={(availableOptions) => availableOptions}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      isOptionEqualToValue={(option, selectedOption) => option.id === selectedOption.id}
      onInputChange={(_, newValue, reason) => {
        if (reason !== 'reset') onChange(newValue)
      }}
      onChange={(_, newValue) => {
        if (newValue) onChange(typeof newValue === 'string' ? newValue : newValue.value)
      }}
      noOptionsText="Sin sugerencias. Podés ingresar texto libre."
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {option.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.detail}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
