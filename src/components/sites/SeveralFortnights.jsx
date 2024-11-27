import { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { useSites } from "../../hooks/useSites";
import { useFortnights } from "../../hooks/useFortnights";

import { ModalComponent } from "../common/ModalComponent";

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";

export function SeveralFortnights({ open, setOpen }) {

    const { state } = useContext(DataContext)

    const { getSites } = useSites()
    const { handleSubmitSeveralFortnights } = useFortnights()
    const { formData, handleChange, reset, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            start_date: '',
            end_date: '',
            in_hour: '',
            out_hour: '',
            lunch: true,
            site_id: ''
        },
        rules: {}
    })

    const [newFortnights, setNewFortnights] = useState([])

    useEffect(() => {
        getSites()
    }, [])

    const handleClose = () => {
        setNewFortnights([])
        reset(setOpen)
    }

    return (
        <ModalComponent open={open === 'NEW-FORTNIGHTS'} onClose={handleClose}>
            <Typography variant="h6">
                Nueva configuración general
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 1, marginBottom: 1 }}>
                <FormControl sx={{ width: '30%' }}>
                    <InputLabel id="site-select">Obras</InputLabel>
                    <Select
                        labelId="site-select"
                        label="Obras"
                        id="site-select"
                        onChange={e => {
                            if (e.target.value.toString().length > 0) {
                                setNewFortnights([parseInt(e.target.value), ...newFortnights])
                                document.getElementById("site-select").value = ''
                            }
                        }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {state.sites
                            .filter(s => !newFortnights.includes(s.id))
                            .sort((a, b) => a.name - b.name)
                            .map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Seleccionar todas"
                    checked={newFortnights.length === state.sites.length}
                    onChange={e => {
                        if (e.target.checked) {
                            setNewFortnights(state.sites.map(s => s.id))
                        } else {
                            setNewFortnights([])
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
                    {newFortnights.length < state.sites.length &&
                        newFortnights.map(nf => (
                            <Chip
                                label={`${state.sites.find(s => s.id === nf).name} ${state.sites.find(s => s.id === nf).name}`}
                                onDelete={() => setNewFortnights(prev => [...prev.filter(item => item !== nf)])}
                            />
                        ))
                    }
                </Box>
            </Box>
            <form onChange={handleChange}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Inicio"
                                    value={formData.start_date.length === 0 ? new Date(Date.now()) : new Date(formData.start_date)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'start_date',
                                            value: new Date(value.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fin"
                                    value={formData.end_date.length === 0 ? new Date(Date.now()) : new Date(formData.end_date)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'end_date',
                                            value: new Date(value.toISOString())
                                        }
                                    })}
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Almuerzan"
                            checked={formData.lunch}
                            onChange={e => handleChange({ target: { name: 'lunch', value: e.target.checked } })}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, margin: '0 auto', marginTop: 2, justifyContent: 'center', width: '50%' }}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ width: '50%', margin: '0 auto' }}
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ width: '50%', margin: '0 auto', color: '#fff' }}
                            disabled={newFortnights.length === 0 || disabled}
                            onClick={e => handleSubmitSeveralFortnights(e, formData, newFortnights, setDisabled, reset, setOpen, setNewFortnights)}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </form>
        </ModalComponent>
    )
}