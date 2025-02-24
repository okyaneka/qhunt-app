const AuthMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
  const { auth } = useAuthStore();
  // if (!auth?.user) return navigateTo(routes.home);
});

export default AuthMiddleware;
