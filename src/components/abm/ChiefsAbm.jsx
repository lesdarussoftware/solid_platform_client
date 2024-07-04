import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { useChiefs } from "../../hooks/useChiefs"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function ChiefsAbm() {

    const { state } = useContext(DataContext)

    const { getChiefs, open, setOpen, handleSubmit, handleDelete } = useChiefs()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: {
            id: '',
            dni: '',
            first_name: '',
            last_name: '',
            qr: ''
        },
        rules: {
            dni: {
                required: true,
                maxLength: 8
            },
            first_name: {
                required: true,
                maxLength: 191
            },
            last_name: {
                required: true,
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        getChiefs()
    }, [])

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "dni",
            numeric: false,
            disablePadding: true,
            label: "Documento",
            accessor: 'dni'
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
        }
    ], [])

    return (
        <DataGrid
            headCells={headCells}
            rows={state.chiefs}
            setOpen={setOpen}
            setFormData={setFormData}
            showEditAction
            showDeleteAction
            contentHeader={
                <Box>
                    <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                        Agregar
                    </Button>
                </Box>
            }
        >
            <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                    {open === 'NEW' && 'Registrar nuevo capataz'}
                    {open === 'EDIT' && `Editar capataz #${formData.id}`}
                </Typography>
                <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {open === 'NEW' &&
                            <FormControl>
                                <InputLabel htmlFor="dni">DNI</InputLabel>
                                <Input id="dni" type="number" name="dni" value={formData.dni} />
                                {errors.dni?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El dni es requerido.
                                    </Typography>
                                }
                            </FormControl>
                        }
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
                    {`¿Desea borrar el registro del capataz ${formData.first_name + ' ' + formData.last_name} (#${formData.id})?`}
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
    )
}