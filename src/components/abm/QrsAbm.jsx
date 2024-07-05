import { useContext } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useWorkers } from "../../hooks/useWorkers";

import { ModalComponent } from "../common/ModalComponent";

export function QrsAbm({ open, setOpen }) {

    const { state } = useContext(DataContext)

    const { newQrs, setNewQrs, handleGenerateQr } = useWorkers()

    const handleClose = () => {
        setOpen(null)
        setNewQrs([])
    }

    return (
        <ModalComponent open={open} onClose={handleClose}>
            <Typography variant="h6">
                Generar nuevos QR
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 1, marginBottom: 1 }}>
                <FormControl sx={{ width: '30%' }}>
                    <InputLabel id="worker-select">Empleado</InputLabel>
                    <Select
                        labelId="worker-select"
                        label="Empleado"
                        id="worker-select"
                        onChange={e => {
                            if (e.target.value.toString().length > 0) {
                                setNewQrs([parseInt(e.target.value), ...newQrs])
                                document.getElementById("worker-select").value = ''
                            }
                        }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {state.workers
                            .filter(w => !newQrs.includes(w.id))
                            .sort((a, b) => a.first_name - b.first_name)
                            .map(w => (
                                <MenuItem key={w.id} value={w.id}>{`${w.first_name} ${w.last_name}`}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Seleccionar todos"
                    checked={newQrs.length === state.workers.length}
                    onChange={e => {
                        if (e.target.checked) {
                            setNewQrs(state.workers.map(w => w.id))
                        } else {
                            setNewQrs([])
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
                <>
                    {newQrs.length < state.workers.length &&
                        newQrs.map(nqr => (
                            <Typography variant="body1" sx={{ padding: 1 }}>
                                {`${state.workers.find(w => w.id === nqr).first_name} ${state.workers.find(w => w.id === nqr).last_name}`}
                            </Typography>
                        ))
                    }
                </>
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
                    disabled={newQrs.length === 0}
                    onClick={e => handleGenerateQr(e, setOpen)}
                >
                    Guardar
                </Button>
            </Box>
        </ModalComponent>
    )
}