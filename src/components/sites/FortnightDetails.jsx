import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Breadcrumbs, Button, Checkbox, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { useFortnights } from "../../hooks/useFortnights";
import { useForm } from "../../hooks/useForm";

import { DataGrid } from "../datagrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";

export function FortnightDetails({ site, setOpenSite, setWorkOnFortnight, workOnFortnight }) {

    const { filter, setFilter, open, setOpen, handleSubmitRule, handleDeleteRule } = useFortnights()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            date: '',
            in_hour: '',
            out_hour: '',
            lunch: true,
            lunch_minutes: 60,
            fortnight_id: workOnFortnight.id
        },
        rules: {}
    })

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
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yyyy')
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
            accessor: (row) => row.lunch ? `${row.lunch_minutes} min.` : 'No'
        }
    ], [])

    return (
        <Box sx={{ m: 1, mt: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', justifyContent: 'start' }}>
                <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setOpenSite(null)}>
                    Volver a lista de obras
                </Link>
                <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setOpenSite('FORTNIGHTS')}>
                    Volver a períodos de {site.name}
                </Link>
                <Typography color="text.primary">
                    Reglas del {format(new Date(workOnFortnight.start_date), 'dd/MM/yyyy')} al {format(new Date(workOnFortnight.end_date), 'dd/MM/yyyy')}
                </Typography>
            </Breadcrumbs>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => setOpen('NEW')}>
                    Agregar
                </Button>
                <DataGrid
                    headCells={headCells}
                    rows={workOnFortnight.rules}
                    filter={filter}
                    setFilter={setFilter}
                    count={workOnFortnight.rules.length}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    showEditAction
                    showDeleteAction
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nueva regla'}
                            {open === 'EDIT' && 'Editar regla'}
                        </Typography>
                        <form
                            onChange={handleChange}
                            onSubmit={(e) => handleSubmitRule(e, formData, setDisabled, reset, workOnFortnight, setWorkOnFortnight)}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Fecha"
                                            value={formData.date.length === 0 ? new Date(Date.now()) : new Date(formData.date)}
                                            onChange={value => handleChange({
                                                target: {
                                                    name: 'date',
                                                    value: new Date(value.toISOString())
                                                }
                                            })}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <FormControl sx={{ width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <TimePicker
                                                label="Entrada"
                                                value={formData.in_hour.length === 0 ? new Date(Date.now()) : new Date(formData.in_hour)}
                                                onChange={value => handleChange({
                                                    target: {
                                                        name: 'in_hour',
                                                        value: new Date(value.toISOString())
                                                    }
                                                })}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                    <FormControl sx={{ width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <TimePicker
                                                label="Salida"
                                                value={formData.out_hour.length === 0 ? new Date(Date.now()) : new Date(formData.out_hour)}
                                                onChange={value => handleChange({
                                                    target: {
                                                        name: 'out_hour',
                                                        value: new Date(value.toISOString())
                                                    }
                                                })}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', mt: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <FormControlLabel
                                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                                        control={<Checkbox />}
                                        label="Almuerzan"
                                        checked={formData.lunch}
                                        onChange={e => handleChange({ target: { name: 'lunch', value: e.target.checked } })}
                                    />
                                    {formData.lunch &&
                                        <FormControl sx={{ width: '25%' }}>
                                            <TextField
                                                label="Min. almuerzo"
                                                type="number"
                                                name="lunch_minutes"
                                                value={formData.lunch_minutes}
                                                onChange={e => handleChange({
                                                    target: {
                                                        name: 'lunch_minutes',
                                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                                    }
                                                })}
                                                InputProps={{ inputProps: { step: 1 } }}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </FormControl>
                                    }
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
                                onClick={() => handleDeleteRule(formData, reset, setDisabled, workOnFortnight, setWorkOnFortnight)}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGrid>
            </Box>
        </Box>
    )
}