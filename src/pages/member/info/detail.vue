<template>
  <div id="member-info-detail">
    <div class="content-header">
      会员详情
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="content-main">
      <a-row style="height: 100%">
        <!-- 基础信息 -->
        <div class="member-base">
          <div class="base-title">
            <div class="base-title-content">基础信息</div>
          </div>
          <a-row class="base-row" style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="16">
              <div class="base-left">
                <div class="base-left-top">
                  <div class="left-top-left">
                    <img class="base-avatar" :src="memberDetails.memberImage" @error="loadAvatarError" />
                  </div>
                  <div class="left-top-right">
                    <div>会员唯一标识:{{ memberDetails.memberCode }}</div>
                    <div v-html="`会员手机号:+${memberDetails.phoneAreaCode || ''} ${memberDetails.phone || ''}`"></div>
                  </div>
                </div>
                <div class="base-left-middle">
                  <div class="left-middle-item">昵称: {{ memberDetails.memberName }}</div>
                  <div class="left-middle-item">姓名: {{ memberDetails.realName || '' }}</div>
                  <div class="left-middle-item">性别: {{ sexStr(memberDetails.sex) }}</div>
                  <div class="left-middle-item">证件类型: {{ cardTypeStr(memberDetails.cardType) }}</div>
                  <div class="left-middle-item">证件号: {{ memberDetails.cardNo }}</div>
                  <div class="left-middle-item">生日: {{ momentStr(memberDetails.birthday) }}</div>
                  <div class="left-middle-item">加入时间: {{ momentStr(memberDetails.createTime) }}</div>
                  <div class="left-middle-item">邮箱: {{ memberDetails.email }}</div>
                </div>
                <div class="base-left-bottom">
                  <div class="left-bottom-left" style="padding-right: 5px">接入来源:</div>
                  <div class="left-bottom-right">
                    <div v-for="item in memberDetails.memberSources" :key="item.id">
                      {{ item.clientName ? item.clientName : '' }} {{ momentStrHms(item.createTime) }}
                      {{ item.type === 1 ? '(创建)' : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="base-right">
                <div class="base-right-inner">
                  <div class="right-item right-item-top">邦豆</div>
                  <div class="right-item right-item-middle">
                    <img class="item-middle-img" :src="bangdouImage" />
                    <span class="item-middle-text">{{ memberIntegral }}</span>
                  </div>
                  <div class="right-item right-item-bottom">
                    <div class="right-item-bottom-left" @click="bangdouHandle(1)">邦豆充值</div>
                    <div class="right-item-bottom-right" @click="bangdouHandle(2)">邦豆抵扣</div>
                  </div>
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
          <a-row style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="24">
              <div class="card-row" v-for="item in memberDetails.memberCardRelats" :key="item.id">
                <div class="card-row-inner">
                  <div class="card-row-left">
                    <img class="card-avatar" :src="item.memberCardImage" @error="loadCardImageError" />
                  </div>
                  <div class="card-row-center">
                    <div class="card-row-center-item">
                      <span class="row-center-item-left">会员卡名称:</span>
                      <span class="row-center-item-right">{{ item.memberCardName }}</span>
                    </div>
                    <div class="card-row-center-item">
                      <span class="row-center-item-left">获取时间:</span>
                      <span class="row-center-item-right">{{ momentStrHms(item.createTime) }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-row-right">
                  <div class="card-row-right-item card-row-right-item-level">
                    <span>会员等级:</span>
                    <span class="row-right-item-level-name">{{ item.levelName }}</span>
                  </div>
                  <div class="card-row-right-item">
                    <mini-progress
                      color="#5C87FB"
                      :hasTarget="false"
                      :percentage="(item.grow / item.rangeEnd) * 100"
                      height="10px"
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
                <div
                  class="content-main-tab"
                  ref="contentMainTab"
                  style="padding: 20px 20px 10px 20px; margin-bottom: 20px"
                >
                  <FormList ref="memberForm1" rowCol="2" :formList="formList1" :onSubmit="onQuery1" />
                  <a-table
                    :columns="integralColumns"
                    :data-source="integralDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width: 100%; margin-top: 8px"
                  >
                    <template slot="integralChangeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="showIntegralChange(rowData)"></span>
                      </div>
                    </template>
                    <template slot="createTimeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="momentStrHms(rowData.createTime)"></span>
                      </div>
                    </template>
                  </a-table>
                  <a-pagination
                    :total="integralTotal"
                    :show-total="integralTotal => `共 ${integralTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="integralCurrent"
                    :page-size.sync="integralPageSize"
                    :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
                    @change="pagingIntegral"
                    @showSizeChange="pagingIntegral"
                    style="margin-top: 30px; width: 100%; text-align: right"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="2" tab="会员成长值记录">
                <div
                  class="content-main-tab"
                  ref="contentMainTab"
                  style="padding: 20px 20px 10px 20px; margin-bottom: 20px"
                >
                  <FormList ref="memberForm2" rowCol="2" :formList="formList2" :onSubmit="onQuery2" />
                  <a-table
                    :columns="grownColumns"
                    :data-source="grownDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width: 100%; margin-top: 8px"
                  >
                    <template slot="growthChangeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="showGrowthChange(rowData)"></span>
                      </div>
                    </template>
                    <template slot="createTimeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="momentStrHms(rowData.createTime)"></span>
                      </div>
                    </template>
                  </a-table>
                  <a-pagination
                    :total="grownTotal"
                    :show-total="grownTotal => `共 ${grownTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="grownCurrent"
                    :page-size.sync="grownPageSize"
                    :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
                    @change="pagingGrown"
                    @showSizeChange="pagingGrown"
                    style="margin-top: 30px; width: 100%; text-align: right"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="3" tab="会员行为记录">
                <div
                  class="content-main-tab"
                  ref="contentMainTab"
                  style="padding: 20px 20px 10px 20px; margin-bottom: 20px"
                >
                  <FormList ref="memberForm3" rowCol="2" :formList="formList3" :onSubmit="onQuery3" />
                  <a-table
                    :columns="behaviourColumns"
                    :data-source="behaviourDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width: 100%; margin-top: 8px"
                  >
                    <template slot="behaviourTypeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="behaviourTypeStr(rowData.behaviourType)"></span>
                      </div>
                    </template>
                    <template slot="createTimeSlot" slot-scope="rowData">
                      <div class="editable-row-operations">
                        <span v-html="momentStrHms(rowData.createTime)"></span>
                      </div>
                    </template>
                  </a-table>
                  <a-pagination
                    :total="behaviourTotal"
                    :show-total="behaviourTotal => `共 ${behaviourTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="behaviourCurrent"
                    :page-size.sync="behaviourPageSize"
                    :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
                    @change="pagingBehaviour"
                    @showSizeChange="pagingBehaviour"
                    style="margin-top: 30px; width: 100%; text-align: right"
                  />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </div>
      </a-row>
    </div>
    <!-- modal对话框 -->
    <a-modal
      :centered="true"
      v-model="visibleBangdou"
      :title="bangdouModalTitle"
      :maskClosable="false"
      on-ok="handleOk"
    >
      <template slot="footer">
        <a-button :disabled="modalLoading" key="back" @click="visibleBangdou = false">取消</a-button>
        <a-button :disabled="modalLoading" key="submit" type="primary" :loading="modalLoading" @click="handleOk">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <div :style="modalInputStyle">
            <div :style="modalInputStyleTop">
              <span style="color: red;">*</span>
              <span>邦豆数量</span>
            </div>
            <a-input-number
              v-model="bangdouAddVal"
              :min="1"
              defaultValue="1"
              style="width: 267px;"
              :style="bangdouAddValNull ? bangdouAddNullStyle1 : ''"
              placeholder="请输入邦豆数量"
            />
          </div>
          <div v-if="bangdouAddValNull" :style="bangdouAddNullStyle2">
            请输入邦豆数量
          </div>
          <div :style="modalInputStyle">
            <div :style="modalInputStyleTop">
              <span style="color: red;">*</span>
              <span>备注</span>
            </div>
            <a-textarea
              v-model="bangdouAddRemark"
              :maxLength="20"
              :auto-size="{ minRows: 1, maxRows: 2 }"
              style="width: 267px;"
              :style="bangdouAddRemarkNull ? bangdouAddNullStyle1 : ''"
              placeholder="请输入备注"
            />
          </div>
          <div v-if="bangdouAddRemarkNull" :style="bangdouAddNullStyle2">
            请输入备注
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
import { MiniProgress } from '@/antd/components';
import FormList from '@/components/FormList/index.jsx';

import { mapActions } from 'vuex';
import { CARD_TYPE_MAP } from '@/constance';
// console.log('CARD_TYPE_MAP :>> ', CARD_TYPE_MAP);

// import mock from './mock';
// console.log('mock :>> ', mock);

const defaultAvatar = require('@/assets/img/member/defaultAvatar.png');
const defaultCardImage = require('@/assets/img/member/defaultAvatar.png');
const bangdouImage = require('@/assets/img/member/bangdou.png');

//页面列表数据
const allColumns = {
  integralColumns: [
    {
      title: '来源',
      dataIndex: 'clientName',
      key: 'clientName'
    },
    {
      title: '积分变动',
      key: 'integralChangeSlot',
      scopedSlots: { customRender: 'integralChangeSlot' }
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    },
    {
      title: '操作人',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '记录时间',
      key: 'createTime',
      scopedSlots: { customRender: 'createTimeSlot' }
    }
  ],
  grownColumns: [
    {
      title: '成长值变动',
      key: 'growthChangeSlot',
      scopedSlots: { customRender: 'growthChangeSlot' }
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    },
    {
      title: '记录时间',
      key: 'createTime',
      scopedSlots: { customRender: 'createTimeSlot' }
    }
  ],
  behaviourColumns: [
    {
      title: '行为名称',
      dataIndex: 'behaviourName',
      key: 'behaviourName'
    },
    {
      title: '行为类型',
      key: 'behaviourTypeSlot',
      scopedSlots: { customRender: 'behaviourTypeSlot' }
    },
    {
      title: '行为来源',
      dataIndex: 'behaviourSource',
      key: 'behaviourSource'
    },
    {
      title: '记录时间',
      key: 'createTimeSlot',
      scopedSlots: { customRender: 'createTimeSlot' }
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
      bangdouAddValNull: false,
      bangdouAddRemarkNull: false,
      memberIntegral: '',
      //bangdou modal:start
      bangdouAddNullStyle1: {
        color: 'red',
        borderColor: 'red'
      },
      bangdouAddNullStyle2: {
        color: 'red',
        borderColor: 'red',
        padding: '5px 0 5px 77px',
        fontSize: '14px',
        lineHeight: '14px'
      },
      modalInputStyle: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-start',
        'align-items': 'center'
      },
      modalInputStyleTop: {
        width: '67px',
        'margin-right': '10px',
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-end',
        'align-items': 'center'
      },
      modalLoading: false,
      bangdouModalTitle: '',
      visibleBangdou: false,
      bangdouModalType: '',
      bangdouAddVal: 1,
      bangdouAddRemark: '',
      //bangdou modal:end
      bangdouImage,
      memberId: '',
      memberDetails: {},
      //表格高度,与每页大小通用
      scrollY: 100,
      tableLoading: false,
      formList1: [
        {
          label: '记录时间',
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
          label: '记录时间',
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
          label: '记录时间',
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
    showGrowthChange() {
      return param => {
        if (param.changeType === 1) {
          return '+' + param.growthChange;
        } else if (param.changeType === 2) {
          return '-' + param.growthChange;
        } else {
          return '';
        }
      };
    },
    showIntegralChange() {
      return param => {
        if (param.changeType === 1) {
          return '+' + param.integralChange;
        } else if (param.changeType === 2) {
          return '-' + param.integralChange;
        } else {
          return '';
        }
      };
    },
    momentStr() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD');
        }
      };
    },
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
      };
    },
    behaviourTypeStr() {
      return param => {
        let str = '';
        if (param === '1') {
          str = '消费';
        } else if (param === '2') {
          str = '其他';
        } else {
          str = '';
        }
        return str;
      };
    },
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
          str = '';
        }
        return str;
      };
    }
  },
  methods: {
    handleOk() {
      if (!this.bangdouAddVal || !this.bangdouAddRemark) {
        if (!this.bangdouAddVal) {
          this.bangdouAddValNull = true;
        }

        if (!this.bangdouAddRemark) {
          this.bangdouAddRemarkNull = true;
        }

        return;
      }

      this.modalLoading = true;

      const param = {
        memberId: this.memberId,
        type: this.bangdouModalType,
        integral: this.bangdouAddVal,
        notes: this.bangdouAddRemark
      };

      console.log('handleOk param :>> ', param);

      api
        .payOrDeductionIntegral(param)
        .finally(() => {
          this.visibleBangdou = false;
          this.modalLoading = false;
        })
        .then(res => {
          console.log('payOrDeductionIntegral res :>> ', res);
          if (res.code === 200) {
            this.memberIntegral = res.data;
          }
        });
    },
    bangdouHandle(type) {
      this.bangdouModalType = ''; //类型
      this.bangdouAddVal = 1; //充值帮豆
      this.bangdouAddRemark = ''; //抵扣帮豆
      this.visibleBangdou = true; //显示对话框
      if (type === 1) {
        this.bangdouModalType = 1;
        this.bangdouModalTitle = '邦豆充值';
      } else if (type === 2) {
        this.bangdouModalType = 2;
        this.bangdouModalTitle = '邦豆扣减';
      }
    },
    loadAvatarError(e) {
      e.target.src = defaultAvatar;
    },
    loadCardImageError(e) {
      e.target.src = defaultCardImage;
    },
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

          this.memberIntegral = this.memberDetails.integral;
          console.log('this.memberDetails :>> ', this.memberDetails);
        }
      });
    },

    getIntegralRecord() {
      this.tableLoading = true;

      this.$nextTick(() => {
        let jointimeStart = '';
        let jointimeEnd = '';
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
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getIntegralRecord res :>> ', res);
            // this.tableLoading = false;
            if (res.code === 200) {
              this.integralTotal = res.data.total;
              this.integralDataSource.splice(0, this.integralDataSource.length);
              res.data.records.forEach((element, index) => {
                this.integralDataSource.push(element);
              });
              console.log('this.integralDataSource :>> ', this.integralDataSource);
            }
          });
      });
    },

    getGrownLog() {
      this.tableLoading = true;

      this.$nextTick(() => {
        let jointimeStart = '';
        let jointimeEnd = '';
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
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getGrownLog res :>> ', res);
            // this.tableLoading = false;
            if (res.code === 200) {
              this.grownTotal = res.data.total;
              this.grownDataSource.splice(0, this.grownDataSource.length);
              res.data.records.forEach((element, index) => {
                this.grownDataSource.push(element);
              });
            }
          });
      });
    },
    getBehaviourList() {
      this.tableLoading = true;

      this.$nextTick(() => {
        let jointimeStart = '';
        let jointimeEnd = '';
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
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getBehaviourList res :>> ', res);
            // this.tableLoading = false;
            if (res.code === 200) {
              this.behaviourTotal = res.data.total;
              this.behaviourDataSource.splice(0, this.behaviourDataSource.length);
              res.data.records.forEach((element, index) => {
                this.behaviourDataSource.push(element);
              });
            }
          });
      });
    },

    //积分分页
    pagingIntegral(current, pageSize) {
      console.log('积分分页 pagingIntegral: ', current, pageSize);
      this.integralPageSize = pageSize;
      this.integralCurrent = current;
      this.getIntegralRecord();
    },
    //成长值分页
    pagingGrown(current, pageSize) {
      console.log('成长值分页 pagingGrown: ', current, pageSize);
      this.grownPageSize = pageSize;
      this.grownCurrent = current;
      this.getGrownLog();
    },
    //行为分页
    pagingBehaviour(current, pageSize) {
      console.log('行为分页 pagingBehaviour: ', current, pageSize);
      this.behaviourPageSize = pageSize;
      this.behaviourCurrent = current;
      this.getBehaviourList();
    }
  },
  created() {
    console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    this.memberId = JSON.parse(window.sessionStorage.routerParams).id;
    this.getMemberDetail();
  },
  mounted() {
    this.getIntegralRecord();
    // this.getGrownLog();
    // this.getBehaviourList();

    const timer1 = setTimeout(() => {
      this.scrollY = this.$refs.contentMainTab.offsetHeight;
    }, 0);
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(timer1);
    });
  },
  watch: {
    visibleBangdou: {
      handler(newVal) {
        if (!newVal) {
          this.bangdouAddValNull = false;
          this.bangdouAddRemarkNull = false;
        }
      },
      immediate: true //刷新加载 立马触发一次handler
    }
  }
};
</script>

<style lang="less" scoped>
#member-info-detail {
  height: 100%;
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
          padding: 10px 10px 10px 20px;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .left-top-left {
            width: 60px;
            height: 60px;
            .base-avatar {
              display: block;
              width: 60px;
              height: 60px;
              border-radius: 50%;
            }
          }
          .left-top-right {
            padding-left: 34px;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #121212;
          }
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
        justify-content: center;
        align-items: center;

        .base-right-inner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          width: 173px;
          height: 143px;
          background: #fafbff;
          border: 1px solid #e9e9e9;

          .right-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }

          .right-item-top {
            padding: 2px 4px;
            height: 26px;
            font-size: 20px;
            font-family: MicrosoftYaHei;
            color: #121212;
            line-height: 26px;
          }

          .right-item-middle {
            .item-middle-img {
              width: 30px;
              height: 30px;
              padding-right: 3px;
            }
            .item-middle-text {
              font-size: 20px;
              font-family: MicrosoftYaHei;
              color: #121212;
            }
          }

          .right-item-bottom {
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #4b7afb;

            .right-item-bottom-left {
              margin-right: 10px;
              padding: 6px 8px;
              border-radius: 2px;
              border: 1px solid #5380fb;
              cursor: pointer;
            }
            .right-item-bottom-right {
              padding: 6px 8px;
              border-radius: 2px;
              border: 1px solid #5380fb;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .member-card {
    height: 172px;
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
      height: 118px;
      padding-left: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;

      .card-row-inner {
        flex: 2;
        height: 118px;
        padding-left: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;

        .card-row-left {
          margin-right: 45px;
          width: 200px;
          height: 118px;

          .card-avatar {
            display: block;
            width: 200px;
            height: 118px;
          }
        }
        .card-row-center {
          margin-right: 245px;
          // background-color: #ccc;
          height: 118px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          .card-row-center-item {
            margin-bottom: 20px;

            .row-center-item-left {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .row-center-item-right {
              padding-left: 10px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
            }
          }
        }
      }

      .card-row-right {
        flex: 1;
        height: 118px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        .card-row-right-item {
          text-align: center;
          width: 277px;
          margin-bottom: 8px;
        }

        .card-row-right-item-level {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;

          .row-right-item-level-name {
            padding-left: 10px;
            color: #5d88fb;
          }
        }
        .card-row-right-item-range {
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5d88fb;
        }
      }
    }

    .card-row:last-child {
      margin-bottom: 0;
    }
  }

  .member-record {
    .content-main-tab {
      background: #fff;

      ::v-deep .ant-btn {
        width: 88px !important;
      }
    }
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
