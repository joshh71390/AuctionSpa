import React from 'react'
import './PricePicker.css'

const PricePicker = () => {
  return (
    <div className="price-picker">
        <div className="picker-header">
        <h4 className="section-label">price</h4>
        </div>
        <hr className="line" />
        <label>min:</label>
        <input type="text" className="price-input" placeholder='0'/>
        <label>max:</label>
        <input type="text" className="price-input" placeholder='0' />
    </div>
  )
}

export default PricePicker