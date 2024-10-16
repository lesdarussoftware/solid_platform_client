import { useState } from "react";
import { Box, Breadcrumbs, Button, FormControl, IconButton, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

import { useReports } from "../../hooks/useReports";

import { ModalComponent } from "../common/ModalComponent";
import { DetailsTables } from "./DetailsTables";

export function Receipts({ setShow }) {

    const { getReceiptsRows, receipts, setReceipts, printReceipts, loading, open, setOpen } = useReports();
    const [formData, setFormData] = useState({
        from: new Date(Date.now()),
        to: new Date(Date.now())
    })

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
                    <Typography color="text.primary">Recibos</Typography>
                </Breadcrumbs>
                <Typography variant="h5" marginBottom={1}>Recibos</Typography>
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
                        width: { xs: '100%', md: '70%', lg: '50%' }
                    }}>
                        <FormControl sx={{ width: { xs: '100%', md: '36%' } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Desde"
                                    value={new Date(formData.from)}
                                    name="from"
                                    onChange={value => setFormData({ ...formData, from: new Date(value.toISOString()) })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '36%' } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Hasta"
                                    value={new Date(formData.to)}
                                    name="to"
                                    onChange={value => setFormData({ ...formData, to: new Date(value.toISOString()) })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ width: { xs: '100%', md: '25%' } }}
                            onClick={() => getReceiptsRows(formData)}
                        >
                            Calcular hs
                        </Button>
                    </Box>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ my: { xs: 1, md: 0 } }}
                        disabled={receipts.length === 0}
                        onClick={() => printReceipts()}
                    >
                        Generar PDF
                    </Button>
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
                        <TableCell align="center">Categoría</TableCell>
                        <TableCell align="center">Cotiz. actual</TableCell>
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
                                        {r.category}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        ${r.rate}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        {r.hours}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        ${r.total_payment}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color }}>
                                        <FormControl>
                                            <TextField
                                                type="number"
                                                value={receipts.find(i => i.idx === r.idx).recipe_hours}
                                                onChange={e => {
                                                    const recipe_hours = parseFloat(e.target.value)
                                                    const recipe_payment = (recipe_hours * parseFloat(r.rate)).toFixed(2)
                                                    setReceipts([
                                                        ...receipts.filter(i => i.idx !== r.idx),
                                                        { ...r, recipe_hours, recipe_payment }
                                                    ])
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
                                        ${r.recipe_payment}
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