export const API = {
  AUTH_EDIT: "/profile/edit",
  AUTH_GOOGLE_SIGN: "/google-sign",
  AUTH_LOGIN: "/login",
  AUTH_LOGOUT: "/logout",
  AUTH_ME_FULL: "/me-full",
  AUTH_ME: "/me",
  AUTH_PROFILE: "/profile",
  AUTH_PASSWORD: "/profile/password",
  AUTH_PHOTO: "/profile/photo",
  AUTH_REGISTER: "/register",

  MEDIA_UPLOAD: "/admin/media/upload",
  MEDIA_GET: (key: string) => `/admin/media/${key}`,
  MEDIA_DELETE: `/admin/media/delete`,

  ADMIN_STAGE_LIST: "/admin/stage/list",
  ADMIN_STAGE_DETAIL_QR: (id: string) => `/admin/stage/${id}/detail-qr`,

  ADMIN_FEATURE_LIST: "/admin/feature/list",
  ADMIN_FEATURE_CREATE: "/admin/feature/create",
  ADMIN_FEATURE_DETAIL: (id: string) => `/admin/feature/${id}/detail`,
  ADMIN_FEATURE_UPDATE: (id: string) => `/admin/feature/${id}/update`,
  ADMIN_FEATURE_DELETE: (id: string) => `/admin/feature/${id}/delete`,

  FEATURE_LIST: "/feature/list",
  FEATURE_PUBLISHED: (type: string, slug: string) => `/feature/${type}/${slug}`,
} as const;
