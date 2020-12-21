<template>
  <div class="member-dashboard">
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
            <div class="antv-chart-mini">
              <div class="chart-wrapper" :style="{ height: 46 }">
                <v-chart :force-fit="true" height="120" :data="quarterAreaData" :padding="[36, 0, 18, 0]">
                  <v-tooltip />
                  <v-smooth-area color="#4D7CFE" position="日期*数量" />
                </v-chart>
              </div>
            </div>
          </div>
          <template slot="footer">
            <div class="quarter-footer">
              <div class="quarter-footer-item" v-for="(item, index) in quarterStr(tongJiData.quarter)" :key="index">
                {{ item }}
              </div>
            </div>
          </template>
        </chart-card>
      </a-col>

      <!-- 会员来源 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <a-card :loading="loading" class="pie-card" :style="{ padding: '20px 24px 8px' }">
          <div class="pie-source">
            <span class="pie-title">会员来源</span>
            <v-chart :forceFit="true" :height="255" :data="pieData1" :scale="pieScale1">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle1" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-card>
      </a-col>
      <!-- 会员等级 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }" class="pie">
        <a-card :loading="loading" class="pie-card" :style="{ padding: '20px 24px 8px' }">
          <div class="pie-source">
            <span class="pie-title">会员等级</span>
            <v-chart :forceFit="true" :height="255" :data="pieData2" :scale="pieScale2">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle2" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 会员数量 -->
    <a-card :bordered="false" :body-style="{ padding: '20px 0 0 0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <span :class="{ isClicked: dateType === 1 }" @click="getMemberTongJiDate(1)">本日</span>
              <span :class="{ isClicked: dateType === 2 }" @click="getMemberTongJiDate(2)">本月</span>
              <span :class="{ isClicked: dateType === 3 }" @click="getMemberTongJiDate(3)">本年</span>
            </div>
            <a-range-picker @change="handleRangePicker" :style="{ width: '256px' }" />
          </div>

          <a-tab-pane tab="会员数量" key="1">
            <a-row>
              <a-col :span="24">
                <a-card :loading="loadingDate">
                  <v-chart :force-fit="true" :height="308" :data="lineData" :scale="lineScale">
                    <v-tooltip />
                    <v-axis />
                    <v-legend />
                    <v-line position="xitem*sumVal" color="sumType" />
                    <v-point position="xitem*sumVal" color="sumType" :size="4" :v-style="lineStyle" :shape="'circle'" />
                  </v-chart>
                </a-card>
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
import { ChartCard } from '@/antd/components';
import { baseMixin } from '@/store/app-mixin';
const defaultAvatar = require('@/assets/img/user/avatar.png');

//饼图：会员来源+会员等级 + 折线图：会员数量
const DataSet = require('@antv/data-set');

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard
  },
  data() {
    return {
      loading: true,
      loadingDate: true,
      labelConfig: [
        'percent',
        {
          formatter: (val, item) => {
            return val;
          }
        }
      ],
      tongJiData: {},
      //面积图:季度新增
      quarterData: [],
      quarterAreaData: [],
      //饼图：会员来源+会员等级
      // 1.0会员来源
      pieData1: [],
      pieScale1: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%'
        }
      ],
      pieStyle1: {
        stroke: '#000'
      },
      // 2.会员等级
      pieData2: [],
      pieScale2: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%'
        }
      ],
      pieStyle2: {
        stroke: '#000'
      },
      //会员数量:折线图
      jointimeStart: '',
      jointimeEnd: '',
      rangeDate: '',
      dateType: 1,
      lineData: [],
      lineScale: [
        {
          dataKey: 'xitem'
        }
      ],
      lineStyle: { stroke: '#fff', lineWidth: 1 }
    };
  },
  computed: {
    quarterStr() {
      return value => {
        if (value === 1) {
          return ['1月', '2月', '3月'];
        } else if (value === 2) {
          return ['4月', '5月', '6月'];
        } else if (value === 3) {
          return ['7月', '8月', '9月'];
        } else if (value === 4) {
          return ['10月', '11月', '12月'];
        }
      };
    },
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
      this.loading = true;
      this.loadingDate = true;
      await this.getLoginUrl();
      await this.getUserInfo();
      await this.getMemberTongJi();
      await this.getMemberTongJiDate(this.dateType);
      this.loading = false;
      this.loadingDate = false;
    },
    getLoginUrl() {
      return api.getLoginUrl().then(res => {
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

      return api.getUserInfo(param).then(res => {
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
      return api.getMemberTongJi().then(res => {
        console.log('getMemberTongJi res :>> ', res);
        if (res.code === 200) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.tongJiData, key, element);
            }
          }
          console.log('this.tongJiData :>> ', this.tongJiData); //测试
          // --------------------------------------
          //季度新增
          this.quarterData.splice(0, this.quarterData.length);
          res.data.quarterStatisticsVo.forEach(element => {
            this.quarterData.push(element);
          });
          console.log('this.quarterData :>> ', this.quarterData);
          // --------------------------------------
          //会员来源
          const pieSourceData1 = [];
          res.data.memberSourceStatisticsVos.forEach(element => {
            let temp = {};
            temp.item = element.memberSourceName;
            temp.count = element.memberCount;
            pieSourceData1.push(temp);
          });
          const dv1 = new DataSet.View().source(pieSourceData1);
          dv1.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
          });
          this.pieData1.splice(0, this.pieData1.length);
          dv1.rows.forEach(element => {
            this.pieData1.push(element);
          });
          console.log('pieData1 :>> ', this.pieData1);
          // --------------------------------------
          //会员等级
          const pieSourceData2 = [];
          res.data.memberLevelStatisticsVos.forEach(element => {
            let temp = {};
            temp.item = element.memberLevelName;
            temp.count = element.memberCount;
            pieSourceData2.push(temp);
          });
          const dv2 = new DataSet.View().source(pieSourceData2);
          dv2.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
          });
          this.pieData2.splice(0, this.pieData2.length);
          dv2.rows.forEach(element => {
            this.pieData2.push(element);
          });
          console.log('pieData2 :>> ', this.pieData2);
          // --------------------------------------
        }
      });
    },

    handleRangePicker(dateVal) {
      this.dateType = 4;
      console.log('handleRangePicker val :>> ', dateVal);
      this.jointimeStart = moment(dateVal[0]).format('YYYY-MM-DD');
      this.jointimeEnd = moment(dateVal[1]).format('YYYY-MM-DD');
      this.getMemberTongJiDate(this.dateType);
    },
    getMemberTongJiDate(dateTypeParam) {
      this.loadingDate = true;
      this.dateType = dateTypeParam; //存dateType
      console.log('getMemberTongJiDate this.dateType :>> ', this.dateType);
      if (dateTypeParam === 4) {
        console.log('rangeDate :>> ', this.rangeDate);
      }
      const param = {
        type: this.dateType,
        createTimeStart: this.jointimeStart,
        createTimeEnd: this.jointimeEnd
      };

      console.log('getMemberTongJiDate param :>> ', param);

      return api
        .getMemberTongJiDate(param)
        .then(res => {
          console.log('getMemberTongJiDate res :>> ', res);
          this.loadingDate = false;
          if (res.code === 200) {
            if (this.dateType === 3) {
              const lineSourceData = [];
              res.data.forEach(element => {
                let temp = {};
                temp['总数量'] = element.monthSum;
                temp['新增数量'] = element.monthNewNum;
                temp.xitem = element.monthNum;
                lineSourceData.push(temp);
              });
              console.log('lineSourceData :>> ', lineSourceData);

              const lineDv = new DataSet.View().source(lineSourceData);
              lineDv.transform({
                type: 'fold',
                fields: ['总数量', '新增数量'],
                key: 'sumType',
                value: 'sumVal'
              });

              this.lineData.splice(0, this.lineData.length);
              lineDv.rows.forEach(element => {
                this.lineData.push(element);
              });
              console.log('lineData :>> ', this.lineData);
            } else if (this.dateType === 1) {
              const lineSourceData = [];
              res.data.forEach(element => {
                let temp = {};
                temp['总数量'] = element.hourSum;
                temp['新增数量'] = element.hourNewNum;
                temp.xitem = element.hourNum + ':00';
                lineSourceData.push(temp);
              });
              console.log('lineSourceData :>> ', lineSourceData);
              const lineDv = new DataSet.View().source(lineSourceData);
              lineDv.transform({
                type: 'fold',
                fields: ['总数量', '新增数量'],
                key: 'sumType',
                value: 'sumVal'
              });
              this.lineData.splice(0, this.lineData.length);
              lineDv.rows.forEach(element => {
                this.lineData.push(element);
              });
              console.log('lineData :>> ', this.lineData);
            } else if (this.dateType === 2) {
              const lineSourceData = [];
              res.data.forEach(element => {
                let temp = {};
                temp['总数量'] = element.daySum;
                temp['新增数量'] = element.dayNewNum;
                temp.xitem = element.dayNum;
                lineSourceData.push(temp);
              });
              console.log('lineSourceData :>> ', lineSourceData);

              const lineDv = new DataSet.View().source(lineSourceData);
              lineDv.transform({
                type: 'fold',
                fields: ['总数量', '新增数量'],
                key: 'sumType',
                value: 'sumVal'
              });

              this.lineData.splice(0, this.lineData.length);
              lineDv.rows.forEach(element => {
                this.lineData.push(element);
              });
              console.log('lineData :>> ', this.lineData);
            } else if (this.dateType === 4) {
              const lineSourceData = [];
              res.data.forEach(element => {
                let temp = {};
                temp['总数量'] = element.daySum;
                temp['新增数量'] = element.dayNewNum;
                temp.xitem = element.dayNum;
                lineSourceData.push(temp);
              });
              console.log('lineSourceData :>> ', lineSourceData);

              const lineDv = new DataSet.View().source(lineSourceData);
              lineDv.transform({
                type: 'fold',
                fields: ['总数量', '新增数量'],
                key: 'sumType',
                value: 'sumVal'
              });

              this.lineData.splice(0, this.lineData.length);
              lineDv.rows.forEach(element => {
                this.lineData.push(element);
              });
              console.log('lineData :>> ', this.lineData);
            }
          }
        })
        .finally(() => {
          this.loadingDate = false;
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
  },
  watch: {
    quarterData: {
      handler(newVal) {
        this.quarterAreaData.splice(0, this.quarterAreaData.length);
        for (let i = 0; i < newVal.length; i++) {
          this.quarterAreaData.push({
            日期: newVal[i].date,
            数量: newVal[i].memberCount
          });
        }
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 ownerList 对象的属性值的变化
    }
  }
};
</script>

<style lang="less" scoped>
.member-dashboard {
  background: #f0f2f5 !important;
  background-color: #f0f2f5 !important;
}

::v-deep .ant-row {
  padding-bottom: 20px;
  .ant-card {
    height: 250px !important;
  }
  .pie-card .ant-card-body {
    padding: 0 !important;
  }
  .ant-card-bordered {
    border: none;
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
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: center;
  }
}

.isClicked {
  color: blue;
}

.antv-chart-mini {
  position: relative;
  width: 100%;

  .chart-wrapper {
    position: absolute;
    bottom: -28px;
    width: 100%;
  }
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    span {
      display: inline-block;
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
