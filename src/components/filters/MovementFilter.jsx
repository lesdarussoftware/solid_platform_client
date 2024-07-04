import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";

export function MovementFilter({ filter, setFilter }) {

    const { state } = useContext(DataContext)

    return (
        <Box sx={{ width: '60%', display: 'flex', justifyContent: 'start', gap: 0.5, paddingTop: 1, alignItems: 'start' }}>
            <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        id="worker-autocomplete"
                        options={state.workers.map(w => `${w.first_name} ${w.last_name}`)}
                        noOptionsText="No hay empleados disponibles."
                        onChange={(_, value) => setFilter({ ...filter, worker: value })}
                        renderInput={(params) => <TextField {...params} label="Empleado" />}
                        value={filter.worker}
                    />
                </FormControl>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        id="chief-autocomplete"
                        options={state.chiefs.map(c => `${c.first_name} ${c.last_name}`)}
                        noOptionsText="No hay capataces disponibles."
                        onChange={(_, value) => setFilter({ ...filter, chief: value })}
                        renderInput={(params) => <TextField {...params} label="Capataz" />}
                        value={filter.chief}
                    />
                </FormControl>
            </Box>
            <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                        onChange={(_, value) => setFilter({ ...filter, site: value })}
                        renderInput={(params) => <TextField {...params} label="Obra" />}
                        value={filter.site}
                    />
                </FormControl>
            </Box>
            <Button
                type="button"
                variant="outlined"
                sx={{ width: '15%' }}
                onClick={() => setFilter({
                    type: '',
                    from: new Date(Date.now()),
                    to: new Date(Date.now()),
                    chief: '',
                    worekr: '',
                    site: ''
                })}
            >
                Limpiar
            </Button>
        </Box>
    )
}