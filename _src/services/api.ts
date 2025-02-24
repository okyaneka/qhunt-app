const api = {
  auth: {
    me: "/me",
    register: "/register",
    profile: "/profile",
    edit: "profile/edit",
  },
} as const;

export default api;
