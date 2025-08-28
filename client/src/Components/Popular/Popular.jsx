import React, {useEffect} from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

  const [ popular, setPopular ] = React.useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'}/popularmen`)
    .then((response) => response.json())
    .then((data) => {
      setPopular(data)
    })
    .catch((error) => {
      console.error('Error fetching popular:', error);
    });
  }
  , [])

  return (
    <div className='popular'>
      <h1>POPULAR IN MAN</h1>
      <hr />
      <div className="popular-item">
        {popular.map((item,i) => {
            return <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular
