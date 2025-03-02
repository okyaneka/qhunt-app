const routes = {
  ABOUT: "/about",
  index: "/",
  register: "/register",
  login: "/login",
  home: "/home",
  profile: "/profile",
  profileEdit: "/profile/edit",
  UPDATE_PASSWORD: "/profile/update-password",
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
} as const;

export default routes;
