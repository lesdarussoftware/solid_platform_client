import { BrowserRouter, Route, Routes } from "react-router-dom"

import { DataProvider } from "./providers/DataProvider"

import { Home } from "./pages/Home"
import { Scan } from "./pages/Scan"

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/escanear" element={<Scan />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
