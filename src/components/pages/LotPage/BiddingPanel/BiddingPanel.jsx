import moment from 'moment'
import React from 'react'
import './BiddingPanel.css'

const BiddingPanel = ({lot}) => {
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
            <span className="bidding-detail">12</span>
        </div>
        </div>
        <hr className="line" style={{'background-color': 'white', 'width': '100%'}} />
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
    <button className="bidding-button" disabled={true}>Place bid</button> 
    <h3 className="bid-auth-warning">only authorized users can take part in bidding</h3> 
    </div>
    <div className="bidders-container">
        <h3>Bids</h3>
    </div>
    </>
  )
}

export default BiddingPanel