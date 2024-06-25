import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Home } from "./pages/Home"
import { Scan } from "./pages/Scan"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escanear" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
