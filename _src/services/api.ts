const api = {
  auth: {
    me: "/me",
    register: "/register",
    profile: "/profile",
    edit: "/profile/edit",
    photo: "/profile/photo",
  },
} as const;

export default api;
