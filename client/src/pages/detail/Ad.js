import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import axios from 'axios';

import ad from '../../hooks/axios/ad';
import supplier from '../../hooks/axios/supplier';
import { getLocalData } from '../../config/localStrage'; 
import nullImg from '../../dummyfiles/img1.png';

import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

import './Detail.css';

const AdDetail = ({ userData }) => {
  const navigate = useNavigate();
  const { adId } = useParams();
  const [detail, setDetail] = useState({
    Client : {company_name: "", email: ""},
    Advertisement_has_Suppliers: []
  });

  const accessToken = getLocalData('accessToken');
  const isClient = getLocalData('isClient');
  const data = detail.Advertisement_has_Suppliers;
  const isApply = data.filter(data => data.Supplier_id === userData.id);

  const [toKrw, setToKrw] = useState(0);
  
  useEffect(() => {
    ad.getDetail(adId)
    .then(res=> setDetail(res.data))
    .catch(err => console.log(err.response.data))
    vsCost(detail.cost);
  }, [adId,detail.cost])

  const vsCost = async (val) => {
    const cost =  val;
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=krw`;
    const options = {
      url: coinGeckoUrl,
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    }
    var toKrw = 0;
    await axios.request(options)
        .then(res => {
          toKrw = res.data.ethereum.krw*cost;
          toKrw = Math.round(toKrw).toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          setToKrw(toKrw)
        })
        .catch(err => console.log(err))
  }

  return (
    <Container className='adDetail_container'>
      <Row className='adDetail_row'>
        <Col xl={7} className="adDetail_card">
          <Row className='adDetail_Img'>
            {detail.AdimgUrl 
              ? <Card.Img variant="top" className='adDetail_card_img' src={detail.AdimgUrl}/> 
              : <Card.Img variant='top' className='adDetail_card_img' src={nullImg}/> }
          </Row>
          <Row>
            <h3 className='adDetail_Title'>{detail.title}</h3>
            <br />
            <br />
            <p className='adDetail_Content'>{detail.content}</p>
          </Row>
        </Col>
        <Col xl={3}>
          <Card border="dark"
            bg={"white"}
            text={"white"} 
            className="adDetail_info_card"
          >
            <Card.Header 
              onClick={() => navigate(`/detail/client/${detail.Client.id}`)}
              key={detail.Client.id}
            >
              {detail.Client.profileImgUrl
                ? <Avatar className='avatar' src={detail.Client.profileImgUrl} size="50"/>
                : <Avatar className='avatar' src={nullImg} size="50"/>
              }
              <h5 className='infoCardHeader'>
                {detail.Client.company_name}
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className='item'>
                <ListGroup.Item>{detail.Client.email}</ListGroup.Item>
              </ListGroup>
              <br></br>
              <Card.Title className='infoCardTitle'>제안 금액</Card.Title>
              <Card.Text className='infoCardContent'>
                {detail.cost} ETH
              </Card.Text>
              <p className='vsKrw'>= {toKrw} KRW</p>
              <Card.Title className='infoCardTitle'>지원자 수</Card.Title>
              <Card.Text className='infoCardContent'>
                {detail.Advertisement_has_Suppliers.length}
              </Card.Text>
              <br></br>
              <div className='adGo'>
                {isApply.length 
                  ? (<button className='adGo_btn' onClick={() => supplier.callApplyCancel(accessToken, isClient, adId)} ><span>취소하기</span></button>)
                  : (<button className='adGo_btn' onClick={() => supplier.callApply(accessToken, isClient, adId)} ><span>지원하기</span></button>)
                } 
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdDetail;