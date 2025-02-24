import { routes } from "~/_src/helpers";

const NoAuthMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
  const { token } = useAuthStore();
  if (!token) return navigateTo(routes.home);
});

export default NoAuthMiddleware;
