import React from 'react';
import { Link } from 'react-router';

export const Addresses = ({ addresses, onRemove }) => {
  return (
    <div>
      <h5>Ваши адреса</h5>
      <ul className="collection">
        { addresses.map(address=> {
          return <li className="collection-item row" key={address._id}>
            <div className="col s10">
              <span className="title">{ address.name }</span>
              <p>{ address.address }</p>
            </div>
            <div className="col s2">
              <button className="btn-floating right waves-effect waves-light red" onClick={()=>{ onRemove(address._id) }}>
                <i className="material-icons">remove</i>
              </button>
            </div>
          </li>
        }) }
      </ul>
      <div className="fixed-action-btn add-address-wrap">
        <Link to="/profile/address" className="btn-floating btn-large waves-effect waves-light red">
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div>
  );
}
