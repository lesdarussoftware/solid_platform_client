import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";

export function DetailsTables({ workOn }) {
    return (
        <>
            {workOn?.movs &&
                <>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        {workOn?.worker} - Ingresos / egresos
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Tipo</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
                                    <TableCell align="center">Creado por</TableCell>
                                    <TableCell align="center">Observaciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workOn?.movs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(mov => (
                                    <TableRow key={mov.id}>
                                        <TableCell align="center">{mov.id}</TableCell>
                                        <TableCell align="center">{mov.type}</TableCell>
                                        <TableCell align="center">{format(new Date(mov.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell align="center">{mov.created_by}</TableCell>
                                        <TableCell align="center">{mov.observations}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            {workOn?.activities &&
                <>
                    <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                        {workOn?.worker} - Horas extra
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Detalle</TableCell>
                                    <TableCell align="center">Entrada</TableCell>
                                    <TableCell align="center">Salida</TableCell>
                                    <TableCell align="center">Horas</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workOn?.activities.sort((a, b) => b.id - a.id).map(act => (
                                    <TableRow key={act.id}>
                                        <TableCell align="center">{act.id}</TableCell>
                                        <TableCell align="center">{act.description}</TableCell>
                                        <TableCell align="center">{format(new Date(act.in_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell align="center">{format(new Date(act.out_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell align="center">{act.hours}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
        </>
    );
}