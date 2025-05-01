// src/constants/urls.js

const URL = "https://xr.logoflex.co.uk/"; // Aap apna base URL yahan define karein
const BASE_URL = `${URL}api/`; // Aap apna base URL yahan define karein

const URLs = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  FETCH_DATA: `${BASE_URL}/data`,
  GET_PROFILE: `${BASE_URL}/profile`,
  INVOICE: `${BASE_URL}invoices/save`,
  // Add more URLs as needed
};

export default URLs;
