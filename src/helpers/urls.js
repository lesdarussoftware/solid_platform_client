export const BASE_URL = import.meta.env.VITE_APP_API_URL

export const LOGIN_URL = BASE_URL + '/auth/login'
export const REFRESH_URL = BASE_URL + '/auth/refresh'
export const LOGOUT_URL = BASE_URL + '/auth/logout'
export const SITE_URL = `${BASE_URL}/sites`
export const CHIEF_URL = `${BASE_URL}/chiefs`
export const USER_URL = `${BASE_URL}/users`
export const WORKER_URL = `${BASE_URL}/workers`
export const MOVEMENT_URL = `${BASE_URL}/movements`
export const QR_URL = `${BASE_URL}/qrs`