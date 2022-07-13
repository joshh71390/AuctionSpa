import React from 'react'
import './LotCard.css'
import moment from 'moment'
import { Link } from 'react-router-dom'

const LotCard = ({lot}) => {
  return (
    <div className='lot-card'>
      <img className='lot-image' alt='' src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/thumbnail`}/>
      <div className='lot-description'>
        <h2 className='lot-name'>{lot.name}</h2>
        <div className='info-container'>
        <p>Current price: <span className='info-value'>{lot.currentBid + lot.startPrice}</span></p>
        </div>
        <div className="info-container">
        <p>Close date: <span className="info-value">{moment(lot.closeDate).format('LL')}</span></p>
        </div>
      </div>
      <Link to={`../lots/${lot.id}`}>
        <button className="bid-button">
          Go to bid
        </button>
      </Link>
    </div>
  )
}

export default LotCard