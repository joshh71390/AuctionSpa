import React from 'react'

const LotCard = ({lot}) => {
  return (
    <div className='lot-card'>
      <img src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/thumbnail`}/>
      <h1>{lot.name}</h1>
    </div>
  )
}

export default LotCard