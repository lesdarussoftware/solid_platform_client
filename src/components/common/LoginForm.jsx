import { useContext } from "react"
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material"

import { AuthContext } from "../../providers/AuthProvider"
import { MessageContext } from "../../providers/MessageProvider"
import { useForm } from "../../hooks/useForm"
import { useAuth } from "../../hooks/useAuth"

import { STATUS_CODES } from "../../helpers/statusCodes"

export function LoginForm({ submitAction }) {

    const { setAuth } = useContext(AuthContext)
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext)
    const { formData, errors, disabled, setDisabled, handleChange, validate } = useForm({
        defaultData: { username: '', password: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 191 }
        }
    })
    const { login } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { username, password } = formData
            const { status, data } = await login({ username, password })
            if (status === STATUS_CODES.OK) {
                setAuth(data)
                localStorage.setItem('solid_auth', JSON.stringify(data))
                if (submitAction) submitAction()
            } else {
                if (status === STATUS_CODES.UNAUTHORIZED) {
                    setMessage('Credenciales inválidas.')
                    setSeverity('error')
                    setOpenMessage(true)
                }
                setDisabled(false)
            }
        } else {
            setDisabled(false)
        }
    }

    return (
        <form onChange={handleChange} onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl>
                    <InputLabel htmlFor="username" sx={{ color: '#012561' }}>Usuario</InputLabel>
                    <Input id="username" type="text" name="username" value={formData.username} sx={{ color: '#012561' }} />
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
                    <InputLabel htmlFor="password" sx={{ color: '#012561' }}>Contraseña</InputLabel>
                    <Input id="password" type="password" name="password" value={formData.password} sx={{ color: '#012561' }} autoComplete="" />
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
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: '50%',
                            margin: '0 auto',
                            marginTop: 1,
                            color: '#fff'
                        }}
                        disabled={disabled}
                    >
                        Ingresar
                    </Button>
                </FormControl>
            </Box>
        </form>
    )
}