<template>
  <div class="text-center">
    <div class="hello">Hello, {{ userName }}!</div>
    <div class="shortcuts">
      <header>Shortcuts:</header>
      <div class="links">
        <div>
          <a href="/subjects" v-if="isTeacher"
            >subject: query/add/update/remove
          </a>
        </div>
        <div>
          <a href="/courses">
            <template v-if="isTeacher">
              course: query/add/applay/remove
            </template>
            <template v-else>
              course: query/applay
            </template>
          </a>
        </div>
        <div>
          <a href="/questions" v-if="isTeacher"
            >question: query/add/update/remove
          </a>
        </div>
        <div>
          <a href="/exams">
            <template v-if="isTeacher">
              exam: query
            </template>
            <template v-else>
              exam: query/apply/start/cancle
            </template>
          </a>
        </div>
        <div><a href="/students" v-if="isTeacher">student: query </a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  computed: {
    userType() {
      return this.$store.state.user.userType;
    },
    isTeacher() {
      return this.userType === "teacher";
    },
    userName() {
      return this.$store.getters.userName;
    },
  },
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
