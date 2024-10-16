import { useContext, useState } from "react";
import { Autocomplete, Box, Breadcrumbs, Button, FormControl, IconButton, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useReports } from "../../hooks/useReports";

import { ModalComponent } from "../common/ModalComponent";
import { DetailsTables } from "./DetailsTables";

export function HoursAmount({ setShow }) {

    const { state } = useContext(DataContext);

    const { getHoursAmountRows, hoursAmountRows, printHoursAmount, loading, open, setOpen } = useReports();
    const {
        formData: hoursAmountData,
        handleChange: hoursAmountChange,
        validate: hoursAmountValidate,
        disabled: hoursAmountDisabled,
        setDisabled: setHoursAmountDisabled
    } = useForm({
        defaultData: {
            site: '',
            worker: '',
            from: new Date(Date.now()),
            to: new Date(Date.now())
        },
        rules: {}
    });

    const [workOn, setWorkOn] = useState(null)

    const handleClose = () => {
        setOpen(null)
        setWorkOn(null)
    }

    return (
        <>
            <Box sx={{ margin: 1 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setShow(null)}>
                        Volver a reportes
                    </Link>
                    <Typography color="text.primary">Cálculo de horas</Typography>
                </Breadcrumbs>
                <Typography variant="h5" marginBottom={1}>Cálculo de horas</Typography>
                <Box sx={{ p: 1, borderRadius: 1, border: '1px solid #000', width: 'fit-content', mb: 2 }}>
                    <Typography variant="body1" marginBottom={1}>Valores de cálculo por defecto</Typography>
                    <Typography variant="body2" marginBottom={1}>- Entrada: 8hs</Typography>
                    <Typography variant="body2" marginBottom={1}>- Salida: 18hs (sábados 13hs)</Typography>
                    <Typography variant="body2" marginBottom={1}>- No se incluye la hora de almuerzo</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'space-between' }
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                        width: { xs: '100%', md: '80%', lg: '60%' }
                    }}>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <Autocomplete
                                disablePortal
                                id="site-autocomplete"
                                options={state.sites.map(s => ({ label: s.name, name: s.name }))}
                                noOptionsText="No hay obras disponibles."
                                onChange={(_, value) => hoursAmountChange({ target: { name: 'site', value: value?.name ?? '' } })}
                                renderInput={(params) => <TextField {...params} label="Obra" />}
                                value={hoursAmountData.site?.toString().length > 0 ? state.sites.find(s => s.name === hoursAmountData.site).name : ''}
                                isOptionEqualToValue={(option, value) => value.length === 0 || option.name === value}
                            />
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <Autocomplete
                                disablePortal
                                id="worker-autocomplete"
                                options={state.workers.map(w => ({ label: `${w.last_name} ${w.first_name}`, id: w.id }))}
                                noOptionsText="No hay operarios disponibles."
                                onChange={(_, value) => hoursAmountChange({ target: { name: 'worker', value: value?.id || '' } })}
                                renderInput={(params) => <TextField {...params} label="Operario" />}
                                value={hoursAmountData.worker.toString().length > 0 ? `${state.workers.find(w => w.id === parseInt(hoursAmountData.worker)).last_name} ${state.workers.find(w => w.id === parseInt(hoursAmountData.worker)).first_name}` : ''}
                                isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                            />
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Desde"
                                    value={new Date(hoursAmountData.from)}
                                    name="from"
                                    onChange={value => hoursAmountChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Hasta"
                                    value={new Date(hoursAmountData.to)}
                                    name="to"
                                    onChange={value => hoursAmountChange({ target: { name: 'to', value: new Date(value.toISOString()) } })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={hoursAmountDisabled || (hoursAmountData.site?.length === 0 && hoursAmountData.worker?.toString().length === 0)}
                            sx={{ marginBottom: 1 }}
                            onClick={() => getHoursAmountRows(hoursAmountData, hoursAmountValidate, setHoursAmountDisabled)}
                        >
                            Calcular
                        </Button>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 1,
                        justifyContent: 'end',
                        marginBottom: { xs: 1, md: 0 }
                    }}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ width: { xs: '50%', sm: 'auto' } }}
                            disabled={hoursAmountRows.length === 0}
                            onClick={() => printHoursAmount('PDF', hoursAmountValidate, hoursAmountData)}
                        >
                            PDF
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ width: { xs: '50%', sm: 'auto' } }}
                            disabled={hoursAmountRows.length === 0}
                            onClick={() => printHoursAmount('EXCEL', hoursAmountValidate, hoursAmountData)}
                        >
                            Excel
                        </Button>
                    </Box>
                </Box>
                <MainTable
                    hoursAmountRows={hoursAmountRows}
                    loading={loading}
                    setWorkOn={setWorkOn}
                    setOpen={setOpen}
                />
                <ModalComponent open={open === 'VIEW'} onClose={handleClose}>
                    <DetailsTables workOn={workOn} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ width: '20%', margin: '0 auto' }}
                            onClick={handleClose}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </ModalComponent>
            </Box>
        </>
    );
}

function MainTable({ hoursAmountRows, loading, setWorkOn, setOpen }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Operario</TableCell>
                        <TableCell align="center">DNI</TableCell>
                        <TableCell align="center">CUIL</TableCell>
                        <TableCell align="center">Horas</TableCell>
                        <TableCell align="center">Observaciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hoursAmountRows.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <>
                                    {loading ?
                                        <LinearProgress /> :
                                        <>{'No hay registros para mostrar.'}</>
                                    }
                                </>
                            </TableCell>
                        </TableRow> :
                        hoursAmountRows.map(har => {
                            const color = har.observations.length > 0 ? 'red' : '';
                            return (
                                <TableRow key={har.id}>
                                    <TableCell align="center" sx={{ p: 0 }}>
                                        <Tooltip title="Detalles" onClick={() => {
                                            setWorkOn(har)
                                            setOpen("VIEW")
                                        }}>
                                            <IconButton sx={{ p: 0 }}>
                                                <SearchSharpIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {har.worker}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {har.dni}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {har.cuil}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {har.hours}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        <Typography whiteSpace="pre-wrap">
                                            {har.observations}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}