import React from 'react';
import Image from 'next/image';

export default function Disclaimer() {
  return (
    <ul className="List List--media u-mt6">
      <li className="Media">
        <div className="Media-image">
          <Image
            src="/logoMSP.png"
            alt="Ministerio de Salud Pública"
            height={74}
            width={187}
          />
        </div>
        <div className="Media-body">
          <p>
            Esta información corresponde a registros del Ministerio de Salud
            Pública.
          </p>
        </div>
      </li>
    </ul>
  );
}
