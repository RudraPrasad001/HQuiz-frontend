
import { BrowserRouter,Routes,Route } from "react-router"
import Home from "./Home"
import QuizCreation from "./QuizCreation"
function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/createQuiz" Component={QuizCreation} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
