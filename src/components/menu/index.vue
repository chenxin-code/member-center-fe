<template>
  <a-menu theme="dark" mode="inline" :openKeys="openKeys" :selected-keys="[$route.meta.menu]" @openChange="checkKeys">
    <template v-for="menu in menus">
      <template v-if="menu.children && hasRangeAuthorityWithoutProject(menu.authKeys)">
        <a-sub-menu :key="menu.name" :disabled="$store.state.menu.menuStatus">
          <span slot="title">
            <img :src="menu.icon" class="menu-icon" />
            <span class="menu-title">{{ menu.title }}</span>
          </span>
          <template v-for="menuChildren in menu.children">
            <template v-if="hasRangeAuthorityWithoutProject(menuChildren.authKeys)">
              <a-menu-item :key="menuChildren.path" @click="onClickMenuChid(menuChildren.path)">
                <img class="menu-item-icon" :src="menuChildren.icon" alt="icon" />
                {{ menuChildren.title }}
              </a-menu-item>
            </template>
          </template>
        </a-sub-menu>
      </template>
      <template v-else>
        <template v-if="hasRangeAuthorityWithoutProject(menu.authKeys)">
          <a-menu-item :key="menu.path" @click="onClickMenu(menu.path)" :disabled="$store.state.menu.menuStatus">
            <span>
              <img :src="$route.meta.menu === menu.path ? menu.icon : menu.iconHide" class="menu-icon" />
              <span class="menu-title">{{ menu.title }}</span>
            </span>
          </a-menu-item>
        </template>
      </template>
    </template>
  </a-menu>
</template>

<script>
import MENU_ROUTES from '../../config/menu';
import hasRangeAuthorityWithoutProject from '@/utils/authority';

export default {
  name: 'Menu',
  props: {
    msg: String
  },
  data() {
    return {
      menus: [],
      openKeys: [this.$route.path.split('/')[2] ? this.$route.path.split('/')[2] : ''],
      rootPath: '',
      collapsed: false
    };
  },
  created() {
    this.setMenus();
    // console.log('this.$route :>> ', this.$route);
    // console.log('this.$route.path.split("/") :>> ', this.$route.path.split('/'));
  },
  methods: {
    checkKeys(openKeys) {
      this.openKeys = openKeys;
      this.$forceUpdate();
    },
    onClickMenuChid(path) {
      this.$router.push({ path: path });
    },
    onClickMenu(path) {
      this.openKeys.splice(0, this.openKeys.length);
      this.openKeys.push('');
      // this.openKeys = [''];
      // this.$forceUpdate();
      this.$router.push({ path: path });
    },
    hasRangeAuthorityWithoutProject(authKeys) {
      return hasRangeAuthorityWithoutProject(authKeys);
    },
    setMenus() {
      const pathname = this.$route.path;
      const matchedMenu = MENU_ROUTES.find(x => x.path === pathname) || { group: '' };
      let filteredMenus = [];
      const groupMenus = MENU_ROUTES.filter(x => x.group === matchedMenu.group);

      if (groupMenus.length > 0) {
        filteredMenus = groupMenus;
      } else {
        if (pathname.split('/').length > 0) {
          const pathParams = pathname.split('/');
          const newMatchedMenu = MENU_ROUTES.find(x =>
            x.hasChild
              ? x.hasChild === (pathParams[1] === 'advertise' ? pathParams[1] : pathParams[1])
              : x.path ===
                '/' +
                  (pathParams[1] === 'user' ||
                  pathParams[1] === 'advertise' ||
                  pathParams[1] === 'operationsManagement' ||
                  pathParams[1] === 'project'
                    ? pathParams[1] + '/' + pathParams[2]
                    : pathParams[1])
          );

          // const newMatchedMenu = MENU_ROUTES.find(x =>
          // x.path ===
          //   ("/" + ((pathParams[1] === "user" || pathParams[1] === "advertise") ? pathParams[1] + "/" + pathParams[2] : pathParams[1])));
          if (newMatchedMenu) {
            const newGroupMenus = MENU_ROUTES.filter(x => x.group === newMatchedMenu.group);
            filteredMenus = newGroupMenus || [];
          }
        }
      }
      this.rootPath = pathname;
      this.menus = filteredMenus;
    }
  },
  watch: {
    $route: 'setMenus',
    menus: {
      handler(newVal) {
        // console.log('menus newVal:>> ', newVal);
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 ownerList 对象的属性值的变化
    },
    openKeys: {
      handler(newVal) {
        // console.log('openKeys newVal:>> ', newVal);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style>
.ant-menu-submenu .ant-menu .ant-menu-item {
  padding-left: 36px !important;
}
.menu-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  top: -1px;
  position: relative;
  margin-right: 10px;
}

.menu-item-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  top: -1px;
  position: relative;
  margin-right: 10px;
}

.ant-layout-sider-collapsed .menu-title {
  opacity: 0;
}
</style>
