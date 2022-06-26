import React from 'react'
import './Toggle.css'

const Toggle = ({onSale, selectOnSale}) => {

  const toggle = () => selectOnSale(!onSale);
    
  return (
    <div className='toggle'>
        <span className={ onSale ? "option selected" : "option"} onClick={toggle}>on sale</span>
        <span className={ !onSale ? "option selected" : "option"} onClick = {toggle}>sold</span>
    </div>
  )
}

export default Toggle