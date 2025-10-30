import './App.css'
// import AddExperience from './Components/AddExperience'
import HomePage from './Components/HomePage'
import Navbar from './Components/Navbar'
import { Routes, Route } from 'react-router-dom'
import DetailsPage from './Components/DetailsPage'
import Ordered from './Components/Ordered'
import CheckoutPage from './Components/CheckoutPage'
import { useState } from 'react'

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  return (
    <>
      <Navbar onSearchChange={setSearchQuery} searchValue={searchQuery} />
      <Routes>
        <Route path='/' element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/checkoutPage" element={<CheckoutPage />} />
        <Route path="/ordered" element={<Ordered />} />
      </Routes>
      {/* <AddExperience/> */}
    </>
  )
}

export default App
