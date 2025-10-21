import React from 'react'
import logo from '../assets/logo.png'

function Logo({w}) {
  return (
    <div>
      <img src={logo} className={w} alt="logo"  />
    </div>
  )
}

export default Logo
