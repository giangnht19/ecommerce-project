import React from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {

  const server = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';
  
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

    // Validate inputs
    if (!productDetails.name || !productDetails.new_price || !image) {
      alert('Please fill all fields and select an image');
      return;
    }

    try {
      let responseData;
      let product = productDetails;
      let formData = new FormData();

      formData.append('product', image);

      // Upload image first
      const uploadResponse = await fetch (`${server}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData
      });
      
      responseData = await uploadResponse.json();
      
      if (responseData.success) {
        product.image = responseData.image_url;
        console.log('Image uploaded successfully:', product.image);

        // Add product to database
        const addProductResponse = await fetch (`${server}/addproduct`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product),
        });
        
        const addProductData = await addProductResponse.json();
        
        if (addProductData.success) {
          alert('Product Added Successfully');
          // Reset form
          setProductDetails({
            name: '',
            old_price: "",
            new_price: "",
            category: 'women',
            image: '',
          });
          setImage(false);
        } else {
          alert('Failed to add product');
        }
      } else {
        alert('Failed to upload image: ' + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product');
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
