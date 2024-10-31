import { useEffect, useMemo } from "react"
import { Box, Button, LinearProgress, Typography } from "@mui/material"

import { useTrash } from "../../hooks/useTrash";

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function SitesTrash({ selected, setSelected }) {

    const { getElements, elements, open, setOpen, handleDelete, filter, setFilter, count, loading } = useTrash()

    useEffect(() => {
        const { page, offset } = filter
        getElements({
            entity: 'sites',
            params: `?page=${page}&offset=${offset}`
        })
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
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    headCells={headCells}
                    rows={elements}
                    setOpen={setOpen}
                    setFormData={setSelected}
                    filter={filter}
                    setFilter={setFilter}
                    count={count}
                    showDeleteAction
                >
                    <ModalComponent open={open === 'DELETE'} onClose={() => setOpen(null)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea borrar definitivamente el registro de la obra ${selected?.name} (#${selected?.id})?`}
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
                                onClick={() => setOpen(null)}
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
                                onClick={() => handleDelete({
                                    entity: 'sites',
                                    selected,
                                    message: 'Obra eliminada definitivamente.'
                                })}
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