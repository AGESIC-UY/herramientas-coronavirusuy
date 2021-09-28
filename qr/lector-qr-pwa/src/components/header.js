import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="Header">
      <div className="Header-top">
        <div className="Container">
          <div className="Header-logo">
            <a href="https://www.gub.uy/ministerio-salud-publica/home">
              <span className="Logo">
                <Image
                  className="Logo-image"
                  src="/escudo.svg"
                  alt="Ministerio de Salud Pública"
                  height={98}
                  width={100}
                />
                <span className="Logo-text">
                  <h1 className="Logo-title">
                    <span className="Logo-role">Ministerio</span>
                    <span>de Salud</span>
                    <span>Pública</span>
                  </h1>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
