import React from 'react'
import Toggle from '../../../shared/Toggle/Toggle'
import './FilterPanel.css'

const FilterPanel = () => {
  return (
    <section className='filter-panel'>
        <input className='text-input' placeholder='Type in lot name' type={"text"}></input>
        <Toggle/>
    </section>
  )
}

export default FilterPanel