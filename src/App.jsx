import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AuthProvider } from "./providers/AuthProvider"
import { DataProvider } from "./providers/DataProvider"
import { MessageProvider } from "./providers/MessageProvider"
import { NotificationsProvider } from "./providers/NotificationsProvider"

import { Home } from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import { Scan } from "./pages/Scan"
import { Profile } from "./pages/Profile"
import { Error } from "./pages/Error"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#000',
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DataProvider>
          <MessageProvider>
            <NotificationsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/escanear" element={<Scan />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </BrowserRouter>
            </NotificationsProvider>
          </MessageProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
