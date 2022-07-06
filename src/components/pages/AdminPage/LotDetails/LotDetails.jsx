import moment from 'moment';
import React, { useState } from 'react'
import CountdownContainer from '../../../shared/CountdownContainer/CountdownContainer';
import Spinner from '../../../shared/Spinner/Spinner';
import './LotDetails.css'

const LotDetails = ({lot, loading}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showBidding, setShowBidding] = useState(false);

  return (
    loading ? <div className='spinner-container'><Spinner/></div> :
    lot === null ? <div className='content-empty'>Failed to load lot data</div> :
    <div style={{'display': 'flex', 'flexDirection' : 'column'}}>
    <div className='lot-details-header'>
        <div className="setting-container">
            <div className='admin-countdown'>
            {
                lot && 
                <CountdownContainer openDate={lot.openDate} closeDate={lot.closeDate}/>
            }
            </div>
            <div className="settings-toggle">...</div>
        </div>
        <button className="delete-lot-button">Delete</button>
    </div>
    <div className='admin-lot-container'>
    {lot && <img className='lot-image' src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/large`} alt="lot-img" style={{'width':'30rem'}}/>}
    <div className="details-container">
    <div className="picker-header">
        <h4 className="section-label">Details</h4>
        <p className='expand-button' onClick={() => setShowDetails(!showDetails)}>{showDetails ? "collapse" : "expand"}</p>
      </div>
    <hr className="line" />
        {
            showDetails && 
            <div className='admin-details-container'>
                <h4 className='admin-detail-label'>Name: <span className='admin-detail'>{lot.name}</span></h4>
                <h4 className='admin-detail-label'>Seller: <span className='admin-detail'>{lot.seller}</span></h4>
                <h4 className='admin-detail-label'>Category: <span className='admin-detail'>{lot.category}</span></h4>
                <h4 className='admin-detail-label'>Start price: <span className='admin-detail'>{lot.startPrice}</span></h4>
                <h4 className='admin-detail-label'>Description: <span className='admin-detail'>{lot.description}</span></h4>
                <button className="edit-button">Edit</button>
            </div>
        }
    <div className="picker-header">
        <h4 className="section-label">Bidding</h4>
        <p className='expand-button' onClick={() => setShowBidding(!showBidding)}>{showBidding ? "collapse" : "expand"}</p>
      </div>
    <hr className="line" />
    {
            showBidding && 
            <div className='admin-details-container'>
                <h4 className='admin-detail-label'>Start date: <span className='admin-detail'>{moment(lot.openDate).utc(true).local().format('LLL')}</span></h4>
                <h4 className='admin-detail-label'>End date: <span className='admin-detail'>{moment(lot.closeDate).utc(true).local().format('LLL')}</span></h4>
                <h4 className='admin-detail-label'>Minimal bid: <span className='admin-detail'>{lot.minimalBid}</span></h4>
                <h4 className='admin-detail-label'>Current bid: <span className='admin-detail'>{lot.currentBid}</span></h4>
                <button className="edit-button">Edit</button>
            </div>
        }
    </div>
    </div>
    </div>
  )
}

export default LotDetails