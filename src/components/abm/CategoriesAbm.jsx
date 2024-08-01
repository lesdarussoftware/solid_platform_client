import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import SearchSharpIcon from '@mui/icons-material/SearchSharp'

import { DataContext } from "../../providers/DataProvider"
import { useCategories } from "../../hooks/useCategories"
import { useForm } from "../../hooks/useForm"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"
import { MONTHS } from "../../helpers/constants"

export function CategoriesAbm() {

    const { state } = useContext(DataContext)

    const {
        getCategories,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        filter,
        setFilter,
        count,
        loadingCategories,
        workOn,
        setWorkOn
    } = useCategories()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: { id: '', name: '' },
        rules: { name: { required: true, maxLength: 191 } }
    })

    useEffect(() => {
        const { page, offset } = filter
        getCategories(`?page=${page}&offset=${offset}`)
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
        },
        {
            id: "rate",
            numeric: false,
            disablePadding: true,
            label: "Cotizaciones/mes UOCRA",
            disableSorting: true,
            accessor: (row) => (
                <Button type="button" variant="contained" onClick={() => setWorkOn(row)}>
                    <SearchSharpIcon />
                </Button>
            )
        }
    ], [])

    return (
        <>
            {loadingCategories ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Box sx={{ width: { xs: '100%', lg: workOn ? '40.5%' : '60.5%' } }}>
                        <DataGrid
                            headCells={headCells}
                            rows={state.categories}
                            setOpen={setOpen}
                            setFormData={setFormData}
                            filter={filter}
                            setFilter={setFilter}
                            count={count}
                            showEditAction
                            showDeleteAction
                            contentHeader={
                                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                    <Button type="button" variant="contained" onClick={() => setOpen('NEW')}>
                                        Agregar
                                    </Button>
                                </Box>
                            }
                        >
                            <ModalComponent open={open === 'NEW' || open === 'EDIT'} reduceWidth={900} onClose={() => reset(setOpen)}>
                                <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                                    {open === 'NEW' && 'Registrar nueva categoría'}
                                    {open === 'EDIT' && `Editar categoría #${formData.id}`}
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
                                    {`¿Desea borrar el registro de la categoría ${formData.name} (#${formData.id})?`}
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
                    </Box>
                    <Box sx={{ width: { xs: '100%', lg: workOn ? '59%' : '39%' } }}>
                        {workOn ?
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {MONTHS.map(m => (
                                                <TableCell align="center" key={m}>{m}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workOn.rates.length === 0 ?
                                            <TableRow>
                                                <TableCell align="center" colSpan={12}>
                                                    No hay cotizaciones disponibles.
                                                </TableCell>
                                            </TableRow> :
                                            workOn.rates.map(rate => (
                                                <TableRow key={rate.id}>
                                                    {MONTHS.map(m => (
                                                        <TableCell align="center" key={m}>
                                                            {rate[m] ?? ''}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer> :
                            <Box sx={{ padding: 3, backgroundColor: '#BDBDBD', borderRadius: 1 }}>
                                <Typography variant="body1" textAlign="center" marginTop={2} color="#fff">
                                    Seleccione una categoría para ver sus cotizaciones por mes.
                                </Typography>
                                <SearchSharpIcon
                                    sx={{
                                        display: 'block',
                                        margin: '0 auto',
                                        marginTop: 2,
                                        marginBottom: 2,
                                        transform: 'scale(1.5)',
                                        color: '#fff'
                                    }}
                                />
                            </Box>
                        }
                    </Box>
                </Box>
            }
        </>
    )
}