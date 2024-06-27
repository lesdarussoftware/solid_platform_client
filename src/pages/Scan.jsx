import { useContext, useEffect } from "react";
import { Autocomplete, Box, Button, FormControl, TextField, Typography } from "@mui/material";

import { DataContext } from "../providers/DataProvider";
import { useChiefs } from "../hooks/useChiefs";
import { useSites } from "../hooks/useSites";
import { useMovements } from "../hooks/useMovements";
import { useForm } from "../hooks/useForm";

import { QrReader } from "../components/QrReader";

export function Scan() {

    const { state } = useContext(DataContext)

    const { getSites } = useSites()
    const { getChiefs } = useChiefs()
    const { formData, setFormData, validate, errors, disabled, handleChange, reset } = useForm({
        defaultData: { chief_dni: '', site_name: '', type: null },
        rules: { site_name: { required: true }, chief_dni: { required: true } }
    })
    const {
        handleSync,
        handleSubmit,
        newMovement,
        setNewMovement,
        newMovementWorkerDni,
        setNewMovementWorkerDni
    } = useMovements({ chief_dni: '', site_name: '', type: null })

    useEffect(() => {
        getSites()
        getChiefs()
        handleSync()
    }, [])

    const handleSaveMainData = e => {
        e.preventDefault()
        validate()
    }

    return (
        <Box>
            <Typography variant="h4" align="center" marginBottom={3} marginTop={3}>
                Escáner de QR
            </Typography>
            {formData.type ?
                <QrReader
                    formData={formData}
                    reset={reset}
                    handleSubmit={handleSubmit}
                    newMovement={newMovement}
                    setNewMovement={setNewMovement}
                    newMovementWorkerDni={newMovementWorkerDni}
                    setNewMovementWorkerDni={setNewMovementWorkerDni}
                /> :
                <Box>
                    <form onSubmit={handleSaveMainData}>
                        <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2, margin: '0 auto' }}>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    id="chief-autocomplete"
                                    options={state.chiefs.map(c => ({ label: `${c.first_name} ${c.last_name} (${c.dni})`, id: c.dni }))}
                                    noOptionsText="No hay registros disponibles."
                                    onChange={(_, value) => handleChange({ target: { name: 'chief_dni', value: value.id } })}
                                    renderInput={(params) => <TextField {...params} label="Capataz" />}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                                {errors.chief_dni?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El capataz es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    id="site-autocomplete"
                                    options={state.sites.map(s => ({ label: s.name, name: s.name }))}
                                    noOptionsText="No hay registros disponibles."
                                    onChange={(_, value) => handleChange({ target: { name: 'site_name', value: value.name } })}
                                    renderInput={(params) => <TextField {...params} label="Obra" />}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                />
                                {errors.site_name?.type === 'required' &&
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
                            sx={{ padding: 3, width: '30%' }}
                            onClick={() => setFormData({ ...formData, type: 'INGRESO' })}
                        >
                            Escanear ingreso
                        </Button>
                        <Button
                            type="button"
                            disabled={!disabled}
                            variant="contained"
                            sx={{ padding: 3, width: '30%' }}
                            onClick={() => setFormData({ ...formData, type: 'EGRESO' })}
                        >
                            Escanear egreso
                        </Button>
                    </Box>
                </Box>
            }
        </Box>
    )
}