import React from 'react'
import './LotsList.css'
import moment from 'moment'
import { useState } from 'react'
import Spinner from '../../../shared/Spinner/Spinner'
import Popup from '../../../shared/Popup/Popup'
import AdminFilterPanel from '../AdminFilterPanel/AdminFilterPanel'
import { useSearchParams } from 'react-router-dom'

const Lot = ({lot, handleSelected}) => {
    return (
        <section onClick={() => handleSelected(lot.id)} className='admin-lot'>
            <div className="admin-lot-header">
                <h4 className='lot-name-label'>{lot.name}</h4>
                <div className='admin-lot-status'>
                    {
                        lot.reviewStatus.toLowerCase() === 'allowed' ? 
                        lot.status.toLowerCase() : lot.reviewStatus.split(/(?=[A-Z])/).join(' ').toLowerCase()
                    }
                </div>
            </div>
            {
                lot.reviewStatus.toLowerCase() === 'allowed' && 
                <h4 className='lot-duration-label'>Auction date:  
                <span className='lot-duration'>
                    {`${moment(lot.openDate).format('LL')} - ${moment(lot.closeDate).format('LL')}`}
                </span>
            </h4>
            }
        </section>
    )
}

const options = [
    {name: 'All', selected: true},
    {name: 'Pending', selected: false},
    {name: 'Complete', selected: false}
];

const LotsList = ({lots, handleSelected, loading}) => {
    const [search, setSearch] = useSearchParams();

    const [selectedOption, setSelectedOption] = useState(options[0].name);
    const [showFilters, setShowFilters] = useState(false);

    const handleOptionChange = (option) => {
        if (option === options[0].name){
            search.delete('status');
            setSearch(search, {
                replace: true
            });
        } else {
            search.set('status', option.toLowerCase());
            setSearch(search, {
                replace: true
            });
        }
        setSelectedOption(option);
    }

  return (
    <section className='lots-list'>
    <div className="filter-header">
        {options.map(option => 
        <h4 
            key={option.name}
            className={option.name === selectedOption ? 'admin-filter-option admin-selected' : 'admin-filter-option'}
            onClick={() => handleOptionChange(option.name)}
        >
            {option.name}
        </h4>)}
        <h4 className='admin-filter-toggle admin-filter-option' onClick={() => setShowFilters(true)}>Filters</h4>
    </div>
    <div className='lots-list-container'>
        {
            loading ? <div className='spinner-container'><Spinner/></div> :
            lots.length === 0 ? <div className='content-empty' style={{'fontSize': '1rem'}}>This section is empty</div> :
            lots.map(lot => <Lot key={lot.id} lot={lot} handleSelected={handleSelected}/>)
        }
    </div>
    <button className='create-lot-button'>Place lot</button>
    <Popup active={showFilters} setActive={setShowFilters}>
        <AdminFilterPanel/>
    </Popup>
    </section>
  )
}

export default LotsList