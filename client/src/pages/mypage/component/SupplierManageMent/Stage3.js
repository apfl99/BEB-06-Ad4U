import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Col, Row, Container } from 'react-bootstrap';
import { getLocalData } from '../../../../config/localStrage';
import contract from '../../../../hooks/axios/contract';
import method from '../../../../hooks/web3/sendTransaction';

import '../../Supplier.css';

import {getIsConfirmed, getTransaction} from '../../../../hooks/web3/queryContract';
import {getCurrentAccount} from '../../../../hooks/web3/common';
import Loading from '../../../../component/Loading';

//진행중2
const Stage3 = ({ adList }) => {
  const adId = adList.id;
  const contractAddress = adList.multisigAddress;
  const accessToken = getLocalData('accessToken');
  const isClient = getLocalData('isClient');

  let txIndex = 0;

  const [confirmCheck, setConfirmCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  //confirmCheck : 이미 컨펌된 경우 disable
  async function isConfirmed () {
    const account = await getCurrentAccount(); // 현재 계정 주소 get
    const result = await getIsConfirmed(contractAddress,0,account);
    console.log(result)
    setConfirmCheck(result);
  }

  useEffect(() => {
    isConfirmed();
  },[])

  async function getConfirmCount () {
    var txInfo = await getTransaction(contractAddress,0);
    return txInfo.numConfirmations;
  }

  //Confirm 두개가 됬을 경우, 서버로 결과를 보냄
  const sendResultExecuted = async () => {
    try {
      setIsLoading(true);
      const result = await contract.complete(accessToken, isClient, adId);
      if (result) return alert("성공!");
      setIsLoading(false);
    } catch(err) {
      console.log(err);
      alert("실패");
    }
  }

    //Revoke시 파기
  const sendResultRevoked = async () => {
    try {
      setIsLoading(true);
      const result = await contract.cancel(accessToken, isClient, adId);
      if (result) return alert("성공!");
      setIsLoading(false);
    } catch(err) {
      console.log(err);
      alert("실패");
    }
  }


  // 4. Confirm Transaction
  const handleConfirmTransaction = async () => {
    const confirmCount = await getConfirmCount(); // 내가 confirm하기 전 계약 컨펌 개수
    console.log(confirmCount)
    try {
      setIsLoading(true);
      const tx = await method.confirmTransaction(contractAddress, txIndex);
      console.log(tx)
      if(confirmCount == 1) {
        sendResultExecuted();
      }
      if (tx) {
        setConfirmCheck(true);
        return alert("성공!");
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      alert("실패");
    }
  };

  // 5. Revoke Transaction
  const handleRevokeConfirmation = async () => {
    try {
      setIsLoading(true);
      const tx = await method.revokeConfirmation(contractAddress, txIndex);
      console.log(tx);
      if (tx) {
        sendResultRevoked();
        return alert("성공!");
      }
      setIsLoading(false);
    } catch(err) {
      console.log(err);
      alert("실패");
    }
  };
  

  return (
    <>
    {isLoading 
      ? <Loading /> 
      : <>
          <div>진행중2</div>
          <button onClick={handleConfirmTransaction} disabled={confirmCheck}>4. Confirm Transaction</button>
          <div>파기하시겠습니까?</div>
          <button onClick={handleRevokeConfirmation}>5. Revoke Transaction</button>
        </>
    }
    </>
  );
}

export default Stage3;