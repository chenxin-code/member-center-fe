<template>
  <div>
    <a-row :gutter="24">
      <!-- 今日新增 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <chart-card :loading="loading" title="今日新增" :total="`${numFormat(tongJiData.todayNewNum)}人`">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <template slot="footer">
            会员总数
            <span style="padding-left:20px;">{{ tongJiData.sum | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>

      <!-- 季度新增 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <chart-card :loading="loading" title="季度新增" :total="tongJiData.quarterNewNum | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :useData="quarterData" />
          </div>
          <template slot="footer">
            <div class="quarter-footer">
              <div class="quarter-footer-item">一月</div>
              <div class="quarter-footer-item">二月</div>
              <div class="quarter-footer-item">三月</div>
            </div>
          </template>
        </chart-card>
      </a-col>

      <!-- 会员来源 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <div class="pie-source">
          <span class="pie-title">会员来源</span>
          <v-chart :forceFit="true" :height="255" :data="pieData1" :scale="pieScale1">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :v-style="pieStyle1" />
            <v-coord type="theta" />
          </v-chart>
        </div>
      </a-col>
      <!-- 会员等级 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <div class="pie-source">
          <span class="pie-title">会员等级</span>
          <v-chart :forceFit="true" :height="255" :data="pieData2" :scale="pieScale2">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :v-style="pieStyle2" />
            <v-coord type="theta" />
          </v-chart>
        </div>
      </a-col>
    </a-row>

    <!-- 会员数量 -->
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div>

          <a-tab-pane loading="true" tab="会员数量" key="1">
            <a-row>
              <a-col :span="24">
                <v-chart :force-fit="true" :height="308" :data="lineData" :scale="lineScale">
                  <v-tooltip />
                  <v-axis />
                  <v-legend />
                  <v-line position="month*temperature" color="city" />
                  <v-point position="month*temperature" color="city" :size="4" :v-style="lineStyle" :shape="'circle'" />
                </v-chart>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
import { ChartCard, MiniArea } from '@/antd/components';
import { baseMixin } from '@/store/app-mixin';
const defaultAvatar = require('@/assets/img/user/avatar.png');

//季度新增
const quarterData = [
  { date: '2020-12-01', num: 1 },
  { date: '2020-12-02', num: 3 },
  { date: '2020-12-03', num: 5 },
  { date: '2020-12-04', num: 9 },
  { date: '2020-12-05', num: 7 },
  { date: '2020-12-06', num: 4 }
];

//饼图：会员来源+会员等级
const DataSet = require('@antv/data-set');
//1.0会员来源
const pieSourceData1 = [
  { item: '家用用1', count: 32.2 },
  { item: '酒水用1', count: 21 },
  { item: '个护用1', count: 17 },
  { item: '服饰用1', count: 13 },
  { item: '母婴用1', count: 9 }
];
const pieScale1 = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
];
const dv1 = new DataSet.View().source(pieSourceData1);
dv1.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
});
const pieData1 = dv1.rows;
//2.0会员等级
const pieSourceData2 = [
  { item: '家用用2', count: 23 },
  { item: '酒水用2', count: 44 },
  { item: '个护用2', count: 45 },
  { item: '服饰用2', count: 10 },
  { item: '母婴用2', count: 9 }
];
const pieScale2 = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
];
const dv2 = new DataSet.View().source(pieSourceData2);
dv2.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
});
const pieData2 = dv2.rows;

// 折行图
const lineSourceData = [
  { month: 'Jan', Tokyo: 7.0, London: 3.9 },
  { month: 'Feb', Tokyo: 6.9, London: 4.2 },
  { month: 'Mar', Tokyo: 9.5, London: 5.7 },
  { month: 'Apr', Tokyo: 14.5, London: 8.5 },
  { month: 'May', Tokyo: 18.4, London: 11.9 },
  { month: 'Jun', Tokyo: 21.5, London: 15.2 },
  { month: 'Jul', Tokyo: 25.2, London: 17.0 },
  { month: 'Aug', Tokyo: 26.5, London: 16.6 },
  { month: 'Sep', Tokyo: 23.3, London: 14.2 },
  { month: 'Oct', Tokyo: 18.3, London: 10.3 },
  { month: 'Nov', Tokyo: 13.9, London: 6.6 },
  { month: 'Dec', Tokyo: 9.6, London: 4.8 }
];

const lineDv = new DataSet.View().source(lineSourceData);
lineDv.transform({
  type: 'fold',
  fields: ['Tokyo', 'London'],
  key: 'city',
  value: 'temperature'
});
const lineData = lineDv.rows;

const lineScale = [
  {
    dataKey: 'month',
    min: 0,
    max: 1
  }
];

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea
  },
  data() {
    return {
      tongJiData: {},
      loading: true,
      //面积图:季度新增
      quarterData,
      //饼图：会员来源+会员等级
      // 1.0会员来源
      pieScale1,
      pieData1,
      pieSourceData1,
      pieStyle1: {
        stroke: '#000'
      },
      // 2.0会员来源
      pieScale2,
      pieData2,
      pieSourceData2,
      pieStyle2: {
        stroke: '#000'
      },
      //会员数量
      lineData,
      lineScale,
      lineStyle: { stroke: '#fff', lineWidth: 1 }
    };
  },
  computed: {
    numFormat() {
      return value => {
        if (!value) {
          return '0';
        } else {
          const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断
          return intPartFormat;
        }
      };
    }
  },
  methods: {
    async checkLoginUser() {
      await this.getLoginUrl();
      await this.getUserInfo();
      await this.getMemberTongJi();
      await this.getMemberTongJiDate();
    },
    getLoginUrl() {
      api.getLoginUrl().then(res => {
        console.log('getLoginUrl res :>> ', res);
        if (res.code === 200) {
          window.localStorage.setItem('SD_LOGIN_URL', res.data);
        }
      });
    },
    getUserInfo() {
      const tokenStr = 'Bearer ' + window.localStorage.getItem('SD_ACCESS_TOKEN');

      const param = {
        token: tokenStr
      };

      api.getUserInfo(param).then(res => {
        console.log('getUserInfo res :>> ', res);
        if (res.code === 200) {
          this.userAvatar = res.data.userImage ? res.data.userImage : defaultAvatar;
          this.username = res.data.userName;
          window.localStorage.setItem('SD_USERAVATAR', this.userAvatar);
          window.localStorage.setItem('SD_USERNAME', res.data.userName);
          this.$store.commit('setUseravatar', this.userAvatar);
          this.$store.commit('setUsername', res.data.userName);
        }
      });
    },
    //获取会员统计
    getMemberTongJi() {
      api.getMemberTongJi().then(res => {
        console.log('getMemberTongJi res :>> ', res);
        if (res.code === 200) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.tongJiData, key, element);
            }
          }
          console.log('this.tongJiData :>> ', this.tongJiData);
        }
      });
    },
    getMemberTongJiDate() {
      const param = {
        type: 1
        // createTimeStart: jointimeStart,
        // createTimeEnd: jointimeEnd
      };
      api
        .getMemberTongJiDate(param)
        .then(res => {
          console.log('getMemberTongJiDate res :>> ', res);
          if (res.code === 200) {
            //
          }
        })
        .finally(() => {
          //
        });
    }
  },
  created() {
    //------ 通过网址传递token并存储到ls ------
    let tokenStr = '';
    const tokenArr = window.location.href.match(/token=(.*?)(&|$|#)/);
    if (Object.prototype.toString.call(tokenArr).indexOf('Array') !== -1) {
      if (tokenArr[1]) {
        tokenStr = tokenArr[1];
      }
    }
    if (tokenStr) {
      console.log('有参数');
      window.localStorage.setItem('SD_ACCESS_TOKEN', tokenStr);
      window.history.replaceState(null, null, window.location.pathname);
    } else {
      console.log('没有参数');
    }
    //------ 通过网址传递token并存储到ls ------
    //初始化校验token和用户信息
    this.checkLoginUser();

    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
  }
};
</script>

<style lang="less" scoped>
.ant-row {
  margin-bottom: 20px;
  .ant-card {
    height: 250px !important;
  }
}

.quarter-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .quarter-footer-item {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

.pie-source {
  height: 250px !important;
  background-color: #fff;
  position: relative;
  top: 0;
  left: 0;

  .pie-title {
    font-family: PingFangSC-Semibold, Avenir, Helvetica, Arial, sans-serif;
    color: #333;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    position: absolute;
    top: 20px;
    left: 24px;
  }

  div {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: center;
  }
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
