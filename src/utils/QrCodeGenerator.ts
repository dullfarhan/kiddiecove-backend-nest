import QRCode from 'qrcode';
import Debug from 'debug';

const options = {
  width: 800,
  height: 600,
  margin: 1,
};

const generateQR = async (text) => {
  const utiltiyDebugger = Debug('app:utility:qr-code-generator');
  try {
    return await QRCode.toDataURL(text, options);
  } catch (err) {
    utiltiyDebugger(err);
  }
};

export default generateQR;
