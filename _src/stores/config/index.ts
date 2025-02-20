const useConfigStore = defineStore("config-store", () => {
  const camera = useCookie("CAMERA_ID");

  return { camera };
});

export default useConfigStore;
