import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import './App.css';
import Landing from './components/pages/Landing/Landing';
import Lots from './components/pages/Lots/Lots';
import LotPage from './components/pages/LotPage/LotPage';
import AuthPage from './components/pages/AuthPage/AuthPage';
import AdminAuthPage from './components/pages/AdminAuthPage/AdminAuthPage';

function App() {
  return (
    <Fragment>
      <Header/>
      <Routes>
        <Route exact path='/' element={<Landing/>}/>
        <Route exact path='/lots' element={<Lots/>}/>
        <Route exact path='/lots/:id' element={<LotPage/>}/>
        <Route exact path='/auth' element={<AuthPage/>}/>
        <Route exact path='/admin/auth' element={<AdminAuthPage/>}/>
      </Routes>
    </Fragment>
  );
}

export default App;
