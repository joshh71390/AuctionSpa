import React from 'react'
import './Popup.css'

const Popup = ({active, setActive, children}) => {
  return (
    <div className={active ? "popup active" : "popup"} onClick={() => setActive(false)}>
        <div className={active ? "content active" : "content"} onClick={e => e.stopPropagation()}>
           {children}
        </div>
    </div>
  )
}

export default Popup