import { useContext, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"
import { format } from 'date-fns'

import { DataContext } from "../../providers/DataProvider"
import { useMovements } from "../../hooks/useMovements"
import { useForm } from "../../hooks/useForm"
import { useSites } from "../../hooks/useSites"
import { useChiefs } from "../../hooks/useChiefs"
import { useWorkers } from "../../hooks/useWorkers"

import { DataGrid } from "../datagrid/DataGrid"
import { MovementFilter } from "../filters/MovementFilter"
import { ModalComponent } from "../common/ModalComponent"

export function MovementsAbm() {

    const { state } = useContext(DataContext)

    const { getMovements, open, setOpen, handleSubmit, handleDelete, filter, setFilter, count, loadingMovements } = useMovements()
    const { getSites, loadingSites } = useSites()
    const { getChiefs, loadingChiefs } = useChiefs()
    const { getWorkers, loadingWorkers } = useWorkers()
    const { formData, setFormData, reset, handleChange, errors, validate, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            type: '',
            date: new Date(Date.now()),
            worker_id: '',
            site_id: '',
            chief_id: '',
            observations: ''
        },
        rules: {
            type: {
                required: true
            },
            worker_id: {
                required: true
            },
            chief_id: {
                required: true
            },
            site_id: {
                required: true
            },
            observations: {
                maxLength: 55
            }
        }
    })

    useEffect(() => {
        getSites()
        getChiefs()
        getWorkers()
    }, [])

    useEffect(() => {
        const { from, to, page, offset, type, chief, worker, site } = filter
        const fromIsNotString = typeof from !== 'string'
        const toIsNotString = typeof to !== 'string'
        getMovements(`?page=${page}&offset=${offset}&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&type=${type}&chief=${chief}&worker=${worker}&site=${site}`)
    }, [filter])

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha y hora",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy HH:mm:ss')
        },
        {
            id: "worker",
            numeric: false,
            disablePadding: true,
            label: "Empleado",
            accessor: (row) => `${row.worker.first_name} ${row.worker.last_name}`
        },
        {
            id: "chief",
            numeric: false,
            disablePadding: true,
            label: "Capataz",
            accessor: (row) => `${row.chief.first_name} ${row.chief.last_name}`
        },
        {
            id: "type",
            numeric: false,
            disablePadding: true,
            label: "Evento",
            accessor: 'type'
        },
        {
            id: "site",
            numeric: false,
            disablePadding: true,
            label: "Obra",
            accessor: (row) => row.site.name
        }
    ], [])

    return (
        <>
            {loadingMovements || loadingChiefs || loadingSites || loadingWorkers ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={state.movements}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showViewAction
                    showEditAction
                    showDeleteAction
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <MovementFilter filter={filter} setFilter={setFilter} />
                            <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nuevo evento'}
                            {open === 'EDIT' && `Editar evento #${formData.id}`}
                        </Typography>
                        <form onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl>
                                    <InputLabel id="type-select">Evento</InputLabel>
                                    <Select
                                        labelId="type-select"
                                        id="type"
                                        value={formData.type}
                                        label="Evento"
                                        name="type"
                                        onChange={e => handleChange({ target: { name: 'type', value: e.target.value } })}
                                    >
                                        <MenuItem value="">Seleccione</MenuItem>
                                        <MenuItem value="INGRESO">INGRESO</MenuItem>
                                        <MenuItem value="EGRESO">EGRESO</MenuItem>
                                    </Select>
                                    {errors.site_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El evento es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Fecha"
                                            value={new Date(formData.date)}
                                            name="date"
                                            onChange={value => handleChange({ target: { name: 'date', value: new Date(value.toISOString()) } })}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormControl>
                                    <Autocomplete
                                        disablePortal
                                        id="chief-autocomplete"
                                        options={state.chiefs.map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c.id }))}
                                        noOptionsText="No hay capataces disponibles."
                                        onChange={(_, value) => handleChange({ target: { name: 'chief_id', value: value.id } })}
                                        renderInput={(params) => <TextField {...params} label="Capataz" />}
                                        value={formData.chief_id.toString().length > 0 ? `${state.chiefs.find(c => c.id === formData.chief_id).first_name} ${state.chiefs.find(c => c.id === formData.chief_id).last_name}` : ''}
                                        isOptionEqualToValue={(option, value) => value.length === 0 || option.id === value.id}
                                    />
                                    {errors.site_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El capataz es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <Autocomplete
                                        disablePortal
                                        id="worker-autocomplete"
                                        options={state.workers.map(w => ({ label: `${w.first_name} ${w.last_name}`, id: w.id }))}
                                        noOptionsText="No hay empleados disponibles."
                                        onChange={(_, value) => handleChange({ target: { name: 'worker_id', value: value.id } })}
                                        renderInput={(params) => <TextField {...params} label="Empleado" />}
                                        value={formData.worker_id.toString().length > 0 ? `${state.workers.find(w => w.id === formData.worker_id).first_name} ${state.workers.find(w => w.id === formData.worker_id).last_name}` : ''}
                                        isOptionEqualToValue={(option, value) => value.length === 0 || option.id === value.id}
                                    />
                                    {errors.site_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El empleado es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <Autocomplete
                                        disablePortal
                                        id="site-autocomplete"
                                        options={state.sites.map(s => ({ label: s.name, id: s.id }))}
                                        noOptionsText="No hay obras disponibles."
                                        onChange={(_, value) => handleChange({ target: { name: 'site_id', value: value.id } })}
                                        renderInput={(params) => <TextField {...params} label="Obra" />}
                                        value={formData.site_id.toString().length > 0 ? state.sites.find(s => s.id === formData.site_id).name : ''}
                                        isOptionEqualToValue={(option, value) => value.length === 0 || option.id === value.id}
                                    />
                                    {errors.site_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La obra es requerida.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                    <Input
                                        id="observations"
                                        type="text"
                                        name="observations"
                                        value={formData.observations}
                                        onChange={(e, value) => handleChange({ target: { name: 'observations', value: e.target.value } })}
                                    />
                                    {errors.observations?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * Las observaciones son demasiado largas.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, marginTop: 2, justifyContent: 'center' }}>
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
                        </form>
                    </ModalComponent>
                    <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea borrar el registro del evento #${formData.id}?`}
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
                    <ModalComponent open={open === 'VIEW'} onClose={() => setOpen(null)} reduceWidth={400}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`Detalles del evento #${formData.id}`}
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Creado por</TableCell>
                                        <TableCell align="center">Fecha creación</TableCell>
                                        <TableCell align="center">Modificado por</TableCell>
                                        <TableCell align="center">Fecha modificación</TableCell>
                                        <TableCell align="center">Ubicación toma QR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">{formData.created_by}</TableCell>
                                        <TableCell align="center">
                                            {format(new Date(formData.created_at ?? Date.now()), 'dd/MM/yyyy HH:mm:ss')}
                                        </TableCell>
                                        <TableCell align="center">{formData.updated_by}</TableCell>
                                        <TableCell align="center">
                                            {format(new Date(formData.updated_at ?? Date.now()), 'dd/MM/yyyy HH:mm:ss')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link
                                                target="_blank"
                                                style={{ textDecoration: 'none', color: '#176ECA' }}
                                                to={`https://www.google.com.ar/maps?q=${formData.lat} ${formData.lng}`}
                                            >
                                                {formData.lat && formData.lat !== '-24.875551' &&
                                                    formData.lng && formData.lng !== '-65.538401' &&
                                                    `https://www.google.com.ar/maps?q=${formData.lat} ${formData.lng}`
                                                }
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{
                                    width: '20%',
                                    margin: '0 auto',
                                    marginTop: 2
                                }}
                                onClick={() => setOpen(null)}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGrid>
            }
        </>
    )
}