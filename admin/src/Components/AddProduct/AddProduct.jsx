import React from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {

  const server = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
  
  const [image, setImage] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: '',
    old_price: "",
    new_price: "",
    category: 'women',
    image: '',
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  
  const submitHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    })
  }

  const Add_Product = async () => {
    console.log(productDetails);

    let responseData;
    let product = productDetails;
    let formData = new FormData();

    formData.append('product', image);

    await fetch (`${server}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData
    }).then((resp) => resp.json()).then((data) => {
        responseData = data;
      })
    
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);

      await fetch (`${server}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
          // console.log(data);
          data.success ? alert('Product Added') : alert('Failed to add product');
      })
    }
  }

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Title</p>
        <input value={productDetails.name} onChange={submitHandler} type="text" name='name' placeholder='Enter here'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={submitHandler} type="text" name='old_price' placeholder='Enter here'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={submitHandler} type="text" name='new_price' placeholder='Enter here'/>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Category</p>
        <select value={productDetails.category} onChange={submitHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='add-product-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
      </div>
      <button onClick={() => Add_Product()} className='add-product-button'>Add Item</button>
    </div>
  )
}

export default AddProduct
