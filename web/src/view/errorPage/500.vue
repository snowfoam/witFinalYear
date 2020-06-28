<template>
  <error-content code="500" desc="Internal server error" :src="src" />
</template>

<script>
import src from "@/assets/500.svg";
import ErrorContent from "@/components/ErrorContent.vue";
export default {
  name: "error_500",
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
