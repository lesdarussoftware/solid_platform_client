export const BASE_URL = import.meta.env.VITE_APP_API_URL

export const LOGIN_URL = BASE_URL + '/auth/login'
export const REFRESH_URL = BASE_URL + '/auth/refresh'
export const LOGOUT_URL = BASE_URL + '/auth/logout'
export const SITE_URL = `${BASE_URL}/sites`
export const USER_URL = `${BASE_URL}/users`
export const WORKER_URL = `${BASE_URL}/workers`
export const MOVEMENT_URL = `${BASE_URL}/movements`
export const QR_URL = `${BASE_URL}/qrs`
export const CATEGORY_URL = `${BASE_URL}/categories`
export const CATEGORY_RATE_URL = `${BASE_URL}/category-rates`
export const REPORT_URL = `${BASE_URL}/reports`
export const ACTIVITY_URL = `${BASE_URL}/activities`
export const FORTNIGHT_URL = `${BASE_URL}/fortnights`
export const RULE_URL = `${BASE_URL}/rules`
export const TRASH_URL = `${BASE_URL}/trash`