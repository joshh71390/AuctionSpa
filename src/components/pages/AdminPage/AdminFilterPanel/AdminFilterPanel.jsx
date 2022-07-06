import React from 'react'
import AdminCategoryPicker from '../AdminCategoryPicker/AdminCategoryPicker'
import AdminSellerPicker from '../AdminSellerPicker/AdminSellerPicker'
import './AdminFilterPanel.css'
import { debounce } from 'lodash'
import { useSearchParams } from 'react-router-dom'

const AdminFilterPanel = () => {
  const [search, setSearch] = useSearchParams();

  const onSearchChange = debounce((e) => {
    const text = e.target.value;
 
    if (text.length === 0) {
      search.delete('name');
      setSearch(search, {
        replace: true
      });
    } else {
      search.set('name', text);
      setSearch(search, {
        replace: true
      });
    }
  }, 350);

  const clearSearch = () => {
    setSearch([]);
  }

  return (
    <section className='admin-filter-panel'>
      <div className="admin-filter-header">
        <h4 className="section-label">Filter</h4>
        <p className="clear-tag" onClick={clearSearch}>clear filters</p>
      </div>
        <input 
            className='admin-name-input' 
            placeholder='type in lot name' 
            type={"text"} 
            onChange={onSearchChange}/>
            <AdminCategoryPicker/>
            <AdminSellerPicker/>
    </section>
  )
}

export default AdminFilterPanel