import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { useForm } from "../hooks/useForm";

import { QrReader } from "../components/QrReader";

export function Scan() {

    const { formData, setFormData, validate, errors, disabled, handleChange, reset } = useForm({
        defaultData: { dni: '', site_id: '', type: null, elements: [] },
        rules: { site_id: { required: true }, dni: { minLength: 8, maxLength: 8 } }
    })

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            console.log(formData)
        }
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
                /> :
                <Box>
                    <form onChange={handleChange} onSubmit={handleSubmit}>
                        <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2, margin: '0 auto' }}>
                            <FormControl>
                                <InputLabel htmlFor="dni">DNI Capataz</InputLabel>
                                <Input id="dni" type="number" name="dni" value={formData.dni} />
                                {(errors.dni?.type === 'minLength' || errors.dni?.type === 'maxLength') &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El DNI debe tener 8 caracteres.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl>
                                <InputLabel id="site-select">Obra</InputLabel>
                                <Select
                                    labelId="site-select"
                                    id="site_id"
                                    sx={{ width: '100%' }}
                                    value={formData.site_id}
                                    label="Obra"
                                    name="site_id"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Seleccione</MenuItem>
                                    <MenuItem value={1}>Obra 1</MenuItem>
                                    <MenuItem value={2}>Obra 2</MenuItem>
                                    <MenuItem value={3}>Obra 3</MenuItem>
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