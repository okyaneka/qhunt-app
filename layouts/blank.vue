<template>
  <main class="blank min-h-screen p-3 !bg-fixed bg-cover">
    <div class="max-w-lg mx-auto">
      <slot />
    </div>
  </main>
</template>

<style scopped>
.blank {
  background: radial-gradient(
      circle at 30% -20%,
      rgba(56, 48, 56, 0.5) 0%,
      rgba(56, 48, 56, 0) 50%
    ),
    radial-gradient(
      circle at 100% 110%,
      rgba(56, 48, 56, 0.3) 0%,
      rgba(56, 48, 56, 0) 30%
    );
}
</style>
