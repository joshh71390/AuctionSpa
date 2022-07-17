import React from 'react'
import { useQuery } from 'react-query'
import './CustomerPage.css'
import useAuthAxios from '../../../hooks/useAuthAxios'
import LotCard from '../../shared/LotCard/LotCard'
import { useMemo } from 'react'
import moment from 'moment'
import useAuth from '../../../hooks/useAuth'
import Popup from '../../shared/Popup/Popup'
import { useState } from 'react'
import Spinner from '../../shared/Spinner/Spinner'
import CustomerCreateLotForm from './CustomerCreateLotForm/CustomerCreateLotForm'
import ReapplyForm from './ReapplyForm/ReapplyForm'

const OwnedLot = ({lot, categories}) => {
    const [showEdit, setShowEdit] = useState(false);
    const pending = useMemo(() => lot.reviewStatus.toLowerCase() === 'pendingreview', [lot]);
    const rejected = useMemo(() => lot.reviewStatus.toLowerCase() === 'rejected', [lot]);
    
    return (
        <div className='lot-card'>
          <img className='lot-image' alt='' src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/thumbnail`}/>
          <div className='lot-description'>
            <h2 className='lot-name'>{lot.name}</h2>
            {
                pending || rejected ?
                <>
                <div className='info-container'>
                <p>Category: <span className='info-value'>{lot.category}</span></p>
                </div>
                <div className="info-container">
                <p>Start price: <span className="info-value">{lot.startPrice}</span></p>
                </div>
                </>
                :
                <>
                <div className='info-container'>
                <p>Current price: <span className='info-value'>{lot.currentBid + lot.startPrice}</span></p>
                </div>
                <div className="info-container">
                <p>Duration: <span className="info-value">{`${moment(lot.openDate).format('LL')} - ${moment(lot.closeDate).format('LL')}`}</span></p>
                </div>
                </>
            }
          </div>
          {
            lot?.sold ?
            <div>
                <div 
                  className="buyer-container" 
                  style={{
                    'fontFamily': 'var(--text-font-primary)',
                    'color': 'var(--color-secondary)'}}>
                    <h2 className="price-title" style={{'fontSize': '0.9rem'}}>Sold to:</h2>
                    <h2 className="bidder" style={{'fontSize': '1rem'}}>{lot?.highestBid.bidder}</h2>
                    <div className="bid-price">
                        <h2 className="price-title" style={{'fontSize': '0.9rem'}}>Final price:</h2>
                        <h2 className='price-value' style={{'fontSize': '1rem'}}>{lot?.startPrice + lot?.highestBid.price}</h2>
                    </div>
                </div>
            </div>
            :
            <div className={!rejected ? 'lot-manage-container pending' : 'lot-manage-container'}>
            <div className='status-container' style={{'width': 'auto', 'margin': '0'}}>
                <h2 className='status' style={{'fontSize': '1rem'}}>
                    {
                        pending || rejected ? lot.reviewStatus.split(/(?=[A-Z])/).join(' ') : lot.status
                    }
                </h2>
            </div>
            {
                rejected &&
                <>
                <button className='edit-lot-button' onClick={() => setShowEdit(true)}>Edit</button>
                <Popup active={showEdit} setActive={setShowEdit}>
                    <ReapplyForm active={showEdit} lot={lot} categories={categories}/>
                </Popup>
                </>
            }
          </div>
          }
        </div>
      )
}

const ParticipatedLot = ({lot}) => {
    
}

const CustomerPage = () => {
    const axios = useAuthAxios();
    const { currentUser } = useAuth();

    const getOwnedLots = useQuery(['owned'], async() => 
    await axios.get('/lots/customer/owned').then(res => res.data),{
        staleTime: 120000
    });
    const owned = useMemo(() => getOwnedLots.data ?? [] , [getOwnedLots.data]);

    const getParticipatedLots = useQuery(['participated'], async() => 
    await axios.get('/lots/customer/participated').then(res => res.data), {
        staleTime: 120000
    });
    const participated = useMemo(() => getParticipatedLots.data ?? [], [getParticipatedLots.data])

    const getCategories = useQuery(['categories'], async () => 
    await axios.get('lots/categories').then(res => res.data));
    const categories = useMemo(() => getCategories.data ?? [], [getCategories.data, getCategories.isLoading]);

    const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className='customer-page'>
        <div className='owned-lots-container'>
        <div className='customer-control-panel'>
        <h1 className='lot-name' style={{'padding': '1rem'}}>Owned lots</h1>
            <button className="lot-create-button" onClick={() => setShowCreateForm(true)}>Create +</button>
            <Popup active={showCreateForm} setActive={setShowCreateForm}>
                <CustomerCreateLotForm categories={categories} active={showCreateForm}/>
            </Popup>
        </div>
            {
                getOwnedLots.isFetching ? <div className='spinner-container'><Spinner/></div> :
                owned.length === 0 || getOwnedLots.status === 'error' ?
                <div className="content-empty" style={{'fontSize': '3rem'}}>No lots in here</div> 
                :
                <div className='scroll-lots-list'>
                {
                    owned.map(lot => <OwnedLot key={lot.id} lot={lot} categories={categories}/>)
                }
            </div>
            }
        </div>
        <hr className="line" />
        <div className='participated-lots-container'>
            <h1 className='lot-name' style={{'padding': '1rem'}}>Participated lots</h1>
            {
                getParticipatedLots.isFetching ? <div className='spinner-container'><Spinner/></div> :
                participated.length === 0 ?
                <div className="content-empty" style={{'padding': '5rem'}}>No lots in here</div> 
                :
                <div className='scroll-lots-list'>
                {
                    participated.map(lot => <LotCard key={lot.id} lot={lot}/>)
                }
            </div>
            }
        </div>
    </div>
  )
}

export default CustomerPage