<template>
  <div class="member-dashboard">
    <a-row :gutter="24">
      <!-- 今日新增 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <chart-card
          class="today-new"
          :loading="loading1"
          title="今日新增数量 (人)"
          :total="`${numFormat(todayNewNum.todayNewNum)}人`"
        >
          <template slot="footer">
            会员总数量:
            <span style="padding-left:10px;">{{ todayNewNum.sum | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>

      <!-- 季度新增 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <chart-card
          class="quarter-new"
          :loading="loading2"
          title="季度新增数量 (人)"
          :total="quarterNewNum | NumberFormat"
        >
          <div>
            <div class="antv-chart-mini">
              <div class="chart-wrapper" :style="{ height: 46 }">
                <v-chart :force-fit="true" height="120" :data="quarterAreaData" :padding="[36, 0, 18, 0]">
                  <v-tooltip />
                  <v-smooth-area color="#517EFD" position="日期*数量" />
                </v-chart>
              </div>
            </div>
          </div>
          <template slot="footer">
            <div class="quarter-footer">
              <div class="quarter-footer-item" v-for="(item, index) in quarterStr(quarter)" :key="index">
                {{ item }}
              </div>
            </div>
          </template>
        </chart-card>
      </a-col>

      <!-- 会员来源 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }">
        <a-card :loading="loading3" class="pie-card" :style="{ padding: '20px 24px 8px' }">
          <div class="pie-source">
            <span class="pie-title">会员来源</span>
            <v-chart
              :padding="['30', '24', 'auto', '24']"
              :forceFit="true"
              :height="200"
              :data="pieData1"
              :scale="pieScale1"
            >
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" :color="pieItem1" :v-style="pieStyle1" :label="labelConfig1" />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-card>
      </a-col>
      <!-- 会员等级 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '0px' }" class="pie">
        <a-card :loading="loading4" class="pie-card" :style="{ padding: '20px 24px 8px' }">
          <div class="pie-source">
            <span class="pie-title">会员等级</span>
            <v-chart
              :padding="['30', '24', 'auto', '24']"
              :forceFit="true"
              :height="223"
              :data="pieData2"
              :scale="pieScale2"
            >
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" :color="pieItem2" :v-style="pieStyle2" :label="labelConfig2" />
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
              <span style="cursor: pointer;" :class="{ isClicked: dateType === 1 }" @click="getMemberTongJiDate(1)">
                本日
              </span>
              <span style="cursor: pointer;" :class="{ isClicked: dateType === 2 }" @click="getMemberTongJiDate(2)">
                本月
              </span>
              <span style="cursor: pointer;" :class="{ isClicked: dateType === 3 }" @click="getMemberTongJiDate(3)">
                本年
              </span>
            </div>
            <a-range-picker
              :placeholder="['开始时间', '结束时间']"
              format="YYYY-MM-DD"
              :value="rangePickerValue"
              @change="handleRangePicker"
              :style="{ width: '256px' }"
            />
          </div>

          <a-tab-pane tab="会员数量" key="1">
            <a-row>
              <a-col :span="24">
                <a-card :loading="loadingDate">
                  <v-chart
                    :force-fit="true"
                    :height="lineHeight"
                    :data="lineData"
                    :scale="lineScale"
                    :padding="['auto', '50', 'auto', 'auto']"
                  >
                    <v-tooltip />
                    <v-axis />
                    <v-legend />
                    <v-line position="xitem*sumVal" color="sumType" />
                    <v-point
                      v-if="dateType === 1 || dateType === 2 || dateType === 3 || (dateType === 4 && dayRange <= 31)"
                      position="xitem*sumVal"
                      color="sumType"
                      :size="4"
                      :v-style="lineStyle"
                      :shape="'circle'"
                    />
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
      rangePickerValue: [],
      lastRangePickerValue: [],
      pieItem1: ['item', ['#84ACFF', '#8BF5CA', '#9EB2D6']],
      pieItem2: ['item', ['#84ACFF', '#8BF5CA', '#EAEEF4', '#FFD36F', '#FF9081']],
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loadingDate: true,
      labelConfig1: [
        'count',
        // 'percent',
        {
          formatter: (val, item) => {
            return val;
          }
        }
      ],
      labelConfig2: [
        'count',
        // 'percent',
        {
          formatter: (val, item) => {
            return val;
          }
        }
      ],
      todayNewNum: {}, //今日新增
      //面积图:季度新增
      quarterNewNum: '',
      quarter: '',
      quarterData: [],
      quarterAreaData: [],
      //饼图：会员来源+会员等级
      // 1.0会员来源
      pieData1: [],
      pieScale1: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: function(text, item) {
            return parseFloat(text * 100).toFixed(6) + '%';
          }
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
          formatter: function(text, item) {
            return parseFloat(text * 100).toFixed(6) + '%';
          }
        }
      ],
      pieStyle2: {
        stroke: '#000'
      },
      //会员数量:折线图
      clientHeight: document.documentElement.clientHeight,
      lineHeight: 308,
      jointimeStart: '',
      jointimeEnd: '',
      dayRange: '',
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
      await this.getLoginUrl();
      await this.getUserInfo();
      this.getQuarterNewNum();
      this.getTodayNewNum();
      this.getMemberSource();
      this.getMemberLevel();
      this.getMemberTongJiDate(this.dateType);
    },

    getLoginUrl() {
      // this.$store.commit('menu/changeMenuStatus', true); //禁止menu
      return api
        .getLoginUrl()
        .finally(() => {
          //测试异步用
          // setTimeout(() => {
          //   console.log('beforeEach store :>> ', this.$store);
          //   console.log('beforeEach setTimeout...');
          //   this.$store.commit('menu/changeMenuStatus', false); //解禁menu
          // }, 3000);
          // this.$store.commit('menu/changeMenuStatus', false); //解禁menu
        })
        .then(res => {
          console.log('beforeEach getLoginUrl res :>> ', res);
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
    //获取会员统计:今日新增
    getTodayNewNum() {
      this.loading1 = true;
      return api
        .getTodayNewNum()
        .finally(() => {
          this.loading1 = false;
        })
        .then(res => {
          console.log('getTodayNewNum res :>> ', res);

          if (res.code === 200) {
            for (const key in res.data) {
              if (Object.hasOwnProperty.call(res.data, key)) {
                const element = res.data[key];
                this.$set(this.todayNewNum, key, element);
              }
            }
            console.log('this.todayNewNum :>> ', this.todayNewNum); //测试
          }
        });
    },
    //获取会员统计:季度新增
    getQuarterNewNum() {
      this.loading2 = true;
      return api
        .getQuarterNewNum()
        .finally(() => {
          this.loading2 = false;
        })
        .then(res => {
          console.log('getQuarterNewNum res :>> ', res);

          if (res.code === 200) {
            //季度新增
            this.quarter = res.data.quarter;
            this.quarterNewNum = res.data.quarterNewNum;
            this.quarterData.splice(0, this.quarterData.length);
            res.data.quarterStatisticsVo.forEach(element => {
              this.quarterData.push(element);
            });
            console.log('this.quarterData :>> ', this.quarterData);
          }
        });
    },
    //获取会员统计:会员来源
    getMemberSource() {
      this.loading3 = true;
      return api
        .getMemberSource()
        .finally(() => {
          this.loading3 = false;
        })
        .then(res => {
          console.log('getMemberSource res :>> ', res);

          if (res.code === 200) {
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
              if (element.count !== 0) {
                this.pieData1.push(element);
              }
            });
            console.log('pieData1 :>> ', this.pieData1);
          }
        });
    },
    //获取会员统计:会员等级
    getMemberLevel() {
      this.loading4 = true;
      return api
        .getMemberLevel()
        .finally(() => {
          this.loading4 = false;
        })
        .then(res => {
          console.log('getMemberLevel res :>> ', res);

          if (res.code === 200) {
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
              if (element.count !== 0) {
                this.pieData2.push(element);
              }
            });
            console.log('pieData2 :>> ', this.pieData2);
          }
        });
    },
    handleRangePicker(dates, dateStrings) {
      console.log('handleRangePicker dates :>> ', dates);
      console.log('handleRangePicker dateStrings :>> ', dateStrings);
      this.dateType = 4;
      this.rangePickerValue = dates;

      this.jointimeStart = dateStrings[0];
      this.jointimeEnd = dateStrings[1];
      this.dayRange = moment(dateStrings[1]).diff(moment(dateStrings[0]), 'day'); //相差天数
      console.log('相差天数 handleRangePicker dayRange :>> ', this.dayRange);
      if (this.dayRange > 90) {
        this.$warning({
          title: '提示',
          content: '日期选择范围不能超过90天'
        });
        this.rangePickerValue = this.lastRangePickerValue;
      } else {
        this.lastRangePickerValue = dates;
        this.getMemberTongJiDate(this.dateType);
      }
    },
    getMemberTongJiDate(dateTypeParam) {
      this.loadingDate = true;
      this.dateType = dateTypeParam; //存dateType
      if (this.dateType === 1 || this.dateType === 2 || this.dateType === 3) {
        this.rangePickerValue = [];
      }
      console.log('getMemberTongJiDate this.dateType :>> ', this.dateType);
      const param = {
        type: this.dateType,
        createTimeStart: this.jointimeStart,
        createTimeEnd: this.jointimeEnd
      };

      console.log('getMemberTongJiDate param :>> ', param);

      return api
        .getMemberTongJiDate(param)
        .finally(() => {
          this.loadingDate = false;
        })
        .then(res => {
          console.log('getMemberTongJiDate res :>> ', res);
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
  mounted() {
    window.onresize = () => {
      this.clientHeight = document.documentElement.clientHeight;
    };
  },
  watch: {
    clientHeight: {
      handler(newVal) {
        let tempVal = newVal - 492;
        if (tempVal < 308) {
          this.lineHeight = 308;
        } else {
          this.lineHeight = newVal - 492;
        }
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 ownerList 对象的属性值的变化
    },
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
  height: 100%;
  background: #f0f2f5 !important;
  background-color: #f0f2f5 !important;

  .today-new {
    ::v-deep .chart-card-footer {
      margin-top: 9px !important;
      border-top: 1px solid #eee;
      .field {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .quarter-new {
    ::v-deep .quarter-footer .quarter-footer-item {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
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

  .salesCard {
    ::v-deep .ant-row {
      padding-bottom: 0;
    }
    ::v-deep .ant-card {
      height: auto !important;

      .ant-card-body {
        min-height: 284px;
        padding: 0 24px;

        .ant-card-loading-content {
          min-height: 284px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: stretch;
        }
      }
    }

    ::v-deep .ant-card-bordered {
      border: none !important;
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
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
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
    color: #4b7afb;
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
