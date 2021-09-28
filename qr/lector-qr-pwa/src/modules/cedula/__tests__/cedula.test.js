import { formatCid } from '../cedula';

describe('Test cid format', () => {
  test('12345678 would be 1.234.567-8', () => {
    expect(formatCid('12345678')).toBe('1.234.567-8');
  });

  test('It cid 1234567 has 7 chars would 123456-7', () => {
    expect(formatCid('1234567')).toBe('123.456-7');
  });

  test('It cid is no a number would be null', () => {
    expect(formatCid('sd3d3sds')).toBe(null);
  });
});
