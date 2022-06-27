import React, { useEffect, useState } from 'react'
import LotsContainer from './LotsContainer/LotsContainer'
import FilterPanel from './FilterPanel/FilterPanel'
import './Lots.css'
import { getSaleLots } from '../../../services/lotsService'

const Lots = () => {
  const [lots, setLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLots = async() => {
      const response = await getSaleLots();
      setLots([...response]);
      setIsLoading(false);
    }
    
    getLots();
  }, [])

  return (
      <div className='lots-page'>
      <FilterPanel/>
      <LotsContainer lots={lots} isLoading={isLoading}/>
      </div>
  )
}

export default Lots