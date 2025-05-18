/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import EditIcon from '@mui/icons-material/Edit'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import RestoreFromTrashSharpIcon from '@mui/icons-material/RestoreFromTrashSharp';

import { EnhancedTableHead } from './EnhancedTableHead';

import { getComparator, stableSort } from '../../helpers/utils';
import { IconButton, Tooltip } from '@mui/material';

export function DataGrid({
    children,
    headCells,
    rows,
    contentHeader,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    setFormData,
    setOpen,
    showViewAction,
    showEditAction,
    showDeleteAction,
    showRestoreAction,
    filter,
    setFilter,
    count,
    minWidth = 750
}) {

    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);

    const handleRequestSort = (_, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_, newPage) => {
        setFilter({ ...filter, page: newPage });
    }

    const handleChangeRowsPerPage = (event) => {
        setFilter({
            ...filter,
            offset: parseInt(event.target.value, 10),
            page: 0
        })
    }

    const visibleRows = useMemo(() => {
        return stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter))
    },
        [order, orderBy, rows, filter.page]
    );

    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            {contentHeader}
            <Paper sx={{ mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth, fontWeight: "bold" }}
                        aria-labelledby="tableTitle"
                        size="small"
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            addCell={showEditAction || showDeleteAction || showViewAction}
                        />
                        <TableBody>
                            {visibleRows && visibleRows.length > 0 ? (
                                visibleRows.map((row, index) => {
                                    return (
                                        <TableRow
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            {(showEditAction || showDeleteAction || showViewAction) &&
                                                <TableCell>
                                                    {showViewAction &&
                                                        <Tooltip
                                                            title="Detalles"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("VIEW")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <SearchSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {showEditAction &&
                                                        <Tooltip
                                                            title="Editar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("EDIT")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {showRestoreAction &&
                                                        <Tooltip
                                                            title="Restaurar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("RESTORE")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <RestoreFromTrashSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {showDeleteAction &&
                                                        <Tooltip
                                                            title="Borrar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("DELETE")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <DeleteSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </TableCell>
                                            }
                                            {headCells.map((cell) => cell.accessor).map((accessor) => (
                                                <TableCell
                                                    key={accessor}
                                                    align="center"
                                                >
                                                    {typeof accessor === "function"
                                                        ? accessor(row, index)
                                                        : row[accessor]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={headCells.length + 1}
                                        align="inherit"
                                        sx={{
                                            fontSize: "1rem",
                                            textAlign: 'center'
                                        }}
                                    >
                                        No se encontraron registros. Pruebe actualizar la página.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 60, 100]}
                    component="div"
                    count={-1}
                    rowsPerPage={filter.offset}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to }) => `${from}–${to} de ${count}`}
                    page={filter.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    slotProps={{
                        actions: {
                            nextButton: {
                                disabled: ((filter.page + 1) * filter.offset) >= count
                            }
                        }
                    }}
                />
            </Paper>
            {children}
        </Box>
    );
}