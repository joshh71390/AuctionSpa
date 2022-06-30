import React, { useEffect, useState } from 'react'
import './LotPage.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../../apiAccessor/axiosApi'
import CountdownContainer from '../../shared/CountdownContainer/CountdownContainer'
import moment from 'moment'
import BiddingPanel from './BiddingPanel/BiddingPanel'

const LotPage = () => {
  const { id } = useParams();
  const [lot, setLot] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLot();
  },[])

  const getLot = async () => {
    const response = await axios.get(`lots/${id}`)
    .then(response => response.data);
    setLot(response);
  }

  return (
    <div className="page-lot-container">
      <div className="lot-page-header">
        <h1 className='go-back-button' onClick={() => navigate(-1)}>go back</h1>
        <div className="countdown-container">
          <div className="countdown">
            <CountdownContainer openDate={lot.openDate} closeDate={lot.closeDate}/>
          </div>
        </div>
      </div>    
      <div className="lot-details">
      <div className="lot-header">
          <div className="title-container">
            <h1 className="lot-title">{lot.name}</h1>
            <hr className="line page-lot-line" />
          </div>
        </div>
      <div className="lot-info-container">
      <div className="image-container">
        <img className='lot-image page-lot-image' alt='' src={`${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${id}/large`}/>
      </div>
      <div className="lot-info">
        <div className="status-container">
          <h1 className='status'>{lot.status}</h1>
        </div>
        <div className="description">
            <h1 className="description-title">Auction duration:
            <span className="description-text">{`${moment(lot.openDate).format('LL')} - ${moment(lot.closeDate).format('LL')}`}</span>
            </h1>
          </div>
        <div className="description">
            <h1 className="description-title">Seller:
            <span className="description-text">{lot.seller}</span>
            </h1>
          </div>
        <div className="description">
            <h1 className="description-title">Category:
            <span className="description-text">{lot.category}</span>
            </h1>
          </div>
        <div className="description">
          <h1 className="description-title">Description:
          <span className="description-text">{lot.description}</span>
          </h1>
        </div>
      </div>
      </div>
      </div>
      <div className="bidding-details">
        <BiddingPanel lot={lot}/>
      </div>
    </div>
  )
}

export default LotPage