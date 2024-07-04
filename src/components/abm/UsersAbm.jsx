import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Typography } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { useUsers } from "../../hooks/useUsers"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function UsersAbm() {

    const { state } = useContext(DataContext)

    const { getUsers, open, setOpen, handleSubmit, handleDelete, filter, setFilter, count, loadingUsers } = useUsers()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            username: '',
            password: ''
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
            },
            password: {
                required: true,
                minLength: 8,
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        const { page, offset } = filter
        getUsers(`?page=${page}&offset=${offset}`)
    }, [filter])

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "first_name",
            numeric: false,
            disablePadding: true,
            label: "Nombre",
            accessor: 'first_name'
        },
        {
            id: "last_name",
            numeric: false,
            disablePadding: true,
            label: "Apellido",
            accessor: 'last_name'
        },
        {
            id: "username",
            numeric: false,
            disablePadding: true,
            label: "Usuario",
            accessor: 'username'
        },
    ], [])

    return (
        <>
            {loadingUsers ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={state.users}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nuevo usuario'}
                            {open === 'EDIT' && `Editar usuario #${formData.id}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl>
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
                                <FormControl>
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
                                {open === 'NEW' &&
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
                                                * La contraseña es demasiado alrga.
                                            </Typography>
                                        }
                                    </FormControl>
                                }
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
                    </ModalComponent>
                    <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea borrar el registro del usuario ${formData.username} (#${formData.id})?`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{
                                    width: '50%',
                                    margin: '0 auto',
                                    marginTop: 1
                                }}
                                onClick={() => reset(setOpen)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    width: '50%',
                                    margin: '0 auto',
                                    marginTop: 1,
                                    color: '#fff'
                                }}
                                disabled={disabled}
                                onClick={() => handleDelete(formData, reset, setDisabled)}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGrid>
            }
        </>
    )
}