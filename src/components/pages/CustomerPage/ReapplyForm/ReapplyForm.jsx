import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import useAuthAxios from '../../../../hooks/useAuthAxios'
import Spinner from '../../../shared/Spinner/Spinner';
import { useQueryClient, useMutation } from 'react-query';

const ReapplyForm = ({lot, categories, active}) => {
    const axios = useAuthAxios();

    const [name, setName] = useState(lot?.name);
    const [nameValid, setNameValid] = useState(false);
  
    const [description, setDescription] = useState(lot?.description);
    const [descriptionValid, setDescriptionValid] = useState(false);
  
    const [startPrice, setStartPrice] = useState(lot?.startPrice);
    const [startPriceValid, setStartPriceValid] = useState(false);
  
    const availableCategories = useMemo(() => categories ?? [], [categories]);
    const [category, setCategory] = useState(categories.find(c => c.name == lot?.category));
    const [openCategory, setOpenCategory] = useState(false);
  
    const [image, setImage] = useState(null);
    const defaultImage = `${process.env.REACT_APP_AUCTION_API_URL}/images/lot/${lot.id}/thumbnail`;
    const [previewImage, setPreviewImage] = useState(defaultImage);


    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      setName(lot?.name);
      setDescription(lot?.description);
      setStartPrice(lot?.startPrice);
      setCategory(categories.find(c => c.name == lot?.category));
      setImage(null);
      setOpenCategory(false);
      setSuccess(false);
    }, [active])
  
    useEffect(() => {
      const same = name === lot?.name;
      const correctLength = name.length <= 40 && name.length > 0;
      setNameValid(same || correctLength);
    }, [name])
  
    useEffect(() => {
      const same = description === lot?.description;
      const correctLength = description.length <= 200 && description.length > 0;
      setDescriptionValid(same || correctLength);
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
      const mutation = useMutation(async form => {
        await axios.put(`/reviews/${lot.id}/reapply`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => setSuccess(true))
        .catch(() => setError('could not update lot'))
        .finally(() => setProcessing(false));
      }, {
        onSuccess: () => queryClient.invalidateQueries(['owned'])
      })
      
        const handleSubmit = async e => {
          e.preventDefault();
          setProcessing(true);
      
          const form = new FormData();
          
          if (name !== lot.name){
            form.append('name', name);
          }
          if (description !== lot.description){
            form.append('description', description);
          }
          if (startPrice !== lot.startPrice){
            form.append('startPrice', startPrice);
          }
          if (category.name !== lot.category){
            form.append('categoryId', category.id);
          }
          if (image !== null){
            form.append('image', image);
          }
      
          await mutation.mutateAsync(form);
        }
  
    return (
      processing ? <div className='spinner-container'><Spinner/></div>:
      success ? <p className='submit-success'>Successfully approved</p>:
      <form 
        onSubmit={handleSubmit} 
        className='split-container'
        style={{'minWidth': '30rem'}}>
        {error.length !== 0 && <p className='submit-error'>{error}</p>}
        <div className="create-detail-container">
      <img 
        src={image ? previewImage : defaultImage} 
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
          <div className="auth-form-field">
          <label className='auth-label' htmlFor="start-price">Starting price:</label>
          <input 
            className='auth-input'
            value={startPrice} 
            type={'number'} 
            required
            disabled={moment(lot?.openDate).local() < moment().local() && lot?.status ? true : false}
            onChange={e => setStartPrice(e.target.value)}
            />
            {
              (!startPriceValid && startPrice !== 0) && 
              <p className='field-invalid'>Must be higher than 0 and lower than half a million</p>
            }
            {
              (moment(lot?.openDate).local() < moment().local() && lot?.status)  &&
              <p className="bid-auth-warning" style={{'width': '100%', 'padding' : '1rem'}}>Cannot change the price because auction for this lot already started</p>
            }
          </div>
          <div className="lot-edit-container">
          <button 
              className="auth-submit-button"
              disabled={!nameValid || !descriptionValid || !startPriceValid ? true : false}
          >
              Submit
          </button>
          <button 
            className="auth-submit-button"
            style={{'backgroundColor': '#CC5C5C', 'color': 'white'}}>
              Remove
          </button>
          </div>
      </div>
      </form>
    )
}

export default ReapplyForm