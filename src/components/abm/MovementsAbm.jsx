import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Autocomplete, Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { format } from 'date-fns';

import { DataContext } from "../../providers/DataProvider";
import { useMovements } from "../../hooks/useMovements";
import { useForm } from "../../hooks/useForm";
import { useSites } from "../../hooks/useSites";
import { useWorkers } from "../../hooks/useWorkers";
import { useCategories } from "../../hooks/useCategories";

import { DataGrid } from "../datagrid/DataGrid";
import { MovementFilter } from "../filters/MovementFilter";
import { ModalComponent } from "../common/ModalComponent";

export function MovementsAbm() {

    const { state } = useContext(DataContext);

    const {
        getMovements,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        filter,
        setFilter,
        count,
        loadingMovements,
        headCells
    } = useMovements();
    const { getCategories, loadingCategories } = useCategories();
    const { getSites, loadingSites } = useSites();
    const { getWorkers, loadingWorkers } = useWorkers();
    const { formData, setFormData, reset, handleChange, errors, validate, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            type: '',
            date: new Date(Date.now()),
            worker_id: '',
            site_id: '',
            observations: ''
        },
        rules: {
            type: {
                required: true
            },
            worker_id: {
                required: true
            },
            site_id: {
                required: true
            },
            observations: {
                maxLength: 55
            }
        }
    });

    useEffect(() => {
        getSites();
        getWorkers();
        getCategories();
    }, []);

    useEffect(() => {
        const { from, to, page, offset, type, worker, site, category } = filter;
        const fromIsNotString = typeof from !== 'string';
        const toIsNotString = typeof to !== 'string';
        getMovements(`?page=${page}&offset=${offset}&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&type=${type}&worker=${worker}&site=${site}&category=${category}`);
    }, [filter]);

    return (
        <>
            {loadingMovements || loadingSites || loadingWorkers || loadingCategories ?
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
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            flexWrap: 'wrap',
                            paddingTop: 2,
                            gap: { xs: 1, lg: 0 }
                        }}>
                            <MovementFilter filter={filter} setFilter={setFilter} />
                            <Button
                                type="button"
                                variant="contained"
                                onClick={() => setOpen('NEW')}
                                sx={{ width: { xs: '100%', sm: '20%', lg: '10%' } }}
                            >
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={500} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nuevo evento'}
                            {open === 'EDIT' && `Editar evento #${formData.id}`}
                        </Typography>
                        <form onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <FormControl sx={{ width: '50%' }}>
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
                                    <FormControl sx={{ width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DateTimePicker
                                                label="Fecha y hora"
                                                value={formData.date.length === 0 ? new Date(Date.now()) : new Date(formData.date)}
                                                name="date"
                                                onChange={value => handleChange({ target: { name: 'date', value: new Date(value) } })}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <Autocomplete
                                            disablePortal
                                            id="worker-autocomplete"
                                            options={state.workers.map(w => ({ label: `${w.last_name} ${w.first_name} (${w.category.name})`, id: w.id }))}
                                            noOptionsText="No hay operarios disponibles."
                                            onChange={(_, value) => handleChange({ target: { name: 'worker_id', value: value?.id || '' } })}
                                            renderInput={(params) => <TextField {...params} label="Operario" />}
                                            value={formData.worker_id.toString().length > 0 ?
                                                (() => {
                                                    const w = state.workers.find(w => w.id === parseInt(formData.worker_id));
                                                    if (!w) return '';
                                                    return `${w.last_name} ${w.first_name} (${w.category.name})`;
                                                })() : ''}
                                            isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                                        />
                                        {errors.worker_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El operario es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <Autocomplete
                                            disablePortal
                                            id="site-autocomplete"
                                            options={state.sites.map(s => ({ label: s.name, id: s.id }))}
                                            noOptionsText="No hay obras disponibles."
                                            onChange={(_, value) => handleChange({ target: { name: 'site_id', value: value?.id || '' } })}
                                            renderInput={(params) => <TextField {...params} label="Obra" />}
                                            value={formData.site_id.toString().length > 0 ? state.sites.find(s => s.id === parseInt(formData.site_id)).name : ''}
                                            isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                                        />
                                        {errors.site_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La obra es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                                <TextField
                                    fullWidth
                                    id="observations"
                                    label="Observaciones"
                                    name="observations"
                                    value={formData.observations}
                                    onChange={handleChange}
                                    multiline
                                    minRows={2}
                                    inputProps={{
                                        maxLength: 55
                                    }}
                                />
                                {errors.observations?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red">
                                        * Las observaciones no deben superar los 55 caracteres.
                                    </Typography>
                                }
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button type="button" variant="contained" onClick={() => reset(setOpen)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={disabled}>
                                        {open === 'NEW' && 'Guardar'}
                                        {open === 'EDIT' && 'Actualizar'}
                                    </Button>
                                </Box>
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
                                        <TableCell align="center">Fecha creación</TableCell>
                                        <TableCell align="center">Modificado por</TableCell>
                                        <TableCell align="center">Fecha modificación</TableCell>
                                        <TableCell align="center">Ubicación toma QR</TableCell>
                                        <TableCell align="center">Observaciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">
                                            {format(new Date(formData.created_at ?? Date.now()), 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell align="center">{formData.updated_by}</TableCell>
                                        <TableCell align="center">
                                            {format(new Date(formData.updated_at ?? Date.now()), 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link
                                                target="_blank"
                                                style={{ textDecoration: 'none', color: '#176ECA' }}
                                                to={`https://www.google.com.ar/maps?q=${formData.lat} ${formData.lng}`}
                                            >
                                                {formData.lat && formData.lat !== '-24.87' &&
                                                    formData.lng && formData.lng !== '-65.53' &&
                                                    `https://www.google.com.ar/maps?q=${formData.lat} ${formData.lng}`
                                                }
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">{formData.observations}</TableCell>
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
    );
}