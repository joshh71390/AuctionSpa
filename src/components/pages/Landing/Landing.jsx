import React from 'react'
import './Landing.css'

const Landing = () => {
  return (
    <section className='banner-section'>
      <h1 class="banner">HOW MANY LOTS DO WE GOT?</h1>
      <h2 className='banner colored'>A LOT!</h2>
      <p className='notion'>With TradeMe you can put on auction <span className='colored'>almost</span> anything</p>
      <button className='search-button'>Start searching</button>
    </section>
  )
}

export default Landing