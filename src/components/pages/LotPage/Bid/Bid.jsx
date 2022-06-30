import moment from 'moment'
import React from 'react'
import './Bid.css'

const Bid = ({bid}) => {
  return (
    <div className='bid-card'>
        <div className="bidder-info">
            <h2 className="bidder">{bid.bidder}</h2>
            <h2 className='placement-date'>{moment(bid.placedOn).format('LLL')}</h2>
        </div>
        <div className="bid-price">
            <h2 className="price-title">Amount:</h2>
            <h2 className="price-value">{bid.price}</h2>
        </div>
    </div>
  )
}

export default Bid