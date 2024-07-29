import './normalize.css'
import './App.css'

import Home from './pages/Home/Home'
import Diagrams from './pages/Diagrams/Diagrams'
import Designers from './pages/Designers/Designers'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/diagrams' element={<Diagrams />}></Route>
        <Route path='/designers' element={<Designers />}></Route>
      </Routes>
    </>
  )
}

export default App
