import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import './CategoryPicker.css'

const CategoryPicker = ({categories}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [search, setSearch] = useSearchParams();
  const onCategoryChange = (e, category) => {
    let categories = search.get('categories')?.split(',') ?? [];

    if (e.target.checked){
      categories.push(category);
    } else {
      categories = categories.filter(c => c !== category);
    }

    if (categories.length === 0){
      search.delete('categories');
    } else { 
      search.set('categories', categories.join(','));
    }

    setSearch(search);
  }

  return (
    <div>
      <div className="picker-header">
        <h4 className="section-label">category</h4>
        <p className='expand-button' onClick={() => setShowCategories(!showCategories)}>{showCategories ? "collapse" : "expand"}</p>
      </div>
      <hr className="line" />
      {showCategories &&
      <div className="categories-list">
        {Object.keys(categories).length === 0 ? <p className='empty'>No categories available</p> : Object.entries(categories).map(([category, count]) => 
        <div key={category} className='category-option'>
          <input checked={search.get('categories')?.split(',').includes(category)} onChange={e => onCategoryChange(e, category)} className='category-selector' type={"checkbox"}/>
          <label className='category-name'>{category}</label>
          <span className='category-count'>{count}</span>
        </div>
        )}
      </div>
      }
  </div>
  )
}

export default CategoryPicker