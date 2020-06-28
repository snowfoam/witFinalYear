<template>
  <Layout style="height: 100%" class="main">
    <Layout>
      <Header class="header-con">
        <header-bar>
          <user />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <keep-alive>
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import HeaderBar from "./HeaderBar";
import User from "./User";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { routeEqual } from "@/libs/util";
import routers from "@/router/routers";
import "@/styles/main.less";
export default {
  name: "Main",
  components: {
    HeaderBar,
    User
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["errorCount"]),
    menuList() {
      return this.$store.getters.menuList;
    }
  },
  methods: {
    ...mapMutations(["setHomeRoute"]),
    ...mapActions(["handleLogin"])
  },
  mounted() {
    this.setHomeRoute(routers);
  }
};
</script>
