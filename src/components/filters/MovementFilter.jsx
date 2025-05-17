import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";

export function MovementFilter({ filter, setFilter }) {

    const { state } = useContext(DataContext)

    return (
        <Box sx={{
            width: { xs: '100%', lg: '60%' },
            display: 'flex',
            justifyContent: 'space-between',
            gap: 0.1,
            alignItems: 'start',
            flexWrap: 'wrap'
        }}>
            <Box sx={{ width: { xs: '100%', sm: '30%' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Desde"
                            value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                            onChange={value => setFilter({ ...filter, from: new Date(value.toISOString()) })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Hasta"
                            value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                            onChange={value => setFilter({ ...filter, to: new Date(value.toISOString()) })}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '30%' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        id="worker-autocomplete"
                        options={state.workers.map(w => `${w.last_name} ${w.first_name} (${w.category.name})`)}
                        noOptionsText="No hay operarios disponibles."
                        onChange={(_, value) => setFilter({ ...filter, worker: value ?? '' })}
                        renderInput={(params) => <TextField {...params} label="Operario" />}
                        value={filter.worker}
                        isOptionEqualToValue={(option, value) => value.length === 0 || option === value}
                    />
                </FormControl>
                <FormControl sx={{ width: '100%' }}>
                    <Autocomplete
                        disablePortal
                        id="category-autocomplete"
                        options={state.categories.map(c => c.name)}
                        noOptionsText="No hay categorías disponibles."
                        onChange={(_, value) => setFilter({ ...filter, category: value ?? '' })}
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                        value={filter.category}
                        isOptionEqualToValue={(option, value) => value.length === 0 || option === value}
                    />
                </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '30%' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <InputLabel id="type-select">Evento</InputLabel>
                    <Select
                        labelId="type-select"
                        id="type"
                        value={filter.type}
                        label="Evento"
                        name="type"
                        onChange={e => setFilter({ ...filter, type: e.target.value })}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        <MenuItem value="INGRESO">INGRESO</MenuItem>
                        <MenuItem value="EGRESO">EGRESO</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        id="site-autocomplete"
                        options={state.sites.map(s => s.name)}
                        noOptionsText="No hay obras disponibles."
                        onChange={(_, value) => setFilter({ ...filter, site: value ?? '' })}
                        renderInput={(params) => <TextField {...params} label="Obra" />}
                        value={filter.site}
                        isOptionEqualToValue={(option, value) => value.length === 0 || option === value}
                    />
                </FormControl>
            </Box>
            <Button
                type="button"
                variant="outlined"
                sx={{ width: { xs: '100%', sm: '9%' } }}
                onClick={() => setFilter({
                    ...filter,
                    type: '',
                    from: '',
                    to: '',
                    worker: '',
                    site: '',
                    category: ''
                })}
            >
                Limpiar
            </Button>
        </Box>
    )
}