import { useEffect, useState } from 'react'
import { Autocomplete, Box, CircularProgress, Typography } from '@mui/material'
import { Input } from '@/components/ui'
import { searchAddresses, type LocationSuggestion } from '@/services/locationService'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
}

export function AddressAutocomplete({
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
}: AddressAutocompleteProps) {
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
        setOptions(await searchAddresses(query, controller.signal))
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
          onChange(typeof newValue === 'string' ? newValue : newValue.label)
        }
      }}
      loadingText="Buscando direcciones..."
      noOptionsText="Sin sugerencias. Podés ingresar la dirección manualmente."
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
          label="Dirección"
          placeholder="Ingresá calle, número y ciudad"
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
