import React from 'react'
import './Toggle.css'
import { useSearchParams } from 'react-router-dom';

const Toggle = ({onSale, selectOnSale}) => {
  const [search, setSearch] = useSearchParams();

  const toggle = () => {
    if (search.get('forSale') === null){
      search.set('forSale', false);
      setSearch(search, {
        replace: true
      });
    } else {
      search.set('forSale', !onSale);
      setSearch(search, {
        replace: true
      });
    }
    
    selectOnSale(!onSale);
  }
    
  return (
    <div className='toggle'>
        <span className={ onSale ? "option selected" : "option"} onClick={toggle}>on sale</span>
        <span className={ !onSale ? "option selected" : "option"} onClick = {toggle}>sold</span>
    </div>
  )
}

export default Toggle