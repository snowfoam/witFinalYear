<template>
  <error-content code="404" desc="Not found" :src="src" />
</template>

<script>
import src from "@/assets/404.svg";
import ErrorContent from "@/components/ErrorContent.vue";
export default {
  name: "error_404",
  components: {
    ErrorContent
  },
  data() {
    return {
      src
    };
  }
};
</script>
