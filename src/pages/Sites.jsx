import { useContext } from "react"
import { Box, Typography } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"

import { LoginForm } from "../components/common/LoginForm"
import { SitesAbm } from "../components/abm/SitesAbm"
import { Layout } from "../components/common/Layout"

export function Sites() {

    const { auth } = useContext(AuthContext)

    return (
        <>
            {auth ?
                <Layout>
                    <SitesAbm />
                </Layout> :
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