import { useContext } from "react"
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"

export function PersonalForm({
    handleChange,
    handleSubmit,
    validate,
    formData,
    disabled,
    setDisabled,
    reset,
    setOpen,
    errors,
    fromWorkers
}) {

    const { state } = useContext(DataContext)

    return (
        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="dni">DNI</InputLabel>
                        <Input id="dni" type="number" name="dni" value={formData.dni} />
                        {errors.dni?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El dni es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="first_name">Nombre</InputLabel>
                        <Input id="first_name" type="text" name="first_name" value={formData.first_name} />
                        {errors.first_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es requerido.
                            </Typography>
                        }
                        {errors.first_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="last_name">Apellido</InputLabel>
                        <Input id="last_name" type="text" name="last_name" value={formData.last_name} />
                        {errors.last_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El apellido es requerido.
                            </Typography>
                        }
                        {errors.last_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El apellido es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                        <Input id="cell_phone" type="text" name="cell_phone" value={formData.cell_phone} />
                        {errors.cell_phone?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El celular es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="cuil">CUIL</InputLabel>
                        <Input id="cuil" type="text" name="cuil" value={formData.cuil} />
                        {errors.cuil?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El cuil es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha Nac."
                                value={new Date(formData.birth === '' ? Date.now() : formData.birth)}
                                name="date"
                                onChange={value => handleChange({ target: { name: 'birth', value: new Date(value.toISOString()) } })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Box>
                {fromWorkers &&
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <FormControl sx={{ width: '33%' }}>
                            <InputLabel id="category-select">Categoría</InputLabel>
                            <Select
                                labelId="category-select"
                                id="category"
                                value={formData.category_id}
                                label="Categoría"
                                name="category"
                                onChange={e => handleChange({ target: { name: 'category_id', value: e.target.value } })}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {state.categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                            {errors.site_id?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El evento es requerido.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: '33%' }}>
                            <InputLabel htmlFor="regime">Régimen</InputLabel>
                            <Input id="regime" type="number" name="regime" value={formData.regime} />
                        </FormControl>
                        <FormControl sx={{ width: '33%' }}>
                            <InputLabel htmlFor="observations">Observaciones</InputLabel>
                            <Input id="observations" type="text" name="observations" value={formData.observations} />
                            {errors.observations?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * Las observaciones son demasiado largas.
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                }
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="address">Dirección</InputLabel>
                        <Input id="address" type="text" name="address" value={formData.address} />
                        {errors.address?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La dirección es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="city">Localidad</InputLabel>
                        <Input id="city" type="text" name="city" value={formData.city} />
                        {errors.city?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La ciudad es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, marginTop: 2, justifyContent: 'center' }}>
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
        </form>
    )
}