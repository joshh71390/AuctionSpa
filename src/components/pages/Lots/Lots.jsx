import React, { useMemo } from 'react'
import LotsContainer from './LotsContainer/LotsContainer'
import FilterPanel from './FilterPanel/FilterPanel'
import './Lots.css'
import useItems from '../../../hooks/useItems'

const Lots = () => {
  const getItems = useItems();
  const items = useMemo(() => getItems.data ?? [], [getItems.data]);

  return (
      <div className='lots-page'>
      <FilterPanel/>
      <LotsContainer lots={items} isLoading={getItems.isLoading}/>
      </div>
  )
}

export default Lots