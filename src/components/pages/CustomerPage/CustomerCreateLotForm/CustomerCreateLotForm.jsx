import React, { useEffect, useMemo, useState } from 'react'
import useAuthAxios from '../../../../hooks/useAuthAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import imagePlaceholder from '../../../../images/image-not-found.svg';
import { useMutation, useQueryClient } from 'react-query';

const CustomerCreateLotForm = ({categories, active}) => {
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

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(imagePlaceholder);

  useEffect(() => {
    setName('');
    setDescription('');
    setStartPrice(0);
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
  await axios.post('/lots/place/customer', lot, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(() => setSuccess(true))
  .catch(() => setError('could not create new lot'))
  .finally(() => setProcessing(false));
}, {
  onSuccess: () => queryClient.invalidateQueries(['owned'])
})

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);

    const lot = new FormData();
    lot.append('name', name);
    lot.append('description', description);
    lot.append('startPrice', startPrice);
    lot.append('categoryId', category.id);
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
            'height': '100%',
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
        </div>    
      </div>
      <div className="create-detail-container">
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
        <button 
            className="auth-submit-button"
            disabled={ 
              !nameValid || !descriptionValid || !image || !category?.name || !startPriceValid
              ? true : false
              }
        >
            Submit
        </button>
      </div>
    </form>
  )
}

export default CustomerCreateLotForm