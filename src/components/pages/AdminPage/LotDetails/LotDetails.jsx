import moment from 'moment';
import React, { useEffect, useState } from 'react'
import CountdownContainer from '../../../shared/CountdownContainer/CountdownContainer';
import Spinner from '../../../shared/Spinner/Spinner';
import './LotDetails.css'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import axios from '../../../../apiAccessor/axiosApi';
import { useMemo } from 'react';
import Popup from '../../../shared/Popup/Popup';
import ApprovePanel from '../ReviewPanels/ApprovePanel';
import RejectPanel from '../ReviewPanels/RejectPanel';
import EditDetailsPanel from '../EditDetailsPanel/EditDetailsPanel';

const LotDetails = ({lot, loading}) => {
    const authAxios = useAuthAxios();

    const [showDetails, setShowDetails] = useState(false);
    const [showBidding, setShowBidding] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [openTimer, setOpenTimer] = useState(false);
    const [showEditDetails, setShowEditDetails] = useState(false);
    const [showEditBidding, setShowEditBidding] = useState(false);

    const [statuses, setStatuses] = useState([]);
    const [categories, setCategories] = useState([]);

    const isAllowed = useMemo(() => lot?.reviewStatus.toLowerCase() === 'allowed', [lot?.reviewStatus]);

    const [error, setError] = useState('');

    useEffect(() => {
        const getStatuses = async() => {
            const response = await authAxios.get('/lots/statuses')
            .then(response => response.data);
            setStatuses(response);
        }
        
        getStatuses();
    }, [])

    useEffect(() => {
        const getCategories = async() => {
            const response = await axios.get('/lots/categories')
            .then(response => response.data);
            setCategories(response);
        }

        getCategories();
    }, [])

    const handleCloseAuction = async() => {
        await authAxios.put(`/lots/${lot.id}/close`)
            .then(response => lot.closeDate = moment(response.data).local().toISOString())
            .catch(() => setError('failed closing auction'));   
    }

    const handleStartAution = async() => {
        await authAxios.put(`/lots/${lot.id}/begin`)
            .then(response => lot.openDate = moment(response.data).local().toISOString())
            .catch(() => setError('failed starting auction'));
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
                            onClick = {() => handleStartAution()}
                            disabled={
                                moment(lot.openDate).utc(true).local() < moment().utc(true).local() 
                                || lot.sold ? true : false}
                        >
                            start auction
                        </button>
                        <button 
                            className='time-option'
                            style={{'fontSize': '1rem'}}
                            onClick={() => handleCloseAuction()}
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
                <button className="edit-button" onClick={() => setShowEditDetails(true)}>Edit</button>
                <Popup active={showEditDetails} setActive={setShowEditDetails}>
                    <EditDetailsPanel/>
                </Popup>
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
            <Popup active={showApprove} setActive={setShowApprove}>
                <ApprovePanel 
                    lot={lot}
                    startPrice={lot.startPrice} 
                    statuses={statuses}/>
                </Popup>
            <Popup active={showReject} setActive={setShowReject}><RejectPanel/></Popup>
        </div>
    }
    </div>
    </div>
    </div>
  )
}

export default LotDetails