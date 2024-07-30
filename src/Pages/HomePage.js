import React, { useState ,useEffect} from 'react'
import { Form, Input, Modal, Select, Table, message, DatePicker} from 'antd';
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'
import Layout from '../components/Layout/Layout'
import Spinner from '../components/Spinner';
import axios from 'axios';
import moment from 'moment';
import Analytics from '../components/Analytics';

const {RangePicker} = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([])
  const [frequency, setFrequency] = useState("7")
  const [startDate, setStartDate] = useState([])
  const [type,setType]  = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable , setEditable] = useState(null)


  // table 

  const columns =[
    {
      title: 'Date',
      dataIndex: 'date',
      render:(text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Refrence',
      dataIndex: 'refrence',
    },
    {
      title: 'Actions',
      render : (text,record)=> (
        <div>
          <EditOutlined onClick={()=>{
            setEditable(record)
            setShowModal(true)
          }}/>
          <DeleteOutlined className='mx-2' onClick={()=>{
            deleteHandler(record);
          }}/>
        </div>
      )
    },
  ]

  

  useEffect(()=>{
    //get transactions

  const getAllTransections =async()=>{
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setLoading(true)
      const res = await  axios.post('/transections/get-transections',{userid: user._id,frequency,startDate,type})
      setLoading(false)
      setAllTransection(res.data)

    } catch (error) {
      console.log(error)
      message.error('Failed to Fetch data')
      
    }
  };
    getAllTransections();
  },[frequency,startDate,type])


  const deleteHandler = async(record)=>{
    try {
      setLoading(true)
      await  axios.post('/transections/delete-transections',{transactionId: record._id});
      setLoading(false)
    } catch (error) {
      setLoading(false);
      message.error('Failed to Delete data')
      console.log(error)
      
    }
  }

  const submitHandler = async (values)=>{
    try {
      const user = await JSON.parse(localStorage.getItem('user'));
      setLoading(true);
        if(editable)
        {  
          await axios.post('/transections/edit-transections',{payload:{
            ...values,
          userid:user._id},
        transactionId:editable._id,});
        setLoading(false);
        message.success('Transaction Updated successfully');

        }else{
          await axios.post('/transections/add-transections',{...values, userid:user._id});
          setLoading(false);
          message.success('Transaction added successfully');
        }
     setShowModal(false);
     setEditable(null)
    } catch (error) {
      setLoading(false);
      message.error('failed to adding transaction');
      
    }
  }

  
  return (
    <Layout>
      {loading && <Spinner/>}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values)=> setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="custom" >Custom</Select.Option>
          </Select>
          {frequency === "custom" && (<RangePicker value={startDate} onChange={(values)=> setStartDate(values)}/>
        )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values)=> setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === "custom" && (<RangePicker value={startDate} onChange={(values)=> setStartDate(values)}/>
        )}
        </div>
        <div className='switch-icons'>
            <UnorderedListOutlined className={`mx-2 ${viewData==='table'? 'active-icon':'inactive-icon'}`} onClick={()=> setViewData("table")}/>
            <AreaChartOutlined className={`mx-2 ${viewData==='analytics'? 'active-icon':'inactive-icon'}`} onClick={() => setViewData("analytics")}/>
          </div>
        <div>
          <button className='btn btn-primary'onClick={()=>setShowModal(true)}>Add New</button>
        </div>

      </div>
      <div className="content">
        {viewData === 'table' ? (<Table columns={columns} dataSource={allTransection}/>) : (<Analytics allTransection={allTransection}/>) }
        
      </div>
      <Modal title = {editable ? 'Edit Transaction' : 'Add Transactions'}
      open={showModal} onCancel={()=>setShowModal(false)} footer={false}>

        <Form onFinish={submitHandler} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type='text'/>
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value= "income">Income</Select.Option>
              <Select.Option value= "expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value= "salary">Salary</Select.Option>
              <Select.Option value= "tip">Tip</Select.Option>
              <Select.Option value= "movie">Movie</Select.Option>
              <Select.Option value= "food">Food</Select.Option>
              <Select.Option value= "bills">Bills</Select.Option>
              <Select.Option value= "Tax">Tax</Select.Option>
              <Select.Option value= "project">Project</Select.Option>
              <Select.Option value= "fee">Fee</Select.Option>
              <Select.Option value= "medical">Medical</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type='date'/>
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type='text'/>
          </Form.Item>

          <Form.Item label="Discription" name="discription">
            <Input type='text'/>
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type='submit' className='btn btn-primary'>SAVE</button>
          </div>

        </Form>

      </Modal>
    </Layout>
  )
}

export default HomePage;