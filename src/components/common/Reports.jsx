import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { AuthContext } from "../../providers/AuthProvider";
import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";

import { REPORT_URL } from "../../helpers/urls";

export function Reports() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        formData: siteStatusData,
        errors: siteStatusErrors,
        handleChange: siteStatusChange,
        validate: siteStatusValidate
    } = useForm({
        defaultData: { site: '', date: new Date(Date.now()) },
        rules: { site: { required: true } }
    })

    const siteStatusSubmit = (e, type) => {
        e.preventDefault()
        if (siteStatusValidate()) {
            if (type === 'PDF') {
                window.open(`${REPORT_URL}/estado-obra-pdf/${auth?.refresh_token}/${siteStatusData.site}/${siteStatusData.date.toISOString()}`, '_blank')
            }
            if (type === 'EXCEL') {
                window.open(`${REPORT_URL}/estado-obra-excel/${auth?.refresh_token}/${siteStatusData.site}/${siteStatusData.date.toISOString()}`, '_blank')
            }
        }
    }

    return (
        <Box>
            <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                <Typography variant="h5" marginBottom={2}>Estado de obra</Typography>
                <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                    <Autocomplete
                        disablePortal
                        id="site-autocomplete"
                        options={state.sites.map(s => ({ label: s.name, name: s.name }))}
                        noOptionsText="No hay obras disponibles."
                        onChange={(_, value) => siteStatusChange({ target: { name: 'site', value: value.name } })}
                        renderInput={(params) => <TextField {...params} label="Obra" />}
                        value={siteStatusData.site.toString().length > 0 ? state.sites.find(s => s.name === siteStatusData.site).name : ''}
                        isOptionEqualToValue={(option, value) => value.length === 0 || option.name === value}
                    />
                    {siteStatusErrors.site?.type === 'required' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * La obra es requerida.
                        </Typography>
                    }
                </FormControl>
                <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha"
                            value={new Date(siteStatusData.date)}
                            name="date"
                            onChange={value => siteStatusChange({ target: { name: 'date', value: new Date(value.toISOString()) } })}
                        />
                    </LocalizationProvider>
                </FormControl>
                <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ width: { xs: '100%', sm: '20%' } }}
                        onClick={e => siteStatusSubmit(e, 'PDF')}
                    >
                        PDF
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ width: { xs: '100%', sm: '20%' } }}
                        onClick={e => siteStatusSubmit(e, 'EXCEL')}
                    >
                        Excel
                    </Button>
                </Box>
            </Box>
        </Box >
    )
}