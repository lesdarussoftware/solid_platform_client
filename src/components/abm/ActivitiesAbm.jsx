import { useEffect, useMemo, useState } from "react";
import { Box, Button, FormControl, InputLabel, LinearProgress, TextField, Typography, FormControlLabel, Checkbox, Select, MenuItem, Chip } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { format } from 'date-fns';

import { useForm } from "../../hooks/useForm";
import { useWorkers } from "../../hooks/useWorkers";
import { useActivities } from "../../hooks/useActivities";

import { DataGrid } from "../datagrid/DataGrid";
import { ActivityFilter } from "../filters/ActivityFilter";
import { ModalComponent } from "../common/ModalComponent";

export function ActivitiesAbm() {

    const {
        activities,
        getActivities,
        open,
        setOpen,
        handleEdit,
        handleCreate,
        handleDelete,
        filter,
        setFilter,
        count,
        loadingActivities
    } = useActivities();
    const { loadingWorkers, getAllWorkers, allWorkers, getWorkers } = useWorkers();
    const { formData, setFormData, reset, handleChange, errors, validate, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            in_date: new Date(Date.now()),
            out_date: new Date(Date.now()),
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

    const [newActivities, setNewActivities] = useState([])

    useEffect(() => {
        getWorkers();
        getAllWorkers();
    }, []);

    useEffect(() => {
        const { date, page, offset, worker_id } = filter;
        const dateIsNotString = typeof date !== 'string';
        getActivities(`?page=${page}&offset=${offset}${dateIsNotString ? `&date=${new Date(date).toISOString()}` : ''}&worker_id=${worker_id}`);
    }, [filter]);

    const handleClose = () => {
        setNewActivities([])
        reset(setOpen)
    }

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
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={500} onClose={handleClose}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Nuevo registro'}
                            {open === 'EDIT' && `Editar registro #${formData.id}`}
                        </Typography>
                        {open === 'NEW' &&
                            <>
                                <Box sx={{ display: 'flex', gap: 2, marginTop: 1, mb: 1 }}>
                                    <FormControl sx={{ width: '30%' }}>
                                        <InputLabel id="worker-select">Operario</InputLabel>
                                        <Select
                                            labelId="worker-select"
                                            label="Operario"
                                            id="worker-select"
                                            onChange={e => {
                                                if (e.target.value.toString().length > 0) {
                                                    setNewActivities([parseInt(e.target.value), ...newActivities])
                                                    document.getElementById("worker-select").value = ''
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Seleccione</MenuItem>
                                            {allWorkers
                                                .filter(w => !newActivities.includes(w.id))
                                                .sort((a, b) => a.first_name - b.first_name)
                                                .map(w => (
                                                    <MenuItem key={w.id} value={w.id}>{` ${w.last_name} ${w.first_name}`}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Seleccionar todos"
                                        checked={newActivities.length === allWorkers.length}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setNewActivities(allWorkers.map(w => w.id))
                                            } else {
                                                setNewActivities([])
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexWrap: 'wrap',
                                    height: 200,
                                    border: '1px solid gray',
                                    padding: 1,
                                    borderRadius: 1,
                                    mb: 2
                                }}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {newActivities.length < allWorkers.length &&
                                            newActivities.map(na => (
                                                <Chip
                                                    label={`${allWorkers.find(w => w.id === na).first_name} ${allWorkers.find(w => w.id === na).last_name}`}
                                                    onDelete={() => setNewActivities(prev => [...prev.filter(item => item !== na)])}
                                                />
                                            ))
                                        }
                                    </Box>
                                </Box>
                            </>
                        }
                        <form onSubmit={(e) => {
                            if (open === 'NEW') handleCreate(e, validate, formData, newActivities, setDisabled, reset, setOpen, setNewActivities)
                            if (open === 'EDIT') handleEdit(e, validate, formData, setDisabled, reset)
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <FormControl sx={{ width: '33%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DateTimePicker
                                                label="Entrada"
                                                value={formData.in_date.length === 0 ? new Date(Date.now()) : new Date(formData.in_date)}
                                                name="in_date"
                                                onChange={value => handleChange({ target: { name: 'in_date', value: new Date(value) } })}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                    <FormControl sx={{ width: '33%' }}>
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
                                    <FormControl sx={{ width: '33%' }}>
                                        <TextField
                                            label="Cant. Hs."
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            onChange={e => handleChange({
                                                target: {
                                                    name: 'hours',
                                                    value: parseInt(e.target.value) <= 0 ? 0 : Math.abs(e.target.value)
                                                }
                                            })}
                                            InputProps={{
                                                inputProps: {
                                                    step: 0.25
                                                }
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
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
                                    <Button type="button" variant="contained" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={disabled || (open === 'NEW' && newActivities.length === 0)}>
                                        {open === 'NEW' && 'Guardar'}
                                        {open === 'EDIT' && 'Actualizar'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </ModalComponent>
                    <ModalComponent open={open === 'DELETE'} onClose={handleClose}>
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
                                onClick={handleClose}
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