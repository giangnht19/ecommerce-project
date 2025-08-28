import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on category and search term
  const filteredProducts = all_product.filter((item) => {
    if (props.category === item.category) {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });
  return (
    <div className='shop-category'>
      <img className='shopCategory-banner' src={props.banner} alt="" />
      <div className="shopCategory-indexSort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of {all_product.filter(item => props.category === item.category).length} products
        </p>
        <div className="shopCategory-controls">
          <div className="shopCategory-search">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="shopCategory-sort">
            Sort by <img src={dropdown_icon} alt="" />
          </div>
        </div>
      </div>
      <div className="shopCategory-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, i) => {
            return <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price} />
          })
        ) : (
          <div className="no-results">
            <p>No products found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
      <div className="shopCategory-loadmore">
        <p>Explore More</p>
      </div>
    </div>
  );
};

export default ShopCategory;
