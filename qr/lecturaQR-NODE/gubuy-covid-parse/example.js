const {publicKeyByPath, verifyQRData} = require("./index");

/**
 * Example of the information we obtain after reading the
 * QR code of the digital certificate
 * */
const qrcode = "HC1:NCFOXNYTSFDHJI8Y0PQ8KGXMDVJ S3U 2ZH6.%5I$PSD1K P/X92-LXKC9I951SB2P6+I41A X9SJNQ$AKMG MG1REJED4C9A-KK/FGPLO+IONIHJL+KIM99+V4RIN3:6G6M. K:004EC7EC89C1J5G3B3UJ4HBXLIF%6C-62R6DXGSU10+P:S9ZT56+PTSGMNJ%JCXWDOVDQHJRWDVD1HXSDZ0%00%/TF$2XVG%+TFKB7LJUVI0M6AKA0$9OYMPK9G*H*XCNMNJDUW5K 0WNBPY-6$FJTV79/RUHPN UR%QXKN:BCA$UY*E4GB/EL4 63EH%X1BE6.3E/ZJBDPXFV-4N-K2PM9+JU9LBMWC /MY/C-T9%MUD:G1D55%1KUSR02XT7S+U4GWZJDC-HDNLM.RHZ5.LNXZ5-UL0NJW:2YDJ:3BNAGG8V2$K+3S9:IMXFP VT/JG98U%O.NM+K7T5QD:EX%N:0VVIA+I135EIHTX9OB5BSLCKXLHV801CCPI13OUSRJHJ11P/T6$1Q684W9I%+VS2S4-HN%247F5.0$SU O2T5EBT4PFM656KRLAOPAVJ$LH-$11F1D5OTDMDW5MUAJXT84PY3S %P**K0-VAM67DASRA$H8NBOLXT-9142FTJJ8*VMK57 UEWJ3MH5JB%+224NNBU"

/** This example is with a public key in a string,
 * if you need to load the public key by file, use the following line
 * const pk = publicKeyByPath("./publicKey.pub");
 **/
const pk = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs5BiLpKYxNR6oUiMWLnn
jSbphDmIP2tKoppKR.............................8hp0kH0oR8u2YB8+ze
UJnBmzJt6jcKKjHDZ5PsFp1vaYjUxLKX0Uyvr0ToO39XPM1zrs1kGgqGocHiCW10
zQIDAQAB
-----END PUBLIC KEY-----
`;

const result = verifyQRData(qrcode, pk);

console.log(result);