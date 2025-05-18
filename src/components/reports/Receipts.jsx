import { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, Breadcrumbs, Button, FormControl, IconButton, Select, InputLabel, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, MenuItem, Input, FormControlLabel, Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

import { DataContext } from "../../providers/DataProvider";
import { useReports } from "../../hooks/useReports";

import { ModalComponent } from "../common/ModalComponent";
import { DetailsTables } from "./DetailsTables";

export function Receipts({ setShow }) {

    const { state } = useContext(DataContext)

    const { getReceiptsRows, receipts, setReceipts, printReceipts, loading, open, setOpen } = useReports();
    const [formData, setFormData] = useState({
        month: new Date(Date.now()).getMonth(),
        year: new Date(Date.now()).getFullYear(),
        fortnight: 1,
        worker: '',
        site: '',
        concept: 'pago de honorarios',
        receipt_date: new Date(Date.now()),
        is_chief: false
    })

    const [workOn, setWorkOn] = useState(null)

    useEffect(() => {
        if (formData.is_chief) setFormData({ ...formData, worker: '', site: '' })
    }, [formData.is_chief])

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
                    <Typography color="text.primary">Recibos</Typography>
                </Breadcrumbs>
                <Typography variant="h5" marginBottom={1}>Recibos</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'space-between' },
                    alignItems: 'start'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                        width: { xs: '100%', md: '70%', lg: '50%' }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: { xs: '100%', md: '32%' } }}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        views={['year', 'month']}
                                        label="Mes y año"
                                        value={new Date(formData.year, formData.month)}
                                        name="month"
                                        onChange={value => setFormData({
                                            ...formData,
                                            month: new Date(value).getMonth(),
                                            year: new Date(value).getFullYear()
                                        })}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="fortnight-select">Quincena</InputLabel>
                                <Select
                                    labelId="fortnight-select"
                                    label="Quincena"
                                    id="fortnight-select"
                                    value={formData.fortnight}
                                    onChange={e => setFormData({ ...formData, fortnight: parseInt(e.target.value) })}
                                >
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: { xs: '100%', md: '32%' } }}>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    id="worker-autocomplete"
                                    disabled={formData.is_chief}
                                    options={state.workers
                                        .filter(w => !w.category.name.toLowerCase().includes('capataz'))
                                        .map(w => ({ label: `${w.last_name} ${w.first_name} (${w.category.name})`, id: w.id }))}
                                    noOptionsText="No hay operarios disponibles."
                                    onChange={(_, value) => setFormData({ ...formData, worker: value?.id || '' })}
                                    renderInput={(params) => <TextField {...params} label="Operario" />}
                                    value={formData.worker.toString().length > 0 ?
                                        (() => {
                                            const w = state.workers.find(w => w.id === parseInt(formData.worker));
                                            if (!w) return '';
                                            return `${w.last_name} ${w.first_name} (${w.category.name})`;
                                        })() : ''}
                                    isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                                />
                            </FormControl>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    disabled={formData.is_chief}
                                    id="site-autocomplete"
                                    options={state.sites.map(s => ({ label: s.name, id: s.id }))}
                                    noOptionsText="No hay obras disponibles."
                                    onChange={(_, value) => setFormData({ ...formData, site: value?.id || '' })}
                                    renderInput={(params) => <TextField {...params} label="Obra" />}
                                    value={formData.site.toString().length > 0 ? state.sites.find(s => s.id === parseInt(formData.site)).name : ''}
                                    isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            width: { xs: '100%', md: '32%' },
                        }}>
                            <FormControlLabel
                                sx={{ justifyContent: 'center' }}
                                control={<Checkbox />}
                                label="Capataces"
                                checked={formData.is_chief}
                                onChange={e => setFormData({ ...formData, is_chief: e.target.checked })}
                            />
                            <Button
                                type="button"
                                variant="contained"
                                onClick={() => getReceiptsRows(formData)}
                                sx={{ mt: { xs: 1, md: 4 } }}
                            >
                                Calcular hs
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: { xs: 2, lg: 0 } }}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha recibo"
                                        value={formData.receipt_date}
                                        name="receipt_date"
                                        onChange={value => setFormData({
                                            ...formData,
                                            receipt_date: new Date(value)
                                        })}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl>
                                <InputLabel htmlFor="name">Concepto</InputLabel>
                                <Input
                                    id="concept"
                                    type="text"
                                    name="concept"
                                    value={formData.concept}
                                    disabled={receipts.length === 0 || formData.concept.length > 55}
                                    onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                />
                                {formData.concept.length > 55 &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * Demasiado largo (máx. 55 caracteres).
                                    </Typography>
                                }
                            </FormControl>
                        </Box>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={receipts.length === 0}
                            onClick={() => printReceipts(formData)}
                        >
                            Generar PDF
                        </Button>
                    </Box>
                </Box>
                <MainTable
                    receipts={receipts}
                    setReceipts={setReceipts}
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

function MainTable({ receipts, setReceipts, loading, setWorkOn, setOpen }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Operario</TableCell>
                        <TableCell align="center">DNI</TableCell>
                        <TableCell align="center">CUIL</TableCell>
                        <TableCell align="center">Cotiz. actual</TableCell>
                        <TableCell align="center">Obra</TableCell>
                        <TableCell align="center">Horas</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Hs recibo</TableCell>
                        <TableCell align="center">Total recibo</TableCell>
                        <TableCell align="center">Obs.</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={11} align="center">
                                <>
                                    {loading ?
                                        <LinearProgress /> :
                                        <>{'No hay registros para mostrar.'}</>
                                    }
                                </>
                            </TableCell>
                        </TableRow> :
                        receipts.map(r => {
                            const color = r.observations.length > 0 ? 'red' : '';
                            return (
                                <TableRow key={r.idx}>
                                    <TableCell align="center" sx={{ p: 0 }}>
                                        <Tooltip title="Detalles" onClick={() => {
                                            setWorkOn(r)
                                            setOpen("VIEW")
                                        }}>
                                            <IconButton sx={{ p: 0 }}>
                                                <SearchSharpIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.worker}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.dni}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.cuil}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        ${r.rate}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.site}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.hours}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        ${r.total_payment}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        <FormControl sx={{ minWidth: 90 }}>
                                            <TextField
                                                type="number"
                                                value={receipts.find(i => i.idx === r.idx).receipt_hours}
                                                onChange={e => {
                                                    const receipt_hours = parseFloat(e.target.value)
                                                    const receipt_payment = (receipt_hours * parseFloat(r.rate)).toFixed(2)
                                                    setReceipts([
                                                        ...receipts.filter(i => i.idx !== r.idx),
                                                        { ...r, receipt_hours, receipt_payment }
                                                    ].sort((a, b) => a.idx - b.idx))
                                                }}
                                                InputProps={{
                                                    inputProps: {
                                                        step: 0.5,
                                                        min: 0,
                                                        max: parseFloat(r.hours)
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        ${r.receipt_payment}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        <Typography whiteSpace="pre-wrap">
                                            {r.observations}
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