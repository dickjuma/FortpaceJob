// src/templates/helpers/sharedVariables.js
module.exports = function (payload) {
  // Example shared variables – can be expanded later.
  return {
    companyName: process.env.COMPANY_NAME || 'FortSpace',
    logoUrl: process.env.LOGO_URL || 'https://example.com/logo.png',
    year: new Date().getFullYear(),
    userId: payload.userId,
    // Add more platform‑wide data here.
  };
};
