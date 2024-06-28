import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useForm } from "../hooks/useForm";

export function Home() {

    const { setAuth } = useContext(AuthContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const navigate = useNavigate()

    const { formData, handleChange, disabled, setDisabled, validate, errors } = useForm({
        defaultData: { username: '', password: '', role: 'ADMIN' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 55 }
        }
    })

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            if (formData.username === 'admin' && formData.password === 'admin123') {
                localStorage.setItem('solid_auth', JSON.stringify(formData))
                setAuth(formData)
                navigate('/dashboard')
            } else {
                setMessage('Credenciales inválidas.')
                setSeverity('error')
                setOpenMessage(true)
            }
            setDisabled(false)
        }
    }

    return (
        <Box>
            <Typography variant="h2" align="center" marginBottom={2} marginTop={10}>
                Solid Platform
            </Typography>
            <form onChange={handleChange} onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '20%', margin: '0 auto' }}>
                    <FormControl>
                        <InputLabel htmlFor="username">Usuario</InputLabel>
                        <Input id="username" type="text" name="username" value={formData.username} />
                        {errors.username?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es requerido.
                            </Typography>
                        }
                        {errors.username?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <Input id="password" type="password" name="password" value={formData.password} />
                        {errors.password?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es requerida.
                            </Typography>
                        }
                        {errors.password?.type === 'minLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado corta.
                            </Typography>
                        }
                        {errors.password?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <Button type="submit" variant="contained" sx={{
                            width: '100%',
                            margin: '0 auto',
                            marginTop: 1
                        }} disabled={disabled}>
                            INICIAR SESIÓN
                        </Button>
                    </FormControl>
                </Box>
            </form>
        </Box>
    )
}