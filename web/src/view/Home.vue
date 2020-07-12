<template>
  <div class="text-center">
    <div class="hello">Hello, {{ userName }}!</div>
    <div class="shortcuts">
      <header>Shortcuts:</header>
      <div class="links">
        <div><a href="/subjects">subject: query/add/update/remove </a></div>
        <div><a href="/courses">course: query/add/update/remove </a></div>
        <div><a href="/questions">question: query/add/update/remove </a></div>
        <div><a href="/exams">exam: query </a></div>
        <div><a href="/students">student: query </a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  computed: {
    userName() {
      const userInfo = this.$store.state.user.userInfo;
      if (userInfo && userInfo.name) {
        return `${userInfo.name.firstName} ${userInfo.name.lastName}`;
      }
      return "";
    }
  }
};
</script>

<style lang="less" scoped>
.hello {
  text-align: center;
  font-size: 2rem;
  margin-top: 8rem;
}
.shortcuts {
  margin-top: 3rem;
  header {
    font-size: 1rem;
  }
}
</style>
