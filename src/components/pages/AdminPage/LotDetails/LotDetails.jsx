import moment from 'moment';
import React, { useState } from 'react'
import CountdownContainer from '../../../shared/CountdownContainer/CountdownContainer';
import Spinner from '../../../shared/Spinner/Spinner';
import './LotDetails.css'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import { useMemo } from 'react';
import Popup from '../../../shared/Popup/Popup';
import ApprovePanel from '../ReviewPanels/ApprovePanel';
import RejectPanel from '../ReviewPanels/RejectPanel';

const LotDetails = ({lot, loading}) => {
    const axios = useAuthAxios();

    const [showDetails, setShowDetails] = useState(false);
    const [showBidding, setShowBidding] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [openTimer, setOpenTimer] = useState(false);

    const isAllowed = useMemo(() => lot?.reviewStatus.toLowerCase() === 'allowed', [lot]);

    const [error, setError] = useState('');

    const handleCloseAuction = async() => {
        
    }

    const handleStartAution = async() => {
        try {
            const response = await axios.put(`/lots/${lot.id}/begin`)
            .then(response => response.data);
            
            if (response.date){
                lot.openDate = response;
            }
        } catch {
            setError('failed starting auction');
        }
    }

  return (
    loading ? <div className='spinner-container'><Spinner/></div> :
    lot === null ? <div className='content-empty'>Failed to load lot data</div> :
    <div style={{'display': 'flex', 'flexDirection' : 'column'}}>
    <div className='lot-details-header'>
        {
            isAllowed &&
            <div className="setting-container">
            <div className='admin-countdown'>
            {
                lot && 
                <CountdownContainer openDate={lot.openDate} closeDate={lot.closeDate}/>
            }
            </div>
            {
                !lot.sold && 
                <div className="settings-toggle" onClick={() => setOpenTimer(!openTimer)}>...
                {
                    openTimer &&
                    <ul className='dropdown'>
                        <li 
                            className='dropdown-item'
                            style={{'fontSize': '1rem'}}
                            onClick = {() => handleStartAution()}
                        >
                            Start auction
                        </li>
                        <li 
                            className='dropdown-item'
                            style={{'fontSize': '1rem'}}
                        >
                            End auction
                        </li>
                    </ul>
                }
            </div>
            }
        </div>
        }
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
    {
        isAllowed ? 
        <>
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
        </>
        :
        <div className='review-container'>
            <p className='review-notion'>This lot requires review to be placed for bidding</p>
            <div className='review-options-container'>
                <button className="review-button" onClick={() => setShowApprove(true)}>Approve</button>
                <button className="review-button" onClick={() => setShowReject(true)}>Reject</button>
            </div>
            <Popup active={showApprove} setActive={setShowApprove}><ApprovePanel/></Popup>
            <Popup active={showReject} setActive={setShowReject}><RejectPanel/></Popup>
        </div>
    }
    </div>
    </div>
    </div>
  )
}

export default LotDetails