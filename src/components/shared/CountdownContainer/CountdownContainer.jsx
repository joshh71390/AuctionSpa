import React from 'react'
import { useCounter } from '../../../hooks/useCounter'
import './CountdownContainer.css'

const CountdownContainer = ({openDate, closeDate}) => {
  const { counter, currentUtcTime } = useCounter({openDate, closeDate});

  const Counter = () => {
    return counter ? 
    <p className='countdown-timer'>
        {counter.days().toFixed()}d {counter.hours()}h {counter.minutes()}m{" "} {counter.seconds()}s
    </p>
    :
    <p>loading...</p>
  }

  const CounterContainer = () => {
    return closeDate > currentUtcTime && openDate < currentUtcTime ?
    <div className='timer-container'>
        <div className='timer-title'>Remaining time:&nbsp;</div>
        <div><Counter/></div>
    </div>
    : openDate > currentUtcTime ?
    <div className='timer-container'>
        <div className='timer-title'>Time until start:&nbsp;</div>
        <div><Counter/></div>
    </div>
    :
    <span>
        <span>Auction ended</span>
    </span>
  }

  return (
    <CounterContainer/>
  )
}

export default CountdownContainer