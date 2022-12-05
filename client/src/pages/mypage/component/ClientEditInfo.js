import React, { useState } from 'react';
import Swal from 'sweetalert2'
import Avatar from 'react-avatar';

import client from '../../../hooks/axios/client';
import { myBucket, S3_BUCKET } from '../../../config/awsS3';
import { getLocalData } from '../../../config/localStrage';

import { Container, Row, Form, Modal, Button } from 'react-bootstrap';

import '../Client.css';

const ClientEditInfo = ({ userData, show, setShow }) => {
  const [newIntro, setNewIntro] = useState("");
  const [newProfileImgUrl, setNewProfileImgUrl] = useState("");
  const accessToken = getLocalData('accessToken');
  const isClient = getLocalData('isClient');

  const { userId, intro, profileImgUrl } = userData;

  const uploadFile = (e) => {
    const file = e.target.files[0];

    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name
    };
    
    myBucket.upload(params, async (err, data) => {
      if (err) {
        await Swal.fire({
          icon: 'error',
          title: '파일 업로드 실패...',
        })
      }
      
      setNewProfileImgUrl(data.Location);
    });
  }

  const onSubmit = async (e) => {

    try {
      e.preventDefault(); 

      let imgUrl;
      newProfileImgUrl ? imgUrl = newProfileImgUrl : imgUrl = profileImgUrl;
      
      const result = await client.inputInfo(accessToken, isClient, newIntro, imgUrl);
      if (result) {
        await Swal.fire({
          icon: 'success',
          title: '회사 정보 수정 완료',
        });
        window.location.reload();
      } 
    } catch (err) {
      console.log(err.response.data);
      await Swal.fire({
        icon: 'error',
        title: '회사 정보 수정 실패..',
      });
    }
  }

  return (
    <>
      <Modal 
        className="ClientInfo_container"
        as={Container} 
        show={show} 
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{userId}님의 정보수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Row>
              {newProfileImgUrl
                ? <Avatar src={newProfileImgUrl} alt="profile_img" />
                : <Avatar src={profileImgUrl} alt="profile_img" />}
              <Form.Label>회사 로고 업로드</Form.Label>
              <Form.Control type="file" onChange={uploadFile}/>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>회사 소개</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              defaultValue={intro}
              onChange={(e) => setNewIntro(e.target.value)}
              />
          </Form.Group>
          <button className='info_submit'  type="submit">저장하기</button>
        </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ClientEditInfo;