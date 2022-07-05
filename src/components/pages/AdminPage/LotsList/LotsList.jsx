import React from 'react'
import './LotsList.css'
import moment from 'moment'

const Lot = ({lot, handleSelected}) => {
    return (
        <section onClick={() => handleSelected(lot.id)} className='admin-lot'>
            <div className="admin-lot-header">
                <h4 className='lot-name-label'>{lot.name}</h4>
                <div className='admin-lot-status'>{lot.status.toLowerCase()}</div>
            </div>
            <h4 className='lot-duration-label'>Auction date:  
                <span className='lot-duration'>
                    {`${moment(lot.openDate).format('LL')} - ${moment(lot.closeDate).format('LL')}`}
                </span>
            </h4>
        </section>
    )
}

const LotsList = ({lots, handleSelected}) => {
  return (
    <section className='lots-list-container'>
        {lots.map(lot => <Lot key={lot.id} lot={lot} handleSelected={handleSelected}/>)}
    </section>
  )
}

export default LotsList