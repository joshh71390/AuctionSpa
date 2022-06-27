import React from 'react'
import { useState } from 'react'
import PricePicker from './PricePicker/PricePicker'
import settingsvg from './images/settings.svg'
import CategoryPicker from './CategoryPicker/CategoryPicker'
import './FilterPanel.css'

const filters = [
  {name: 'Date (new first)'},
  {name: 'Date (old first)'},
  {name: 'Price (lower first)'},
  {name: 'Price (higher first)'}
];

const FilterPanel = () => {
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const [selectedSort, setSort] = useState(filters[0].name);
  const [selectedCategory, setCategory] = useState();

  return (
    <section className='filter-panel'>
        <input className='text-input' placeholder='type in lot name' type={"text"}></input>
        <PricePicker/>
        <CategoryPicker categories = {filters}/>
        <div className='filter-option sort-filter' onClick={() => setOpenSort(!openSort)}>
            filter by: <span className='selected-filter'>{selectedSort}</span>
            {openSort &&
              <ul className='dropdown'>
                {filters.map((option, idx) => 
                  <li key={idx} className='dropdown-item' onClick={() => setSort(filters[idx].name)}>
                  {option.name}
                  </li>
                )}
              </ul>
            }
        </div>
        <button className="apply-button">apply</button>
    </section>
  )
}

export default FilterPanel