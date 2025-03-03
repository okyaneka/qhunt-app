<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { SliderItem } from "~/_src/helpers";

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

const sliderRef = ref<HTMLElement>();
const slideContentRef =
  ref<(HTMLElement | InstanceType<typeof RouterLink>)[]>();
const isTouched = ref(false);
const isPause = ref(false);
const quickActiveIndex = ref(0);
const activeIndex = ref(0);
const slideInterval = ref<NodeJS.Timeout>();
const slideTimeout = ref<NodeJS.Timeout>();
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

const center = computed(() => Math.floor(visibleItems.value.length / 2));

const sortedVisibleItems = computed(() => {
  const rest = [...visibleItems.value];
  const index = (activeIndex.value + 1 + center.value) % itemsLength.value;
  const spliced = rest.splice(index);
  return [...spliced, ...rest];
});

const scrollWidth = computed(() => {
  const slider = sliderRef.value;
  if (!slider) return 0;
  const { gap } = getComputedStyle(slider);

  return slider.clientWidth + parseInt(gap);
});

const defaultPos = computed(() => {
  return scrollWidth.value * center.value;
});

const onPlay = (evt?: TouchEvent | MouseEvent) => {
  if (evt?.type === "touchend") isTouched.value = false;
  onPause(evt);
  isPause.value = false;
  slideInterval.value = setInterval(() => {
    onNext();
  }, interval);
};

const onPause = (evt?: TouchEvent | MouseEvent) => {
  if (evt?.type === "touchstart") isTouched.value = true;
  isPause.value = true;
  clearInterval(slideInterval.value);
};

const onSetPos = (pos: number) => {
  if (sliderRef.value) {
    quickActiveIndex.value = pos;
    const index = sortedVisibleItems.value.indexOf(pos) - center.value;
    sliderRef.value.scrollTo({
      left: defaultPos.value + index * scrollWidth.value,
      behavior: "smooth",
    });
  }
};

const onNext = () => {
  if (sliderRef.value) {
    quickActiveIndex.value = (activeIndex.value + 1) % itemsLength.value;
    sliderRef.value.scrollTo({
      left: defaultPos.value + scrollWidth.value,
      behavior: "smooth",
    });
  }
};

const onPrev = () => {
  if (sliderRef.value) {
    quickActiveIndex.value =
      (activeIndex.value - 1 + itemsLength.value) % itemsLength.value;
    sliderRef.value.scrollTo({
      left: defaultPos.value - scrollWidth.value,
      behavior: "smooth",
    });
  }
};

const sliderOnScroll = (event: Event) => {
  if (isTouched.value) return;
  clearTimeout(slideTimeout.value);
  slideTimeout.value = setTimeout(() => {
    const slider = sliderRef.value;
    if (!slider) return;
    if (slider.scrollLeft == defaultPos.value) return;
    const adder = (slider.scrollLeft - defaultPos.value) / scrollWidth.value;

    activeIndex.value =
      (activeIndex.value + adder + itemsLength.value) % itemsLength.value;
    quickActiveIndex.value = activeIndex.value;
  }, 3e2);
};

const init = async () => {
  const slider = sliderRef.value;
  if (slider) {
    slider.scrollTo({ left: defaultPos.value });
    slider.addEventListener("scroll", sliderOnScroll);
  }
  onPlay();
};

const uninit = () => {
  sliderRef.value?.removeEventListener("scroll", sliderOnScroll);
  clearTimeout(slideTimeout.value);
  clearInterval(slideInterval.value);
};

watch(
  quickActiveIndex,
  async (index) => {
    if (import.meta.client) {
      await nextTick();
      const el = document.querySelectorAll(".slide-content");
      const activeEl = el[center.value + 1];
      if (activeEl) slideContentHeight.value = activeEl.clientHeight;
    }
  },
  { immediate: true }
);

onMounted(() => init());

onUnmounted(() => uninit());
</script>

<template>
  <div
    class="slider"
    @mouseenter="pauseOnHover ? onPause($event) : ''"
    @mouseleave="pauseOnHover ? onPlay($event) : ''"
    @touchstart.stop="onPause"
    @touchend="onPlay"
  >
    <div ref="sliderRef" class="slide-container">
      <template v-for="item in sortedVisibleItems" :key="item">
        <div
          class="slide-item"
          :style="{
            height: `${height}px`,
            backgroundImage:
              slotItems.length || !items?.length || !items[item]
                ? 'unset'
                : `url(${items[item].image})`,
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
        </div>
      </template>
    </div>

    <div v-if="navigation" class="slide-nav">
      <div
        v-for="item in visibleItems"
        :key="item"
        class="slide-nav-item"
        :class="{ active: item === quickActiveIndex }"
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
    @apply snap-start snap-always flex flex-col flex-none w-full bg-cover bg-center select-none;
  }
  .slide-content {
    @apply p-3 block bg-dark bg-opacity-50 text-white mt-auto;
  }
  .slide-nav {
    @apply absolute bottom-2 right-2 max-w-80 flex gap-1 cursor-pointer;
  }
  .slide-nav-item {
    @apply rounded-full bg-white bg-opacity-50 w-4 h-4 transition hover:bg-opacity-75;
  }
  .slide-nav-item.active {
    @apply bg-opacity-100;
  }
  .slide-nav-arrow {
    @apply absolute w-full left-0 transition-all duration-300;
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
