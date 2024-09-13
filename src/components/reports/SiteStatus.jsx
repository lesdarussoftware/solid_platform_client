import { useContext, useState } from "react";
import { Autocomplete, Box, Breadcrumbs, Button, FormControl, IconButton, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { format } from "date-fns";

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useReports } from "../../hooks/useReports";

import { ModalComponent } from "../common/ModalComponent";

export function SiteStatus({ setShow }) {

    const { state } = useContext(DataContext);

    const { getSiteStatusRows, siteStatusRows, printSiteStatus, loadingSiteStatus, open, setOpen } = useReports();
    const {
        formData: siteStatusData,
        handleChange: siteStatusChange,
        validate: siteStatusValidate,
        disabled: siteStatusDisabled,
        setDisabled: setSiteStatusDisabled
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

    const handelClose = () => {
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
                    <Typography color="text.primary">Estado de obra</Typography>
                </Breadcrumbs>
                <Typography variant="h5" marginBottom={1}>Estado de obra</Typography>
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
                                onChange={(_, value) => siteStatusChange({ target: { name: 'site', value: value?.name ?? '' } })}
                                renderInput={(params) => <TextField {...params} label="Obra" />}
                                value={siteStatusData.site?.toString().length > 0 ? state.sites.find(s => s.name === siteStatusData.site).name : ''}
                                isOptionEqualToValue={(option, value) => value.length === 0 || option.name === value}
                            />
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <Autocomplete
                                disablePortal
                                id="worker-autocomplete"
                                options={state.workers.map(w => ({ label: `${w.last_name} ${w.first_name}`, id: w.id }))}
                                noOptionsText="No hay operarios disponibles."
                                onChange={(_, value) => siteStatusChange({ target: { name: 'worker', value: value?.id || '' } })}
                                renderInput={(params) => <TextField {...params} label="Operario" />}
                                value={siteStatusData.worker.toString().length > 0 ? `${state.workers.find(w => w.id === parseInt(siteStatusData.worker)).last_name} ${state.workers.find(w => w.id === parseInt(siteStatusData.worker)).first_name}` : ''}
                                isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                            />
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Desde"
                                    value={new Date(siteStatusData.from)}
                                    name="from"
                                    onChange={value => siteStatusChange({ target: { name: 'from', value: new Date(value.toISOString()) } })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
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
                            disabled={siteStatusDisabled || (siteStatusData.site?.length === 0 && siteStatusData.worker?.toString().length === 0)}
                            sx={{ marginBottom: 1 }}
                            onClick={() => getSiteStatusRows(siteStatusData, siteStatusValidate, setSiteStatusDisabled)}
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
                            disabled={siteStatusRows.length === 0}
                            onClick={() => printSiteStatus('PDF', siteStatusValidate, siteStatusData)}
                        >
                            PDF
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ width: { xs: '50%', sm: 'auto' } }}
                            disabled={siteStatusRows.length === 0}
                            onClick={() => printSiteStatus('EXCEL', siteStatusValidate, siteStatusData)}
                        >
                            Excel
                        </Button>
                    </Box>
                </Box>
                <MainTable
                    siteStatusRows={siteStatusRows}
                    loadingSiteStatus={loadingSiteStatus}
                    setWorkOn={setWorkOn}
                    setOpen={setOpen}
                />
                <ModalComponent open={open === 'VIEW'} onClose={handelClose}>
                    <DetailsTables workOn={workOn} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ width: '20%', margin: '0 auto' }}
                            onClick={handelClose}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </ModalComponent>
            </Box>
        </>
    );
}

function MainTable({ siteStatusRows, loadingSiteStatus, setWorkOn, setOpen }) {
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
                    {siteStatusRows.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <>
                                    {loadingSiteStatus ?
                                        <LinearProgress /> :
                                        <>{'No hay registros para mostrar.'}</>
                                    }
                                </>
                            </TableCell>
                        </TableRow> :
                        siteStatusRows.map(ssr => {
                            const color = ssr.observations.length > 0 ? 'red' : '';
                            return (
                                <TableRow key={ssr.id}>
                                    <TableCell align="center" sx={{ p: 0 }}>
                                        <Tooltip title="Detalles" onClick={() => {
                                            setWorkOn(ssr)
                                            setOpen("VIEW")
                                        }}>
                                            <IconButton sx={{ p: 0 }}>
                                                <SearchSharpIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
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
                                        <Typography whiteSpace="pre-wrap">
                                            {ssr.observations}
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

function DetailsTables({ workOn }) {
    return (
        <>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {workOn?.worker} - Ingresos / egresos
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                            <TableCell align="center">Fecha</TableCell>
                            <TableCell align="center">Creado por</TableCell>
                            <TableCell align="center">Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workOn?.movs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(mov => (
                            <TableRow key={mov.id}>
                                <TableCell align="center">{mov.id}</TableCell>
                                <TableCell align="center">{mov.type}</TableCell>
                                <TableCell align="center">{format(new Date(mov.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell align="center">{mov.created_by}</TableCell>
                                <TableCell align="center">{mov.observations}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                {workOn?.worker} - Horas extra
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Detalle</TableCell>
                            <TableCell align="center">Entrada</TableCell>
                            <TableCell align="center">Salida</TableCell>
                            <TableCell align="center">Horas</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workOn?.activities.sort((a, b) => b.id - a.id).map(act => (
                            <TableRow key={act.id}>
                                <TableCell align="center">{act.id}</TableCell>
                                <TableCell align="center">{act.description}</TableCell>
                                <TableCell align="center">{format(new Date(act.in_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell align="center">{format(new Date(act.out_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell align="center">{act.hours}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}