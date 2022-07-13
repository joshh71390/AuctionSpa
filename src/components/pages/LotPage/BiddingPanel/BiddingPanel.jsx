import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import Bid from '../Bid/Bid';
import { Link } from 'react-router-dom'
import './BiddingPanel.css'
import useAuth from '../../../../hooks/useAuth'
import Popup from '../../../shared/Popup/Popup'
import Spinner from '../../../shared/Spinner/Spinner'
import useAuthAxios from '../../../../hooks/useAuthAxios'
import successIcon from '../../../../images/success-icon.svg'

const BiddingPanel = ({lot}) => {
    const { currentUser } = useAuth();
    const authAxios = useAuthAxios();
 
    const [bidWindowOpen, setBidWindowOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [bidValid, setBidValid] = useState(false);
    const [bidding, setBidding] = useState(false);
    const [succeed, setSucceed] = useState(false);
    const [error, setError] = useState('');

    const bids = useMemo(() => lot.bids.sort((a,b) => b.price - a.price) ?? [], [lot.bids, succeed]);
    const highestBid = useMemo(() => bids[0] ?? null, [bids, succeed]);
    
    useEffect(() => {
        if (error.length !== 0) setError('');
        const allowed = highestBid ? highestBid.price + lot.minimalBid : 0 + lot.minimalBid;
        const bidHigher = bidAmount > allowed && bidAmount <= 1000000;
        setBidValid(bidHigher);
    }, [bidAmount])

    const handleBidPlacement = async() => {
        setBidding(true);

        try {
            const response = await authAxios.post('/bidding/place',
            JSON.stringify({lotId: lot.id, price: new Number(bidAmount)}));
            
            const bid = {
                id: response.data, 
                price: parseInt(bidAmount),
                placedOn: moment().utc(),
                bidderId: currentUser.id,
                bidder: currentUser.name}
            
            lot.bids.push(bid);
            lot.currentBid = bidAmount;
            setSucceed(true);
            setBidAmount(0);
        } catch {
            setError('Failed to place bid');
        } finally {
            setBidding(false);
        }
    }

    const getAllowedBidAction = () => {
        const sameBidder = highestBid?.bidderId === currentUser?.id;
        if (sameBidder) return "Your bid is the highest one";
        const currentTime = moment().utc(true).local().toISOString("dd/mm/yyyy HH:mm");
        const action = lot.openDate > currentTime ? "Auction not started" :
        lot.closeDate > currentTime ? "Place bid" : "Auction is over";
        return action;
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
        {
            bids.length !== 0 &&
            <div className="bidding-detail-container" style={{'marginLeft': 'auto'}}>
                <h3 className="bidding-detail-title">Last bidded on: </h3>
                <span className="bidding-detail">
                    {highestBid?.placedOn ? moment(highestBid.placedOn).format('LL') : "none"}
                </span>
            </div>
        }
        </div>
    </div>
    {
        (currentUser && !currentUser.isAdmin) &&
        <button 
        className="bidding-button" 
        disabled={
            moment(lot.openDate).local().toISOString() > moment().toISOString() 
            || moment(lot.closeDate).local().toISOString() < moment().toISOString()
            || !currentUser || highestBid?.bidderId === currentUser.id ? true : false
        }
        onClick={() => setBidWindowOpen(true)}
        >{getAllowedBidAction()}</button>
    } 
    {
        !currentUser && 
        <h3 className="bid-auth-warning">only authorized users can take part in bidding. <Link to={'/auth'}>Log in now</Link></h3> 
    }
    </div>
    <div className="bidders-container">
        <h3 className='bidders-header'>Bids</h3>
        {bids.length === 0 ? <div className="empty-bids">No bids here yet</div> : bids.slice(0,3).map(bid => <Bid key={bid.id} bid={bid}/>)}
    </div>
    <Popup active={bidWindowOpen} setActive={setBidWindowOpen}>
        {
        bidding ? <div className='spinner-container'><Spinner/></div> : 
        succeed ? 
        <div className='bidding-success'>
            <img style={{'width': '5rem'}} src={successIcon} alt="success-svg" />
            <p className="bid-auth-warning" style={{'width': '100%', 'padding' : '1rem'}}>Your bid successfully registered</p>
        </div>
        :
        <div className="popup-container">
        <div className="popup-header">
            <h3 className="popup-detail">Current bid: <span style={{'fontWeight' : '700'}}>{lot.currentBid}</span></h3>
            <h3 className="popup-detail">Minimal bid: <span style={{'fontWeight' : '700'}}>{lot.minimalBid}</span></h3>
        </div>
        {error.length !== 0 && <p className='submit-error' style={{'width' : '100%'}}>{error}</p>}
        <div className="price-container">
        <h3 className='price-input-label'>Amount: </h3>
        <input 
          type="text" 
          className="price-input" 
          placeholder='0'
          value={bidAmount}
          onChange={e => setBidAmount(e.target.value)}
          style={{'width': 'auto'}}
          />
        </div>
        {
            !bidValid && 
            <p className="bid-auth-warning" style={{'width': '20rem', 'fontSize': '0.8rem'}}>
                Must be higher than current bid plus minimal bid requirement. Highest
                allowed bid: 1 million
            </p> 
        }
        <button 
            disabled={bidValid ? false : true} 
            className="bidding-button"
            onClick={handleBidPlacement}
            >Place bid</button>
        </div>
        }
    </Popup>
    </>
  )
}

export default BiddingPanel