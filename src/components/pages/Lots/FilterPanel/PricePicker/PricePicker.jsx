import React from 'react'
import './PricePicker.css'
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

const PricePicker = () => {
  const [search, setSearch] = useSearchParams();

  const onMinPriceChange = debounce((e) => {
    const text = e.target.value;
 
    if (text.length === 0) {
      search.delete('minPrice');
      setSearch(search, {
        replace: true
      });
    } else {
      search.set('minPrice', text);
      setSearch(search, {
        replace: true
      });
    }
  }, 350);

  const onMaxPriceChange = debounce((e) => {
    const text = e.target.value;
 
    if (text.length === 0) {
      search.delete('maxPrice');
      setSearch(search, {
        replace: true
      });
    } else {
      search.set('maxPrice', text);
      setSearch(search, {
        replace: true
      });
    }
  }, 350);

  return (
    <div className="price-picker">
        <div className="picker-header">
        <h4 className="section-label">price</h4>
        </div>
        <hr className="line" />
        <label>min:</label>
        <input 
          type="text" 
          className="price-input" 
          placeholder='0'
          onChange={onMinPriceChange}
          />
        <label>max:</label>
        <input 
          type="text" 
          className="price-input" 
          placeholder='0' 
          onChange={onMaxPriceChange}
          />
    </div>
  )
}

export default PricePicker