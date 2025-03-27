import React from 'react'
import './Admin.css'
import SideBar from '../../Components/SideBar/SideBar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListOrder from '../../Components/ListOrder/ListOrder'

const Admin = () => {
  return (
    <div className='admin'>
      <SideBar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct/>} />
        <Route path="/listproduct" element={<ListProduct/>} />
        <Route path="/listorder" element={<ListOrder/>} />
      </Routes>
    </div>
  )
}

export default Admin
