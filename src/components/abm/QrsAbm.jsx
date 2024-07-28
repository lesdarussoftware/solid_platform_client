import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { useWorkers } from "../../hooks/useWorkers";

import { ModalComponent } from "../common/ModalComponent";

import { REPORT_URL } from "../../helpers/urls";

export function QrsAbm({ open, setOpen }) {

    const { auth } = useContext(AuthContext)

    const { newQrs, setNewQrs, handleGenerateQr, workersForQr, getWorkersForQr, disabled } = useWorkers()

    useEffect(() => {
        getWorkersForQr()
    }, [])

    const handleClose = () => {
        setOpen(null)
        setNewQrs([])
    }

    return (
        <ModalComponent open={open === 'GENERATE-QR' || open === 'PRINT-QR'} onClose={handleClose}>
            <Typography variant="h6">
                {open === 'GENERATE-QR' && 'Generar nuevos QR'}
                {open === 'PRINT-QR' && 'Imprimir QR'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 1, marginBottom: 1 }}>
                <FormControl sx={{ width: '30%' }}>
                    <InputLabel id="worker-select">Operario</InputLabel>
                    <Select
                        labelId="worker-select"
                        label="Operario"
                        id="worker-select"
                        onChange={e => {
                            if (e.target.value.toString().length > 0) {
                                setNewQrs([parseInt(e.target.value), ...newQrs])
                                document.getElementById("worker-select").value = ''
                            }
                        }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {workersForQr
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
                    checked={newQrs.length === workersForQr.length}
                    onChange={e => {
                        if (e.target.checked) {
                            setNewQrs(workersForQr.map(w => w.id))
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
                    {newQrs.length < workersForQr.length &&
                        newQrs.map(nqr => (
                            <Chip
                                label={`${workersForQr.find(w => w.id === nqr).first_name} ${workersForQr.find(w => w.id === nqr).last_name}`}
                                onDelete={() => setNewQrs(prev => [...prev.filter(item => item !== nqr)])}
                            />
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
                    disabled={newQrs.length === 0 || disabled}
                    onClick={e => {
                        if (open === 'GENERATE-QR') handleGenerateQr(e, setOpen)
                        if (open === 'PRINT-QR') window.open(`${REPORT_URL}/lista-qr/${auth?.refresh_token}${newQrs.length > 0 && newQrs.length < workersForQr.length ? `?ids=${JSON.stringify(newQrs)}` : ''}`, '_blank')
                    }}
                >
                    {open === 'GENERATE-QR' && 'Guardar'}
                    {open === 'PRINT-QR' && 'Imprimir'}
                </Button>
            </Box>
        </ModalComponent>
    )
}