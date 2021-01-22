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
                    <div class="column-left">{{ couponDetails.couponTitle || '物业抵扣券' }}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券副标题 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券副标题:</div>
                    <div class="column-left">{{ couponDetails.couponSubhead || '收费系统使用' }}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券类型/代金券金额  -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券类型:</div>
                    <div class="column-left">{{ couponDetails.couponType || '代金券' }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">代金券金额:</div>
                    <div class="column-left">{{ couponDetails.voucherAmount || 100 }}元</div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券类型:</div>
                    <div class="column-left">{{ couponDetails.couponType || '满减券' }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">代金券金额:</div>
                    <div class="column-left">
                      满{{ couponDetails.satisfyAmount || 1000 }}元抵扣{{
                        couponDetails.fullReductionDiscountAmount || 1000
                      }}元
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券类型:</div>
                    <div class="column-left">{{ couponDetails.couponType || '折扣券' }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">代金券金额:</div>
                    <div class="column-left">
                      满{{ couponDetails.satisfyAmount || 1000 }}元{{ couponDetails.discountRatio || 98 }}折最高抵扣{{
                        couponDetails.discountMaxDeduction || 1000
                      }}元
                    </div>
                  </div>
                </div>
              </div>
              <!-- 有效期类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期类型:</div>
                    <div class="column-left">{{ couponDetails.validityType || '固定有效期' }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">选择日期:</div>
                    <div class="column-left">
                      {{ couponDetails.validityStartTime || '2015-10-02 22:00:00' }}~{{
                        couponDetails.validityEndTime || '2015-10-10 23:00:00'
                      }}
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期类型:</div>
                    <div class="column-left">{{ couponDetails.validityType || '相对有效期' }}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">有效期:</div>
                    <div class="column-left">
                      {{ couponDetails.validityDayNums || 100 }}天, 领取后{{
                        couponDetails.takeEffectDayNums || 3
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
                    <div class="column-left">{{ couponDetails.source || '邻里邦Pro'}}</div>
                  </div>
                </div>
              </div>
              <!-- 卡券业务类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">{{ couponDetails.couponBusinessType || '物业费'}}</div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">{{ couponDetails.couponBusinessType || '购物券'}}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">{{ couponDetails.couponBusinessType || '购物券'}}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">{{ couponDetails.couponBusinessType || '购物券'}}</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 成本价 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">成本价:</div>
                    <div class="column-left">{{ couponDetails.cost || 50}}元</div>
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
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券创建:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ couponDetails.createTime || '2020-10-10 23:00:00' }}</div>
                      <div>{{ couponDetails.createOperator || '望望 13900000001' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券启用:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ couponDetails.onTime || '2020-10-10 23:00:00' }}</div>
                      <div>{{ couponDetails.onOperator || '望望 13900000001' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券禁用:</div>
                    <div class="column-left">
                      <div style="padding-right:20px">{{ couponDetails.offTime || '2020-10-10 23:00:00' }}</div>
                      <div>{{ couponDetails.offOperator || '望望 13900000001' }}</div>
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
  name: 'memberInfoDetail',
  components: {},
  data() {
    return {
      memoBackup: '1.请在有效期内使用;\n2.只能在指定商铺使用;',
      couponDetails: {}
    };
  },
  computed: {
    couponDetailsMemo() {
      return this.couponDetails.memo ? this.couponDetails.memo : this.memoBackup;
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
    }
  },
  methods: {
    ...mapActions(['FALLBACK']),
    getCouponDetail() {
      const param = {
        couponId: this.$route.query.id
      };
      console.log('getCouponDetail param :>> ', param);
      api.getCouponDetail(param).then(res => {
        console.log('getCouponDetail res :>> ', res);
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
  watch: {
    // bangdouAddRemark: {
    //   handler(newVal) {
    //     if (newVal) {
    //       this.bangdouAddRemarkNull = false;
    //     }
    //   },
    //   immediate: true //刷新加载 立马触发一次handler
    // }
  }
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
