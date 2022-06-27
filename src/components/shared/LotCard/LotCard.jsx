import React from 'react'
import './LotCard.css'
import moment from 'moment'

const LotCard = ({lot}) => {
  return (
    <div className='lot-card'>
      <img className='lot-image' src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/thumbnail`}/>
      <div className='lot-description'>
        <h2 className='lot-name'>{lot.name}</h2>
        <div className='info-container'>
        <p>Current bid: <span className='info-value'>{lot.currentBid}</span></p>
        </div>
        <div className="info-container">
        <p>Close date: <span className="info-value">{moment(lot.closeDate).format('LL')}</span></p>
        </div>
      </div>
      <button className="bid-button">
        Place bid
      </button>
    </div>
  )
}

export default LotCard