<template>
  <div class="game-index">
    <div class="game-header">
      <timesInput title="游戏名称" v-model="gameName" placeholder="请输入游戏名称"></timesInput>
      <timesSelect
        title="游戏方式"
        :optionObj="gameOption"
        @select-option="selectGame"
        placeholder="请选择游戏"
        style="margin-left: 20px"
      ></timesSelect>
      <div>
        <a-button @click="searchGame" style="width: 150px;margin-left: 20px;" type="primary">查询</a-button>
        <a-button @click="addGame" style="width: 150px;margin-left: 10px" type="primary">新建游戏</a-button>
      </div>
    </div>
    <div class="game-content">
      <a-table :columns="columns" :data-source="contentData" @change="changePage" :pagination="pagination">
        <span slot="operate" slot-scope="text, record">
          <span @click="turnOn(record, 'on')" class="operate">启用</span>
          <span @click="turnOn(record, 'off')" class="operate">禁用</span>
          <span @click="turnOn(record, 'del')" class="operate">删除</span>
          <span @click="turnOn(record, 'editor')" class="operate">编辑</span>
          <span @click="turnOn(record, 'check')" class="operate">查看活动人员</span>
          <span @click="turnOn(record, 'manage')" class="operate">奖品管理</span>
          <span @click="turnOn(record, 'copy')" class="operate">复制链接</span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
// 头部标题
const columns = [
  {
    title: '游戏主题',
    dataIndex: 'theme',
    key: 'theme'
  },
  {
    title: '游戏名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '开奖方式',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: '游戏方式',
    key: 'gameType',
    dataIndex: 'gameType'
  },
  {
    title: '开始时间',
    key: 'startTime',
    dataIndex: 'startTime'
  },
  {
    title: '结束时间',
    key: 'endTime',
    dataIndex: 'endTime'
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    slots: { title: 'operate' },
    scopedSlots: { customRender: 'operate' }
  }
];
// 内容
const contentData = [
  {
    key: '1',
    name: 'John Brown',
    theme: 32,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  },
  {
    key: '2',
    name: 'Jim Green',
    theme: 42,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  },
  {
    key: '3',
    name: 'Joe Black',
    theme: 32,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  }
];
export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      gameOption: [
        { name: '九宫格', value: 'sudoku' },
        { name: '大转盘', value: 'turntable' },
        { name: '砸金蛋', value: 'egg' }
      ],
      gameObj: {},
      gameName: '',
      columns,
      contentData,
      pagination: {
        total: 50
      }
    };
  },
  watch: {
    gameName(val) {
      console.log('>>>>>>>>>', val);
    }
  },
  methods: {
    selectGame(value) {
      console.log('value', value);
    },
    searchGame() {},
    addGame() {
      this.$router.push({
        path: '/gameManage/addGame'
      })
    },
    turnOn(target) {
      console.log('>>>>>>>turn on>>>>>>>>>', target);
    },
    //  分页
    changePage(val) {
      console.log('------------', val);
    }
  }
};
</script>

<style lang="less" scoped>
.game-index {
  .game-header {
    display: flex;
    margin: 20px 15px;
  }
  .game-content {
    .operate {
      color: #169bd5;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
