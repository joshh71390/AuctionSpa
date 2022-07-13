import React from 'react'
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import useAuthAxios from '../../../../hooks/useAuthAxios'
import Spinner from '../../../shared/Spinner/Spinner';

const RejectPanel = ({lot}) => {
  const axios = useAuthAxios();

  const [feedback, setFeedback] = useState('');
  const [feedbackValid, setFeedbackValid] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const valid = feedback.length <= 100;
    setFeedbackValid(valid);
  }, [feedback])

  const client = useQueryClient();
  const rejectMutation = useMutation(async () => {
    await axios.put(`reviews/${lot.id}/reject`, feedback)
    .then(() => {
      lot.reviewStatus = 'rejected';
      lot.feedback = feedback;
      setSuccess(true);
    })
    .catch(() => setError('Could not reject lot'))
    .finally(() => setProcessing(false));
  }, {
    onSuccess: () => client.invalidateQueries('reviews')
  })

  const handleReject = async e => {
    e.preventDefault();
    setProcessing(true);
    await rejectMutation.mutateAsync();
  }

  return (
    processing ? <div className='spinner-container'><Spinner/></div>:
    success ? <p className='submit-success'>Successfully rejected</p>:
    <form onSubmit={handleReject} className='review-form-container'>
      {error.length !== 0 && <p className='submit-error'>{error}</p>}
      <div className="auth-form-field">
      <label className='auth-label' htmlFor="feedback">{'Feedback (optional):'}</label>
      <textarea 
          className='auth-input'
          value={feedback} 
          type={'text'} 
          required
          onChange={e => setFeedback(e.target.value)}
          style={{'minWidth': '30rem'}}
          />
          {
            !feedbackValid && 
            <p className='field-invalid'>Must contain no more than 100 letters</p>
          }
      </div>
        <button 
            className="auth-submit-button"
            style={{'width': '50%', 'alignSelf': 'center'}}
            disabled={!feedbackValid ? true : false}>
               Submit 
            </button>
    </form>
  )
}

export default RejectPanel