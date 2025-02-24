import { routes } from "~/_src/helpers";

const NoAuthMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
  const { token } = useAuthStore();
  console.log(token);
  if (token) return navigateTo(routes.profile, { replace: true });
});

export default NoAuthMiddleware;
