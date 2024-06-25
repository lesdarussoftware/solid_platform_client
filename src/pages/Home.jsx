import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Home() {

    const navigate = useNavigate()

    return (
        <Box>
            <Typography variant="h1">
                Solid Platform
            </Typography>
            <Button variant="contained" onClick={() => navigate('/escanear')}>
                Escanear
            </Button>
        </Box>
    )
}