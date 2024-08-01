import { useContext, useEffect, useMemo } from "react"
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import CancelIcon from '@mui/icons-material/Cancel';

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
        setWorkOn,
        handleSubmitRate,
        handleDeleteRate
    } = useCategories()
    const { formData, setFormData, handleChange, reset, disabled, setDisabled, errors, validate } = useForm({
        defaultData: { id: '', name: '' },
        rules: { name: { required: true, maxLength: 191 } }
    })
    const {
        formData: newRate,
        setFormData: setNewRate,
        handleChange: changeRate,
        reset: resetRate,
        errors: errorsRate,
        validate: validateRate
    } = useForm({
        defaultData: { id: '', category_id: '', rate: '', month: '', year: '' },
        rules: {
            rate: { required: true },
            month: { required: true },
            year: { required: true }
        }
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
            label: "Cotiz./mes UOCRA",
            disableSorting: true,
            accessor: (row) => (
                <Button
                    type="button"
                    variant="contained"
                    sx={{ backgroundColor: row.id === workOn?.id ? '#BDBDBD' : '' }}
                    onClick={() => {
                        if (workOn !== null && workOn.id === row.id) {
                            setWorkOn(null)
                        } else {
                            setWorkOn(row)
                        }
                    }}
                >
                    {workOn === null || workOn?.id !== row.id ?
                        <SearchSharpIcon /> :
                        <CancelIcon />
                    }
                </Button>
            )
        }
    ], [workOn])

    return (
        <>
            {loadingCategories ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Box sx={{ width: { xs: '100%', lg: workOn ? '35.5%' : '55.5%' } }}>
                        <DataGrid
                            headCells={headCells}
                            rows={state.categories}
                            setOpen={setOpen}
                            setFormData={setFormData}
                            filter={filter}
                            setFilter={setFilter}
                            count={count}
                            minWidth={500}
                            showEditAction
                            showDeleteAction
                            contentHeader={
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginTop: 1, marginBottom: 1 }}>
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
                    <Box sx={{ width: { xs: '100%', lg: workOn ? '64%' : '44%' } }}>
                        {workOn ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 1, marginBottom: 1, gap: 3 }}>
                                    <Typography variant="h6">
                                        {`Cotizaciones de ${workOn.name}`}
                                    </Typography>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        onClick={() => setOpen('NEW-RATE')}
                                    >
                                        Agregar cotización
                                    </Button>
                                </Box>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                {MONTHS.map(m => <TableCell align="center" key={m}>{m}</TableCell>)}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {workOn.rates.length === 0 ?
                                                <TableRow>
                                                    <TableCell align="center" colSpan={13}>
                                                        No hay cotizaciones disponibles.
                                                    </TableCell>
                                                </TableRow> :
                                                Array.from(new Set(workOn.rates.map(r => r.year))).map(year => (
                                                    <TableRow key={year}>
                                                        <TableCell align="center">{year}</TableCell>
                                                        {MONTHS.map(m => {
                                                            const value = workOn.rates.find(r => r.year === year && r.month === m)
                                                            const rate = value?.rate
                                                            return (
                                                                <TableCell
                                                                    align="center"
                                                                    key={`${m}-${year}`}
                                                                    onClick={() => {
                                                                        setNewRate(value)
                                                                        setOpen('EDIT-RATE')
                                                                    }}
                                                                    sx={{
                                                                        cursor: rate ? 'pointer' : '',
                                                                        ':hover': {
                                                                            color: rate ? '#FFF' : '',
                                                                            backgroundColor: rate ? '#BDBDBD' : ''
                                                                        }
                                                                    }}
                                                                >
                                                                    {`${rate ? rate : ''}`}
                                                                </TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </> :
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
                        <ModalComponent
                            open={open === 'NEW-RATE' || open === 'EDIT-RATE'}
                            reduceWidth={900}
                            onClose={() => resetRate(setOpen)}
                        >
                            <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                                {open === 'NEW-RATE' && `Nueva cotización de ${workOn?.name}`}
                                {open === 'EDIT-RATE' && `Editar cotización de ${workOn?.name} (${newRate.month}/${newRate.year})`}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {open === 'NEW-RATE' &&
                                        <>
                                            <FormControl sx={{ width: '70%' }}>
                                                <InputLabel id="month-select">Mes</InputLabel>
                                                <Select
                                                    labelId="month-select"
                                                    id="month"
                                                    value={newRate.month}
                                                    label="Mes"
                                                    name="month"
                                                    onChange={e => changeRate({ target: { name: 'month', value: e.target.value } })}
                                                >
                                                    <MenuItem value="">Seleccione</MenuItem>
                                                    {MONTHS.map(m => (
                                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                                    ))}
                                                </Select>
                                                {errorsRate.month?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El mes es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl sx={{ width: '70%' }}>
                                                <InputLabel htmlFor="year">Año</InputLabel>
                                                <Input
                                                    id="year"
                                                    type="number"
                                                    name="year"
                                                    value={newRate.year}
                                                    onChange={e => {
                                                        const value = parseInt(e.target.value) < 1 ? 1 : parseInt(e.target.value)
                                                        changeRate({ target: { name: 'year', value } })
                                                    }}
                                                />
                                                {errorsRate.year?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El año es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                        </>
                                    }
                                    <FormControl sx={{ width: '70%' }}>
                                        <InputLabel htmlFor="rate">Monto</InputLabel>
                                        <Input
                                            id="rate"
                                            type="number"
                                            name="rate"
                                            value={newRate.rate}
                                            onChange={e => {
                                                const value = parseInt(e.target.value) < 1 ? 1 : parseInt(e.target.value)
                                                changeRate({ target: { name: 'rate', value } })
                                            }}
                                        />
                                        {errorsRate.rate?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El monto es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        sx={{ width: '33%', marginTop: 1 }}
                                        onClick={() => resetRate(setOpen)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        sx={{ width: '33%', marginTop: 1 }}
                                        onClick={() => setOpen('DELETE-RATE')}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        sx={{ width: '33%', marginTop: 1 }}
                                        disabled={disabled}
                                        onClick={(e) => handleSubmitRate(e, validateRate, newRate, resetRate)}
                                    >
                                        Confirmar
                                    </Button>
                                </Box>
                            </Box>
                        </ModalComponent>
                        <ModalComponent open={open === 'DELETE-RATE'} onClose={() => reset(setOpen)}>
                            <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                                {`¿Desea borrar el registro de la cotización de ${workOn?.name} (${newRate.month}/${newRate.year})?`}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{ width: '50%', marginTop: 1 }}
                                    onClick={() => reset(setOpen)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    sx={{ width: '50%', marginTop: 1, color: '#fff' }}
                                    disabled={disabled}
                                    onClick={() => handleDeleteRate(newRate, reset)}
                                >
                                    Confirmar
                                </Button>
                            </Box>
                        </ModalComponent>
                    </Box>
                </Box>
            }
        </>
    )
}