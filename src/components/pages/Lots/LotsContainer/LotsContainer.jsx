import React from 'react'
import './LotsContainer.css'
import { useState } from 'react';
import Toggle from '../../../shared/Toggle/Toggle';
import LotCard from '../../../shared/LotCard/LotCard';
import Spinner from '../../../shared/Spinner/Spinner';

const LotsContainer = ({lots, isLoading}) => {
  const [onSale, selectOnSale] = useState(true);

  return (
    <section className='lots-container'>
        <div className="filter-optional">
        <h4 className='count-total'>Total lots: {lots.length}</h4>
        <Toggle onSale={onSale} selectOnSale={selectOnSale}/>
        </div>
        <div className={isLoading ? "spinner-container" : 
        lots.length === 0 ? "spinner-container" : "lots-display-container"}>
        {isLoading ? <Spinner/> : lots.length === 0 ? 
            <div className="content-empty">
            Ooops... guess nothing is in here yet
            </div>
          : lots.map(lot => <LotCard key={lot.id} lot={lot}/>
         )}
        </div>
        </section>
  )
}

export default LotsContainer