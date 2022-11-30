import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getLocalData } from '../../config/localStrage';

import Avatar from 'react-avatar';
import { Container, Card } from 'react-bootstrap/esm';
import Swal from 'sweetalert2'

import supplier from '../../hooks/axios/supplier';
import Propose from './component/Propose';
import './Detail.css';


const SupplierDetail = ({ userData }) => {
  const { supplierId } = useParams();
  const [detail, setDetail] = useState({});
  const [playlist, setPlaylist] = useState([])
  const [show, setShow] = useState(false);
  console.log("Detail", detail)

  useEffect(() => {
    supplier.getDetail(supplierId)
    .then(res=> setDetail(res.data))
    .catch(err => err.response.data)
  }, [supplierId])

  useEffect(() => {
    const apikey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const get_channelId = detail.channel_id;
    console.log(get_channelId)
    axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${get_channelId}&maxResults=50&key=${apikey}`
      )
      .then((res) => {
        console.log(res.data.items);
        setPlaylist(res.data.items)
      })
      .catch((err) => { console.log(err) });
  }, [detail]);

  const handleShow = async () => {
    const isClient = getLocalData("isClient")
    if (isClient === "true") return setShow(true);
    else {
      await Swal.fire({
        icon: 'error',
        title: '광고주 계정으로만 지원 가능합니다!',
      })
    }
  }

  return (
    <Container className='supplierDetail_container'>
      <div className="supplierDetail-content_card-container">
        <Avatar src={detail.profileImgUrl} size="150"/>
        <Card.Body>
          <Card.Title className='supplierDetail_title' as='h1'>{detail.channelName}</Card.Title>
          <Card.Text>{detail.channelUrl}</Card.Text>
          <Card.Text>{detail.email}</Card.Text>
          <Card.Text>subscriber {detail.subscriberCount}</Card.Text>
          <Card.Text>view {detail.viewCount}</Card.Text>
        </Card.Body>
        <button onClick={handleShow}>제안하기</button>
      </div>
      <div className='youtubeVideo'>
        {playlist && playlist.map((video, idx) => {
          return (
            <div className='playlist_card-container' key={idx}>
              <Card.Body>
                <img src={video.snippet.thumbnails.medium.url} alt="" />
                <Card.Text>{video.snippet.title}</Card.Text>
                <Card.Footer>{video.snippet.description}</Card.Footer>
              </Card.Body>
            </div>
          )
        })}
      </div>
      <Propose show={show} setShow={setShow} userData={userData} supplierId={supplierId} />
    </Container> 
  );
}

export default SupplierDetail;