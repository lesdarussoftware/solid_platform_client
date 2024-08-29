import { useContext, useEffect, useMemo } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, LinearProgress, TextField, Typography, Input } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { format } from 'date-fns';

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useWorkers } from "../../hooks/useWorkers";
import { useActivities } from "../../hooks/useActivities";

import { DataGrid } from "../datagrid/DataGrid";
import { ActivityFilter } from "../filters/ActivityFilter";
import { ModalComponent } from "../common/ModalComponent";

export function ActivitiesAbm() {

    const { state } = useContext(DataContext);

    const {
        activities,
        getActivities,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        filter,
        setFilter,
        count,
        loadingActivities
    } = useActivities();
    const { getWorkers, loadingWorkers } = useWorkers();
    const { formData, setFormData, reset, handleChange, errors, validate, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            in_date: new Date(Date.now()),
            out_date: new Date(Date.now()),
            worker_id: '',
            description: '',
            hours: ''
        },
        rules: {
            worker_id: {
                required: true
            },
            hours: {
                required: true
            },
            description: {
                required: true,
                maxLength: 191
            }
        }
    });

    useEffect(() => {
        getWorkers();
        getActivities()
    }, []);

    useEffect(() => {
        const { from, to, page, offset, worker_id } = filter;
        const fromIsNotString = typeof from !== 'string';
        const toIsNotString = typeof to !== 'string';
        getActivities(`?page=${page}&offset=${offset}&from=${fromIsNotString ? new Date(from).toISOString() : ''}&to=${toIsNotString ? new Date(to).toISOString() : ''}&worker_id=${worker_id}`);
    }, [filter]);

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "worker",
            numeric: false,
            disablePadding: true,
            label: "Operario",
            accessor: (row) => `${row.worker.first_name} ${row.worker.last_name}`
        },
        {
            id: "description",
            numeric: false,
            disablePadding: true,
            label: "Detalle",
            accessor: 'description'
        },
        {
            id: "in_date",
            numeric: false,
            disablePadding: true,
            label: "Entrada",
            accessor: (row) => format(new Date(row.in_date), 'dd/MM/yy HH:mm')
        },
        {
            id: "out_date",
            numeric: false,
            disablePadding: true,
            label: "Salida",
            accessor: (row) => format(new Date(row.out_date), 'dd/MM/yy HH:mm')
        },
        {
            id: "hours",
            numeric: false,
            disablePadding: true,
            label: "Cant. hs. extra",
            accessor: 'hours'
        }
    ], []);

    return (
        <>
            {loadingActivities || loadingWorkers ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={activities}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
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
                            <ActivityFilter filter={filter} setFilter={setFilter} />
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
                            {open === 'NEW' && 'Nuevo registro'}
                            {open === 'EDIT' && `Editar registro #${formData.id}`}
                        </Typography>
                        <form onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DateTimePicker
                                                label="Entrada"
                                                value={formData.in_date.length === 0 ? new Date(Date.now()) : new Date(formData.in_date)}
                                                name="in_date"
                                                onChange={value => handleChange({ target: { name: 'in_date', value: new Date(value) } })}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DateTimePicker
                                                label="Salida"
                                                value={formData.out_date.length === 0 ? new Date(Date.now()) : new Date(formData.out_date)}
                                                name="out_date"
                                                onChange={value => handleChange({ target: { name: 'out_date', value: new Date(value) } })}
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
                                            options={state.workers.map(w => ({ label: `${w.last_name} ${w.first_name}`, id: w.id }))}
                                            noOptionsText="No hay operarios disponibles."
                                            onChange={(_, value) => handleChange({ target: { name: 'worker_id', value: value?.id || '' } })}
                                            renderInput={(params) => <TextField {...params} label="Operario" />}
                                            value={formData.worker_id.toString().length > 0 ? `${state.workers.find(w => w.id === parseInt(formData.worker_id)).last_name} ${state.workers.find(w => w.id === parseInt(formData.worker_id)).first_name}` : ''}
                                            isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                                        />
                                        {errors.worker_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El operario es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="hours">Horas</InputLabel>
                                        <Input id="hours" type="number" name="hours" value={formData.hours} />
                                        {errors.hours?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las cantidad de horas extra es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                                <TextField
                                    fullWidth
                                    id="description"
                                    label="Detalle"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    minRows={2}
                                    inputProps={{
                                        maxLength: 55
                                    }}
                                />
                                {errors.description?.type === 'required' &&
                                    <Typography variant="caption" color="red">
                                        * El detalle es requerido.
                                    </Typography>
                                }
                                {errors.description?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red">
                                        * El detalle no debe superar los 191 caracteres.
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
            }
        </>
    );
}