import axios from '../../../../apiAccessor/axiosApi'
import React, { useEffect, useState } from 'react'
import Spinner from '../../../shared/Spinner/Spinner'

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const NAME_REGEX = /^[A-Za-z]{2,20}$/;

const getAge = (date) => {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const RegisterForm = ({submitting, setSubmitting}) => {
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);

    const [name, setName] = useState('');
    const [nameValid, setNameValid] = useState(false);

    const [surname, setSurname] = useState('');
    const [surnameValid, setSurnameValid] = useState(false);

    const [birthDate, setBirthDate] = useState('');
    const [birthDateValid, setBirthDateValid] = useState(true);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setEmailValid(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setPasswordValid(PWD_REGEX.test(password));
    }, [password])

    useEffect(() => {
        setNameValid(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setSurnameValid(NAME_REGEX.test(surname))
    }, [surname])

    useEffect(() => {
        const age = getAge(birthDate);
        setBirthDateValid(age >= 18 && age < 110)
    }, [birthDate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        try {
            const user = {
                email,
                password,
                name,
                surname,
                birthDate: new Date(birthDate)
            }
            await axios.post('/auth/register',
                JSON.stringify(user),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }  
            );
            setEmail('');
            setPassword('');
            setName('');
            setSurname('');
            setBirthDate('');
            setSuccess(true);
        } catch (error) {
            console.log(error);
            if (!error?.response){
                setError('No server response');
            } else {
                setError('Registration failed');
            }
        } finally {
            setSubmitting(false);
        }
  }

  return (
    submitting ? <div className='spinner-container'><Spinner/></div> :
    success ? <p className='submit-success'>Registered successfully</p> :
    <form onSubmit={handleSubmit} className="auth-form">
        {error.length !== 0 && <p className='submit-error'>{error}</p>}
        <div className="auth-form-field">
        <label htmlFor="email" className="auth-label">
            Email:
        </label>
        <input 
            type="text"
            className="auth-input"
            onChange={e => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={emailValid ? "false" : "true"}
         />
         {(!emailValid && email.length !==0 ) && 
         <p className='field-invalid'>Must include @ sign and correct domain name</p> }
        </div>
        <div className="auth-form-field">
        <label htmlFor="password" className="auth-label">
            Password:
        </label>
        <input 
            type="password" 
            className="auth-input"
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
            aria-invalid={passwordValid ? "false" : "true"} 
        />
        {(!passwordValid && password.length !== 0 ) && 
        <p className='field-invalid'>8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character</p>}
        </div>
        <div className="auth-form-field">
        <label htmlFor="firstName" className="auth-label">
            First name:
        </label>
        <input 
            type="text"
            className="auth-input" 
            onChange={e => setName(e.target.value)}
            value={name}
            required
            aria-invalid={nameValid ? "false" : "true"}
        />
        {(!nameValid && name.length !==0 ) && 
         <p className='field-invalid'>2 to 20 characters. Must include only letters</p>}
        </div>
        <div className="auth-form-field">
        <label htmlFor="lastName" className="auth-label">
            Last name:
        </label>
        <input 
            type="text" 
            className="auth-input" 
            onChange={e => setSurname(e.target.value)}
            value={surname}
            required
            aria-invalid={surnameValid ? "false" : "true"}
        />
        {(!surnameValid && surname.length !==0 ) && 
         <p className='field-invalid'>2 to 20 characters. Must include only letters</p> }
        </div>
        <div className="auth-form-field">
        <label htmlFor="birthDate" className="auth-label">
            Birth date:
        </label>
        <input 
            type="date" 
            className="auth-input"
            onChange={e => setBirthDate(e.target.value)}
            required
            aria-invalid={birthDateValid ? "false" : "true"} 
        />
        {(!birthDateValid && birthDate.length !==0 ) && 
         <p className='field-invalid'>You must be of age 18 to register</p> }
        </div>
        <button 
            className="auth-submit-button"
            disabled={!emailValid || !passwordValid || !nameValid
            || !surnameValid || !birthDateValid ? true : false}
        >
            Sign in
        </button>
    </form>
  )
}

export default RegisterForm