<script setup lang="ts">
import { RouterLink } from "vue-router";
import { routes } from "~/_src/helpers";

const items = [
  { label: "Home", to: routes.home, icon: "ri:home-4-fill" },
  { label: "Quest", to: routes.stage.index, icon: "ri:sword-fill" },
  { label: "Scan", to: routes.scan.index, icon: "ri:qr-code-line" },
  { label: "Message", to: routes.notification, icon: "ri:notification-3-fill" },
  { label: "Profile", to: routes.profile, icon: "ri:user-fill" },
];

const route = useRoute();
const showNav = ref(false);
const { auth } = storeToRefs(useAuthStore());

const isActive = (path: string) => {
  return route.path.indexOf(path) == 0;
};

onMounted(() => {
  setTimeout(() => {
    showNav.value = true;
  });
});
</script>

<template>
  <main class="mobile min-h-screen !bg-fixed bg-cover">
    <div class="w-lg-center pb-28 overflow-x-clip">
      <slot />
    </div>

    <Transition name="fade-up" mode="out-in">
      <div
        v-if="showNav"
        class="w-lg-center fixed h-16 bottom-0 left-1/2 -translate-x-1/2"
      >
        <div
          class="flex justify-between items-center h-full rounded-t-2xl bg-white px-4 shadow-card text-dark"
        >
          <RouterLink
            v-for="(item, i) in items"
            class="inline-block h-full"
            :to="item.to"
          >
            <div
              class="flex flex-col justify-center items-center cursor-pointer select-none transition-all"
              :class="{
                'hexagon bg-dark text-white relative bottom-2 shadow-lg shadow-dark w-[72px] transition-all hover:shadow-xl hover:shadow-dark':
                  i === 2,
                'bg-white hover:bg-dark-50 active:bg-dark-100 h-full w-16':
                  i !== 2,
                'border-t-dark-600 border-t-4 border-x-4 border-x-white hover:border-x-dark-50 active:border-x-dark-100':
                  isActive(item.to),
              }"
            >
              <Icon
                v-if="i !== 4"
                class="block mb-1"
                :name="item.icon"
                :size="i === 2 ? '24' : '20'"
              />
              <CAvatar v-else class="w-9 h-9" :src="auth?.photo?.fileUrl" />
              <div v-if="i !== 4" class="text-sm">{{ item.label }}</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.hexagon::after,
.hexagon::before {
  @apply absolute border-l-[36px] border-r-[36px] border-transparent content-[''] w-0;
}
.hexagon::before {
  @apply border-b-[16px] border-b-dark top-[-16px];
}
.hexagon::after {
  @apply border-t-[16px] border-t-dark bottom-[-16px];
}
</style>
