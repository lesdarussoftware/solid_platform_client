import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";

export function Profile() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    const {
        formData: formDataUser,
        handleChange: handleChangeUser,
        disabled: disabledUser,
        setDisabled: setDisabledUser,
        validate: validateUser,
        reset: resetUser,
        errors: errorsUser
    } = useForm({
        defaultData: {
            id: auth?.me.id,
            first_name: auth?.me.first_name,
            last_name: auth?.me.last_name,
            username: auth?.me.username
        },
        rules: {
            first_name: {
                required: true,
                maxLength: 55
            },
            last_name: {
                required: true,
                maxLength: 55
            },
            username: {
                required: true,
                maxLength: 55
            }
        }
    })
    const {
        formData: formDataPwd,
        handleChange: handleChangePwd,
        disabled: disabledPwd,
        setDisabled: setDisabledPwd,
        validate: validatePwd,
        reset: resetPwd,
        errors: errorsPwd
    } = useForm({
        defaultData: {
            id: auth?.me.id,
            email: auth?.me.email,
            password: '',
            repeat: ''
        },
        rules: {
            password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            repeat: {
                required: true,
                minLength: 8,
                maxLength: 255
            }
        }
    })
    const { handleModifyData } = useUsers()

    const [dataHasChanged, setDataHasChanged] = useState(false)

    useEffect(() => {
        if (
            formDataUser.first_name === auth?.me.first_name &&
            formDataUser.last_name === auth?.me.last_name &&
            formDataUser.username === auth?.me.username) {
            setDataHasChanged(false)
        } else {
            setDataHasChanged(true)
        }
    }, [formDataUser])

    return (
        <>
            {auth ?
                <Layout>
                    <Box sx={{ margin: 2 }}>
                        <Button type="button" variant="contained" sx={{ marginBottom: 2 }} onClick={() => navigate('/tarjas')}>
                            Volver a tarjas
                        </Button>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, md: 0 } }}>
                            <Box sx={{ width: { xs: '100%', md: '45%' }, border: '1px solid gray', borderRadius: 1, padding: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
                                    <Typography variant="h6">
                                        Perfil
                                    </Typography>
                                    <Typography variant="caption" color="gray">
                                        * Si cambia sus datos, deberá iniciar sesión nuevamente.
                                    </Typography>
                                </Box>
                                <form
                                    onChange={handleChangeUser}
                                    onSubmit={e => handleModifyData(e, validateUser, formDataUser, setDisabledUser, resetUser)}
                                    style={{ marginTop: 15 }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <FormControl>
                                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                                            <Input id="first_name" type="text" name="first_name" value={formDataUser.first_name} />
                                            {errorsUser.first_name?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre es requerido.
                                                </Typography>
                                            }
                                            {errorsUser.first_name?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre es demasiado largo.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                                            <Input id="last_name" type="text" name="last_name" value={formDataUser.last_name} />
                                            {errorsUser.last_name?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El apellido es requerido.
                                                </Typography>
                                            }
                                            {errorsUser.last_name?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El apellido es demasiado largo.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="username">Usuario</InputLabel>
                                            <Input id="username" type="text" name="username" value={formDataUser.username} />
                                            {errorsUser.username?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre de usuario es requerido.
                                                </Typography>
                                            }
                                            {errorsUser.username?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre de usuario es demasiado largo.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            justifyContent: 'center'
                                        }}>
                                            <Button type="submit" variant="contained" disabled={disabledUser || !dataHasChanged}>
                                                Guardar
                                            </Button>
                                        </FormControl>
                                    </Box>
                                </form>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '45%' }, border: '1px solid gray', borderRadius: 1, padding: 2 }}>
                                <Typography variant="h6">
                                    Cambiar contraseña
                                </Typography>
                                <form
                                    onChange={handleChangePwd}
                                    onSubmit={e => handleModifyData(e, validatePwd, formDataPwd, setDisabledPwd, resetPwd, true)}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <FormControl>
                                            <InputLabel htmlFor="password">Contraseña nueva</InputLabel>
                                            <Input id="password" type="password" name="password" value={formDataPwd.password} />
                                            {errorsPwd.password?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este campo es requerido.
                                                </Typography>
                                            }
                                            {errorsPwd.password?.type === 'minLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este valor es demasiado corto.
                                                </Typography>
                                            }
                                            {errorsPwd.password?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este valor es demasiado largo.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="repeat">Repetir contraseña nueva</InputLabel>
                                            <Input id="repeat" type="password" name="repeat" value={formDataPwd.repeat} />
                                            {errorsPwd.repeat?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este campo es requerido.
                                                </Typography>
                                            }
                                            {errorsPwd.repeat?.type === 'minLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este valor es demasiado corto.
                                                </Typography>
                                            }
                                            {errorsPwd.repeat?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Este valor es demasiado largo.
                                                </Typography>
                                            }
                                            {formDataPwd.password === formDataPwd.repeat &&
                                                formDataPwd.password.length > 0 &&
                                                formDataPwd.repeat.length > 0 &&
                                                <Typography variant="caption" color="green" marginTop={1}>
                                                    * Las contraseñas coinciden.
                                                </Typography>
                                            }
                                            {formDataPwd.password !== formDataPwd.repeat &&
                                                formDataPwd.password.length > 0 &&
                                                formDataPwd.repeat.length > 0 &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * Las contraseñas no coinciden.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            justifyContent: 'center'
                                        }}>
                                            <Button type="submit" variant="contained" disabled={disabledPwd}>
                                                Guardar
                                            </Button>
                                        </FormControl>
                                    </Box>
                                </form>
                            </Box>
                        </Box>
                    </Box>
                </Layout> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <Box sx={{ width: '30%' }}>
                        <Typography variant="h6" align="center" marginBottom={1}>
                            Inicie sesión para usar el sistema
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    )
}