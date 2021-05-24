export default [
  // 大转盘
  {
    path: "/game/turntable",
    component: resolve => require(["@/view/game/turntable.vue"], resolve),
    meta: {
      title: " ",
      previous: false,
      keepAlive: true
    }
  },
  // 九宫格
  {
    path: "/game/sudoku",
    component: resolve => require(["@/view/game/sudoku.vue"], resolve),
    meta: {
      title: " ",
      previous: false,
      keepAlive: true
    }
  },
  // 金蛋
  {
    path: "/game/glodegg",
    component: resolve => require(["@/view/game/glodegg.vue"], resolve),
    meta: {
      title: " ",
      previous: false,
      keepAlive: true
    }
  },
  // 金蛋
  {
    path: "/game/gameRecord",
    component: resolve => require(["@/view/game/gameRecord.vue"], resolve),
    meta: {
      title: " ",
      previous: false,
      keepAlive: true
    }
  }
];
