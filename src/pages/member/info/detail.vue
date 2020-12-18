<template>
  <div id="member-info-detail">
    <div class="content-header">
      会员详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding-bottom:10px;height:100%;">
        <!-- 基础信息 -->
        <div class="member-base">
          <div class="base-title">
            <div class="base-title-content">基础信息</div>
          </div>
          <a-row class="base-row" style="padding:16px;border-bottom: 1px dashed #ccc;">
            <a-col :span="16">
              <div class="base-left">
                <div class="base-left-top">
                  <div class="left-top-left">
                    <a-avatar
                      class="base-avatar"
                      :size="48"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  </div>
                  <div class="left-top-right">
                    <div>会员ID:{{ memberId }}</div>
                    <div v-html="`会员手机号:+${memberDetails.phoneAreaCode} ${memberDetails.phone}`"></div>
                  </div>
                </div>
                <div class="base-left-middle">
                  <div class="left-middle-item">昵称: {{ memberDetails.memberName }}</div>
                  <div class="left-middle-item">姓名: {{ memberDetails.memberName }}</div>
                  <div class="left-middle-item">性别: {{ sexStr(memberDetails.sex) }}</div>
                  <div class="left-middle-item">证件类型: {{ cardTypeStr(memberDetails.cardType) }}</div>
                  <div class="left-middle-item">证件号: {{ memberDetails.cardNo }}</div>
                  <div class="left-middle-item" v-html="`生日: ${moment(memberDetails.birthday).format('YYYY-MM-DD')}`">
                    {
                  </div>
                  <div
                    class="left-middle-item"
                    v-html="`加入时间: ${moment(memberDetails.createTime).format('YYYY-MM-DD')}`"
                  ></div>
                  <div class="left-middle-item">邮箱: {{ memberDetails.email }}</div>
                </div>
                <div class="base-left-bottom">
                  <div class="left-bottom-left" style="padding-right:5px;">接入来源:</div>
                  <div class="left-bottom-right">
                    <div v-for="item in memberDetails.memberSources" :key="item.id">
                      {{ item.sourceName }} {{ moment(memberDetails.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="base-right">
                <div class="right-item">邦豆</div>
                <div class="right-item right-item-middle">{{ memberDetails.integral }}</div>
                <div class="right-item right-item-bottom">
                  <div class="right-item-bottom-left">邦豆充值</div>
                  <div class="right-item-bottom-right">邦豆抵扣</div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 会员卡信息 -->
        <div class="member-card">
          <div class="card-title">
            <div class="card-title-content">会员卡信息</div>
          </div>
          <a-row style="padding:16px;border-bottom: 1px dashed #ccc;">
            <a-col :span="24">
              <div class="card-row" v-for="item in memberDetails.memberCardRelats" :key="item.id">
                <div class="card-row-left">
                  <img
                    class="card-avatar"
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    alt=""
                  />
                </div>
                <div class="card-row-center">
                  <div class="card-row-center-item">会员卡名称:{{ item.memberCardName }}</div>
                  <div class="card-row-center-item">
                    获取时间:{{ moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </div>
                <div class="card-row-right">
                  <div class="card-row-right-item">会员等级:{{ item.levelName }}</div>
                  <div class="card-row-right-item">
                    <mini-progress
                      color="rgb(19, 194, 194)"
                      :hasTarget="false"
                      :percentage="(item.grow / item.rangeEnd) * 100"
                      height="8px"
                    />
                  </div>
                  <div class="card-row-right-item card-row-right-item-range">{{ item.grow }}/{{ item.rangeEnd }}</div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 会员记录 -->
        <div class="member-record">
          <a-row style="margin-top: 20px">
            <a-tabs type="card" @change="tabChangeCallback">
              <a-tab-pane class="tabs-body-content" key="1" tab="会员积分记录">
                <div class="content-main" ref="content_main" style="padding: 20px;">
                  <FormList ref="memberForm1" rowCol="2" :formList="formList1" :onSubmit="onQuery1" />
                  <a-table
                    :columns="integralColumns"
                    :data-source="integralDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="integralTotal"
                    :show-total="integralTotal => `共 ${integralTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="integralCurrent"
                    :page-size.sync="integralPageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingIntegral"
                    @showSizeChange="pagingIntegral"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="2" tab="会员成长值记录">
                <div class="content-main" ref="content_main" style="padding: 20px;">
                  <FormList ref="memberForm2" rowCol="2" :formList="formList2" :onSubmit="onQuery2" />
                  <a-table
                    :columns="grownColumns"
                    :data-source="grownDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="grownTotal"
                    :show-total="grownTotal => `共 ${grownTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="grownCurrent"
                    :page-size.sync="grownPageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingGrown"
                    @showSizeChange="pagingGrown"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="3" tab="会员行为记录">
                <div class="content-main" ref="content_main" style="padding: 20px;">
                  <FormList ref="memberForm3" rowCol="2" :formList="formList3" :onSubmit="onQuery3" />
                  <a-table
                    :columns="behaviourColumns"
                    :data-source="behaviourDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="behaviourTotal"
                    :show-total="behaviourTotal => `共 ${behaviourTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="behaviourCurrent"
                    :page-size.sync="behaviourPageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingBehaviour"
                    @showSizeChange="pagingBehaviour"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
import { MiniProgress } from '@/antd/components';
import FormList from '@/components/FormList/index.jsx';

import { mapActions } from 'vuex';
const defaultAvatar = require('@/assets/img/user/avatar.png');
import { CARD_TYPE_MAP } from '@/constance';
// console.log('CARD_TYPE_MAP :>> ', CARD_TYPE_MAP);

// import mock from './mock';
// console.log('mock :>> ', mock);

//页面列表数据
const allColumns = {
  integralColumns: [
    {
      title: '来源',
      key: 'sourceType',
      dataIndex: 'sourceType'
    },
    {
      title: '积分变动',
      dataIndex: 'integralChange',
      key: 'integralChange'
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    },
    {
      title: '操作人',
      dataIndex: 'createUser',
      key: 'createUser'
    },
    {
      title: '记录时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    }
  ],
  grownColumns: [
    {
      title: '成长值变动',
      key: 'growthChange',
      dataIndex: 'growthChange'
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    },
    {
      title: '记录时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    }
  ],
  behaviourColumns: [
    {
      title: '行为名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '行为类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '行为来源',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: '记录时间',
      key: 'id',
      dataIndex: 'id'
    }
  ]
};
export default {
  name: 'memberInfoDetail',
  components: {
    MiniProgress,
    FormList
  },
  data() {
    return {
      memberId: '',
      memberDetails: {},
      //表格高度,与每页大小通用
      scrollY: 100,
      tableLoading: false,
      formList1: [
        {
          label: '加入时间',
          type: 'rangePicker',
          name: 'jointime1'
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      formList2: [
        {
          label: '加入时间',
          type: 'rangePicker',
          name: 'jointime2'
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      formList3: [
        {
          label: '加入时间',
          type: 'rangePicker',
          name: 'jointime3'
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      //积分记录
      integralColumns: allColumns.integralColumns,
      integralDataSource: [],
      integralTotal: 0,
      integralCurrent: 1,
      integralPageSize: 10,
      //成长值记录
      grownColumns: allColumns.grownColumns,
      grownDataSource: [],
      grownTotal: 0,
      grownCurrent: 1,
      grownPageSize: 10,
      //行为记录
      behaviourColumns: allColumns.behaviourColumns,
      behaviourDataSource: [],
      behaviourTotal: 0,
      behaviourCurrent: 1,
      behaviourPageSize: 10
    };
  },
  computed: {
    cardTypeStr() {
      return param => {
        let str = '';
        if (Object.keys(CARD_TYPE_MAP).includes(param)) {
          str = CARD_TYPE_MAP[param];
        }
        return str;
      };
    },
    sexStr() {
      return param => {
        let str = '';
        if (param === 1) {
          str = '男';
        } else if (param === 2) {
          str = '女';
        } else {
          str = '未知';
        }
        return str;
      };
    }
  },
  methods: {
    moment,
    ...mapActions(['FALLBACK']),
    tabChangeCallback(key) {
      if (key == 1) {
        this.getIntegralRecord();
      } else if (key == 2) {
        this.getGrownLog();
      } else if (key == 3) {
        this.getBehaviourList();
      }
    },
    //查询按钮
    onQuery1() {
      this.current = 1;
      this.getIntegralRecord();
    },
    onQuery2() {
      this.current = 1;
      this.getGrownLog();
    },
    onQuery3() {
      this.current = 1;
      this.getBehaviourList();
    },
    getMemberDetail() {
      const param = {
        memberId: this.memberId
      };

      // //mock操作
      // for (const key in mock.data) {
      //   if (Object.hasOwnProperty.call(mock.data, key)) {
      //     const element = mock.data[key];
      //     this.$set(this.memberDetails, key, element);
      //   }
      // }

      api.getMemberDetail(param).then(res => {
        console.log('getMemberDetail res :>> ', res);
        if (res.code === 200) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.memberDetails, key, element);
            }
          }
          console.log('this.memberDetails :>> ', this.memberDetails);
        }
      });
    },

    getIntegralRecord() {
      this.tableLoading = true;
      let jointimeStart = '';
      let jointimeEnd = '';
      this.$nextTick(() => {
        if (this.$refs.memberForm1.getFieldsValue().jointime1) {
          jointimeStart = moment(this.$refs.memberForm1.getFieldsValue().jointime1[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.memberForm1.getFieldsValue().jointime1[1]).format('YYYY-MM-DD');
        }

        const param = {
          memberId: this.memberId,
          pageIndex: this.integralCurrent,
          pageSize: this.integralPageSize,
          createTimeStart: jointimeStart,
          createTimeEnd: jointimeEnd
        };

        console.log('getIntegralRecord param :>> ', param);

        api
          .getIntegralRecord(param)
          .then(res => {
            console.log('getIntegralRecord res :>> ', res);
            this.tableLoading = false;
            if (res.code === 200) {
              this.integralTotal = res.data.total;
              this.integralDataSource.splice(0, this.integralDataSource.length);
              res.data.records.forEach((element, index) => {
                this.integralDataSource.push(element);
              });

              console.log('this.integralDataSource :>> ', this.integralDataSource);
            }
          })
          .finally(() => {
            this.tableLoading = false;
          });
      });
    },

    getGrownLog() {
      this.tableLoading = true;
      let jointimeStart = '';
      let jointimeEnd = '';
      this.$nextTick(() => {
        if (this.$refs.memberForm2.getFieldsValue().jointime2) {
          jointimeStart = moment(this.$refs.memberForm2.getFieldsValue().jointime2[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.memberForm2.getFieldsValue().jointime2[1]).format('YYYY-MM-DD');
        }

        const param = {
          memberId: this.memberId,
          pageIndex: this.grownCurrent,
          pageSize: this.grownPageSize,
          createTimeStart: jointimeStart,
          createTimeEnd: jointimeEnd
        };

        console.log('getGrownLog param :>> ', param);

        api
          .getGrownLog(param)
          .then(res => {
            console.log('getGrownLog res :>> ', res);
            this.tableLoading = false;
            if (res.code === 200) {
              this.grownTotal = res.data.total;
              this.grownDataSource.splice(0, this.grownDataSource.length);
              res.data.records.forEach((element, index) => {
                this.grownDataSource.push(element);
              });
            }
          })
          .finally(() => {
            this.tableLoading = false;
          });
      });
    },
    getBehaviourList() {
      this.tableLoading = true;
      let jointimeStart = '';
      let jointimeEnd = '';

      this.$nextTick(() => {
        if (this.$refs.memberForm3.getFieldsValue().jointime3) {
          jointimeStart = moment(this.$refs.memberForm3.getFieldsValue().jointime3[0]).format('YYYY-MM-DD');
          jointimeEnd = moment(this.$refs.memberForm3.getFieldsValue().jointime3[1]).format('YYYY-MM-DD');
        }
        const param = {
          memberId: this.memberId,
          pageIndex: this.behaviourCurrent,
          pageSize: this.behaviourPageSize,
          createTimeStart: jointimeStart,
          createTimeEnd: jointimeEnd
        };
        console.log('getBehaviourList param :>> ', param);

        api
          .getBehaviourList(param)
          .then(res => {
            console.log('getBehaviourList res :>> ', res);
            this.tableLoading = false;
            if (res.code === 200) {
              this.behaviourTotal = res.data.total;
              this.behaviourDataSource.splice(0, this.behaviourDataSource.length);
              res.data.records.forEach((element, index) => {
                this.behaviourDataSource.push(element);
              });
            }
          })
          .finally(() => {
            this.tableLoading = false;
          });
      });
    },

    //积分分页
    pagingIntegral(current, pageSize) {
      console.log(current, pageSize);
      this.integralPageSize = pageSize;
      this.integralCurrent = current;
      this.getIntegralRecord();
    },
    //成长值分页
    pagingGrown(current, pageSize) {
      this.grownPageSize = pageSize;
      this.grownCurrent = current;
      this.getGrownLog();
    },
    //行为分页
    pagingBehaviour(current, pageSize) {
      this.behaviourPageSize = pageSize;
      this.behaviourCurrent = current;
      this.getBehaviourList();
    }
  },
  created: function() {
    console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    this.memberId = JSON.parse(window.sessionStorage.routerParams).id;
    this.getMemberDetail();
  },
  mounted() {
    this.getIntegralRecord();
    this.getGrownLog();
    this.getBehaviourList();

    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 204 + 'px';
    }, 100);
  }
};
</script>

<style lang="less" scoped>
#member-info-detail {
  .member-base {
    .base-title {
      color: #666;
      padding: 5px 0 0 26px;
      .base-title-content {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        padding-left: 8px;
        border-left: 3px solid rgba(33, 33, 206, 0.5);
      }
    }
    .base-row {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .base-left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .base-left-top {
          width: 100%;
          padding: 10px;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          // .left-top-left{}
          // .left-top-right{}
        }
        .base-left-middle {
          width: calc(100% -32px);
          margin-left: 32px;
          color: #666;
          padding: 10px 10px 0 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;

          .left-middle-item {
            width: calc(100% / 3);
            margin-bottom: 10px;
          }
        }
        .base-left-bottom {
          width: calc(100% -32px);
          margin-left: 32px;
          color: #666;
          padding: 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }

      .base-right {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .right-item {
          margin-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }

        .right-item-middle {
          padding: 2px 4px;
          background: lightblue;
          font-size: 20px;
          font-weight: bold;
        }
        .right-item-bottom {
          .right-item-bottom-left {
            padding: 2px 4px;
            margin-right: 20px;
            background: skyblue;
          }
          .right-item-bottom-right {
            padding: 2px 4px;
            border: 1px solid skyblue;
          }
        }
      }
    }
  }

  .member-card {
    .card-title {
      color: #666;
      padding: 5px 0 0 26px;
      .card-title-content {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        padding-left: 8px;
        border-left: 3px solid rgba(33, 33, 206, 0.5);
      }
    }
    .card-row {
      padding-left: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;

      .card-row-left {
        margin-right: 45px;
        background-color: lightblue;
        width: 200px;
        height: 150px;

        .card-avatar {
          display: block;
          width: 200px;
          height: 150px;
        }
      }
      .card-row-center {
        margin-right: 45px;
        // background-color: #ccc;
        width: 200px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        .card-row-center-item {
          margin-bottom: 8px;
        }
      }
      .card-row-right {
        // background-color: #ccc;
        width: 200px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        .card-row-right-item {
          margin-bottom: 8px;
        }
        .card-row-right-item-range {
          color: rgb(98, 98, 238);
          font-size: 18px;
        }
      }
    }
    .card-row:last-child {
      margin-bottom: 0;
    }
  }

  .member-record {
  }

  .ant-tabs-bar {
    margin: 0 !important;
  }

  .fallback {
    cursor: pointer;
  }

  .icon-body {
    margin-top: 10px;
    display: flex;
    font-size: 16px;
    font-weight: 500;
  }

  .micro-unable {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../../../assets/img/micro/Icon_unable.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }

  .micro-enable {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../../../assets/img/micro/Icon_enable.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }
}
</style>
