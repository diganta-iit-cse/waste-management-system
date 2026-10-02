const QRCode = require('qrcode');

const generateQRCode = async (payload) => {
  try {
    const stringData = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(stringData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
      width: 250,
    });
    return dataUrl;
  } catch (err) {
    console.error('QR code generation error:', err);
    // Return a base64 encoded SVG fallback if QR code fails
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#111827">CINEBOOK TICKET</text><text x="100" y="125" font-family="monospace" font-size="12" text-anchor="middle" fill="#e11d48">${typeof payload === 'object' && payload.bookingId ? payload.bookingId : 'VERIFIED'}</text></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(fallbackSvg).toString('base64')}`;
  }
};

module.exports = { generateQRCode };
