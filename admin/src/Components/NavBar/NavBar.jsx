import React from 'react'
import './NavBar.css'
import navlogo from '../../assets/nav-logo.png'
import navProfile from '../../assets/nav-profile.svg'

const NavBar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-right">
            <div className="nav-logo-img">
                <img src={navlogo} alt="" className="nav-logo" />
            </div>
            <div className="nav-logo-components">
                <h1>FashFrenzy</h1>
                <h4>Admin Panel</h4>
            </div>
        </div>
        <div className="navbar-left">
            <img src={navProfile} alt="" className='nav-profile'/>
        </div>
    </div>
  )
}

export default NavBar
