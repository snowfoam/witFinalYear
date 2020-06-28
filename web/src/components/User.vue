<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="logout">
      {{ userName }}
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">logout</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "@/styles/user.less";
import { mapActions } from "vuex";

export default {
  name: "User",
  data() {
    return {
      userName: ""
    };
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login"
        });
      });
    }
  }
};
</script>
