import React from 'react'
import Toggle from '../../../shared/Toggle/Toggle'
import './FilterPanel.css'

const FilterPanel = () => {
  return (
    <section className='filter-panel'>
        <input className='text-input' placeholder='Type in lot name' type={"text"}></input>
        <Toggle/>
        <div className='filter-option'>
            filer by: date
        </div>
        <div className='filter-option'>
            filters
        </div>
    </section>
  )
}

export default FilterPanel