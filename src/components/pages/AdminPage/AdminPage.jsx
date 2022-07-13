import React, { useMemo, useState, useEffect } from 'react'
import './AdminPage.css'
import LotsList from './LotsList/LotsList'
import useAuthAxios from '../../../hooks/useAuthAxios'
import useReviews from '../../../hooks/useReviews'
import LotDetails from './LotDetails/LotDetails'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const AdminPage = () => {
  const axios = useAuthAxios();

  const getStatuses = useQuery(['statuses'], async () => 
  await axios.get('lots/statuses').then(res => res.data));
  const statuses = useMemo(() => getStatuses.data ?? [], [getStatuses.data, getStatuses.isLoading]);

  const getCategories = useQuery(['categories'], async () => 
  await axios.get('lots/categories').then(res => res.data));
  const categories = useMemo(() => getCategories.data ?? [], [getCategories.data, getCategories.isLoading]);

  const getLots = useReviews();
  const lots = useMemo(() => getLots.data ?? [], [getLots.data]);

  const defaultLot = useMemo(() => lots[0] ?? null, [lots]);
  const [selectedLot, setSelectedLot] = useState(defaultLot);

  const handleSelected = (id) => {
    const selected = lots.find(l => l.id === id);
    setSelectedLot(selected ?? defaultLot);
  } 

  const client = useQueryClient();
  const deleteMutation = useMutation(async id => {
    await axios.delete(`/lots/${id}`)
    .then(() => {
      setSelectedLot(defaultLot);
    });
  },{
    onSuccess: () => client.invalidateQueries(["filter", "reviews"])
  })

  const handleDelete = async id => await deleteMutation.mutateAsync(id);

  return (
    <div className='admin-page-container'>
      <LotsList 
        lots={lots} 
        statuses={statuses}
        categories={categories}
        handleSelected={handleSelected} 
        loading={getLots.isFetching}
        status={getLots.status}/>
      <LotDetails 
        lot={selectedLot ?? defaultLot}
        statuses={statuses}
        categories={categories}
        handleDelete={handleDelete} 
        loading={getLots.isLoading}/>
    </div>
  )
}

export default AdminPage