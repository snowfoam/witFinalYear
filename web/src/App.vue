<template>
  <div id="app">
    <Layout style="height: 100%" class="main">
      <Layout>
        <!-- user & login/register & logout -->
        <header-bar v-if="showHeaderBar" />

        <!-- content -->
        <Content class="main-content-con">
          <Layout class="main-layout-con">
            <Content class="content-wrapper" :class="showHeaderBar?'container':''">
              <keep-alive>
                <router-view />
              </keep-alive>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
export default {
  name: "App",
  components: {
    HeaderBar
  },
  computed: {
    showHeaderBar() {
      return this.$route.name !== 'login'
    }
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.main {
  .logo-con {
    height: 64px;
    padding: 10px;
    img {
      height: 44px;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  }

  .main-layout-con {
    height: 100%;
    overflow: hidden;
  }
  .main-content-con {
    height: ~"calc(100% - 60px)";
    overflow: hidden;
    // padding: 3rem;
  }
  .tag-nav-wrapper {
    padding: 0;
    height: 40px;
    background: #f0f0f0;
  }
  .content-wrapper {
    // padding: 18px;
    // height: ~"calc(100% - 80px)";
    overflow: auto;
  }
  .left-sider {
    .ivu-layout-sider-children {
      overflow-y: scroll;
      margin-right: -18px;
    }
  }
}
.ivu-menu-item > i {
  margin-right: 12px !important;
}
.ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
  margin-right: 8px !important;
}

.ivu-select-dropdown.ivu-dropdown-transfer {
  max-height: 400px;
}
.container {
  padding: 3rem;
}
.text-center {
  text-align: center;
}
</style>
