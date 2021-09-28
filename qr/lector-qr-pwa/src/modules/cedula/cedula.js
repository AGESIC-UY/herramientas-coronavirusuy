export const formatCid = (cidNumber) => {
  if (!isNaN(cidNumber)) {
    cidNumber.split('.').join('').split('-').join('');
    if (cidNumber.length === 7) {
      return [
        cidNumber.substring(0, 3),
        '.',
        cidNumber.substring(3, 6),
        '-',
        cidNumber[6],
      ].join('');
    }
    return [
      cidNumber[0],
      '.',
      cidNumber.substring(1, 4),
      '.',
      cidNumber.substring(4, 7),
      '-',
      cidNumber[7],
    ].join('');
  }
  return null;
};
