import { useContext, useEffect, useMemo } from "react"
import { Box, Button, LinearProgress, Typography } from "@mui/material"
import { format } from "date-fns"

import { DataContext } from "../../providers/DataProvider"
import { useChiefs } from "../../hooks/useChiefs"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"
import { PersonalForm } from "../common/PersonalForm"

export function ChiefsAbm() {

    const { state } = useContext(DataContext)

    const { getChiefs, open, setOpen, handleSubmit, handleDelete, filter, setFilter, count, loadingChiefs } = useChiefs()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: {
            id: '',
            dni: '',
            first_name: '',
            last_name: '',
            cuil: '',
            birth: '',
            address: '',
            city: '',
            cell_phone: '',
            observations: '',
            regime: ''
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
            },
            cuil: {
                maxLength: 55
            },
            address: {
                maxLength: 55
            },
            city: {
                maxLength: 55
            },
            cell_phone: {
                maxLength: 55
            },
            observations: {
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        const { page, offset } = filter
        getChiefs(`?page=${page}&offset=${offset}`)
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
        },
        {
            id: "cuil",
            numeric: false,
            disablePadding: true,
            label: "CUIL",
            accessor: 'cuil'
        },
        {
            id: "birth",
            numeric: false,
            disablePadding: true,
            label: "Fecha Nac.",
            accessor: (row) => row.birth ? format(new Date(row.birth), 'dd/MM/yyyy') : ''
        },
        {
            id: "address",
            numeric: false,
            disablePadding: true,
            label: "Dirección",
            accessor: 'address'
        },
        {
            id: "city",
            numeric: false,
            disablePadding: true,
            label: "Localidad",
            accessor: 'city'
        },
        {
            id: "cell_phone",
            numeric: false,
            disablePadding: true,
            label: "Celular",
            accessor: 'cell_phone'
        },
        {
            id: "observations",
            numeric: false,
            disablePadding: true,
            label: "Observaciones",
            accessor: 'observations'
        },
        {
            id: "regime",
            numeric: false,
            disablePadding: true,
            label: "Régimen",
            accessor: 'regime'
        }
    ], [])

    return (
        <>
            {loadingChiefs ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={state.chiefs}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showEditAction
                    showDeleteAction
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={500} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nuevo capataz'}
                            {open === 'EDIT' && `Editar capataz #${formData.id}`}
                        </Typography>
                        <PersonalForm
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            validate={validate}
                            formData={formData}
                            disabled={disabled}
                            setDisabled={setDisabled}
                            reset={reset}
                            setOpen={setOpen}
                            errors={errors}
                        />
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
            }
        </>
    )
}