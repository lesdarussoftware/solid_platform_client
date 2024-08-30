import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Breadcrumbs, FormControl, LinearProgress, Typography, TextField, FormControlLabel, Checkbox } from "@mui/material"
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { format } from 'date-fns';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useFortnights } from "../../hooks/useFortnights";
import { useForm } from "../../hooks/useForm";

import { DataGrid } from "../datagrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";

export function SiteDetails({ site, setOpenSite, setWorkOnFortnight }) {

    const {
        fortnights,
        getFortnights,
        filter,
        setFilter,
        loadingFortnights,
        count,
        open,
        setOpen,
        handleSubmit,
        handleDelete
    } = useFortnights()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            start_date: new Date(Date.now()),
            end_date: new Date(Date.now()),
            in_hour: new Date(Date.now()),
            out_hour: new Date(Date.now()),
            lunch: true,
            site_id: site.id
        },
        rules: {}
    })

    useEffect(() => {
        const { page, offset } = filter
        getFortnights(`/${site.id}?page=${page}&offset=${offset}`)
    }, [filter])

    useEffect(() => {
        if (open === 'EDIT') {
            const [inH, inM] = formData.in_hour.split(':')
            const [outH, outM] = formData.out_hour.split(':')
            let inHour = new Date(Date.now())
            let outHour = new Date(Date.now())
            inHour.setHours(parseInt(inH), parseInt(inM), 0, 0)
            outHour.setHours(parseInt(outH), parseInt(outM), 0, 0)
            setFormData({ ...formData, in_hour: inHour, out_hour: outHour })
        }
    }, [open])

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "start_date",
            numeric: false,
            disablePadding: true,
            label: "Inicio",
            accessor: (row) => format(new Date(row.start_date), 'dd/MM/yyyy')
        },
        {
            id: "end_date",
            numeric: false,
            disablePadding: true,
            label: "Fin",
            accessor: (row) => format(new Date(row.end_date), 'dd/MM/yyyy')
        },
        {
            id: "in_hour",
            numeric: false,
            disablePadding: true,
            label: "Entrada",
            accessor: 'in_hour'
        },
        {
            id: "out_hour",
            numeric: false,
            disablePadding: true,
            label: "Salida",
            accessor: 'out_hour'
        },
        {
            id: "lunch",
            numeric: false,
            disablePadding: true,
            label: "Almuerzo",
            accessor: (row) => row.lunch ? 'Sí' : 'No'
        },
        {
            id: "rules",
            numeric: false,
            disablePadding: true,
            label: "Reglas",
            accessor: (row) => (
                <Button variant="contained" onClick={() => {
                    setWorkOnFortnight(row.id)
                    setOpenSite('RULES')
                }}>
                    <SettingsRoundedIcon />
                </Button>
            )
        }
    ], [])

    return (
        <Box sx={{ m: 1, mt: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', justifyContent: 'start' }}>
                <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setOpenSite(null)}>
                    Volver a lista de obras
                </Link>
                <Typography color="text.primary">Quincenas de {site.name}</Typography>
            </Breadcrumbs>
            {loadingFortnights ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={() => setOpen('NEW')}>
                        Agregar
                    </Button>
                    <DataGrid
                        headCells={headCells}
                        rows={fortnights}
                        filter={filter}
                        setFilter={setFilter}
                        count={count}
                        setOpen={setOpen}
                        setFormData={setFormData}
                        showEditAction
                        showDeleteAction
                    >
                        <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                            <Typography variant="h6" sx={{ marginBottom: 2, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                                {open === 'NEW' && 'Registrar nueva quincena'}
                                {open === 'EDIT' && 'Editar quincena'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, setDisabled, reset)}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControl sx={{ width: '50%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <DatePicker
                                                    label="Inicio"
                                                    value={formData.start_date.length === 0 ? new Date(Date.now()) : new Date(formData.start_date)}
                                                    name="start_date"
                                                    onChange={value => handleChange({ target: { name: 'start_date', value: new Date(value) } })}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl sx={{ width: '50%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <DatePicker
                                                    label="Fin"
                                                    value={formData.end_date.length === 0 ? new Date(Date.now()) : new Date(formData.end_date)}
                                                    name="end_date"
                                                    onChange={value => handleChange({ target: { name: 'end_date', value: new Date(value) } })}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                        <FormControl sx={{ width: '50%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <TimePicker
                                                    label="Entrada"
                                                    value={formData.in_hour.length === 0 ? new Date(Date.now()) : new Date(formData.in_hour)}
                                                    name="in_our"
                                                    onChange={value => handleChange({ target: { name: 'in_hour', value: new Date(value) } })}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl sx={{ width: '50%' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <TimePicker
                                                    label="Salida"
                                                    value={formData.out_hour.length === 0 ? new Date(Date.now()) : new Date(formData.out_hour)}
                                                    name="out_hour"
                                                    onChange={value => handleChange({ target: { name: 'out_hour', value: new Date(value) } })}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Almuerzan"
                                            checked={formData.lunch}
                                            onChange={e => handleChange({ target: { name: 'lunch', value: e.target.checked } })}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '60%', m: '0 auto', mt: 1 }}>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            sx={{ width: '50%', margin: '0 auto', marginTop: 1 }}
                                            onClick={() => reset(setOpen)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ width: '50%', margin: '0 auto', marginTop: 1, color: '#fff' }}
                                            disabled={disabled}
                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </ModalComponent>
                        <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)}>
                            <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                                {`¿Desea borrar el registro #${formData.id}?`}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{
                                        width: '50%',
                                        margin: '0 auto',
                                        marginTop: 1
                                    }}
                                    onClick={() => reset(setOpen)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    sx={{
                                        width: '50%',
                                        margin: '0 auto',
                                        marginTop: 1,
                                        color: '#fff'
                                    }}
                                    disabled={disabled}
                                    onClick={() => handleDelete(formData, reset, setDisabled)}
                                >
                                    Confirmar
                                </Button>
                            </Box>
                        </ModalComponent>
                    </DataGrid>
                </Box>
            }
        </Box>
    )
}