export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //signup(POST)
    LOGIN: "/api/auth/login", //signin(POST)
    GET_PROFILE: "/api/auth/me", //get logged in user profile(GET)
    UPDATE_PROFILE: "/api/auth/me", //update logged in user profile (PUT)
  },
  INVOICE: {
    CREATE: "/api/invoices", //create new invoice(POST)
    GET_ALL: "/api/invoices", //get all invoices(GET)
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`, //get invoice by id(GET)
    UPDATE_INVOICE: (id) => `/api/invoices/${id}`, //update invoice by id(PUT)
    DELETE_INVOICE: (id) => `/api/invoices/${id}`, //delete invoice by id(DELETE),
  },
  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text", //parse invoice text using ai(POST)
    GENERATE_REMINDER: "/api/ai/generate-reminder", //generate reminder email using ai(POST)
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary", //generate dashboard summary using ai(GET)
  },
};
