import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Breadcrumbs, Button, LinearProgress, Typography } from "@mui/material";
import { format } from "date-fns";

import { useFortnights } from "../../hooks/useFortnights";

import { DataGrid } from "../datagrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";

export function SiteDetails({ site, setOpenSite }) {

    const { fortnights, getFortnights, filter, setFilter, loadingFortnights, count } = useFortnights()

    useEffect(() => {
        const { page, offset } = filter
        getFortnights(`/${site.id}?page=${page}&offset=${offset}`)
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
            id: "start_date",
            numeric: false,
            disablePadding: true,
            label: "Inicio",
            accessor: (row) => format(new Date(row.start_date), 'dd/MM/yyyy')
        },
        {
            id: "end_date",
            numeric: false,
            disablePadding: true,
            label: "Fin",
            accessor: (row) => format(new Date(row.end_date), 'dd/MM/yyyy')
        },
        {
            id: "in_hour",
            numeric: false,
            disablePadding: true,
            label: "Entrada",
            accessor: 'in_hour'
        },
        {
            id: "out_hour",
            numeric: false,
            disablePadding: true,
            label: "Salida",
            accessor: 'out_hour'
        },
        {
            id: "lunch",
            numeric: false,
            disablePadding: true,
            label: "Almuerzo",
            accessor: (row) => row.lunch ? 'Sí' : 'No'
        }
    ], [])

    return (
        <Box sx={{ m: 1, mt: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', justifyContent: 'start' }}>
                <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setOpenSite(null)}>
                    Volver a obras
                </Link>
                <Typography color="text.primary">Quincenas de {site.name}</Typography>
            </Breadcrumbs>
            {loadingFortnights ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained">
                        Agregar
                    </Button>
                    <DataGrid
                        headCells={headCells}
                        rows={fortnights}
                        filter={filter}
                        setFilter={setFilter}
                        count={count}
                    >
                        <ModalComponent >

                        </ModalComponent>
                    </DataGrid>
                </Box>
            }
        </Box>
    )
}