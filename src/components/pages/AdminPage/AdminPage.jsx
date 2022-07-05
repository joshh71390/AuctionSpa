import React, { useEffect, useMemo, useState } from 'react'
import './AdminPage.css'
import LotsList from './LotsList/LotsList'
import useAuthAxios from '../../../hooks/useAuthAxios'
import Spinner from '../../shared/Spinner/Spinner'
import useReviews from '../../../hooks/useReviews'
import LotDetails from './LotDetails/LotDetails'

const AdminPage = () => {
  const getLots = useReviews();
  const lots = useMemo(() => getLots.data ?? [], [getLots.data]);

  const defaultLot = useMemo(() => lots[0] ?? null, [lots]);
  const [selectedLot, setSelectedLot] = useState(defaultLot);

  const handleSelected = (id) => {
    const selected = lots.find(l => l.id === id);
    setSelectedLot(selected ?? defaultLot);
  } 

  return (
    <div className='admin-page-container'>
      <LotsList lots={lots} handleSelected={handleSelected}/>
      <LotDetails lot={selectedLot ?? defaultLot}/>
    </div>
  )
}

export default AdminPage