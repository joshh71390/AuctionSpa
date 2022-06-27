import React, { useState } from 'react'
import './CategoryPicker.css'

const CategoryPicker = ({categories}) => {
  const [showCategories, setShowCategories] = useState(false);
  return (
    <div>
      <div className="picker-header">
        <h4 className="section-label">category</h4>
        <p className='expand-button' onClick={() => setShowCategories(!showCategories)}>{showCategories ? "collapse" : "expand"}</p>
      </div>
      <hr className="line" />
      {showCategories &&
      <div className="categories-list">
        {categories.map(category => 
        <div className='category-option'>
          <input className='category-selector' type={"checkbox"}/>
          <label className='category-name'>{category.name}</label>
          <span className='category-count'>1</span>
        </div>
        )}
      </div>
      }
  </div>
  )
}

export default CategoryPicker