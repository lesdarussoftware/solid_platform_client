import { useContext, useEffect, useMemo } from "react";
import { Box, Breadcrumbs, LinearProgress, Link, Typography } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useWorkers } from "../../hooks/useWorkers";

import { DataGrid } from "../datagrid/DataGrid";

export function WorkersStatus({ setShow }) {

    const { state } = useContext(DataContext);

    const { getWorkers, loadingWorkers, count, filter, setFilter } = useWorkers();

    useEffect(() => {
        const { page, offset } = filter
        getWorkers(`?page=${page}&offset=${offset}&in_site=true`)
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
                {loadingWorkers ?
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box> :
                    <DataGrid
                        headCells={headCells}
                        rows={state.workers}
                        filter={filter}
                        setFilter={setFilter}
                        count={count}
                    />
                }
            </Box>
        </>
    );
}