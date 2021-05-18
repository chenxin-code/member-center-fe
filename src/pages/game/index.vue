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
      <a-table
        :columns="columns"
        :data-source="records"
        :rowKey="record => record.id"
        @change="changePage"
        :pagination="pagination"
      >
        <span slot="operate" slot-scope="text, record">
          <!-- 0禁用、1启用 -->
          <span @click="turnOn(record, 1)" class="operate" v-if="record.availableFlage == 0">启用</span>
          <span @click="turnOn(record, 2)" class="operate" v-if="record.availableFlage == 1">禁用</span>
          <span @click="turnOn(record, 3)" class="operate">删除</span>
          <span @click="turnOn(record, 'editor')" class="operate">编辑</span>
          <span @click="turnOn(record, 'check')" class="operate">查看活动人员</span>
          <span @click="turnOn(record, 'manage')" class="operate">奖品管理</span>
          <!-- <span @click="turnOn(record, 'copy')" class="operate">复制链接</span> -->
          <span class="operate" data-clipboard-action="copy">复制</span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
// TODO 复制功能未完成
import Clipboard from 'clipboard';
import { GAME_LIST, GANE_MANAGE_GAME } from '@/api/game.js';
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
// 头部标题
const columns = [
  {
    title: '游戏名称',
    dataIndex: 'gameTitle',
    key: 'gameTitle'
  },
  {
    title: '开奖方式',
    key: 'lotteryType',
    dataIndex: 'lotteryType'
  },
  {
    title: '游戏方式',
    key: 'activityType',
    dataIndex: 'activityType'
  },
  {
    title: '开始时间',
    key: 'validityStartTime',
    dataIndex: 'validityStartTime'
  },
  {
    title: '结束时间',
    key: 'validityEndTime',
    dataIndex: 'validityEndTime'
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    slots: { title: 'operate' },
    scopedSlots: { customRender: 'operate' }
  }
];
let prizeDict = {
  1: '立即开奖',
  2: '非立即开奖'
};
let gameTypeDict = {
  1: '幸运转盘',
  2: '砸金蛋',
  3: '九宫格'
};
// 内容
export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      gameOption: [
        { name: '九宫格', value: '3' },
        { name: '大转盘', value: '1' },
        { name: '砸金蛋', value: '2' }
      ],
      chooseGame: '', // 选择游戏
      gameObj: {},
      gameName: '',
      columns,
      records: [],
      pagination: {
        total: 0
      },
      pageNum: 1,
      pageSize: 10
    };
  },
  mounted() {
    const that = this;
    const btnCopy = new Clipboard('.copy', {
      target: function() {
        return that.$refs.tradeNo;
      }
    });
    btnCopy.on('success', target => {
      that.copyText = target.text;
      that.$toast('复制成功');
    });
  },
  activated() {
    this.getGameList({
      pageNum: 1,
      pageSize: 10,
      chooseGame: '',
      gameName: ''
    });
  },
  methods: {
    // 获取游戏列表
    getGameList(params) {
      GAME_LIST(params).then(({ code, data }) => {
        console.log('code', code);
        if (code == 200) {
          this.pagination.total = Number(data.total);
          this.pageNum++;
          this.records = data.records;
          this.records.forEach(item => {
            item.lotteryType = prizeDict[item.lotteryType];
            item.activityType = gameTypeDict[item.activityType];
          });
        }
      });
    },
    /**
     * @description 管理活动游戏，
     *  启动 1 删除 3 禁用 2
     *  操作后更新
     */

    operateGame(params) {
      GANE_MANAGE_GAME(params).then(res => {
        console.log('>>>>>>>>', res);
        if (res.code == 200) {
          this.$message.info('操作成功');
          this.getGameList({
            gameTitle: this.gameName,
            activityType: this.chooseGame,
            pageNum: 1,
            pageSize: 10
          });
        }
      });
    },
    selectGame(value) {
      this.chooseGame = value;
    },
    searchGame() {
      let params = {
        gameTitle: this.gameName,
        activityType: this.chooseGame,
        pageNum: 1,
        pageSize: 10
      };
      this.getGameList(params);
    },
    addGame() {
      this.$router.push({
        path: '/gameManage/addGame'
      });
    },
    turnOn(target, type) {
      if (type == 'manage') {
        this.$router.push({
          path: '/gameManage/prizeManage',
          query: target
        });
      } else if (type == 'check') {
        this.$router.push({
          path: '/gameManage/peopleManage',
          query: target
        });
      } else if (type == 1 || type == 2 || type == 3) {
        //启动 1  禁用 2  删除 3
        this.operateGame({
          gameId: target.id,
          operatorType: String(type)
        });
      }
    },
    //  分页
    changePage(val) {
      console.log('------------', val);
      this.getGameList({
        gameTitle: this.gameName,
        activityType: this.chooseGame,
        pageNum: val.current,
        pageSize: 10
      });
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
