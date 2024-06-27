import { BrowserRouter, Route, Routes } from "react-router-dom"

import { DataProvider } from "./providers/DataProvider"
import { MessageProvider } from "./providers/MessageProvider"

import { Home } from "./pages/Home"
import { Scan } from "./pages/Scan"

function App() {
  return (
    <DataProvider>
      <MessageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/escanear" element={<Scan />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </DataProvider>
  )
}

export default App
