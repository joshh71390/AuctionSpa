import React, { useEffect, useState } from 'react'
import LotsContainer from './LotsContainer/LotsContainer'
import FilterPanel from './FilterPanel/FilterPanel'
import './Lots.css'
import { getSaleLots } from '../../../services/lotsService'

const Lots = () => {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    const getLots = async() => {
      const response = await getSaleLots();
      console.log(response);
      setLots([...response]);
      console.log(lots);
    }

    getLots();
  }, [])

  return (
      <div className='lots-page'>
      <FilterPanel/>
      <LotsContainer lots={lots}/>
      </div>
  )
}

export default Lots