import React from 'react'
import { useState } from 'react'
import PricePicker from './PricePicker/PricePicker'
import settingsvg from './images/settings.svg'
import CategoryPicker from './CategoryPicker/CategoryPicker'
import './FilterPanel.css'
import { useSearchParams } from 'react-router-dom'
import { debounce } from 'lodash'

const filters = [
  {name: 'Close Date (later)', value: 'dateDesc'},
  {name: 'Close Date (sooner)', value: 'dateAsc'},
  {name: 'Price (higher first)', value: 'priceDesc'},
  {name: 'Price (lower first)', value: 'priceAsc'}
];

const FilterPanel = () => {
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSort] = useState("");
  const [search, setSearch] = useSearchParams();
  const onSearchChange = debounce((e) => {
    const text = e.target.value;
 
    if (text.length === 0) {
      search.delete('lotName');
      setSearch(search, {
        replace: true
      });
    } else {
      search.set('lotName', text);
      setSearch(search, {
        replace: true
      });
    }
  }, 350);

  const onFilterSelect = (idx) => {
    setSort(filters[idx].name);
    search.set('sortBy', filters[idx].value);
    setSearch(search, {
      replace: true
    });
  }

  return (
    <section className='filter-panel'>
        <input className='text-input' placeholder='type in lot name' type={"text"} onChange={onSearchChange}></input>
        <PricePicker/>
        <CategoryPicker/>
        <div className='filter-option sort-filter' onClick={() => setOpenSort(!openSort)}>
            filter by: <span className='selected-filter'>{selectedSort}</span>
            {openSort &&
              <ul className='dropdown'>
                {filters.map((option, idx) => 
                  <li key={idx} className='dropdown-item' onClick={e => onFilterSelect(idx)}>
                  {option.name}
                  </li>
                )}
              </ul>
            }
        </div>
    </section>
  )
}

export default FilterPanel