import React from 'react'
import { useCounter } from '../../../hooks/useCounter'
import './CountdownContainer.css'
import moment from 'moment'

const CountdownContainer = ({openDate, closeDate}) => {
  const { counter, currentTime, currentUtcTime } = useCounter({openDate, closeDate});

  const Counter = () => {
    if (isNaN(counter)) return <p>loading...</p>
    return counter ? 
    <p className='countdown-timer'>
        {counter.days().toFixed()}d {counter.hours()}h {counter.minutes()}m{" "} {counter.seconds()}s
    </p>
    :
    <p>loading...</p>
  }

  const CounterContainer = () => {
    return moment(closeDate).utc(true).local().toISOString("dd/mm/yyyy HH:mm") > currentTime &&
    moment(openDate).utc(true).local().toISOString("dd/mm/yyyy HH:mm") < currentTime ?
    <div className='timer-container'>
        <div className='timer-title'>Remaining time:&nbsp;</div>
        <div><Counter/></div>
    </div>
    : moment(openDate).utc(true).local().toISOString("dd/mm/yyyy HH:mm") > currentTime ?
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