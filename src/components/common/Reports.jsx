import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useReports } from "../../hooks/useReports";

export function Reports() {

    const { state } = useContext(DataContext)

    const { getSiteStatusRows, siteStatusRows, printSiteStatus } = useReports()
    const {
        formData: siteStatusData,
        errors: siteStatusErrors,
        handleChange: siteStatusChange,
        validate: siteStatusValidate,
        disabled: siteStatusDisabled,
        setDisabled: setSiteStatusDisabled
    } = useForm({
        defaultData: { site: '', from: new Date(Date.now()), to: new Date(Date.now()) },
        rules: { site: { required: true } }
    })

    return (
        <>
            <Box sx={{ margin: 1 }}>
                <Typography variant="h5" marginBottom={1}>Estado de obra</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <FormControl sx={{ width: '30%' }}>
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
                        <FormControl sx={{ width: '30%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Desde"
                                    value={new Date(siteStatusData.from)}
                                    name="from"
                                    onChange={value => siteStatusChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: '30%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Hasta"
                                    value={new Date(siteStatusData.to)}
                                    name="to"
                                    onChange={value => siteStatusChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={siteStatusDisabled}
                            onClick={() => getSiteStatusRows(siteStatusData, siteStatusValidate, setSiteStatusDisabled)}
                        >
                            Calcular
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, justifyContent: 'end' }}>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={siteStatusRows.length === 0}
                            onClick={() => printSiteStatus('PDF', siteStatusValidate, siteStatusData)}
                        >
                            PDF
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={siteStatusRows.length === 0}
                            onClick={() => printSiteStatus('EXCEL', siteStatusValidate, siteStatusData)}
                        >
                            Excel
                        </Button>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Operario</TableCell>
                                <TableCell align="center">DNI</TableCell>
                                <TableCell align="center">CUIL</TableCell>
                                <TableCell align="center">Horas</TableCell>
                                <TableCell align="center">Observaciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {siteStatusRows.length === 0 ?
                                <TableCell colSpan={5} align="center">No hay registros para mostrar.</TableCell> :
                                siteStatusRows.map(ssr => {
                                    const color = ssr.observations.length > 0 ? 'red' : '';
                                    return (
                                        <TableRow key={ssr.id}>
                                            <TableCell align="center" sx={{ color }}>
                                                {ssr.worker}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color }}>
                                                {ssr.dni}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color }}>
                                                {ssr.cuil}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color }}>
                                                {ssr.hours}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color }}>
                                                {ssr.observations}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}