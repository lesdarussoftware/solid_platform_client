import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"
import { Header } from "../components/common/Header"
import { LoginForm } from "../components/common/LoginForm"

export function Error() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    return (
        <>
            {auth ?
                <Box sx={{ paddingX: 2 }}>
                    <Header />
                    <Typography variant="h4" align="center" marginTop={3}>
                        404 - Página no encontrada.
                    </Typography>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ display: 'block', margin: '0 auto', marginTop: 2 }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Volver
                    </Button>
                </Box> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <Box sx={{ width: '30%' }}>
                        <Typography variant="h6" align="center" marginBottom={1}>
                            Inicie sesión para usar el sistema
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    )
}