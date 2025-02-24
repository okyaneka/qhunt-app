const NoAuthMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
  const { auth } = useAuthStore();
  // if (auth?.user) return navigateTo(routes.profile, { replace: true });
});

export default NoAuthMiddleware;
