<template>
  <div>
    <a-row :gutter="24">
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

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <chart-card :loading="loading" title="季度新增" :total="tongJiData.quarterNewNum | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :useData="useData" />
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

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <div class="pie-source">
          <v-chart :forceFit="true" :height="275" :data="pieData" :scale="pieScale">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :v-style="pieStyle" />
            <v-coord type="theta" />
          </v-chart>
        </div>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <div class="pie-source">
          <v-chart :forceFit="true" :height="275" :data="pieData" :scale="pieScale">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :v-style="pieStyle" />
            <v-coord type="theta" />
          </v-chart>
        </div>
      </a-col>
    </a-row>


    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div>
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" title="销售额排行" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="访问量" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" title="销售额趋势" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="线上热门搜索" :style="{ height: '100%' }">
            <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">操作一</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">操作二</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px' }">
                <number-info :total="12321" :sub-total="17.1">
                  <span slot="subtitle">
                    <span>搜索用户数</span>
                    <a-tooltip title="指标说明" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px' }">
                <number-info :total="2.7" :sub-total="26.2" status="down">
                  <span slot="subtitle">
                    <span>人均搜索次数</span>
                    <a-tooltip title="指标说明" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="searchData"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">{{ text }}%</trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            :loading="loading"
            :bordered="false"
            title="销售额类别占比"
            :style="{ height: '100%' }"
          >
            <div slot="extra" style="height: inherit;">
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">操作一</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">操作二</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="a">
                  <a-radio-button value="a">全部渠道</a-radio-button>
                  <a-radio-button value="b">线上</a-radio-button>
                  <a-radio-button value="c">门店</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <h4>销售额</h4>
            <div>
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <v-legend dataKey="item" />
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/antd/components';
import { baseMixin } from '@/store/app-mixin';
const defaultAvatar = require('@/assets/img/user/avatar.png');

const barData = [];
const barData2 = [];
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  });
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  });
}

const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  });
}

const userData = [
  { date: '2020-12-01', num: 1 },
  { date: '2020-12-02', num: 3 },
  { date: '2020-12-03', num: 5 },
  { date: '2020-12-04', num: 9 },
  { date: '2020-12-05', num: 7 },
  { date: '2020-12-06', num: 4 }
];
const searchUserData = [];
for (let i = 0; i < userData.length; i++) {
  searchUserData.push({
    x: userData[i].date,
    y: userData[i].num
  });
}
// for (let i = 0; i < 7; i++) {
//   searchUserData.push({
//     x: moment()
//       .add(i, 'days')
//       .format('YYYY-MM-DD'),
//     y: Math.ceil(Math.random() * 10)
//   });
// }

const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
];

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
];
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  });
}

//饼图
const DataSet = require('@antv/data-set');
const sourceData = [
  { item: '家用', count: 32.2 },
  { item: '酒水', count: 21 },
  { item: '个护', count: 17 },
  { item: '服饰', count: 13 },
  { item: '母婴', count: 9 }
];
const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
];
const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
});
const pieData = dv.rows;

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    // MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data() {
    return {
      tongJiData: {},
      useData: [
        { date: '2020-12-01', num: 1 },
        { date: '2020-12-02', num: 3 },
        { date: '2020-12-03', num: 5 },
        { date: '2020-12-04', num: 9 },
        { date: '2020-12-05', num: 7 },
        { date: '2020-12-06', num: 4 }
      ],
      loading: true,
      rankList,
      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
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
      // await this.getMemberTongJiDate();
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
  height: 260px !important;
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
