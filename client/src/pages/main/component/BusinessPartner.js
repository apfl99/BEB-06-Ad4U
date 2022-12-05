import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import supplier from '../../../hooks/axios/supplier';
import client from '../../../hooks/axios/client';

import { Row, Col, Container } from 'react-bootstrap';

import '../Main.css';

const BusinessPartner = () => {
  const [clientList, setClientList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    client.mainList()
    .then(res => setClientList(res.data))
    .catch(err => console.log(err.response.data))
  }, [])

  useEffect(() => {
    supplier.mainList()
    .then(res => setSupplierList(res.data))
    .catch(err => console.log(err.response.data))
  }, [])

  return (
    <Container className='partner_container'>
      <h1>Partner with us</h1>
      <h3>파트너사</h3>
      <div className='partner_card_container'>
        {clientList.map((data, idx) => {
          return (
            <div className='partner_card'
              onClick = {() => {
                navigate(`/detail/client/${data.id}`)
                window.scrollTo(0,0)
              }}
              key={idx}
            >
              <div className='partner_card_content'>
                <div className='partner_card_front'>
                  <img src={data.profileImgUrl} alt='profileImg'/>
                </div>
                <div className='partner_card_back'>
                  <div className='partner_card_back_title'>{data.company_name}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='viewall'>
        <Link to="/list/client"><button className='viewall_btn'><span>View all</span></button></Link>
      </div>
        
      <h1 className='withus'>Creator with us</h1>
      <h3>크리에이터</h3>
      <div className="creator-content">
        {supplierList.map((data, idx) => {
          return (
            <div className='creator_card'
              onClick = {() => {
                navigate(`/detail/supplier/${data.id}`)
                window.scrollTo(0,0)
            }}
            key={idx}>
              <div className='creator_card_img'>
                <img src={data.profileImgUrl} alt='card img'/>
              </div>
              <Col className='creator_card_text'>
                <Row><div className='creator_card_t1'>{data.channelName}</div></Row>
                <Row><div className='creator_card_t2'>구독자 {data.subscriberCount > 10000 ? (data.subscriberCount/10000).toFixed(2) + "만명" : data.subscriberCount + "명"}</div></Row>
              </Col>
            </div>
          )
        })}
      </div>
      <div className='viewall'>
        <Link to="/list/supplier"><button className='viewall_btn'><span>View all</span></button></Link>
      </div>
    </Container>
  );
}

export default BusinessPartner;