import React from 'react'

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