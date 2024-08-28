import { useContext, useEffect, useMemo } from "react";
import { Box, Breadcrumbs, Link, Typography, Autocomplete, FormControl, TextField } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useWorkers } from "../../hooks/useWorkers";

import { DataGrid } from "../datagrid/DataGrid";

export function WorkersStatus({ setShow }) {

    const { state } = useContext(DataContext);

    const { getWorkers, count, filter, setFilter, allWorkers, getAllWorkers } = useWorkers();

    useEffect(() => {
        getAllWorkers()
    }, [])

    useEffect(() => {
        const { page, offset, worker_name, site_name } = filter
        if (worker_name.length > 0 || site_name.length > 0) {
            getWorkers(`?page=${page}&offset=${offset}&in_site=true${worker_name.length > 0 ? `&worker_name=${worker_name}` : ''}${site_name.length > 0 ? `&site_name=${site_name}` : ''}`)
        }
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
            id: "in_site",
            numeric: false,
            disablePadding: true,
            label: "En obra",
            accessor: 'in_site'
        }
    ], [])

    return (
        <>
            <Box sx={{ margin: 1 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setShow(null)}>
                        Volver a reportes
                    </Link>
                    <Typography color="text.primary">Estado de operarios</Typography>
                </Breadcrumbs>
                <Typography variant="h5" marginBottom={1}>Estado de operarios</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: { xs: '100%', md: '30%' } }}>
                    <FormControl sx={{ width: '50%' }}>
                        <Autocomplete
                            disablePortal
                            id="worker-autocomplete"
                            options={allWorkers.map(w => ({ label: `${w.last_name} ${w.first_name}`, id: w.id }))}
                            noOptionsText="No hay operarios disponibles."
                            onChange={(_, value) => setFilter({
                                ...filter,
                                worker_name: value?.label ?? ''
                            })}
                            renderInput={(params) => <TextField {...params} label="Operario" />}
                            value={filter.worker_name}
                            isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                        <Autocomplete
                            disablePortal
                            id="site-autocomplete"
                            options={state.sites.map(s => ({ label: s.name, id: s.id }))}
                            noOptionsText="No hay obras disponibles."
                            onChange={(_, value) => setFilter({
                                ...filter,
                                site_name: value?.label ?? ''
                            })}
                            renderInput={(params) => <TextField {...params} label="Obra" />}
                            value={filter.site_name}
                            isOptionEqualToValue={(option, value) => value.length === 0 || option.label === value}
                        />
                    </FormControl>
                </Box>
                <DataGrid
                    headCells={headCells}
                    rows={filter.site_name.length > 0 || filter.worker_name.length > 0 ? state.workers : []}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                />
            </Box>
        </>
    );
}