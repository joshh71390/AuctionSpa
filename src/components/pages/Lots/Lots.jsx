import React, { useEffect, useMemo, useState } from 'react'
import LotsContainer from './LotsContainer/LotsContainer'
import FilterPanel from './FilterPanel/FilterPanel'
import './Lots.css'
import useItems from '../../../hooks/useItems'

const Lots = () => {
  const getItems = useItems();
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

  return (
      <div className='lots-page'>
      <FilterPanel categories={itemsCount}/>
      <LotsContainer lots={items} isLoading={getItems.isLoading}/>
      </div>
  )
}

export default Lots