import React, { useEffect, useMemo, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import './AdminAuthPage'

const AdminAuthPage = () => {
  const {currentUser} = useAuth();
  const [state, setState] = useState('');

  useEffect(()=> {
    setTimeout(() => {setState(currentUser)}, 2000);
  }, [])

  return (
    <div>AdminAuthPage
      <div>{state}</div>
    </div>
  )
}

export default AdminAuthPage