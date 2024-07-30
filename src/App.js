import './App.css';
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './Pages/HomePage';
import Register from './Pages/Register';
import LoginPage from './Pages/LoginPage';


function App() {
  return (
    <>
       <Routes>
         <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/login' element={<LoginPage/>}/>
       </Routes>
    
    </>
  );
}

export function ProtectedRoutes (props)
{
  if(localStorage.getItem('user'))
    {
      return props.children;
    }else{
      return <Navigate to={'/login'}/>
    }
}

export default App;
