<template>
  <error-content code="401" desc="Unauthorized" :src="src" />
</template>

<script>
import src from "@/assets/401.svg";
import ErrorContent from "@/components/ErrorContent.vue";
export default {
  name: "error_401",
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
