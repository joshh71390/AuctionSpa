import React from 'react'
import './FilterToggle.css'

const FilterToggle = ({visible, active, onClear, onApply}) => {
  if (active) {
    return (
        <button className='filter-toggle' onClick={onClear}>
            clear filter
        </button>
    );
  }

  if (visible){
    return (
        <button className="filter-toggle" onClick={onApply}>
            apply filter
        </button>
    );
  }

  return null;
}

export default FilterToggle