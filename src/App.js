import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import './App.css';
import Landing from './components/pages/Landing/Landing';
import Lots from './components/pages/Lots/Lots';

function App() {
  return (
    <Fragment>
      <Header/>
      <Routes>
        <Route exact path='/' element={<Landing/>}/>
        <Route exact path='/lots' element={<Lots/>}/>
      </Routes>
    </Fragment>
  );
}

export default App;
