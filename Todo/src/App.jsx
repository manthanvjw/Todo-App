import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Status from './Status'
import Activity from './Activity'
import Navbar from './Navbar'
export default function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={< Status/>} />
        <Route path="/activity" element={< Activity/>} />
      </Routes>
    </Router>
  )
}
