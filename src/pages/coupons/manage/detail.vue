<template>
  <div id="coupons-detail">
    <div class="content-header">
      卡券查看
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%">
        <!-- 卡券基础信息 -->
        <div class="coupons-common coupons-base">
          <div class="common-title">
            <div class="common-title-content">卡券基础信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <!-- 卡券标题 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券标题:</div>
                    <div class="column-left">{{ couponDetails.couponTitle || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券副标题 -->
              <div class="common-column-wrapp" v-show="couponDetails.couponSubhead">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券副标题:</div>
                    <div class="column-left">{{ couponDetails.couponSubhead || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券类型/代金券金额  -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券类型:</div>
                    <div class="column-left">{{ couponTypeStr(couponDetails.couponType) }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">代金券金额:</div>
                    <div class="column-left" v-show="couponDetails.couponType === 10">
                      {{ couponDetails.voucherAmount || '' }}元
                    </div>
                    <div class="column-left" v-show="couponDetails.couponType === 20">
                      满{{ couponDetails.satisfyAmount || '' }}元抵扣{{ couponDetails.voucherAmount || '' }}元
                    </div>
                    <div class="column-left" v-show="couponDetails.couponType === 40">
                      满{{ couponDetails.satisfyAmount || '' }}元{{
                        couponDetails.discountRatio * 10 || ''
                      }}折最高抵扣{{ couponDetails.discountMaxDeduction || '' }}元
                    </div>
                  </div>
                </div>
              </div>
              <!-- 有效期类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期类型:</div>
                    <div class="column-left">{{ validityTypeStr(couponDetails.validityType) }}</div>
                  </div>

                  <div class="column-item" v-show="couponDetails.validityType === 1">
                    <div class="column-right">选择日期:</div>
                    <div class="column-left">
                      {{ momentStrHms(couponDetails.validityStartTime) }} ~
                      {{ momentStrHms(couponDetails.validityEndTime) }}
                    </div>
                  </div>
                  <div class="column-item" v-show="couponDetails.validityType === 3">
                    <div class="column-right">有效期:</div>
                    <div class="column-left">
                      {{ couponDetails.validityDayNums || '' }}天, 领取后{{
                        couponDetails.takeEffectDayNums || ''
                      }}天生效
                    </div>
                  </div>
                </div>
              </div>
              <!-- 卡券来源 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券来源:</div>
                    <div class="column-left">{{ sourceStr(couponDetails.source) }}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券业务类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">{{ couponBusinessTypeStr(couponDetails.couponBusinessType) }}</div>
                  </div>
                  <div v-if="couponDetails.couponBusinessType === '4005'">
                    <div class="column-item">
                      <div class="column-right">分类:</div>
                      <div class="column-left">{{ classificationStr(couponDetails.classification) }}</div>
                    </div>
                    <div class="column-item">
                      <div class="column-right">平台抵扣券类型:</div>
                      <div class="column-left">{{ couponTypeStr(couponDetails.couponType) }}</div>
                    </div>
                    <div class="column-item">
                      <div class="column-right">优惠券封面:</div>
                      <div class="column-left">
                        <div class="column-left-image">
                          <img :src="couponDetails.couponImage.replace(/\s+/g, '')" width="85" height="85" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 成本价 -->
              <div class="common-column-wrapp" v-show="couponDetails.cost">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">成本价:</div>
                    <div class="column-left">{{ couponDetails.cost || '' }}元</div>
                  </div>
                </div>
              </div>
              <!-- 使用说明 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">使用说明:</div>
                    <div class="column-left">
                      <a-textarea
                        v-model="couponDetailsMemo"
                        :disabled="true"
                        :maxLength="50"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        style="width: 267px;"
                        placeholder="请输入备注"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- 卡券记录信息 -->
        <div class="coupons-common coupons-record">
          <div class="common-title">
            <div class="common-title-content">卡券记录信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <div
                class="common-column-wrapp"
                v-show="momentStrHms(couponDetails.createTime) && couponDetails.createOperator"
              >
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券创建:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ momentStrHms(couponDetails.createTime) || '' }}</div>
                      <div>{{ couponDetails.createOperator || '' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-show="momentStrHms(couponDetails.onTime) && couponDetails.onOperator">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券启用:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ momentStrHms(couponDetails.onTime) || '' }}</div>
                      <div>{{ couponDetails.onOperator || '' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="common-column-wrapp"
                v-show="momentStrHms(couponDetails.offTime) && couponDetails.offOperator"
              >
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券禁用:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ momentStrHms(couponDetails.offTime) || '' }}</div>
                      <div>{{ couponDetails.offOperator || '' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api';
import { mapActions } from 'vuex';
import { CARD_TYPE_MAP } from '@/constance';

export default {
  name: 'couponsManageDetail',
  components: {},
  data() {
    return {
      couponDetails: {}
    };
  },
  computed: {
    couponDetailsMemo() {
      return this.couponDetails.memo ? this.couponDetails.memo : '';
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
    cardTypeStr() {
      return param => {
        let str = '';
        if (Object.keys(CARD_TYPE_MAP).includes(param)) {
          str = CARD_TYPE_MAP[param];
        }
        return str;
      };
    },
    couponTypeStr() {
      return param => {
        if (param === 10) {
          return '代金券';
        } else if (param === 20) {
          return '满减券';
        } else if (param === 40) {
          return '折扣券';
        } else {
          return '';
        }
      };
    },
    validityTypeStr() {
      return param => {
        if (param === 1) {
          return '固定有效期';
        } else if (param === 3) {
          return '相对有效期';
        } else {
          return '';
        }
      };
    },
    sourceStr() {
      return param => {
        if (param === '10' || param === 10) {
          return '地产';
        } else if (param === '20' || param === 20) {
          return '邻里邦';
        } else if (param === '30' || param === 30) {
          return '邻里商城';
        } else if (param === '40' || param === 40) {
          return '会员中心';
        } else if (param === '50' || param === 50) {
          return '收费中心';
        } else {
          return '';
        }
      };
    },
    couponBusinessTypeStr() {
      return param => {
        if (param === '4014') {
          return '物业费';
        } else if (param === '4005') {
          return '购物券';
        } else {
          return '';
        }
      };
    },
    classificationStr() {
      return param => {
        if (param === 1) {
          return '全部';
        } else if (param === 2) {
          return '零售';
        } else {
          return '';
        }
      };
    }
  },
  methods: {
    ...mapActions(['FALLBACK']),
    getCouponDetail() {
      let param = {};
      let apiString = '';
      if (Object.keys(this.$route.query)[0] === 'id') {
        param = {
          couponId: this.$route.query.id
        };
        apiString = 'getCouponDetail';
      }
      if (Object.keys(this.$route.query)[0] === 'code') {
        param = {
          couTypeCode: this.$route.query.code
        };
        apiString = 'getCouponDetailByCode';
      }

      console.log('getCouponDetail param :>> ', param);

      api[apiString](param).then(res => {
        console.log('getCouponDetail res :>> ', res);

        // //////////////////mock/////////////////
        // // const res = { data: {}, code: 200 };
        // res.data = {
        //   // pcRuleId:136994,//没用
        //   couponTitle: '卡券标题',
        //   couponSubhead: '卡副券标题',
        //   // couponType: 10,//开关
        //   couponType: 40,
        //   voucherAmount: '100',
        //   satisfyAmount: '200',
        //   fullReductionDiscountAmount: '100',
        //   discountMaxDeduction: '150',
        //   discountRatio: '0.7',
        //   // validityType: 1,//开关
        //   validityType: 3,
        //   validityStartTime: '2021-01-11',
        //   validityEndTime: '2020-01-22',
        //   validityDayNums: 30,
        //   takeEffectDayNums: 3,
        //   // source: '10',//开关
        //   source: '30',
        //   // couponBusinessType: '4014',//开关
        //   couponBusinessType: '4005',
        //   // classification: 1,//开关
        //   classification: 2,
        //   commercialTenants: '123456',
        //   merchandises: '123456',
        //   couponImage:
        //     'https://hystxt-oss.oss-cn-shenzhen.aliyuncs.com/oss-frontend/sys-member-center/4402197751161_lalala.png',
        //   cost: '666',
        //   memo: 'memo memo memo 999',
        //   createTime: '2020-10-10 23:00:00',
        //   createOperator: '望望 13900000001',
        //   onTime: '2020-10-10 23:00:00',
        //   onOperator: '望望 13900000001',
        //   offTime: '2020-10-10 23:00:00',
        //   offOperator: '望望 13900000001'
        // };
        // //////////////////mock/////////////////

        if (res.code === 200) {
          console.log('res.data :>> ', res.data);
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.couponDetails, key, element);
            }
          }
          console.log('this.couponDetails :>> ', this.couponDetails);
        }
      });
    }
  },
  created() {
    console.log('this.$route :>> ', this.$route);
    this.getCouponDetail();
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="less" scoped>
#coupons-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }
  .coupons-main {
    height: calc(100% - 50px);
    overflow-y: auto;
    .coupons-common {
      background-color: #fff;
      .common-title {
        color: #666;
        padding: 20px 0 0 30px;
        .common-title-content {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          padding-left: 8px;
          border-left: 3px solid rgba(33, 33, 206, 0.5);
        }
      }
      .common-row {
        padding: 20px 16px 0;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        .common-column-wrapp {
          // padding-left: 80px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          .common-column {
            padding-right: 50px;
            .column-item {
              padding-bottom: 10px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;

              .column-right {
                width: 132.25px;
                padding-right: 5px;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
              }
              .column-left {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;

                .column-left-image {
                  margin-left: 10px;
                  width: 103px;
                  height: 103px;
                  border: 1px dashed #ccc;
                  border-radius: 8px;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                }

                .ant-input-disabled {
                  background-color: #fff;
                  width: 500px !important;
                  color: #2c3e50;
                }
              }
            }
            .column-item:last-child {
              padding-bottom: 0;
            }
          }
        }

        .common-column-wrapp:last-child {
          margin-bottom: 0;
        }
      }

      .common-row:last-child {
        border: none;
      }
    }

    // .coupons-base {
    // }
    .coupons-record {
      padding-bottom: 100px;
    }
  }
}
</style>
