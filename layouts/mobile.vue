<script setup lang="ts">
import { RouterLink } from "vue-router";
import { routes } from "~/_src/helpers";

const items = [
  { label: "Home", to: routes.home, icon: "ri:home-fill" },
  { label: "Quest", to: routes.stage.index, icon: "ri:sword-fill" },
  { label: "Scan", to: routes.scan.index, icon: "ri:qr-code-line" },
  { label: "Message", to: routes.notification, icon: "ri:notification-3-fill" },
  { label: "Profile", to: routes.profile, icon: "ri:user-fill" },
];

const route = useRoute();
const showNav = ref(false);

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
    <div class="max-w-lg mx-auto mb-20 overflow-x-clip">
      <slot />
    </div>

    <Transition name="fade-up" mode="out-in">
      <div
        v-if="showNav"
        class="fixed w-full max-w-lg h-16 bottom-0 left-1/2 -translate-x-1/2"
      >
        <div
          class="flex justify-between items-center h-full rounded-t-2xl bg-white px-4 shadow shadow-dark"
        >
          <RouterLink
            v-for="(item, i) in items"
            class="inline-block h-full"
            :to="item.to"
          >
            <div
              class="flex flex-col justify-center items-center cursor-pointer select-none transition-all"
              :class="{
                'bg-dark hover:bg-dark-600 active:bg-dark-700 text-white relative bottom-2 hexagon shadow-lg shadow-dark w-[72px]':
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
              <div
                v-else
                class="w-9 h-9 flex items-center justify-center rounded-full bg-dark text-white overflow-hidden"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSA7_2hdizY8I5MyhNVjyMD0nBl2SS9oUl0g&s"
                />
              </div>
              <div v-if="i !== 4" class="text-sm">{{ item.label }}</div>
            </div>
          </RouterLink>
          <!-- <CButton  icon variant="flat" size="lg">
            <Icon name="ri:home-fill" />
          </CButton>
          <CButton v-for="i in 2" icon variant="flat" size="lg">
            <Icon name="ri:home-fill" />
          </CButton> -->
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.hexagon {
  @apply before:transition-all after:transition-all hover:before:border-b-dark-600 active:before:border-b-dark-700 hover:after:border-t-dark-600 active:after:border-t-dark-700 before:content-[''] before:absolute before:w-0 before:border-l-[36px] before:border-r-[36px] before:border-b-[16px] before:border-b-dark before:border-transparent before:top-[-16px] after:content-[''] after:absolute after:w-0 after:border-l-[36px] after:border-r-[36px] after:border-t-[16px] after:border-t-dark after:border-transparent after:bottom-[-16px];
}
</style>
