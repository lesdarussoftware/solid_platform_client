import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { SiteStatus } from "./SiteStatus";
import { WorkersStatus } from "./WorkersStatus";

export function ReportsMenu() {

    const [show, setShow] = useState(null)

    const boxStyles = {
        background: 'linear-gradient(#FFF, #BDBDBD)',
        borderRadius: 1,
        padding: 1,
        width: '250px',
        height: '250px',
        transition: '200ms all',
        cursor: 'pointer',
        ':hover': {
            transform: 'scale(1.05)'
        }
    }

    return (
        <>
            {!show &&
                <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: 2, gap: 2 }}>
                    <Box sx={boxStyles} onClick={() => setShow('SITE_STATUS')}>
                        <Typography variant="h6" marginBottom={1}>Estado de obra</Typography>
                        <Typography variant="body1">
                            Permite calcular el total de obras trabajadas por operario por obra.
                        </Typography>
                    </Box>
                    <Box sx={boxStyles} onClick={() => setShow('WORKERS_STATUS')}>
                        <Typography variant="h6" marginBottom={1}>Estado de operarios</Typography>
                        <Typography variant="body1">
                            Permite ver si un operario está en obra o no.
                        </Typography>
                    </Box>
                </Box>
            }
            {show === 'SITE_STATUS' && <SiteStatus setShow={setShow} />}
            {show === 'WORKERS_STATUS' && <WorkersStatus setShow={setShow} />}
        </>
    );
}