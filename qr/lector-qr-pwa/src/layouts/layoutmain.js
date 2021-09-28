import React from 'react';
import Head from 'next/head';
import Header from '../components/header';

export default function LayoutMain(props) {

  function displayTransition() {
    let fill = '', path = '';
    switch (props.typeTransition) {
      case 'success': {
        fill = '#279e3f';
        path = (<path
          d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/>);
      }
        break;
      case 'warning': {
        fill = '#c33';
        path = (<path
          d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/>);
      }
        break;
      case 'error': {
        fill = '#c33';
        path = (<path
          d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/>);
      }
        break;
      default:
        return null;
    }
    return (
      <div className='Alert-transition'>
        <div className='Alert-transition-badge'>
          <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' fill={fill} viewBox='0 0 24 24'>
            <path d='M0 0h24v24H0z' fill='none'/>
            {path}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='x-ua-compatible' content='ie=edge'/>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <title>Control de acceso sanitario - Ministerio de Salud Pública</title>
        <link rel='shortcut icon' type='image/ico' href='/favicons/favicon.ico'/>
        <link rel='icon' type='image/png' href='/favicons/favicon-512.png'/>
        <link rel='icon' type='image/png' sizes='192x192' href='/favicons/favicon-192.png'/>
        <link rel='apple-touch-icon' sizes='180x180' href='/favicons/favicon-180.png'/>
      </Head>
      {displayTransition()}
      {props.hasHeader ? <Header/> : null}
      <div className='u-main u-mt2 u-mb4'>
        <div className='Container'>
          <div className='Grid'>{props.children}</div>
        </div>
      </div>
    </>
  );
}
