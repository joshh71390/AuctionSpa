import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterToggle from '../../Lots/FilterPanel/CategoryPicker/FilterToggle/FilterToggle';
import useReviews from '../../../../hooks/useReviews'

const AdminCategoryPicker = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [searchCategories, setCategories] = useState(search.get('categories')?.split(',') ?? []);
    const getItems = useReviews();
    const items = useMemo(() => getItems.data ?? [], [getItems.data]);
  
    const itemsCount = useMemo(() => 
    items.reduce((counts, item) => {
      if (!isNaN(counts[item.category])){
        counts[item.category] += 1;
      } else {
        counts[item.category] = 1;
      }
  
      return counts;
    }, {}), [items]);
  
    const onCategoryChange = (category) => (e) => {
      let categories = searchCategories.slice();
  
      if (e.target.checked){
        categories.push(category);
      } else {
        categories = categories.filter(c => c !== category);
      }
  
      setCategories(categories);
    }
  
    const checkboxDisabled = search.get('categories') !== null;
  
    return (
      <div>
        <div className="picker-header">
          <h4 className="section-label">category</h4>
          <p className='expand-button' onClick={() => setShowCategories(!showCategories)}>{showCategories ? "collapse" : "expand"}</p>
        </div>
        <hr className="line" />
        {showCategories &&
        <div className="categories-list">
          {Object.keys(itemsCount).length === 0 ? !getItems.isLoading && <p className='empty'>No categories available</p> 
          : Object.entries(itemsCount).map(([category, count]) => 
          <div key={category} className='category-option'>
            <input 
              disabled={checkboxDisabled}
              checked={searchCategories.includes(category)}
              onChange={onCategoryChange(category)} 
              className='category-selector' 
              type={"checkbox"}/>
            <label className='category-name'>{category}</label>
            <span className='category-count'>{count}</span>
          </div>
          )}
          <FilterToggle 
            visible={searchCategories.length > 0}
            active={!!search.get('categories')}
            onApply={() => {
              search.set('categories', searchCategories.join(','));
              setSearch(search, {
                replace: true
              });
            }}
            onClear={() => {
              search.delete('categories');
              setCategories([]);
              setSearch(search, {
                replace: true
              });
            }}
          />
        </div>
        }
    </div>
    )
}

export default AdminCategoryPicker