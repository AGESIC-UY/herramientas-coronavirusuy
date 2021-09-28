import React from 'react';
import cbor from 'cbor';

export const getPK = () => {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const id = `_gu_${window.navigator.userAgent.replace(/\D+/g, '')}`;
  return new Promise((resolve, reject) => {
    fetch('/api/pk/key', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({}),
      redirect: 'follow',
    })
      .then((response) => {
        if (response.ok) {
          response.text().then((value) => {
            const pk = `${id}${JSON.parse(value).pk}`;
            const buffer = Buffer.from(pk).toString('hex');
            const encode = cbor.encode(buffer).toString('hex');
            localStorage.setItem(id, encode);
            resolve(pk);
          });
        }
      })
      .catch(() => {
        const local = localStorage.getItem(id);
        const localPK = String(Buffer.from(cbor.decode(local), 'hex').toString("utf8")).substring(id.length);
        if (localPK !== '') {
          resolve(localPK);
        } else {
          reject('');
        }
      });
  });
};
