import { useEffect, useState } from 'react'
import { Autocomplete, Box, CircularProgress, Typography } from '@mui/material'
import { Input } from '@/components/ui'
import { searchLocations, type LocationSuggestion } from '@/services/locationService'

interface DestinationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAdd: (value: string) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
}

export function DestinationAutocomplete({
  value,
  onChange,
  onAdd,
  disabled = false,
  error = false,
  helperText,
}: DestinationAutocompleteProps) {
  const [options, setOptions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const query = value.trim()

    if (query.length < 3) {
      setOptions([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)

      try {
        setOptions(await searchLocations(query, controller.signal))
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) {
          setOptions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 350)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [value])

  return (
    <Autocomplete<LocationSuggestion, false, false, true>
      freeSolo
      fullWidth
      disabled={disabled}
      options={options}
      value={null}
      inputValue={value}
      loading={loading}
      filterOptions={(availableOptions) => availableOptions}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      isOptionEqualToValue={(option, selectedOption) => option.id === selectedOption.id}
      onInputChange={(_, newValue, reason) => {
        if (reason !== 'reset') {
          onChange(newValue)
        }
      }}
      onChange={(_, newValue) => {
        if (newValue) {
          onAdd(typeof newValue === 'string' ? newValue : newValue.label)
        }
      }}
      loadingText="Buscando ubicaciones..."
      noOptionsText="Sin sugerencias. Podés agregar el texto ingresado."
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {option.label}
            </Typography>
            {option.detail && (
              <Typography variant="caption" color="text.secondary">
                {option.detail}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <Input
          {...params}
          label="Destinos"
          placeholder="P. ej. París, Madrid"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
