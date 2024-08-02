import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Typography } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { useSites } from "../../hooks/useSites"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function SitesAbm() {

    const { state } = useContext(DataContext)

    const { getSites, open, setOpen, handleSubmit, handleDelete, filter, setFilter, count, loadingSites } = useSites()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: { id: '', name: '', },
        rules: { name: { required: true, maxLength: 191 } }
    })

    useEffect(() => {
        const { page, offset } = filter
        getSites(`?page=${page}&offset=${offset}`)
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
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Nombre",
            accessor: 'name'
        }
    ], [])

    return (
        <>
            {loadingSites ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={state.sites}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showEditAction
                    showDeleteAction
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: { xs: 5, sm: 2 }  }}>
                            <Typography variant="h6">
                                Obras
                            </Typography>
                            <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nueva obra'}
                            {open === 'EDIT' && `Editar obra #${formData.id}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel htmlFor="name">Nombre</InputLabel>
                                <Input id="name" type="text" name="name" value={formData.name} />
                                {errors.name?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El nombre es requerido.
                                    </Typography>
                                }
                                {errors.name?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El nombre es demasiado largo.
                                    </Typography>
                                }
                            </FormControl>
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
                            {`¿Desea borrar el registro de la obra ${formData.name} (#${formData.id})?`}
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