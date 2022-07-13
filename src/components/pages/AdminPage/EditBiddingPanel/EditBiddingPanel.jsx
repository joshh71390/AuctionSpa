import React from 'react'
import useAuthAxios from '../../../../hooks/useAuthAxios'
import { useState, useEffect } from 'react';
import Spinner from '../../../shared/Spinner/Spinner';
import moment from 'moment';

const EditBiddingPanel = ({lot, active}) => {
    const axios = useAuthAxios();

    const [openDate, setOpenDate] = useState(moment(lot?.openDate).utc(true).local().seconds(0).milliseconds(0).toISOString().replace('Z', ''));
    const [openDateValid, setOpenDateValid] = useState(false);

    const [closeDate, setCloseDate] = useState(moment(lot?.closeDate).utc(true).local().seconds(0).milliseconds(0).toISOString().replace('Z', ''));
    const [closeDateValid, setCloseDateValid] = useState(false);

    const [minimalBid, setMinimalBid] = useState(lot?.minimalBid);
    const [minimalBidValid, setMinimalBidValid] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      setOpenDate(moment(lot?.openDate).utc(true).local().seconds(0).milliseconds(0).toISOString().replace('Z', ''));
      setCloseDate(moment(lot?.closeDate).utc(true).local().seconds(0).milliseconds(0).toISOString().replace('Z', ''));
      setMinimalBid(lot?.minimalBid);
      setSuccess(false);
      setError('');
    }, [active])

    useEffect(() => {
      const currentTime = moment().utc(true).local();
      const openDateLocal = moment(openDate).utc(true).local();
      const valid = openDateLocal > currentTime;
      const active = moment(lot?.openDate).local() < moment().local();
      setOpenDateValid(valid || active);
    }, [openDate])
  
    useEffect(() => {
      const currentTime = moment().utc(true).local();
      const openDateLocal = moment(openDate).utc(true).local();
      const closeDateLocal = moment(closeDate).utc(true).local();
      const valid = closeDateLocal > currentTime && closeDateLocal > openDateLocal;
      setCloseDateValid(valid);
    }, [openDate, closeDate])
  
    useEffect(() => {
      const halfPrice = lot?.startPrice / 2;
      setMinimalBidValid(minimalBid <= halfPrice && minimalBid >= 0);
    }, [minimalBid])

    const handleSubmit = async e => {
      e.preventDefault();
      setProcessing(true);

      const active = moment(lot?.openDate).local() < moment().local();

      const details = {
        openDate: !active ? openDate : null,
        closeDate: !lot.sold ? closeDate : null,
        minimalBid: new Number(minimalBid) 
      }

      await axios.put(`/lots/${lot.id}/bidding`, JSON.stringify(details))
        .then(() => {
          if (!active) lot.openDate = openDate;
          if (!lot.sold) lot.closeDate = closeDate;
          lot.minimalBid = minimalBid;
          setSuccess(true);
        })
        .catch(() => setError('could not update bidding details'))
        .finally(() => setProcessing(false));
    }

  return (
    processing ? <div className='spinner-container'><Spinner/></div>:
    success ? <p className='submit-success'>Successfully approved</p>:
    <form 
        onSubmit={handleSubmit} 
        className='review-form-container'
        style={{'minWidth': '30rem'}}>
        {error.length !== 0 && <p className='submit-error'>{error}</p>}
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="open-date">Open date:</label>
        <input 
          className='auth-input'
          value={openDate} 
          type={'datetime-local'}
          disabled={moment(lot?.openDate).local() < moment().local() ? true : false} 
          required
          onChange={e => setOpenDate(e.target.value)}
          />
          {
            (!openDateValid && openDate.length !== 0) && 
            <p className='field-invalid'>Must be grater then current time and lower than close date</p>
          }
        </div>
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="close-date">Close date:</label>
        <input
          className='auth-input'
          value={closeDate} 
          type={'datetime-local'}
          required
          onChange={e => setCloseDate(e.target.value)} 
          />
          {
            (!closeDateValid && closeDate.length !== 0) &&
            <p className='field-invalid'>Must be grater than current time and open date</p>
          }
        </div>
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="min-bid">Minimal bid:</label>
        <input
          className='auth-input'
          value={minimalBid} 
          type={'number'}
          disabled={moment(lot?.openDate).local() < moment().local() ? true : false}
          onChange={e => setMinimalBid(e.target.value)} 
          />
          {
            (!minimalBidValid && minimalBid !== 0) &&
            <p className='field-invalid'>Must be positive and lower or equal to the half of the starting price. Lot starting price: {`${lot?.startPrice}`}</p>
          }
          {
            moment(lot?.openDate).local() < moment().local() &&
            <p className="bid-auth-warning" style={{'width': '100%', 'padding' : '1rem'}}>Cannot change open date or minimal bid when auction is running or over</p>
          }
        </div>
        <button 
            className="auth-submit-button"
            disabled={!openDateValid || !closeDateValid || !minimalBidValid ? true : false}
        >
            Submit
        </button>
    </form>
  )
}

export default EditBiddingPanel