import { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { useSites } from "../../hooks/useSites";
import { useFortnights } from "../../hooks/useFortnights";

import { ModalComponent } from "../common/ModalComponent";

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";

export function SeveralFortnights({ open, setOpen }) {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const { getSites } = useSites()
    const { handleSubmitSeveralFortnights } = useFortnights()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            start_date: new Date(Date.now()),
            end_date: new Date(Date.now()),
            in_hour: new Date(Date.now()),
            out_hour: new Date(Date.now()),
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
        setOpen(null)
        setNewFortnights([])
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
                borderRadius: 1
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
                    onClick={e => handleSubmitSeveralFortnights(e, newFortnights, setDisabled, reset)}
                >
                    Guardar
                </Button>
            </Box>
        </ModalComponent>
    )
}