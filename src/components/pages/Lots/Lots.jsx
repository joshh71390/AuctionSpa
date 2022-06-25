import React from 'react'
import LotsContainer from './LotsContainer/LotsContainer'
import FilterPanel from './FilterPanel/FilterPanel'
import './Lots.css'

const Lots = () => {
  return (
    <div className='lots-page'>
      <FilterPanel/>
      <LotsContainer/>
    </div>
  )
}

export default Lots