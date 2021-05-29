<template>
  <div class="game-prizeManage">
    <!-- <div class="game-prize-title">游戏人员管理</div> -->
    <div class="game-prize-title">
      <div style="margin-left: 30px">游戏人员管理</div>
      <div class="page-back" @click="pageBack">返回</div>
    </div>

    <div class="game-prize-header">
      <div class="game-message-explain">
        <div class="game-prize-label">
          <div class="prize-label-title">游戏主题</div>
          <div class="prize-label-text">{{ paramsPage.gameTitle }}</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">游戏名称</div>
          <div class="prize-label-text">{{ paramsPage.activityTypeName }}</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">开始时间</div>
          <div class="prize-label-text">{{ paramsPage.validityStartTime }}</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">结束时间</div>
          <div class="prize-label-text">{{ paramsPage.validityEndTime }}</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">活动最高参与人数</div>
          <div class="prize-label-text">{{ paramsPage.partakeNum }}</div>
        </div>
        <div class="game-prize-label">
          <div class="prize-label-title">开奖方式</div>
          <div class="prize-label-text">{{ paramsPage.lotteryTypeName }}</div>
        </div>

        <div class="game-prize-label" v-if="paramsPage.drawLotteryNum">
          <div class="prize-label-title">开奖人数</div>
          <div class="prize-label-text">{{ paramsPage.drawLotteryNum }}</div>
        </div>

        <div class="game-prize-label" v-if="paramsPage.drawLotteryTime">
          <div class="prize-label-title">开奖时间</div>
          <div class="prize-label-text">{{ paramsPage.drawLotteryTime }}</div>
        </div>
      </div>

      <div class="game-message-search">
        <div style="display: flex;margin-left: 40px;">
          <timesInput title="会员手机号" v-model="memberPhone" placeholder="请输入会员手机号"></timesInput>
          <timesInput
            title="会员ID"
            v-model="memberId"
            placeholder="请输入会员ID"
            style="margin-left: 20px;"
          ></timesInput>
          <timesSelect
            title="已抽取奖品"
            :optionObj="activityLotteryVoListLevel"
            @select-option="seleceLevel"
            placeholder="请选择奖品"
            style="margin-left: 20px"
          ></timesSelect>
        </div>
        <a-button @click="search" style="width: 150px;margin-left: 10px" type="primary">查询</a-button>
      </div>
    </div>

    <div class="game-prize-content">
      <a-table
        :columns="columns"
        :data-source="contentData"
        @change="changePage"
        :pagination="pagination"
        :rowKey="record => record.id"
      >
        <span slot="operate" slot-scope="text, record">
          <span @click="turnOn(record, 'result')" class="operate">查看抽奖结果</span>
          <span @click="turnOn(record, 'times')" class="operate">管理抽奖次数</span>
        </span>
      </a-table>
    </div>

    <a-modal title="查看抽奖结果" :visible="resultVisible" @cancel="resultVisible = false">
      <a-table
        :columns="rusultColumns"
        :data-source="activityLotteryVoList"
        bordered
        :rowKey="record => record.id"
      ></a-table>
      <div slot="footer" style="display: flex;justify-content: center;">
        <a-button type="primary" @click="resultVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <a-modal title="修改抽奖次数" :visible="changeVisible" @cancel="changeVisible = false">
      <div class="game-prize-label">
        <div class="prize-label-title" style="width: 100px">会员手机号</div>
        <div class="prize-label-text">{{ operateTarget.memberPhone }}</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title" style="width: 100px">会员ID</div>
        <div class="prize-label-text">{{ operateTarget.memberId }}</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title">会员应参与次数</div>
        <div class="prize-label-text">{{ operateTarget.maxPartakeNum }}</div>
      </div>
      <div class="game-prize-label">
        <div class="prize-label-title">会员已参与次数</div>
        <div class="prize-label-text">{{ operateTarget.alreadyPartakeNum }}</div>
      </div>
      <timesInput
        title="重置会员参与次数"
        v-model="resetAttendNum"
        placeholder="请输入重置会员参与次数"
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
import {
  GANE_TAKEPARTINLIST,
  GANE_PRIZE_MANAGE_LIST,
  GANE_MANAGE_TIMES,
  GANE_CHECK_RESULT,
  PRIZE_NAME_LIST
} from '@/api/game';
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
// 头部标题
const columns = [
  {
    title: '会员手机号',
    dataIndex: 'memberPhone',
    key: 'memberPhone'
  },
  {
    title: '会员ID',
    dataIndex: 'memberId',
    key: 'memberId'
  },
  {
    title: '最高参与次数',
    dataIndex: 'maxPartakeNum',
    key: 'maxPartakeNum'
  },
  {
    title: '已参与次数',
    dataIndex: 'alreadyPartakeNum',
    key: 'alreadyPartakeNum'
  }
  // {
  //   key: 'operate',
  //   slots: { title: 'operate' },
  //   scopedSlots: { customRender: 'operate' }
  // }
];
const rusultColumns = [
  {
    title: '会员手机号',
    dataIndex: 'memberPhone',
    key: 'memberPhone'
  },
  {
    title: '会员ID',
    dataIndex: 'memberId',
    key: 'memberId'
  },
  {
    title: '参与时间',
    key: 'partakeTime',
    dataIndex: 'partakeTime'
  },
  {
    title: '奖品名称',
    key: 'prizeName',
    dataIndex: 'prizeName'
  }
];

export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      data: [],
      resultVisible: false,
      changeVisible: false,
      paramsPage: {},
      prizeLevelOption: [],
      prizeLevel: '',
      vipId: '',
      columns: [
        {
          title: '会员手机号',
          dataIndex: 'memberPhone',
          key: 'memberPhone'
        },
        {
          title: '会员ID',
          dataIndex: 'memberId',
          key: 'memberId'
        }
        // {
        //   title: '最高参与次数',
        //   dataIndex: 'maxPartakeNum',
        //   key: 'maxPartakeNum'
        // },
        // {
        //   title: '已参与次数',
        //   dataIndex: 'alreadyPartakeNum',
        //   key: 'alreadyPartakeNum'
        // }
        // {
        //   key: 'operate',
        //   slots: { title: 'operate' },
        //   scopedSlots: { customRender: 'operate' }
        // }
      ],
      contentData: [],
      pagination: {
        total: 10
      },
      rusultColumns,
      operateTarget: {}, //每次命中的对象
      activityLotteryVoList: [], // 抽奖结果列表

      resetAttendNum: '', // 重置抽奖次数
      activityLotteryVoListLevel: [], //中奖结果列表
      prizeName: '',
      gameId: '', // 活动游戏表ID
      memberId: '', // 会员ID
      memberPhone: '', // 会员手机号码
      prizeFlag: '', // 是否中奖(0否，1中奖)
      prizeId: '' // 奖品表管理
    };
  },
  created() {
    this.paramsPage = this.$route.query;
    let { memberId, memberPhone, prizeFlag, prizeId, lotteryType } = this.paramsPage;
    if (!this.paramsPage.drawLotteryTime) {
      this.columns.push(
        {
          title: '最高参与次数',
          dataIndex: 'maxPartakeNum',
          key: 'maxPartakeNum'
        },
        {
          title: '已参与次数',
          dataIndex: 'alreadyPartakeNum',
          key: 'alreadyPartakeNum'
        },
        {
          key: 'operate',
          slots: { title: 'operate' },
          scopedSlots: { customRender: 'operate' }
        }
      );
    } else {
      this.columns.push({
        title: '奖品名称',
        dataIndex: 'prizeName',
        key: 'prizeName'
      });
    }
    console.log('columns', this.columns);
    // 获取活动奖品名称列表
    PRIZE_NAME_LIST({
      gameId: this.paramsPage.id,
      pageNum: 1,
      pageSize: 10
    }).then(({ code, data }) => {
      if (code == 200) {
        this.activityLotteryVoListLevel.push({
          name: '全部',
          value: ''
        });
        data.forEach(item => {
          this.activityLotteryVoListLevel.push({
            name: item,
            value: item
          });
        });
      }
    });
    // 游戏人员列表
    this.getList({
      gameId: this.paramsPage.id,
      memberId,
      memberPhone,
      pageNum: 1,
      pageSize: 10,
      prizeFlag,
      prizeId,
      lotteryType: this.paramsPage.lotteryType * 1
    });
  },
  activated() {},
  methods: {
    pageBack() {
      this.$router.go(-1);
    },
    getList(params) {
      GANE_TAKEPARTINLIST(params).then(({ code, data }) => {
        if (code == 200) {
          console.log('data');
          this.contentData = data.activityMemberRespVoIPage.records;
          this.pagination.total = data.activityMemberRespVoIPage.total * 1;
        }
      });
    },
    seleceLevel(val) {
      this.prizeFlag = val;
    },
    changePage() {},
    search() {
      let { prizeId } = this.paramsPage;
      this.getList({
        gameId: this.paramsPage.id,
        memberId: this.memberId,
        memberPhone: this.memberPhone,
        pageNum: 1,
        pageSize: 10,
        // prizeFlag: this.prizeFlag,
        prizeId,
        prizeName: this.prizeFlag,
        lotteryType: this.paramsPage.lotteryType
      });
    },
    turnOn(data, flag) {
      this.operateTarget = data;
      console.log('........', data);
      if (flag == 'times') {
        this.changeVisible = true;
      } else {
        this.resultVisible = true;
        GANE_CHECK_RESULT({
          gameId: data.gameId,
          memberId: data.memberId
        }).then(({ data, code }) => {
          if (code == 200) {
            console.log('----data----', data);
            this.activityLotteryVoList = data.activityLotteryVoList;
          }
        });
      }
    },
    /*
      管理游戏抽奖次数
    */
    save() {
      GANE_MANAGE_TIMES({
        id: this.operateTarget.id,
        memberId: this.operateTarget.memberId,
        resetAttendNum: this.resetAttendNum
      }).then(({ data, code }) => {
        if (code == 200) {
          this.$message.info('游戏次数重置成功');
          this.changeVisible = false;
          let { prizeFlag, prizeId } = this.paramsPage;
          // 游戏人员列表
          this.getList({
            gameId: this.paramsPage.id,
            memberId: this.memberId,
            memberPhone: this.memberPhone,
            pageNum: 1,
            pageSize: 10,
            prizeFlag,
            prizeName: this.prizeName,
            prizeId,
            lotteryType: this.paramsPage.lotteryType * 1
          });
        }
      });
    }
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
  // .game-prize-title {
  //   width: 200px;
  //   height: 80px;
  //   text-align: center;
  //   line-height: 80px;
  // }
  .game-prize-title {
    height: 80px;
    text-align: center;
    line-height: 80px;
    display: flex;
    justify-content: space-between;
    .page-back {
      margin-right: 30px;
      color: #4b7afb;
      cursor: pointer;
    }
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
