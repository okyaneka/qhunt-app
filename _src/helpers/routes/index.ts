const routes = {
  ABOUT: "/about",
  index: "/",
  register: "/register",
  login: "/login",
  HOME: "/home",
  home: "/home",
  profile: "/profile",
  profileEdit: "/profile/edit",
  UPDATE_PASSWORD: "/profile/update-password",
  EVENTS: "/events",
  TERMS: "/terms-conditions",
  PRIVACY: "/privacy-policy",
  CONTACT: "/contact",
  notifications: "/notifications",
  scan: {
    index: "/scan",
    code: (code: string) => `/scan/${code}`,
  },
  stage: {
    index: "/stage",
    leaderboard: (id: string) => `/stage/${id}/leaderboard`,
    prolog: (id: string) => `/stage/${id}/prolog`,
    challenges: (id: string) => `/stage/${id}/challenges`,
  },
  challenge: {
    prolog: (id: string) => `/challenge/${id}/prolog`,
    trivia: (id: string) => `/challenge/${id}/trivia`,
    photohunt: (id: string) => `/challenge/${id}/photohunt`,
    action: (id: string) => `/challenge/${id}/action`,
    result: (id: string) => `/challenge/${id}/result`,
  },
  admin: {
    feature: {
      list: `/__admin/feature`,
      create: `/__admin/feature/create`,
      edit: (id: string) => `/__admin/feature/${id}/edit`,
    },
  },
  FEATURE: "/features",
  FEATURE_TYPE: (type: string) => `/features/${type}`,
  FEATURE_CONTENT: (type: string, slug: string) => `/features/${type}/${slug}`,
} as const;

export default routes;
