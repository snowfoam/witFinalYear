<template>
  <Header class="header-con">
    <div class="header-bar">
      <div class="logo">
        <div class="title">
          OES
          <span class="type">({{ userType }})</span>
        </div>
        <div class="subtitle">Online Examination System</div>
      </div>

      <Menu
        mode="horizontal"
        theme="light"
        :active-name="activeName"
        class="menu"
      >
        <MenuItem name="home" to="/">
          <Icon type="ios-paper" />
          Home
        </MenuItem>
        <Submenu name="course" v-if="isTeacher">
          <template slot="title">
            <Icon type="ios-construct" />
            Course
          </template>
          <MenuItem name="subjects" to="/subjects">Subjects</MenuItem>
          <MenuItem name="courses" to="/courses">Courses</MenuItem>
        </Submenu>
        <MenuItem name="courses" to="/courses" v-else>
          <Icon type="ios-construct" />
          Course
        </MenuItem>
        <Submenu name="exam" v-if="isTeacher">
          <template slot="title">
            <Icon type="ios-stats" />
            Exam
          </template>
          <MenuItem name="questions" to="/questions">Questions</MenuItem>
          <MenuItem name="exams" to="/exams">Exams</MenuItem>
        </Submenu>
        <MenuItem name="exams" to="/exams" v-else>
          <Icon type="ios-stats" />
          Exam
        </MenuItem>
        <MenuItem name="students" to="/students" v-if="isTeacher">
          <Icon type="ios-people" />
          Student
        </MenuItem>
      </Menu>

      <div class="custom-content-con">
        <div class="user-avatar-dropdown">
          <Dropdown @on-click="logout" v-if="hasUserInfo">
            {{ userName }}
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem name="logout">logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <span v-else>
            <Button type="text" @click="$router.push('/login')">Login</Button>
            <Divider type="vertical" />
            <Button type="text" @click="goRegister">Register</Button>
          </span>
        </div>
      </div>
    </div>
  </Header>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "HeaderBar",
  computed: {
    activeName() {
      return this.$route.name;
    },
    hasUserInfo() {
      return this.$store.state.user.hasUserInfo;
    },
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
  methods: {
    ...mapActions(["handleLogOut"]),

    async logout() {
      await this.handleLogOut();
      this.$router.push("/login");
    },

    goRegister() {
      if (this.$route.name === "register") return;
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.header-con {
  background: #fff;
  padding: 0 20px;
  width: 100%;
}
.header-bar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    font-weight: bold;
    font-style: italic;
    text-align: center;
    div {
      height: 30px;
      line-height: 30px;
    }
    .title {
      font-size: 1.5rem;
    }
    .subtitle {
      font-size: 0.7rem;
    }
    .type {
      font-size: 0.8rem;
    }
  }
  .custom-content-con {
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 64px;
    & > * {
      float: right;
    }
  }
}
.user {
  &-avatar-dropdown {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    .ivu-badge-dot {
      top: 16px;
    }
  }
}
.menu {
  position: initial;
}
</style>
