import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { format } from "date-fns"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"
import { useCategories } from "../../hooks/useCategories"
import { useWorkers } from "../../hooks/useWorkers"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"
import { QrsAbm } from "./QrsAbm"
import { PersonalForm } from "../common/PersonalForm"

export function WorkersAbm() {

    const { state } = useContext(DataContext)

    const { getCategories, loadingCategories } = useCategories()
    const { getWorkers, open, setOpen, handleSubmit, handleDelete, filter, setFilter, count, loadingWorkers } = useWorkers()
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
            category_id: '',
            qr: '',
            observations: '',
            regime: '',
            can_scan: ''
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
            category_id: {
                required: true
            },
            observations: {
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        const { page, offset } = filter
        getWorkers(`?page=${page}&offset=${offset}`)
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
            label: "DNI",
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
            id: "cell_phone",
            numeric: false,
            disablePadding: true,
            label: "Celular",
            accessor: 'cell_phone'
        },
        {
            id: "category",
            numeric: false,
            disablePadding: true,
            label: "Categoría",
            accessor: (row) => row.category.name
        },
        {
            id: "regime",
            numeric: false,
            disablePadding: true,
            label: "Régimen",
            accessor: 'regime'
        },
        {
            id: "qr",
            numeric: false,
            disablePadding: true,
            label: "QR",
            accessor: (row) => {
                if (row.qrs.length > 0) {
                    return (
                        <img
                            width={50}
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${row.qrs[0].hash}`}
                        />
                    )
                }
            }
        },
        {
            id: "can_scan",
            numeric: false,
            disablePadding: true,
            label: "Puede escanear",
            accessor: (row) => row.can_scan ? 'Sí' : 'No'
        }
    ], [])

    return (
        <>
            {loadingWorkers || loadingCategories ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={state.workers}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showEditAction
                    showDeleteAction
                    showViewAction
                    contentHeader={
                        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
                            <Button type="button" variant="contained" onClick={() => setOpen('GENERATE-QR')}>
                                Generar QR
                            </Button>
                            <Button type="button" variant="contained" onClick={() => setOpen('PRINT-QR')}>
                                Imprimir QR
                            </Button>
                            <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                        </Box>
                    }
                >
                    <QrsAbm open={open} setOpen={setOpen} />
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={500} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                            {open === 'NEW' && 'Registrar nuevo operario'}
                            {open === 'EDIT' && `Editar operario #${formData.id}`}
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
                            {`¿Desea borrar el registro del operario ${formData.first_name + ' ' + formData.last_name} (#${formData.id})?`}
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
                    <ModalComponent open={open === 'VIEW'} onClose={() => setOpen(null)} reduceWidth={400}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`Detalles del registro #${formData.id}`}
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Fecha nacimiento</TableCell>
                                        <TableCell align="center">Dirección</TableCell>
                                        <TableCell align="center">Localidad</TableCell>
                                        <TableCell align="center">Observaciones</TableCell>
                                        <TableCell align="center">Fecha creación</TableCell>
                                        <TableCell align="center">Fecha modificación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">
                                            {formData.birth ? format(new Date(formData.birth), 'dd/MM/yyyy') : ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.address}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.city}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.observations}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.created_at ? format(new Date(), 'dd/MM/yyyy') : ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formData.created_at ? format(new Date(formData.updated_at), 'dd/MM/yyyy') : ''}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{
                                    width: '20%',
                                    margin: '0 auto',
                                    marginTop: 2
                                }}
                                onClick={() => setOpen(null)}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGrid>
            }
        </>
    )
}