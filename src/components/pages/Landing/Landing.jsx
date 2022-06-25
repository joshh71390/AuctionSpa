import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate();

  const goToLots = () => navigate("/lots");

  return (
    <section className='banner-section'>
      <h1 class="banner">WHAT DO WE GOT AND HOW MANY?</h1>
      <h2 className='banner colored'>A LOT!</h2>
      <p className='notion'>With TradeMe you can put on auction <span className='colored'>almost</span> anything</p>
      <button className='search-button' onClick={goToLots}>Start searching</button>
    </section>
  )
}

export default Landing