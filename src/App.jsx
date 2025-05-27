
import { BrowserRouter,Routes,Route } from "react-router"
import Home from "./Home"
function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
