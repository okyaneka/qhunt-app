const routes = {
  index: "/",
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
    action: (id: string) => `/challenge/${id}/action`,
    result: (id: string) => `/challenge/${id}/result`,
  },
} as const;

export default routes;
