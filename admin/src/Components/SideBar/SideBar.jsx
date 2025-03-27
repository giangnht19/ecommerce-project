import React from 'react'
import './SideBar.css'
import { Link } from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from  '../../assets/Product_list_icon.svg'
import list_order_icon from '../../assets/Order_list_icon.svg'

const SideBar = () => {
  return (
    <div className='sidebar'>
      <Link to={"/addproduct"}>
        <div className="sidebar-item">
            <img src={add_product_icon} alt="" />
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"}>
        <div className="sidebar-item">
            <img src={list_product_icon} alt="" />
            <p>Product List</p>
        </div>
      </Link>
      <Link to={"/listorder"}>
        <div className="sidebar-item list-order">
            <img src={list_order_icon} alt="" />
            <p>Order List</p>
        </div>
      </Link>
    </div>
  )
}

export default SideBar
