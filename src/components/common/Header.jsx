import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export function Header() {

    const { handleLogout } = useAuth()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, paddingY: 1 }}>
            <Typography variant="h6" align="center">
                Solid Platform
            </Typography>
            <Button type="button" variant="contained" onClick={handleLogout}>
                Salir
            </Button>
        </Box>
    )
}