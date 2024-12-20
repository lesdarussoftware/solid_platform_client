import { useEffect } from "react"
import { Box, Button, LinearProgress, Typography } from "@mui/material"

import { useTrash } from "../../hooks/useTrash";
import { useActivities } from "../../hooks/useActivities";

import { DataGrid } from "../datagrid/DataGrid"
import { ModalComponent } from "../common/ModalComponent"

export function ActivitiesTrash({ selected, setSelected }) {

    const { getElements, elements, open, setOpen, handleDelete, handleRestore, filter, setFilter, count, loading } = useTrash()
    const { headCells } = useActivities();

    useEffect(() => {
        const { page, offset } = filter
        getElements({
            entity: 'activities',
            params: `?page=${page}&offset=${offset}`
        })
    }, [filter])

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
                            {`¿Desea restaurar el registro #${selected?.id}?`}
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
                                    entity: 'activities',
                                    selected,
                                    message: 'Registro restaurado correctamente.'
                                })}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                    <ModalComponent open={open === 'DELETE'} onClose={() => setOpen(null)}>
                        <Typography variant="h6" sx={{ marginBottom: 1, textAlign: 'center' }}>
                            {`¿Desea borrar definitivamente el registro #${selected?.id}?`}
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
                                    entity: 'activities',
                                    selected,
                                    message: 'Registro eliminado definitivamente.'
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