import { Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import './App.css';
import Landing from './components/pages/Landing/Landing';
import Lots from './components/pages/Lots/Lots';
import LotPage from './components/pages/LotPage/LotPage';
import AuthPage from './components/pages/AuthPage/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './components/pages/AdminPage/AdminPage';
import CustomerPage from './components/pages/CustomerPage/CustomerPage';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route exact path='/' element={<Landing/>}/>
        <Route exact path='/lots' element={<Lots/>}/>
        <Route exact path='/lots/:id' element={<LotPage/>}/>
        <Route exact path='/auth' element={<AuthPage/>}/>
        <Route element={<ProtectedRoute allowedRoles={["administrator"]} />}>
          <Route path='/admin' element={<AdminPage/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["customer"]}/>}>
          <Route path='/profile' element={<CustomerPage/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
