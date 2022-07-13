import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import imagePlaceholder from '../../../../images/image-not-found.svg';
import { useMutation, useQueryClient } from 'react-query';

const AdminCreateLotForm = ({statuses, categories, active}) => {
  const axios = useAuthAxios();

  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);

  const [description, setDescription] = useState('');
  const [descriptionValid, setDescriptionValid] = useState(false);

  const [startPrice, setStartPrice] = useState(0);
  const [startPriceValid, setStartPriceValid] = useState(false);

  const availableCategories = useMemo(() => categories ?? [], [categories]);
  const [category, setCategory] = useState({});
  const [openCategory, setOpenCategory] = useState(false);

  const [openDate, setOpenDate] = useState('');
  const [openDateValid, setOpenDateValid] = useState(false);

  const [closeDate, setCloseDate] = useState('');
  const [closeDateValid, setCloseDateValid] = useState(false);

  const [minimalBid, setMinimalBid] = useState(0);
  const [minimalBidValid, setMinimalBidValid] = useState(false);

  const availableStatuses = useMemo(() => statuses ?? [], [statuses]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatuts] = useState({});

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(imagePlaceholder);

  useEffect(() => {
    setName('');
    setDescription('');
    setStartPrice(0);
    setOpenDate('');
    setCloseDate('');
    setMinimalBid(0);
    setImage(null);
    setError('');
    setSuccess(false);
  }, [active])

  useEffect(() => {
    const correctLength = name.length <= 40 && name.length > 0;
    setNameValid(correctLength);
  }, [name])

  useEffect(() => {
    const correctLength = description.length <= 200 && description.length > 0;
    setDescriptionValid(correctLength);
  }, [description])

  useEffect(() => {
    const valid = startPrice > 0 && startPrice <= 500000;
    setStartPriceValid(valid);
  }, [startPrice])

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
  }, [minimalBid, startPrice])

  const handleImageChange = e => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2){
        setPreviewImage(reader.result);
      }
    }

    setImage(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  }

const queryClient = useQueryClient();
const mutation = useMutation(async lot => {
  await axios.post('/lots/place/admin', lot, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    console.log(response.data);
    setSuccess(true);
  })
  .catch(() => setError('could not create new lot'))
  .finally(() => setProcessing(false));
}, {
  onSuccess: () => queryClient.invalidateQueries(['reviews'])
})

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);

    const lot = new FormData();
    lot.append('name', name);
    lot.append('description', description);
    lot.append('startPrice', startPrice);
    lot.append('minimalBid', minimalBid);
    lot.append('categoryId', category.id);
    lot.append('statusId', selectedStatus.id);
    lot.append('openDate', openDate);
    lot.append('closeDate', closeDate);
    lot.append('image', image);

    await mutation.mutateAsync(lot);
  }

  return (
    processing ? <div className='spinner-container'><Spinner/></div>:
    success ? <p className='submit-success'>Successfully created</p>:
    <form onSubmit={handleSubmit} className='split-container'>
      {error.length !== 0 && <p className='submit-error'>{error}</p>}
      <div className="create-detail-container">
      <img 
        src={image ? previewImage : imagePlaceholder} 
        alt="lot-img" 
        className="lot-image" 
        style={
          {'width': '18rem',
           'objectFit' : image ? 'cover' : 'initial',
            'alignSelf': 'center',
            'marginBottom': '1rem'
            }}/>
      <div className="auth-form-field">
        <label className='auth-label' htmlFor="lot-name">Photo:</label>
        <input 
          className='auth-input'
          type={'file'}
          accept='image/png, image/jpeg' 
          required
          onChange={handleImageChange}
          />
          {
            (!nameValid && name.length > 0) && 
            <p className='field-invalid'>Must contain from 1 to 40 letters</p>
          }
        </div>
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="lot-name">Name:</label>
        <input 
          className='auth-input'
          value={name} 
          type={'text'} 
          required
          onChange={e => setName(e.target.value)}
          />
          {
            !nameValid && 
            <p className='field-invalid'>Must contain from 1 to 40 letters</p>
          }
        </div>
        <div className="auth-form-field">
        <label className='auth-label' htmlFor="lot-description">Description:</label>
        <textarea 
          className='auth-input'
          value={description} 
          type={'text'} 
          required
          onChange={e => setDescription(e.target.value)}
          />
          {
            !descriptionValid && 
            <p className='field-invalid'>Must contain from 1 to 200 letters</p>
          }
        </div>    
      </div>
      <div className="create-detail-container">
      <div className="date-picker-container" style={{'minWidth': 'auto'}}>
      <div 
          className='filter-option sort-filter' 
          onClick={() => setOpenCategory(!openCategory)}
          style={{'color' : 'white', 'marginBottom': '1rem'}}>
            Category: <span className='selected-filter'>{category?.name}</span>
            {openCategory &&
              <ul className='dropdown'>
                <div style={{'maxHeight': '8rem', 'overflowX': 'hidden', 'overflowY': 'scroll', 'padding': '0.2rem'}}>
                {availableCategories.map((option, idx) => 
                  <li key={idx} className='dropdown-item' onClick={() => setCategory(option)}>
                  {option.name}
                  </li>
                )}
                </div>
              </ul>
            }
        </div>
      <div className="auth-form-field">
        <label className='auth-label' htmlFor="start-price">Starting price:</label>
        <input 
          className='auth-input'
          value={startPrice} 
          type={'number'} 
          required
          onChange={e => setStartPrice(e.target.value)}
          />
          {
            (!startPriceValid && startPrice !== 0) && 
            <p className='field-invalid'>Must be higher than 0 and lower than half a million</p>
          }
        </div>
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
            <p className='field-invalid'>Must be positive and lower or equal to the half of the starting price. Lot starting price: {`${startPrice ?? 0}`}</p>
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
            disabled={
              !openDateValid || !closeDateValid || !minimalBidValid || !selectedStatus?.name
              || !nameValid || !descriptionValid || !image || !category?.name || !startPriceValid
              ? true : false
              }
        >
            Submit
        </button>
      </div>
      </div>
    </form>
  )
}

export default AdminCreateLotForm