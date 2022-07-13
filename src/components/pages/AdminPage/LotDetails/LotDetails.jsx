import moment from 'moment';
import React, { useEffect, useState } from 'react'
import CountdownContainer from '../../../shared/CountdownContainer/CountdownContainer';
import Spinner from '../../../shared/Spinner/Spinner';
import './LotDetails.css'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import { useMemo } from 'react';
import Popup from '../../../shared/Popup/Popup';
import ApprovePanel from '../ReviewPanels/ApprovePanel';
import RejectPanel from '../ReviewPanels/RejectPanel';
import EditDetailsPanel from '../EditDetailsPanel/EditDetailsPanel';
import EditBiddingPanel from '../EditBiddingPanel/EditBiddingPanel';
import { useMutation, useQueryClient } from 'react-query';

const LotDetails = ({lot, statuses, categories, handleDelete, loading}) => {
    const authAxios = useAuthAxios();

    const [showDetails, setShowDetails] = useState(false);
    const [showBidding, setShowBidding] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [openTimer, setOpenTimer] = useState(false);
    const [openDeletewindow, setOpenDeleteWindow] = useState(false);
    const [openStatuses, setOpenStatuses] = useState(false);
    const [showEditDetails, setShowEditDetails] = useState(false);
    const [showEditBidding, setShowEditBidding] = useState(false);

    const currentStatus = useMemo(() => statuses?.find(s => s.name === lot?.status) ?? {name: 'loading...'}, [lot?.status]);

    const isAllowed = useMemo(() => lot?.reviewStatus.toLowerCase() === 'allowed', [lot?.reviewStatus]);
    
    const bids = useMemo(() => lot !== null ? lot?.bids?.sort((a,b) => b.price - a.price) : [], [lot?.bids, loading]);
    const highestBid = useMemo(() => bids[0] ?? null, [bids, loading]);

    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    const handleCloseAuction = useMutation(async() => {
        await authAxios.put(`/lots/${lot.id}/close`)
            .then(response => lot.closeDate = moment(response.data).local().toISOString())
            .catch(() => setError('failed closing auction'));   
    }, {
        onSuccess: () => queryClient.invalidateQueries(['reviews'])
    })

    const handleStartAution = useMutation(async() => {
        await authAxios.put(`/lots/${lot.id}/begin`)
            .then(response => lot.openDate = moment(response.data).local().toISOString())
            .catch(() => setError('failed starting auction'));
    }, {
        onSuccess: () => queryClient.invalidateQueries(['reviews'])
    })

    const handleStatusChange = useMutation(async id => {
        if (id !== currentStatus.id){
            await authAxios.put(`lots/${lot.id}/status/${id}`)
            .then(() => {
                lot.status = statuses.find(s => s.id === id).name;
            });
        }
    }, {
        onSuccess: () => queryClient.invalidateQueries(['reviews'])
    })

    const [confirming, setConfirming] = useState(false);

    const handlePurchase = async() => {
        setConfirming(true);
        await authAxios.put(`/bidding/${lot.id}/sold/${highestBid.bidderId}`)
            .then(() => {
                lot.sold = true;
                lot.buyer = highestBid.bidder;
                setConfirming(false);
            });
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
                    <div className='dropdown'>
                        <div className="time-options-container">
                        <p className='time-info'>You can start or end auction depending on its current date set. You can`t restart the auction if it is sold.</p>
                        <div className="time-toggle-container">
                        <button 
                            className='time-option'
                            style={{'fontSize': '1rem'}}
                            onClick = {() => handleStartAution.mutate()}
                            disabled={
                                moment(lot.openDate).utc(true).local() < moment().utc(true).local() 
                                || lot.sold ? true : false}
                        >
                            start auction
                        </button>
                        <button 
                            className='time-option'
                            style={{'fontSize': '1rem'}}
                            onClick={() => handleCloseAuction.mutate()}
                            disabled={
                                moment(lot.closeDate).utc(true).local() < moment().utc(true).local()
                                || moment(lot.openDate).utc(true).local() > moment().utc(true).local()
                                || lot.sold ? true : false
                            }
                        >
                            end auction
                        </button>
                        </div>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
        }
        {
            isAllowed &&
            <div className='admin-status-toggle' onClick={() => setOpenStatuses(!openStatuses)}>
            Status: <span className='selected-filter' style={{'fontWeight': '400', 'fontSize' : '1rem'}}>{currentStatus?.name}</span>
            {openStatuses &&
              <ul className='dropdown'>
                {statuses?.map((option, idx) => 
                  <li key={idx} className='dropdown-item' onClick={() => handleStatusChange.mutate(option.id)}>
                  {option.name}
                  </li>
                )}
              </ul>
            }
        </div>
        }
        <button className="delete-lot-button" onClick={() => setOpenDeleteWindow(true)}>Delete</button>
        <Popup active={openDeletewindow} setActive={setOpenDeleteWindow}>
        <div className='review-container' style={{'border': 'none'}}>
            <p className='review-notion'>Are you sure you want to delete this lot?</p>
            <div className='review-options-container'>
                <button 
                    className="review-button" 
                    onClick={() => {
                        handleDelete(lot.id);
                        setOpenDeleteWindow(false);
                    }}>
                        Yes</button>
                <button className="review-button" onClick={() => setOpenDeleteWindow(false)}>No</button>
            </div>
        </div>
        </Popup>
    </div>
    <div className='admin-lot-container'>
    {
        lot && 
        <img
            key={lot?.id} 
            className='lot-image' 
            src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/large`} 
            alt="lot-img" 
            style={{'width':'30rem'}}/>}
    <div className="details-container">
    {
        lot?.reviewStatus.toLowerCase() === 'rejected' ?
        <div>
            <div className="buyer-container" style={{'flexDirection': 'column', 'alignItems': 'start', 'gap': '1rem'}}>
                <h2 className="bidder" style={{'alignSelf': 'center'}}>Rejected</h2>
                <div>
                    <h2 className='bidder'>Reason:</h2>
                    <h2 className="price-title">{lot?.feedback}</h2>
                </div>
            </div>
        </div>
        :
        <>
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
                <button className="edit-button" onClick={() => setShowEditDetails(true)}>Edit</button>
                <Popup active={showEditDetails} setActive={setShowEditDetails}>
                    <EditDetailsPanel lot={lot} categories={categories} active={showEditDetails}/>
                </Popup>
            </div>
        }
    {
        isAllowed ?
        lot?.sold ?
        <div>
            <div className="buyer-container">
                <h2 className="price-title">Sold to:</h2>
                <h2 className="bidder">{highestBid?.bidder}</h2>
                <div className="bid-price">
                    <h2 className="price-title">Final price:</h2>
                    <h2 className='price-value'>{lot?.startPrice + highestBid?.price}</h2>
                </div>
            </div>
        </div> 
        :
        <>
        <div className="picker-header">
        <h4 className="section-label">Bidding</h4>
        <p className='expand-button' onClick={() => setShowBidding(!showBidding)}>{showBidding ? "collapse" : "expand"}</p>
      </div>
        <hr className="line" />
        {
            showBidding && 
            <div className='admin-details-container'>
                <h4 className='admin-detail-label'>Start date: <span className='admin-detail'>{moment(lot.openDate).local().format('LLL')}</span></h4>
                <h4 className='admin-detail-label'>End date: <span className='admin-detail'>{moment(lot.closeDate).local().format('LLL')}</span></h4>
                <h4 className='admin-detail-label'>Minimal bid: <span className='admin-detail'>{lot.minimalBid}</span></h4>
                <h4 className='admin-detail-label'>Current bid: <span className='admin-detail'>{lot.currentBid}</span></h4>
                <button className="edit-button" onClick={() => setShowEditBidding(true)}>Edit</button>
                <Popup active={showEditBidding} setActive={setShowEditBidding}>
                    <EditBiddingPanel lot={lot} active={showEditBidding}/>
                </Popup>
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
            <Popup active={showApprove} setActive={setShowApprove}>
                <ApprovePanel 
                    lot={lot}
                    startPrice={lot.startPrice} 
                    statuses={statuses}/>
                </Popup>
            <Popup active={showReject} setActive={setShowReject}>
                <RejectPanel lot={lot}/>
            </Popup>
        </div>
    }
    {
        confirming ? <div className='spinner-container' style={{'height': 'auto', 'padding': '0'}}><Spinner/></div> :
        (moment(lot?.closeDate).local() < moment().local() && lot?.bids.length > 0 && !lot?.sold) &&
        <div className='lot-sold-container'>
            <p className="bid-auth-warning" style={{'width': '100%', 'padding' : '1rem', 'fontSize': '0.8rem'}}>This lot requires review since bids are closed and it has a potential buyer</p>
            <div className="buyer-container">
                <h2 className="price-title">Buyer:</h2>
                <h2 className="bidder">{highestBid?.bidder}</h2>
                <div className="bid-price">
                    <h2 className="price-title">Final price:</h2>
                    <h2 className='price-value'>{lot?.startPrice + highestBid?.price}</h2>
                </div>
            </div>
            <button className="edit-button" onClick={() => handlePurchase()}>Approve purchase</button>
        </div>
    }
    </>
    }
    </div>
    </div>
    </div>
  )
}

export default LotDetails