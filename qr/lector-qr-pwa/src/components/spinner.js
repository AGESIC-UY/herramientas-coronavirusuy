import React from 'react';

export default function Spinner(props) {
  return (
    <div className="u-md-size4of5 u-lg-size3of5 u-mxAuto u-my3">
      <span className="u-left">
        <div className="Spinner Spinner--small"></div>
      </span>
      <span className="u-pl1">Procesando código QR...</span>
    </div>
  );
}
