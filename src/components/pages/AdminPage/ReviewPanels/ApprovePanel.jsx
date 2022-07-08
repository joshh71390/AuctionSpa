import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import './ReviewPanels.css'

const ApprovePanel = ({lot, startPrice, statuses}) => {
  const axios = useAuthAxios();

  const [processing, setProcessing] = useState(false);

  const [openDate, setOpenDate] = useState('');
  const [openDateValid, setOpenDateValid] = useState(false);

  const [closeDate, setCloseDate] = useState('');
  const [closeDateValid, setCloseDateValid] = useState(false);

  const [minimalBid, setMinimalBid] = useState(0);
  const [minimalBidValid, setMinimalBidValid] = useState(false);

  const availableStatuses = useMemo(() => statuses ?? [], [statuses]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatuts] = useState({});

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentTime = moment().utc(true).local();
    const openDateLocal = moment(openDate).utc(true).local();
    const valid = openDateLocal > currentTime;
    setOpenDateValid(valid);
  }, [openDate])

  useEffect(() => {
    const currentTime = moment().utc(true).local();
    const openDateLocal = moment(openDate).utc(true).local();
    const closeDateLocal = moment(closeDate).utc(true).local();
    const valid = closeDateLocal > currentTime && closeDateLocal > openDateLocal;
    setCloseDateValid(valid);
  }, [openDate, closeDate])

  useEffect(() => {
    const halfPrice = startPrice / 2;
    setMinimalBidValid(minimalBid <= halfPrice && minimalBid >= 0);
  }, [minimalBid])

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);

    const approval = {
      statusId: selectedStatus.id,
      minimalBid: new Number(minimalBid),
      openDate: openDate,
      closeDate: closeDate
    };

    await axios.put(`/reviews/${lot.id}/approve`, JSON.stringify(approval))
    .then(() => {
      lot.reviewStatus = 'Allowed';
      lot.status = selectedStatus.name;
      lot.openDate = openDate;
      lot.closeDate = closeDate;
      lot.minimalBid = minimalBid;
      setSuccess(true);
    })
    .catch(() => setError('Could not aprrove lot'))
    .finally(() => {
      setOpenDate('');
      setCloseDate('');
      setMinimalBid(0);
      setSelectedStatuts({});
      setProcessing(false);
    });
  }

  return (
    processing ? <div className='spinner-container'><Spinner/></div>:
    success ? <p className='submit-success'>Successfully approved</p>:
    <form onSubmit={handleSubmit} className='review-form-container'>
      {error.length !== 0 && <p className='submit-error'>{error}</p>}
      <div className="date-picker-container">
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="open-date">Open date:</label>
        <input 
          className='auth-input'
          value={openDate} 
          type={'datetime-local'} 
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
          onChange={e => setMinimalBid(e.target.value)} 
          />
          {
            (!minimalBidValid && minimalBid !== 0) &&
            <p className='field-invalid'>Must be positive and lower or equal to the half of the starting price. Lot starting price: {`${startPrice}`}</p>
          }
        </div>
        <div 
          className='filter-option sort-filter' 
          onClick={() => setOpenStatus(!openStatus)}
          style={{'color' : 'white'}}>
            Status: <span className='selected-filter'>{selectedStatus?.name}</span>
            {openStatus &&
              <ul className='dropdown'>
                {availableStatuses.map((option, idx) => 
                  <li key={idx} className='dropdown-item' onClick={() => setSelectedStatuts(option)}>
                  {option.name}
                  </li>
                )}
              </ul>
            }
        </div>
        <button 
            className="auth-submit-button"
            disabled={!openDateValid || !closeDateValid || !minimalBidValid || !selectedStatus?.name ? true : false}
        >
            Submit
        </button>
      </div>
    </form>
  )
}

export default ApprovePanel