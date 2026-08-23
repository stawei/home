<template>
  <div class="more-content">
    {{ moreContent }}
  </div>
</template>

<script setup>
const moreContent = import.meta.env.VITE_MORE_CONTENT || "醉后不知天在水，满船清梦压星河。";
</script>

<style lang="scss" scoped>
.more-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  height: 100%;
}
</style>
