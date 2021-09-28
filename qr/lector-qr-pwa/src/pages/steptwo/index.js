import React, { useState, useEffect } from 'react';
import Spinner from '../../components/spinner';
import QrScanner from 'qr-scanner';
import Disclaimer from '../../components/disclaimer';
import LayoutMain from '../../layouts/layoutmain';
import { verifyQRData } from '../../modules/gubuy-covid-parse/browser';
import { getPK } from '../../modules/control-access';
import { formatCid } from '../../modules/cedula';

export default function StepTwoIndex() {
  const [state, setState] = useState({
    showSpinner: false,
    typeTransition: ''
  });

  const [dataQR, setDataQR] = useState([]);
  const [publicKey, setPublicKey] = useState('');
  const [isVerified, setVerified] = useState('');
  const [isValid, setValid] = useState(false);

  const initialValues = () => {
    setPublicKey('');
    setDataQR([]);
  };

  const getVerify = async data => {
    try {
      const result = await verifyQRData(data, `${publicKey}`);
      setVerified(true);
      setDataQR(result.data);
      setValid(result.valid);
      if (result.valid === true) {
        setState({ typeTransition: 'success' });
      } else {
        setState({ typeTransition: 'error' });
      }
    } catch (err) {
      setDataQR('Invalid');
      setVerified(true);
      setState({ typeTransition: 'error' });
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const setupPK = async () => {
      try {
        const pk = await getPK();
        setPublicKey(pk);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }
    };

    if (publicKey) {
      QrScanner.hasCamera().then(hasCamera => {
        if (hasCamera) {
          const qrscanner = new QrScanner(
            document.getElementById('QR-escaner'),
            result => {
              initialValues();
              qrscanner.stop();
              getVerify(result);
              setTimeout(() => qrscanner.start(), 3000);
            }
          );
          qrscanner.start();
        }
      });
    } else {
      setupPK();
    }
  }, [publicKey, isVerified]);

  const changeDateFormatTo = DosisDate => {
    const [yy, mm, dd] = DosisDate.split(/-/g);
    return `${dd}/${mm}/${yy}`;
  };

  const successMessage = () => {
    const dosesLength = dataQR.VaccinationInfo?.Doses.length;

    dataQR.VaccinationInfo?.Doses.sort(function (a, b) {
      if (a.Date > b.Date) {
        return 1;
      }
      if (a.Date < b.Date) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    const dosis = dataQR.VaccinationInfo?.Doses.map((VaccineDosis, i) => {
      if (dosesLength === i + 1) {
        // Marca en negrita la última vacunación
        return (
          <li key={VaccineDosis.Date} className="u-mt1 u-textLarge">
            {' '}
            <strong>
              {changeDateFormatTo(VaccineDosis.Date)} {VaccineDosis.Vaccine}
            </strong>
          </li>
        );
      } else {
        // Devuelve la lista sin negrita
        return (
          <li key={VaccineDosis.Date} className="u-mt1">
            {changeDateFormatTo(VaccineDosis.Date)} {VaccineDosis.Vaccine}
          </li>
        );
      }
    });

    return dataQR.VaccinationInfo?.Doses.length > 0 ? (
      <div className="Alert Alert--success u-py3 u-pr2 u-mb">
        <h4 className="Alert-title">
          <strong>Vacunación - C.I. {formatCid(dataQR.DocumentNumber)}</strong>
        </h4>
        <p>Dosis administradas:</p>
        <ul className="u-bullet u-mb2">{dosis}</ul>
      </div>
    ) : (
      ''
    );
  };

  function errorMessage() {
    return (
      <div className="Alert Alert--danger u-my3">
        <h4 className="Alert-title">Código inválido.</h4>
        <p>La firma digital no es correcta.</p>
      </div>
    );
  }

  function showMessage() {
    return (
      <>
        {isVerified ? (
          <div>{isValid ? successMessage() : errorMessage()}</div>
        ) : (
          ''
        )}
      </>
    );
  }

  return (
    <LayoutMain typeTransition={state.typeTransition}>
      <div className="Grid-item Grid-item--center u-md-size3of5">
        <div className="Page u-mb0">
          <h2 className="Page-title u-h6">Control de acceso sanitario</h2>
          {state.showSpinner ? <Spinner /> : null}
          {showMessage()}
          <video id="QR-escaner" className="u-border u-bgGray" />
          <Disclaimer />
        </div>
      </div>
    </LayoutMain>
  );
}
