import moment from 'moment'
import React, { useMemo } from 'react'
import Bid from '../Bid/Bid';
import { Link } from 'react-router-dom'
import './BiddingPanel.css'
import useAuth from '../../../../hooks/useAuth'

const BiddingPanel = ({lot}) => {
    const { currentUser } = useAuth();

    const bids = useMemo(() => lot.bids ?? [], lot.bids);

    const getAllowedBidAction = () => {
        const currentTime = moment().toISOString("dd/mm/yyyy HH:mm");
        return lot.openDate > currentTime ? 
        "Auction not started" :
        lot.closeDate > currentTime ?
        "Place bid" : "Auction is over";
    }

  return (
    <>
    <div className="lot-bidding-panel">
    <div className="bidding-status-container">
        <div className="bidding-status-header">
        <div className="bidding-detail-container">
            <h3 className="bidding-detail-title">Starting price: </h3>
            <span className="bidding-detail">{lot.startPrice}</span>
        </div>
        <div className="bidding-detail-container" style={{'marginLeft': 'auto'}}>
            <h3 className="bidding-detail-title">Bids: </h3>
            <span className="bidding-detail">{bids.length}</span>
        </div>
        </div>
        <hr className="line" style={{'backgroundColor': 'white', 'width': '100%', 'marginBottom': '0'}} />
        <div className="bid-requirement-container">
        <div className="bidding-detail-container">
            <h3 className="bidding-detail-title">Minimum bid amount: </h3>
            <span className="bidding-detail">{lot.minimalBid}</span>
        </div>
        <div className="bidding-detail-container">
            <h3 className="bidding-detail-title">Current bid amount: </h3>
            <span className="bidding-detail">{lot.currentBid}</span>
        </div>
        <div className="bidding-detail-container" style={{'marginLeft': 'auto'}}>
            <h3 className="bidding-detail-title">Last bidded on: </h3>
            <span className="bidding-detail">{moment().format('LL')}</span>
        </div>
        </div>
    </div>
    <button 
        className="bidding-button" 
        disabled={
            !currentUser || lot.openDate > moment().toISOString() ||
            lot.closeDate < moment().toISOString() ? true : false
        }
    >
        {getAllowedBidAction()}
    </button> 
    {
        !currentUser && 
        <h3 className="bid-auth-warning">only authorized users can take part in bidding. <Link to={'/auth'}>Log in now</Link></h3> 
    }
    </div>
    <div className="bidders-container">
        <h3 className='bidders-header'>Bids</h3>
        {bids.length === 0 ? <div className="empty-bids">No bids here yet</div> : bids.map(bid => <Bid key={bid.id} bid={bid}/>)}
    </div>
    </>
  )
}

export default BiddingPanel