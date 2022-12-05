import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import crypto from 'crypto-js';

import { client } from "../../../config/linkIpfs"

import './Contract.css'

const ContractPrint = ({ contractInfo, previewCheck, setTokenURI, setPreviewCheck }) => {

  useEffect(() => {
    const print = document.getElementById("divToPrint");
    html2canvas(print)
    .then(async (canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      var imgData = canvas.toDataURL('image/png',1);
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("contract_"+Date.now()+".pdf"); 
      const datauri = pdf.output("datauristring"); 

      const secretKey = process.env.REACT_APP_SECRET_KEY;

      const encrypted = crypto.AES.encrypt(datauri, secretKey).toString(); 

      const added = await client.add(encrypted);
      const url = `https://ad4u.infura-ipfs.io/ipfs/${added.path}`; 
      setTokenURI(url);
      setPreviewCheck(true)
    })
  },[previewCheck])

  return (
    <div id="divToPrint" className='printContract'>
      <h3 className='modalH3'>계약서</h3>
      <br></br>
      <span className='modalSpan'>주식회사 광고주(이하 “갑”이라 한다) 및 주식회사 매체사(이하 “을”이라 한다)는 “갑”의 온라인 광고 캠페인을 “을”이 운영하는 온라인 매체(사이트명-매체사, <span className='modalInput'>{contractInfo.mediaUrl}</span>, 이하 “사이트”라 한다)에 진행(이하 “서비스”라 한다)하기 위하여 포괄적인 상호 협력 관계를 맺기로 합의하여 이 계약을 체결한다.</span><br></br>
      <h5 className='modalH5'>제 1조 (계약의 목적)</h5>
      <span className='modalSpan'>본 계약은 “갑”과 “을” 간의 업무 제휴를 체결함에 따른 권리와 의무 및 필요한 제반사항을 규정하는데 그 목적이 있다.</span>
      <h5 className='modalH5'>제 2조 (서비스의 정의)</h5>
      <span className='modalSpan'>“을”이 “갑”에게 제공하는 “서비스”는 계약서 제3조 범위 안에서 이루어진다.</span>
      <h5 className='modalH5'>제3조 (서비스의 범위)</h5>
      <span className='modalSpan'>
      ①   “을”이 수행할 “서비스”의 범위는 다음과 같으며, “을”은 동 “서비스”의 수행시 “서비스”의 구체적인 방안에 관하여 사전에 “갑”의 승인을 받아야 한다.<br></br>
          &emsp;1.    온라인 광고의 게재<br></br>
          &emsp;2.    온라인 광고의 게재 여부 확인 및 운영<br></br>
          &emsp;3.    온라인 프로모션(이벤트, Publicity, 판촉 등 ) 업무<br></br>
          &emsp;4.    온라인 광고활동에 필요한 여론조사 및 자료수집<br></br>
          &emsp;5.    기타 집행결과보고서 등 매체 관련 업무<br></br>
          &emsp;6.    기타 본 계약의 목적을 달성하기 위한 제반 업무<br></br><br></br>
      ②   본 계약에서 온라인 광고란 “온라인 환경 상에서 광고 집행을 위해 진행되는 모든 부분” 을 말한다.<br></br>
      </span>
      <h5 className='modalH5'>제4조 (계약 일반)</h5>
      <span className='modalSpan'>
      ①   계약기간<br></br>
      &ensp;본 계약의 유효 기간은 <span className='modalInput'>{contractInfo.date1}부터  {contractInfo.date2}까지</span>로 한다. 단, 계약기간 만료 일(1)개월 전까지 당사자 일방이 상대방에 대하여 서면으로 갱신거절의 의사를 통지하거나 계약내용의 변경을 요청하지 아니하면, 본 계약은 계약만료 익일부터 일(1)년씩 동일 조건으로 자동연장된다.<br></br>
      ②   “갑”의 독점적 지위<br></br>
      &ensp;“갑”의 독점적 지위는 광고진행세부내역에 의한다.<br></br>
      ③   업무의 내용<br></br>
      &ensp;업무의 구체적인 내용은 본 계약외 별도의 문서(이하 “광고게재신청서”라 한다)를 통해서 확정하며 업무의 내용이 변경되는 경우에도 “광고게재신청서”를 수정하여 변경ㆍ확정한다.
      </span>
      <h5 className='modalH5'>제5조 (거래절차)</h5>
      <span className='modalSpan'>
      ①   광고 게재의 신청 : “갑”은 직접 또는 대행하여 “을”에게 광고 게재를 신청할 수 있으며, “을”은 게재신청에 대한 절차 및 방법을 미리 정하여 이를 고지하여 한다.<br></br>
      ②   광고게재신청서의 내용 : “갑”은 인터넷광고의 게재를 신청할 때에는 광고하고자 하는 광고의 규격과 양, 금액, 광고기간(시작일 및 종료일), 광고유형 등을 정확히 기재한 광고게재신청서를 “을”에게 제출하여야 한다.<br></br>
      ③   광고의 게재 및 변경 : 인터넷 광고의 게재 신청을 접수한 “을”은 일정 기간 내에 광고게재여부를 “갑”에게 통지하여야 한다. 단, 신청내용의 변경이 있는 경우에는 이를 적절한 방법으로 상대방에게 통지하여야 한다.<br></br>
      ④   광고소재의 전달 : 인터넷광고를 게재하기로 결정되면 “갑”은 “을”이 광고 소재에 대한 게재 가능 여부의 확인 및 자율심의를 할 수 있는 충분한 기간을 고려하여 광고소재를 광고시작전에 전달하여야 한다. 단, 영업일 기준으로 광고시작 24시간 이전에 전달하지 못한 경우에는 “을”은 광고게재 시작일을 보장하지 아니한다.<br></br>
      </span>
      <h5 className='modalH5'>제6조 (광고비의 청구 및 지급)</h5>
      <span className='modalSpan'>
      ①   “을”의 광고비 청구는 광고를 집행한 기준으로 한다.<br></br>
      ②   “갑”은 “을”의 청구에 다음 각 호의 지급방식 중 “을”과 사전에 협의된 방식으로 지급한다.<br></br>
      &emsp;1.    광고의 집행 전에 현금성 결제수단으로 광고비를 지급하는 선금지급방식<br></br>
      &emsp;2.    세금계산서 발행일로부터 14일 이내에 현금성 결제수단으로 광고비를 지급하는 현금지급방식<br></br>
      &emsp;3.    세금계산서 발행일로부터 15일에서 3개월 이내에 현금성 결제수단으로 광고비를 지급하는 신용지급방식<br></br>
      &emsp;4.    세금계산서 발행일로부터 4개월 이내에 현금화가 가능한 어음으로 광고비를  지급하는 어음지급방식<br></br>
      ③   지급액 : <span className='modalInput'>{contractInfo.value} ETH</span><br></br>
      </span>
      <h5 className='modalH5'>제7조 (양자의 의무)</h5>
      <span className='modalSpan'>“갑”과 “을”은 본 계약서의 의무를 이행하는 과정에서 제3자의 권리나 명예를 침해하지 않도록 최선을 노력을 한다.</span>
      <h5 className='modalH5'>제8조 (게재의 제한)</h5>
      <span className='modalSpan'>
      &ensp;“갑”의 온라인 광고 내용이 아래 각호의 1에 해당하는 경우 “을”은 동 광고의 게재를 거부하거나 기 게재되고 있는 광고의 집행을 중단할 수 있으며, “을”이 광고내용을 수정하거나 제3자와의 분쟁을 해결할 것을 “갑”에게 요구하였음에도 불구하고 “갑”이 이에 응하지 않을 경우 “을”은 계약을 해지할 수 있다.<br></br>
      &emsp;1.    “을”이 별도로 규정한 광고 및 홍보정책에 반하는 경우<br></br>
      &emsp;2.    “갑”의 광고내용이 관련 법령을 위반하여 “갑” 또는 “을”이 행정기관 기타 정부기관으로부터 경고, 고발 등의 조치를 당하는 경우<br></br>
      &emsp;3.    “갑”의 광고내용이 제3자의 권리를 침해하여 “갑” 또는 “을”과 제3자 사이에 분쟁이 발생하는 경우<br></br>
      </span>
      <h5 className='modalH5'>제9조 (계약의 양도)</h5>
      <span className='modalSpan'>을”은 “갑”의 서면승인 없이 본 계약의 권리 및 의무의 일부 또는 전부를 제3자에게 양도ㆍ이전하거나 담보물로 제공할 수 없다.</span>
      <h5 className='modalH5'>제10조 (결과보고 및 이의제기)</h5>
      <span className='modalSpan'>
      ①   “을”은 “갑”의 온라인광고에 대한 결과보고서를 “갑”에게 제공하고, 광고집행 결과보고서는 광고집행 완료 후 즉시 제공한다.<br></br>
      ②   “갑”은 본 계약에 의해 집행된 광고의 결과에 대하여 본 계약의 유효기간이 초과하는 경우 이에 대한 이의를 제기할 수 없다.<br></br>
      ③   “을”은 “갑”의 광고 집행 내역에 대한 로그자료를 해당 광고집행 완료일로부터 영구적으로 보관한다.<br></br>
      </span>
      <h5 className='modalH5'>제11조 (계약의 해지)</h5>
      <span className='modalSpan'>
      ①   계약 상대방(이하 “귀책당사자”라 한다)에게 다음 각호에 해당하는 사유가 발생할 경우 “갑” 또는 “을”(이하 “해지권자라 한다)은 “귀책당사자”에게 그 사유를 통지하고 본 계약을 해지할 수 있으며, 이의 효력은 서면 통지 즉시 발생하는 것으로 한다.<br></br>
      &emsp;1.    “귀책당사자”가 본 계약을 위반하여 “해지권자”가 10일 이상의 기간을 정하여 이행을 최고하여도 이를 시정하지 않는 경우<br></br>
      &emsp;2.    “귀책당사자”에게 발행 수표, 어음 등의 지급거절 또는 부도가 발생한 경우나 파산, 회사정리, 화의, 워크아웃 기타 이와 유사한 절차의 신청이 있는 경우<br></br>
      &emsp;3.    “해지권자”의 사전 서면 승인없이 “귀책당사자”가 본 계약상의 권리, 의무 등을 제3자에게 양도하였을 경우<br></br>
      ②   본 계약상 목적을 달성하는 것이 현저히 불가능하여 본 계약의 해지를 양당사자가 서면으로 동의할 경우, 본 계약은 해지된다.<br></br>
      </span>
      <h5 className='modalH5'>제12조 (자료제공 및 기밀 유지)</h5>
      <span className='modalSpan'>
      ①   “갑” 또는 “을”은 본 계약기간 중 본 계약의 체결 또는 이행과 관련하여 알게된 상대방의 영업비밀, 기술정보, 자료(이하 “비밀등”이라 한다)를 본 계약의 이행을 위해서만 사용하여야 하고, 계약기간 종료와 동시에 상대방에게 모든 “비밀등”을 반환하여야 한다.<br></br>
      ②   “갑” 또는 “을”은 본 계약기간은 물론 종료 후에도 상대방이 제공한 “비밀등”을 상대방의 사전 서면 승낙없이 제3자에게 누설ㆍ공개하여서는 아니되며 , 외부유출로 야기되는 민형사상 일체의 책임은 유출한 측이 진다.<br></br>
      ③   “갑” 또는 “을”은 그 임직원, 관련자로 하여금 위 각항과 동일한 의무를 부담하도록 하여야 한다.<br></br>
      </span>
      <h5 className='modalH5'>제13조 (지적재산권)</h5>
      <span className='modalSpan'>본 계약 업무 수행을 위하여 상대방에게 제공되는 광고물, 솔루션 등의 소유권, 저작권 등의 권리는 제공한 각 당사자에게 귀속된다.</span>
      <h5 className='modalH5'>제14조 (신의성실의 의무)</h5>
      <span className='modalSpan'>“갑”또는 “을”은 본 계약의 목적 달성을 위해 신의성실의 원칙에 따라서 상호관련 업무에 협력한다.</span>
      <h5 className='modalH5'>제15조 (손해 배상)</h5>
      <span className='modalSpan'>본 계약이 해지되거나 당사자 일방이 본 계약을 위반하는 경우, 귀책사유 있는 당사자는 이로 인하여 상대방에게 발생하는 모든 손해를 배상하여야 한다.</span>
      <h5 className='modalH5'>제16조 (불가항력)</h5>
      <span className='modalSpan'>천재지변, 전쟁, 내란, 폭동, 법령의 개폐 또는 사회통념상 이에 준하는 당사자 일방이 책임질 수 없는 사유(노사분규 제외)로 인하여 그 일방이 본 계약상의 의무를 이행하지 못하는 경우에는 그 책임을 면한다</span>
      <h5 className='modalH5'>제17조 (소송의 합의 관할)</h5>
      <span className='modalSpan'>본 계약이해에 있어 “갑”, “을”간에 분쟁이 발생할 경우에는 “갑”의 주사무소 소재지 관할법원을 전속적 합의 관할 법원으로 하여 일체의 분쟁을 해결한다.</span>
      <h5 className='modalH5'>제18조 (효력 및 해석)</h5>
      <span className='modalSpan'>본 계약의 효력은 계약일로부터 발효하고, 계약서에 정한 사항 이외의 것에 대해서는 일반적인 상관습에 준한다.</span>
      <h5 className='modalH5'>제19조 (계약서의 보완)</h5>
      <span className='modalSpan'>본 계약서의 세부적인 이행사항에 관하여 내용 보완이 필요한 경우 “갑”,“을”은 상호 협의하여 결정한다.</span>
      <h5 className='modalH5'>제20조 (기타 사항)</h5>
      {contractInfo.content.length > 0 ?         
      <span className='modalSpan'>{contractInfo.content}</span> : <span className='modalSpan'>없음</span>}
      <br></br>
      <br></br>
      <span className='modalSpan'>본 계약의 체결을 증명하기 위하여 본 계약서를 이더리움에 보관한다.</span>
      <br></br>
      <br></br>
      <table className='signTable'>
        <tbody>
        <tr>
            <td className='signLeft'>
            <span className='modalSpan'>"갑"</span><br></br>
            <span className='modalSpan'>광고주</span><br></br>
            <span className='modalInput'>주소 : {contractInfo.clientAddr}</span><br></br>
            </td>
            <td className='signRight'>
            <span className='modalSpan'>"을"</span><br></br>
            <span className='modalSpan'>크리에이터</span><br></br>
            <span className='modalInput'>주소 : {contractInfo.supplierAddr}</span><br></br>
            </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ContractPrint;
