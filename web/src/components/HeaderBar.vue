<template>
  <div class="header-bar">
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import "@/styles/header-bar.less";
export default {
  name: "HeaderBar"
};
</script>
