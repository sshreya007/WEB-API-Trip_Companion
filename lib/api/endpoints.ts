//List of api routes
//Single source of truth for api endpoints

// export const API={
//     AUTH:{
//         LOGIN: 'api/auth/login',
//         REGISTER:'api/auth/register',
//     }

// }

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: (id: string) => `/profile/${id}`,
  },
};
