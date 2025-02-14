import CryptoJS from 'crypto-js';

export const cifrarBase64 = (data: string, key: string): string => {
  const secretKey = key;

  const keySha1 = CryptoJS.SHA1(secretKey)
    .toString(CryptoJS.enc.Hex)
    .slice(0, 32);

  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Hex.parse(keySha1),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Convertir el resultado a string antes de usar btoa
  const encryptedBtoa = btoa(encrypted.toString());

  return encryptedBtoa;
};
