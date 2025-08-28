import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import remove_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const server = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo  = async () => {
    const response = await fetch(`${server}/allproducts`);
    const data = await response.json();
    setAllProducts(data);
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeProduct = async (id) => {
    await fetch(`${server}/deleteproduct`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((item, index) => {
          return <><div key={index} className="listproduct-format-main listproduct-format">
            <img src={item.image} alt="" className="listproduct-product-icon" />
            <p>{item.name}</p>
            <p>${item.old_price}</p>
            <p>${item.new_price}</p>
            <p>{item.category}</p>
            <img onClick={() => {removeProduct(item.id)}} src={remove_icon} alt="" className="listproduct-remove-icon" />
          </div>
          <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct
