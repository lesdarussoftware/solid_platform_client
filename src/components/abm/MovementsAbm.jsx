import { useContext, useEffect } from "react"
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material"
import { format } from 'date-fns'

import { DataContext } from "../../providers/DataProvider"
import { useMovements } from "../../hooks/useMovements"
import { useForm } from "../../hooks/useForm"
import { useSites } from "../../hooks/useSites"

import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination"

export function MovementsAbm() {

    const { state } = useContext(DataContext)

    const { getMovements } = useMovements()
    const { getSites } = useSites()
    const { formData, reset, handleChange } = useForm({
        defaultData: { worker: '', site: '' }
    })

    useEffect(() => {
        getMovements()
        getSites()
    }, [])

    const headCells = [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "worker",
            numeric: false,
            disablePadding: true,
            label: "Empleado",
            accessor: (row) => `${row.worker.first_name} ${row.worker.last_name}`
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy HH:mm:ss')
        },
        {
            id: "type",
            numeric: false,
            disablePadding: true,
            label: "Evento",
            accessor: 'type'
        },
        {
            id: "site_name",
            numeric: false,
            disablePadding: true,
            label: "Obra",
            accessor: 'site_name'
        },
    ]

    return (
        <DataGridWithFrontendPagination
            headCells={headCells}
            rows={state.movements.filter(m => {
                return (formData.worker.length === 0 && formData.site.length === 0) ||
                    (
                        (formData.site.length === 0 || m.site_name === formData.site) &&
                        (formData.worker.length === 0 || (m.worker.first_name.includes(formData.worker) || m.worker.last_name.includes(formData.worker)))
                    )
            })}
            contentHeader={
                <Box sx={{ width: '60%', display: 'flex', gap: 2, justifyContent: 'space-between', margin: 1, alignItems: 'center' }}>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel htmlFor="worker">Empleado</InputLabel>
                        <Input
                            id="worker"
                            name="worker"
                            value={formData.worker}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel id="site-select">Obra</InputLabel>
                        <Select
                            labelId="site-select"
                            id="site"
                            value={formData.site}
                            label="Obra"
                            name="site"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            {state.sites.map(s => (
                                <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button sx={{ width: '33%' }} type="button" variant="outlined" onClick={() => reset()}>
                        Reiniciar filtro
                    </Button>
                </Box>
            }
        />
    )
}