import React, { useState } from 'react'
import './Toggle.css'

const Toggle = () => {

    const [onSaleSelected, selectOnSale] = useState(true);
    const [soldSelected, selectSold] = useState(false);

    const filterOnSale = () => {
        selectOnSale(true);
        selectSold(false);
    }

    const filterSold = () => {
        selectOnSale(false);
        selectSold(true);
    }
    
  return (
    <div className='toggle'>
        <span className={ onSaleSelected ? "option selected" : "option"} onClick={filterOnSale}>on sale</span>
        <span className={ soldSelected ? "option selected" : "option"} onClick = {filterSold}>sold</span>
    </div>
  )
}

export default Toggle