import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createTheme } from "@mui/material"
import { ThemeProvider } from "@emotion/react"

import { AuthProvider } from "./providers/AuthProvider"
import { DataProvider } from "./providers/DataProvider"
import { MessageProvider } from "./providers/MessageProvider"
// import { NotificationsProvider } from "./providers/NotificationsProvider"

import { Home } from "./pages/Home"
import { Tarjas } from "./pages/Tarjas"
import { Sites } from "./pages/Sites"
import { Users } from "./pages/Users"
import { Scan } from "./pages/Scan"
import { Profile } from "./pages/Profile"
import { Trash } from "./pages/Trash"
import { Error } from "./pages/Error"

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
      <MessageProvider>
        <AuthProvider>
          <DataProvider>
            {/* <NotificationsProvider> */}
            <BrowserRouter basename="/app2">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tarjas" element={<Tarjas />} />
                <Route path="/obras" element={<Sites />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/scanner" element={<Scan />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/papelera" element={<Trash />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </BrowserRouter>
            {/* </NotificationsProvider> */}
          </DataProvider>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  )
}

export default App
