<template>
  <div id="home">
    <a-layout class="container">
      <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo"></div>
        <Menu />
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0 20px">
          <Breadcrumb class="breadcrumb" />
          <div class="logout-btn">
            <a-dropdown>
              <span class="ant-dropdown-link" @click="e => e.preventDefault()">
                <a-avatar class="user-avatar" :src="useravatar" @loadError="loadError" />
                {{ username }}
                <!-- <a-icon type="down" /> -->
              </span>
              <!-- <a-menu slot="overlay">
                <a-menu-item>
                  <router-link :to="{ path: '/memberInfo' }">个人中心</router-link>
                </a-menu-item>
                <a-menu-item>
                  <router-link :to="{ path: '/memberInfo' }">返回首页</router-link>
                </a-menu-item>
                <a-menu-item @click="handleLogout">
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu> -->
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content class="content">
          <template v-if="promise">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </template>
          <div class="home-fail" v-else-if="!promise">
            暂无权限
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Menu from '@/components/menu'; //
import Breadcrumb from '@/components/breadcrumb';
import hasRangeAuthorityWithoutProject from '@/utils/authority';
console.log('hasRangeAuthorityWithoutProject :>> ', hasRangeAuthorityWithoutProject);
import { mapGetters } from 'vuex';

const defaultAvatar = require('@/assets/img/user/avatar.png');

export default {
  name: 'Home',
  data() {
    return {
      collapsed: false,
      // promise: '',
      promise: true,
      userImage: defaultAvatar
    };
  },
  computed: {
    ...mapGetters(['username', 'useravatar'])
  },
  components: {
    Menu,
    Breadcrumb
  },
  props: {
    authKeys: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (to.name === "portal" || to.name === "login" || to.name === "userInfo") {
  //     // from.meta.keepAlive = false;
  //     this.$destroy()
  //   }
  //   next();
  // },
  created() {
    if (this.useravatar && this.useravatar != 'undefined') {
      this.userImage = this.useravatar;
    } else {
      this.userImage = defaultAvatar;
    }
    // console.log(this.userImage)
    // this.userImage = window.localStorage.getItem("SD_USERAVATAR");
    // this.userName = window.localStorage.getItem("SD_USERNAME");
    // const jsonAuthorities = window.localStorage.getItem('SD_AUTHORITIES');
    // if (jsonAuthorities) {
    //   const authKeys = this.$route.meta.authKeys;
    //   if (authKeys != '' && !hasRangeAuthorityWithoutProject(authKeys)) {
    //     // this.promise = false;
    //     this.promise = true;
    //   } else {
    //     this.promise = true;
    //   }
    // } else {
    //   this.$router.push({ path: '/portal' });
    // }
  },
  mounted() {},
  methods: {
    loadError() {
      this.$store.commit('setUseravatar', this.userImage);
      // this.useravatar = defaultAvatar;
      window.localStorage.setItem('SD_USERAVATAR', defaultAvatar);
    }
    // handleLogout() {
    //   window.localStorage.setItem('SD_ACCESS_TOKEN', '');
    //   window.localStorage.setItem('SD_ACCESS_REFRESHTOKEN', '');
    //   window.localStorage.setItem('SD_AUTHORITIES', '');
    //   window.localStorage.setItem('SD_USERAVATAR', '');
    //   window.localStorage.setItem('SD_USERNAME', '');
    //   window.localStorage.setItem('login_refresh', 'false');
    //   this.$router.push({ path: '/' });
    // }
  },
  watch: {
    // $route() {
    //   const jsonAuthorities = window.localStorage.getItem('SD_AUTHORITIES');
    //   if (jsonAuthorities) {
    //     if (!hasRangeAuthorityWithoutProject(this.$route.meta.authKeys)) {
    //       // this.promise = false;
    //       this.promise = true;
    //     } else {
    //       this.promise = true;
    //     }
    //   } else {
    //     this.$router.push({ path: '/portal' });
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
#home {
  // height: 100%;

  .container {
    // height: 100%;
    // margin-bottom: 24px;
    min-height: 100vh;

    aside.ant-layout-sider {
      z-index: 2;
    }

    .breadcrumb {
      display: inline-block;
    }

    .logout-btn {
      float: right;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      letter-spacing: 0;

      .logout {
        display: block;
      }

      .ant-dropdown-link {
        padding-right: 10px;
        height: 60px;
        line-height: 60px;
        display: inline-block;
      }

      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 12px;
      }
    }

    .logo {
      width: 86px;
      height: 20px;
      background: url(../assets/img/menu/logo.png) no-repeat;
      margin: 16px;
      color: #fff;
    }

    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    .content {
      height: calc(100% - 90px);
      margin: 24px 16px;
      background: #fff;

      .home-fail {
        padding: 20px;
      }
    }
  }
}
</style>
