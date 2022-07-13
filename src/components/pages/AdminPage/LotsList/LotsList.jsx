import React, { useMemo } from 'react'
import './LotsList.css'
import moment from 'moment'
import { useState } from 'react'
import Spinner from '../../../shared/Spinner/Spinner'
import Popup from '../../../shared/Popup/Popup'
import AdminFilterPanel from '../AdminFilterPanel/AdminFilterPanel'
import { useSearchParams } from 'react-router-dom'
import AdminCreateLotForm from '../AdminCreateLotForm/AdminCreateLotForm'

const Lot = ({lot, handleSelected}) => {
    const listLot = useMemo(() => lot ?? {}, [lot, lot?.openDate, lot?.closeDate]);

    return (
        <section onClick={() => handleSelected(listLot.id)} className='admin-lot'>
            <div className="admin-lot-header">
                <h4 className='lot-name-label'>{listLot.name}</h4>
                <div className='admin-lot-status'>
                    {
                        listLot.reviewStatus.toLowerCase() === 'allowed' ? 
                        listLot.status.toLowerCase() : listLot.reviewStatus.split(/(?=[A-Z])/).join(' ').toLowerCase()
                    }
                </div>
            </div>
            {
                listLot.reviewStatus.toLowerCase() === 'allowed' && 
                <h4 className='lot-duration-label'>Auction date:  
                <span className='lot-duration'>
                    {`${moment(listLot.openDate).format('LL')} - ${moment(listLot.closeDate).format('LL')}`}
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

const LotsList = ({lots, statuses, categories, handleSelected, loading, status}) => {
    const [search, setSearch] = useSearchParams();

    const [selectedOption, setSelectedOption] = useState(options[0].name);
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateLot, setShowCreateLot] = useState(false);

    const handleOptionChange = (option) => {
        if (option === options[0].name){
            setSearch("", {
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
    <button className='create-lot-button' onClick={() => setShowCreateLot(true)}>Place lot</button>
    <Popup active={showCreateLot} setActive={setShowCreateLot}>
        <AdminCreateLotForm
            statuses={statuses}
            categories={categories}
            active={showCreateLot}
        />
    </Popup>
    <div className='overflow-scroll'>
    <div className='lots-list-container'>
        {
            loading ? <div className='spinner-container'><Spinner/></div> :
            lots.length === 0 || status === 'error' ? <div className='content-empty' style={{'fontSize': '1rem'}}>This section is empty</div> :
            lots.map(lot => <Lot key={lot.id} lot={lot} handleSelected={handleSelected}/>)
        }
    </div>
    </div>
    <Popup active={showFilters} setActive={setShowFilters}>
        <AdminFilterPanel/>
    </Popup>
    </section>
  )
}

export default LotsList