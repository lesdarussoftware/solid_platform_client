/* eslint-disable react/prop-types */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { AuthContext } from "../../providers/AuthProvider";
import { useAuth } from "../../hooks/useAuth";

export function UserDropdown({ setShowUserDropdown }) {

  const { auth } = useContext(AuthContext)

  const navigate = useNavigate()

  const { handleLogout } = useAuth()

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '185px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'black',
        top: '40px',
        right: 10,
        borderRadius: '0.5rem',
        textAlign: 'start',
        color: 'white',
        zIndex: 10,
      }}
      onMouseLeave={() => setShowUserDropdown(false)}
    >
      <Box sx={{
        display: 'flex',
        width: '100%',
        marginY: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem', // 0.25rem es el valor por defecto para gap-1 en Tailwind
      }}>
        <Box sx={{
          width: '100%',
          height: 'auto',
          paddingTop: '0.5rem', // 0.5rem es el valor por defecto para pt-2 en Tailwind
          fontWeight: '600', // 600 es el valor para font-semibold en Tailwind
          textAlign: 'center',
        }}>
          <Typography variant="body1" align="center">
            {auth?.me.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        fontSize: '0.75rem', // 0.75rem es el valor por defecto para text-xs en Tailwind
        fontWeight: '300', // 300 es el valor para font-thin en Tailwind
        padding: '0.75rem', // 0.75rem es el valor por defecto para p-3 en Tailwind
        width: '100%',
      }}>
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            margin: '0 auto',
            marginBottom: 1,
            width: '80%',
            padding: '0.25rem', // 0.25rem es el valor por defecto para p-1 en Tailwind
            borderRadius: '0.375rem', // 0.375rem es el valor por defecto para rounded-md en Tailwind
            color: '#fff',
            ':hover': {
              color: '#1f2937', // #1f2937 es el valor por defecto para text-gray-950 en Tailwind
              backgroundColor: '#f9fafb', // #f9fafb es el valor por defecto para bg-gray-50 en Tailwind
            },
          }}
          onClick={() => navigate('/perfil')}
        >
          <AccountBoxIcon />
          Perfil
        </Button>
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            margin: '0 auto',
            width: '80%',
            padding: '0.25rem', // 0.25rem es el valor por defecto para p-1 en Tailwind
            borderRadius: '0.375rem', // 0.375rem es el valor por defecto para rounded-md en Tailwind
            color: '#fff',
            ':hover': {
              color: '#1f2937', // #1f2937 es el valor por defecto para text-gray-950 en Tailwind
              backgroundColor: '#f9fafb', // #f9fafb es el valor por defecto para bg-gray-50 en Tailwind
            },
          }}
          onClick={handleLogout}
        >
          <ExitToAppIcon />
          Salir
        </Button>
      </Box>
    </Box>
  )
}