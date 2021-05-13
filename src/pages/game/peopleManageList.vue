<template>
  <div class="game-prizeManage">
    <div class="game-prize-title">游戏人员管理</div>

    <div class="game-prize-header">
      <div class="game-message-explain">
        <div class="game-prize-label">
          <div class="prize-label-title">游戏主题</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">游戏名称</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">开始时间</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">结束时间</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">活动最高参与人数</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">开奖方式</div>
          <div class="prize-label-text">xxxxxxxxxxx</div>
        </div>
      </div>

      <div class="game-message-search">
        <div style="display: flex;margin-left: 40px;">
          <timesInput title="会员ID" v-model="vipId" placeholder="请输入会员ID"></timesInput>
          <timesInput
            title="会员手机号"
            v-model="vipPhone"
            placeholder="请输入会员手机号"
            style="margin-left: 20px;"
          ></timesInput>
          <timesSelect
            title="已抽取奖品等级"
            :optionObj="prizeLevelOption"
            @select-option="seleceLevel"
            placeholder="请选择奖品等级"
            style="margin-left: 20px"
          ></timesSelect>
        </div>
        <a-button @click="submit" style="width: 150px;margin-left: 10px" type="primary">查询</a-button>
      </div>
    </div>

    <div class="game-prize-content">
      <a-table :columns="columns" :data-source="contentData" @change="changePage" :pagination="pagination">
        <span slot="operate" slot-scope="text, record">
          <span @click="turnOn(record, 'result')" class="operate">查看抽奖结果</span>
          <span @click="turnOn(record, 'times')" class="operate">管理抽奖次数</span>
        </span>
      </a-table>
    </div>

    <a-modal title="查看抽奖结果" :visible="resultVisible" @cancel="resultVisible = false">
      <a-table :columns="rusultColumns" :data-source="data" bordered></a-table>
      <div slot="footer" style="display: flex;justify-content: center;">
        <a-button type="primary" @click="resultVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <a-modal title="修改抽奖次数" :visible="changeVisible" @cancel="changeVisible = false">
      <div class="game-prize-label">
        <div class="prize-label-title" style="width: 100px">会员手机号</div>
        <div class="prize-label-text">xxxxxxxxxxx</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title" style="width: 100px">会员ID</div>
        <div class="prize-label-text">xxxxxxxxxxx</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title">会员应参与次数</div>
        <div class="prize-label-text">xxxxxxxxxxx</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title">会员已参与次数</div>
        <div class="prize-label-text">xxxxxxxxxxx</div>
      </div>
      <timesInput
        title="重置会员参与次数"
        v-model="vipPhone"
        placeholder="请输入会员手机号"
        style="margin-left: 20px;"
      ></timesInput>
      <div slot="footer" style="display: flex;justify-content: center;">
        <a-button @click="changeVisible = false">取消</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
// 头部标题
const columns = [
  {
    title: '会员手机号',
    dataIndex: 'theme',
    key: 'theme'
  },
  {
    title: '会员ID',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '最高参与次数',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: '已参与次数',
    key: 'gameType',
    dataIndex: 'gameType'
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    slots: { title: 'operate' },
    scopedSlots: { customRender: 'operate' }
  }
];
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

const rusultColumns = [
  {
    title: '会员手机号',
    dataIndex: 'theme',
    key: 'theme'
  },
  {
    title: '会员ID',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '参与时间',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: '奖品名称',
    key: 'gameType',
    dataIndex: 'gameType'
  }
];

export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      resultVisible: false,
      changeVisible: false,
      paramsPage: {},
      prizeLevelOption: [],
      prizeLevel: '',
      vipId: '',
      vipPhone: '',
      columns,
      contentData,
      pagination: {
        total: 50
      },
      rusultColumns
    };
  },
  created() {
    this.paramsPage = this.$route.query;
  },
  methods: {
    seleceLevel(val) {
      this.prizeLevel = val;
    },
    changePage() {},
    submit() {},
    turnOn(data, flag) {
      if (flag == 'times') {
        this.changeVisible = true;
      } else {
        this.resultVisible = true;
      }
    },
    save() {}
  }
};
</script>

<style lang="less" scoped>
.game-prize-label {
  display: flex;
  margin: 20px 40px;
  .prize-label-title {
    text-align: right;
  }
  .prize-label-text {
    margin-left: 15px;
  }
}
.game-prizeManage {
  .game-prize-title {
    width: 200px;
    height: 80px;
    text-align: center;
    line-height: 80px;
  }
  .game-prize-header {
    // display: flex;
    margin: 0px 30px;
    .game-message-explain {
      display: flex;
      flex-wrap: wrap;
    }
    .game-message-search {
      display: flex;
      // margin: 20px 40px;
      justify-content: space-between;
      align-items: center;
    }
  }
  .game-prize-content {
    margin: 20px 40px;
    .operate {
      color: #169bd5;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
