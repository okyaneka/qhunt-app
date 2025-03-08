<script setup lang="ts">
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";

import LOGO from "~/_src/assets/images/logo-grey-trimmed.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Scrollbar } from "swiper/modules";
import { RouterLink } from "vue-router";
import type { SliderItem } from "~/_src/helpers";
import type { Swiper as SwiperInstance } from "swiper/types";

type Props = {
  items: SliderItem[];
  height: number;
  interval: number;
  navigation: boolean;
  pauseOnHover: boolean;
  arrow: boolean;
};

useAttrs();

const {
  arrow,
  interval = 3e3,
  height = 320,
  items,
  pauseOnHover,
  navigation,
} = defineProps<Partial<Props>>();
const slots = useSlots();

const swiper = ref<SwiperInstance>();

const slideContentHeight = ref(0);

const slotItems = computed(() =>
  (Object.keys(slots) || []).filter((key) => key.startsWith("item-"))
);

const itemsLength = computed(
  () => slotItems.value.length || items?.length || 0
);

const visibleItems = computed<number[]>(() => {
  if (import.meta.server) return [0, 0, 0];
  return Array.from({ length: itemsLength.value }, (_, i) => i);
});

const onPlay = (evt?: TouchEvent | MouseEvent) => {
  onPause(evt);
  swiper.value?.autoplay.start();
};

const onPause = (evt?: TouchEvent | MouseEvent) => {
  swiper.value?.autoplay.pause();
};

const onSetPos = (pos: number) => {
  swiper.value?.slideTo(pos);
};

const onNext = () => {
  swiper.value?.slideNext() || onSetPos(0);
};

const onPrev = () => {
  swiper.value?.slidePrev() || onSetPos(itemsLength.value - 1);
};

const onSwiper = (instance: SwiperInstance) => {
  swiper.value = instance;
};

watch(
  () => swiper?.value?.activeIndex,
  async (value) => {
    if (import.meta.client && value !== undefined) {
      await nextTick();
      const el = document.querySelectorAll(".slide-content");
      const activeEl = el[value];

      if (activeEl) slideContentHeight.value = activeEl.clientHeight;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="slider"
    @mouseenter="pauseOnHover ? onPause($event) : ''"
    @mouseleave="pauseOnHover ? onPlay($event) : ''"
    @touchstart.stop="onPause"
    @touchend="onPlay"
  >
    <Swiper
      ref="swiperRef"
      class="slide-container"
      :modules="[Autoplay, Scrollbar]"
      :autoplay="{ delay: interval }"
      @swiper="onSwiper"
    >
      <template v-for="item in visibleItems" :key="item">
        <SwiperSlide
          class="slide-item bg-gray-100"
          :class="{
            '!bg-contain': items && items[item] && !items[item].image,
          }"
          :style="{
            height: `${height}px`,
            backgroundImage:
              slotItems.length || !items?.length || !items[item]
                ? 'unset'
                : `url(${(items && items[item] && items[item].image) || LOGO})`,
          }"
        >
          <slot v-if="slotItems.length" :name="`item-${item + 1}`" />
          <component
            v-else-if="items && items[item]"
            :is="items[item].to ? RouterLink : 'div'"
            class="slide-content"
            :to="items[item].to"
          >
            <h2>{{ items[item].title }}</h2>
            <p>{{ items[item].subtitle }}</p>
          </component>
        </SwiperSlide>
      </template>
    </Swiper>

    <div v-if="navigation" class="slide-nav">
      <div
        v-for="item in visibleItems"
        :key="item"
        class="slide-nav-item"
        :class="{ active: item === swiper?.activeIndex }"
        @click="onSetPos(item)"
      ></div>
    </div>

    <div
      v-if="arrow && slideContentHeight"
      class="slide-nav-arrow"
      :style="{ bottom: `${slideContentHeight}px` }"
    >
      <div class="slide-nav-prev">
        <CButton size="sm" variant="light" color="white" icon @click="onPrev">
          <Icon name="ri:arrow-left-line" />
        </CButton>
      </div>
      <div class="slide-nav-next">
        <CButton size="sm" variant="light" color="white" icon @click="onNext">
          <Icon name="ri:arrow-right-line" />
        </CButton>
      </div>
    </div>
  </div>
</template>

<style>
@tailwind components;

@layer components {
  .slider {
    @apply relative overflow-hidden;
  }
  .slide-container {
    @apply snap-x snap-mandatory flex flex-nowrap gap-4 overflow-auto;
    scrollbar-width: none;
  }
  .slide-item {
    @apply snap-start snap-always flex flex-col flex-none w-full bg-cover bg-center select-none overflow-hidden bg-no-repeat;
  }
  .slide-content {
    @apply p-3 block bg-dark bg-opacity-50 text-white mt-auto;
  }
  .slide-nav {
    @apply absolute bottom-2 right-2 max-w-80 flex gap-1 cursor-pointer z-10;
  }
  .slide-nav-item {
    @apply rounded-full bg-white bg-opacity-50 w-4 h-4 transition hover:bg-opacity-75;
  }
  .slide-nav-item.active {
    @apply bg-opacity-100;
  }
  .slide-nav-arrow {
    @apply absolute w-full left-0 transition-all duration-300 z-10;
  }
  .slide-nav-prev,
  .slide-nav-next {
    @apply absolute bottom-2;
  }
  .slide-nav-prev {
    @apply left-2;
  }
  .slide-nav-next {
    @apply right-2;
  }
}
</style>
