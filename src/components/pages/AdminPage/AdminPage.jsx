import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import './AdminPage.css'
import LotsList from './LotsList/LotsList'
import useAuthAxios from '../../../hooks/useAuthAxios'
import Spinner from '../../shared/Spinner/Spinner'

const AdminPage = () => {
  const { stateLoading } = useAuth();
  const authAxios = useAuthAxios();

  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(lots[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelected = (id) => {
    const selected = lots.find(l => l.id === id);
    setSelectedLot(selected ?? lots[0]);
  } 

  useEffect(() => {
    const getLots = async() => {
      setLoading(true);
      try {
        const response = await authAxios.get('/reviews')
        .then(response => response.data);
        setLots(response);
      } catch {
        setError('could not fetch data');
      } finally {
        setLoading(false);
      }
    }

    getLots();
  }, [stateLoading])

  return (
    <div className='admin-page-container'>
      <LotsList lots={lots} handleSelected={handleSelected}/>
      
    </div>
  )
}

export default AdminPage