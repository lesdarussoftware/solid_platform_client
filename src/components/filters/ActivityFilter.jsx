import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";

export function ActivityFilter({ filter, setFilter }) {

    const { state } = useContext(DataContext)

    return (
        <Box sx={{
            width: { xs: '100%', lg: '50%' },
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            alignItems: 'start',
            flexWrap: 'wrap'
        }}>
            <FormControl sx={{ width: { xs: '100%', sm: '43%' } }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                        label="Fecha"
                        value={filter.date.length === 0 ? new Date(Date.now()) : new Date(filter.date)}
                        onChange={value => setFilter({ ...filter, date: new Date(value.toISOString()) })}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: { xs: '100%', sm: '43%' } }}>
                <Autocomplete
                    disablePortal
                    id="worker-autocomplete"
                    options={state.workers.map(w => `${w.last_name} ${w.first_name}`)}
                    noOptionsText="No hay operarios disponibles."
                    onChange={(_, value) => setFilter({ ...filter, worker: value ?? '' })}
                    renderInput={(params) => <TextField {...params} label="Operario" />}
                    value={filter.worker}
                    isOptionEqualToValue={(option, value) => value.length === 0 || option === value}
                />
            </FormControl>
            <Button
                type="button"
                variant="outlined"
                sx={{ width: { xs: '100%', sm: '10%' } }}
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