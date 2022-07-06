import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterToggle from '../../Lots/FilterPanel/CategoryPicker/FilterToggle/FilterToggle';
import useReviews from '../../../../hooks/useReviews'

const AdminSellerPicker = () => {
    const [showSellers, setShowSellers] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [searchSellers, setSellers] = useState(search.get('sellers')?.split(',') ?? []);
    const getItems = useReviews();
    const items = useMemo(() => getItems.data ?? [], [getItems.data]);
  
    const itemsCount = useMemo(() => 
    items.reduce((counts, item) => {
      if (!isNaN(counts[item.seller])){
        counts[item.seller] += 1;
      } else {
        counts[item.seller] = 1;
      }
  
      return counts;
    }, {}), [items]);
  
    const onSellerChange = (seller) => (e) => {
      let sellers = searchSellers.slice();
  
      if (e.target.checked){
        sellers.push(seller);
      } else {
        sellers = sellers.filter(s => s !== seller);
      }
  
      setSellers(sellers);
    }
  
    const checkboxDisabled = search.get('sellers') !== null;
  
    return (
      <div>
        <div className="picker-header">
          <h4 className="section-label">seller</h4>
          <p className='expand-button' onClick={() => setShowSellers(!showSellers)}>{showSellers ? "collapse" : "expand"}</p>
        </div>
        <hr className="line" />
        {showSellers &&
        <div className="categories-list">
          {Object.keys(itemsCount).length === 0 ? !getItems.isLoading && <p className='empty'>No sellers available</p> 
          : Object.entries(itemsCount).map(([category, count]) => 
          <div key={category} className='category-option'>
            <input 
              disabled={checkboxDisabled}
              checked={searchSellers.includes(category)}
              onChange={onSellerChange(category)} 
              className='category-selector' 
              type={"checkbox"}/>
            <label className='category-name'>{category}</label>
            <span className='category-count'>{count}</span>
          </div>
          )}
          <FilterToggle 
            visible={searchSellers.length > 0}
            active={!!search.get('sellers')}
            onApply={() => {
              search.set('sellers', searchSellers.join(','));
              setSearch(search, {
                replace: true
              });
            }}
            onClear={() => {
              search.delete('sellers');
              setSellers([]);
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

export default AdminSellerPicker