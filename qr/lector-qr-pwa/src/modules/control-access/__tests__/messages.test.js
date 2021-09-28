import {getMessage} from '../control-access';

describe('Messages test', () => {
  test('With success type would return success css class', () => {
    const caseType = 'success';
    const {title, css} = getMessage(caseType);

    expect(css).toBe(caseType);
    expect(title).toBe('HABILITADO. Puede acceder al evento.');
  });

  test('With error_key type would return warning css class', () => {
    const caseType = 'error_key';
    const expected = 'warning';
    const {title, css} = getMessage(caseType);

    expect(expected).toBe(css);
    expect(title).toBe('ERROR');
  });

  test('Test css classes types', () => {
    const successType = 'success';
    const dangerType = 'danger';
    const warningType = 'warning';
    const errorType = 'error';
    const errorKeyType = 'error_key';

    const options = [
      {type: successType, className: successType},
      {type: dangerType, className: dangerType},
      {type: errorType, className: warningType},
      {type: errorKeyType, className: warningType},
    ];

    for (let item of options) {
      const {type, className} = item;
      let {css} = getMessage(type);
      expect(className).toBe(css);
    }
  });
});
