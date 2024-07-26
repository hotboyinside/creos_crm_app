import './normalize.css'
import './App.css'

import Home from './pages/Home/Home'
import Diagrams from './pages/Diagrams/Diagrams'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/diagrams' element={<Diagrams />}></Route>
      </Routes>
    </>
  )
}

export default App
