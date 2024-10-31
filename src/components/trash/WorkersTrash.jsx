import { useEffect, useMemo } from "react"
import { Box, Button, LinearProgress, Typography } from "@mui/material"

import { useTrash } from "../../hooks/useTrash"

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function WorkersTrash({ selected, setSelected }) {

    const { getElements, elements, open, setOpen, handleDelete, handleRestore, filter, setFilter, count, loading } = useTrash()

    useEffect(() => {
        const { page, offset } = filter
        getElements({
            entity: 'workers',
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
                    showRestoreAction
                >
                    <ModalComponent open={open === 'RESTORE'} onClose={() => setOpen(null)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea restaurar el registro del operario ${`${selected?.first_name} ${selected?.last_name}`} (#${selected?.id})?`}
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
                                onClick={() => handleRestore({
                                    entity: 'workers',
                                    selected,
                                    message: 'Operario restaurado correctamente.'
                                })}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                    <ModalComponent open={open === 'DELETE'} onClose={() => setOpen(null)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea borrar definitivamente el registro del operario ${`${selected?.first_name} ${selected?.last_name}`} (#${selected?.id})?`}
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
                                    entity: 'workers',
                                    selected,
                                    message: 'Operario eliminado definitivamente.'
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