import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AuthProvider } from "./providers/AuthProvider"
import { DataProvider } from "./providers/DataProvider"
import { MessageProvider } from "./providers/MessageProvider"
import { NotificationsProvider } from "./providers/NotificationsProvider"

import { Home } from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import { Scan } from "./pages/Scan"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MessageProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/escanear" element={<Scan />} />
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </MessageProvider>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
