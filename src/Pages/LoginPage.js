import React,{useEffect, useState} from 'react'
import {Form, Input, message} from 'antd';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';


const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (values)=>{

        try {
         setLoading(true);
        const {data} = await axios.post('/users/login', values);
        setLoading(false);
        message.success('Login successfully');
        localStorage.setItem('user',JSON.stringify({...data.user ,password :''}));
        navigate('/');
            
        } catch (error) {
            setLoading(false);
            message.error("Something went wrong");
        }
        
    }
//prevent for login user
    useEffect(()=>{
        if(localStorage.getItem('user'))
            {
                navigate('/');
            }
    },[navigate]);


  return (
    <>
    <div className="register-page">
    {loading && <Spinner/>}
        <Form onFinish={submitHandler}>
            <h1>LOGIN FORM</h1>
            <Form.Item label ="Email" name="email">
                <Input type='email'/>
            </Form.Item>

            <Form.Item label ="Password" name="password">
                <Input type='password'/>
            </Form.Item>

            <div className="d-flex justify-content-between">
                <Link to={'/register'}>Not a user ? Register here</Link>
                <button className='btn btn-secondary'>LOGIN</button>
            </div>

        </Form>
      </div>
    
    </>
  )
}

export default LoginPage