import React from 'react'

const KkbEpay = ({kkb, appendix, order}) => (
  <form action={`https://epay.kkb.kz/jsp/process/logon.jsp`}>
    <input type="hidden" name="Signed_Order_B64" value={window.btoa(kkb)}/>
    <input type="hidden" name="email" value={order.email}/>
    <input type="hidden" name="BackLink" value={window.location.href}/>
    <input type="hidden" name="PostLink" value='http://mimimishki.kz/kkb'/>
    <input type="hidden" name="appendix" value={window.btoa(appendix)}/>
    <button className="btn waves-effect waves-light">Оплатить через Epay</button>
  </form>
)

export default KkbEpay
