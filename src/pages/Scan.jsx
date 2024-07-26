import { useContext, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { DataContext } from "../providers/DataProvider";
import { useSites } from "../hooks/useSites";
import { useMovements } from "../hooks/useMovements";

import { QrReader } from "../components/common/QrReader";
import { useForm } from "../hooks/useForm";
import { useWorkers } from "../hooks/useWorkers";

export function Scan() {

    const { state } = useContext(DataContext)

    const { getSites } = useSites()
    const { getScanners } = useWorkers()
    const { handleSync, handleScan, newMovementWorkerHash, setNewMovementWorkerHash, getLocation } = useMovements()
    const { formData, setFormData, validate, errors, disabled, handleChange, reset } = useForm({
        defaultData: {
            created_by: '',
            site_id: '',
            worker_id: '',
            type: null,
            lat: null,
            lng: null
        },
        rules: { site_id: { required: true }, created_by: { required: true } }
    })

    useEffect(() => {
        getSites()
        getScanners()
        handleSync()
    }, [])

    const handleSaveMainData = e => {
        e.preventDefault()
        if (validate()) {
            getLocation(formData, setFormData)
        }
    }

    return (
        <Box>
            <Typography variant="h3" align="center" marginBottom={3} marginTop={3}>
                Escáner de QR
            </Typography>
            {formData.type ?
                <QrReader
                    formData={formData}
                    reset={reset}
                    setFormData={setFormData}
                    handleSubmit={handleScan}
                    newMovementWorkerHash={newMovementWorkerHash}
                    setNewMovementWorkerHash={setNewMovementWorkerHash}
                /> :
                <Box>
                    <form onSubmit={handleSaveMainData}>
                        <Box sx={{ width: { xs: '80%', sm: '30%' }, display: 'flex', flexDirection: 'column', gap: 2, margin: '0 auto' }}>
                            <FormControl>
                                <InputLabel id="scanner-select">Capataz</InputLabel>
                                <Select
                                    labelId="scanner-select"
                                    label="Capataz"
                                    id="scanner-select"
                                    onChange={e => handleChange({ target: { name: 'created_by', value: e.target.value } })}
                                >
                                    {state.scanners.map(s => (
                                        <MenuItem key={s.id} value={`${s.first_name} ${s.last_name}`}>
                                            {`${s.first_name} ${s.last_name} (${s.dni})`}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.created_by?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El capataz es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl>
                                <InputLabel id="site-select">Obra</InputLabel>
                                <Select
                                    labelId="site-select"
                                    label="Obra"
                                    id="site-select"
                                    onChange={e => handleChange({ target: { name: 'site_id', value: e.target.value } })}
                                >
                                    {state.sites.map(s => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.site_id?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * La obra es requerida.
                                    </Typography>
                                }
                            </FormControl>
                            <Button
                                type="submit"
                                disabled={disabled}
                                variant="contained"
                                sx={{ width: '50%', margin: '0 auto' }}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </form>
                    <Box sx={{ padding: 5, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <Button
                            type="button"
                            disabled={!disabled}
                            variant="contained"
                            sx={{ padding: 3, width: { xs: '80%', sm: '30%' }, fontSize: 20 }}
                            onClick={() => setFormData({ ...formData, type: 'INGRESO' })}
                        >
                            Ingreso
                        </Button>
                        <Button
                            type="button"
                            disabled={!disabled}
                            variant="contained"
                            sx={{ padding: 3, width: { xs: '80%', sm: '30%', fontSize: 20 } }}
                            onClick={() => setFormData({ ...formData, type: 'EGRESO' })}
                        >
                            Egreso
                        </Button>
                    </Box>
                </Box>
            }
        </Box>
    )
}