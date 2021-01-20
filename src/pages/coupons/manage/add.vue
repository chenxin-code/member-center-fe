<template>
  <div id="coupons-detail">
    <div class="content-header">
      卡券创建
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
                    <div class="column-left">
                      <a-input placeholder="请输入卡券标题" allow-clear v-model="couponTitle" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 卡券副标题 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券副标题:</div>
                    <div class="column-left">
                      <a-input placeholder="请输入卡券标题" allow-clear v-model="couponSubhead" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 卡券类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券类型:</div>
                    <div class="column-left">
                      <a-select :default-value="couponTypes[0].code" style="width: 120px" @change="couponTypeSelect">
                        <a-select-option :value="item.code" v-for="(item, index) in couponTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>couponType:{{ couponType }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 代金券金额 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">代金券金额:</div>
                    <div class="column-left">
                      <a-input placeholder="请输入代金券金额" allow-clear v-model="voucherAmount" />
                      <div>{{ voucherAmount }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期类型:</div>
                    <div class="column-left">
                      <a-select
                        :default-value="validityTypes[0].code"
                        style="width: 120px"
                        @change="validityTypeSelect"
                      >
                        <a-select-option :value="item.code" v-for="(item, index) in validityTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>validityType:{{ validityType }}</div>
                    </div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">有效期:</div>
                    <div class="column-left">
                      {{ couponDetails.validityDayNums }}天, 领取后{{ couponDetails.takeEffectDayNums }}天生效
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券来源:</div>
                    <div class="column-left">我是卡券来源</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">物业费</div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">购物券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item column-cover">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">购物券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item column-cover">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">购物券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">分类:</div>
                    <div class="column-left">平台抵扣券</div>
                  </div>
                  <div class="column-item">
                    <div class="column-right">平台抵扣券类型:</div>
                    <div class="column-left">全部</div>
                  </div>
                  <div class="column-item column-cover">
                    <div class="column-right">优惠券封面:</div>
                    <div class="column-left">
                      <img src="../../../assets/img/member/lalala.png" width="75" height="70" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">成本价:</div>
                    <div class="column-left">{{ couponDetails.cost }}元</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item column-textarea">
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
      couponDetails: {},
      couponTitle: '',
      couponSubhead: '',
      couponType: 10,
      couponTypes: [
        { name: '代金券', code: 10 },
        { name: '满减券', code: 20 },
        { name: '折扣券', code: 30 }
      ],
      voucherAmount: '',
      validityType: 10,
      validityTypes: [
        { name: '固定有效期', code: 10 },
        { name: '相对有效期', code: 20 }
      ]
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
    couponTypeSelect(value) {
      console.log('couponTypeSelect');
      this.couponType = value;
    },
    validityTypeSelect(value) {
      console.log('validityTypeSelect');
      this.validityType = value;
    },
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
        padding: 5px 0 0 26px;
        .common-title-content {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          padding-left: 8px;
          border-left: 3px solid rgba(33, 33, 206, 0.5);
        }
      }
      .common-row {
        padding: 16px;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        .common-column-wrapp {
          padding-left: 80px;
          margin-bottom: 20px;
          // background-color: #eee;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          .common-column {
            padding-right: 50px;
            .column-item {
              padding-bottom: 20px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;

              .column-right {
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

                ::v-deep .ant-input {
                  width: 430px;
                  height: 30px;
                }

                ::v-deep .ant-input-disabled {
                  background-color: #fff;
                  width: 500px !important;
                  color: #2c3e50;
                }

                ::v-deep .ant-select {
                  width: 430px !important;
                  height: 30px;
                }
              }
            }
            .column-item:last-child {
              padding-bottom: 0;
            }

            .column-item.column-textarea {
              padding-bottom: 20px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;
            }

            .column-item.column-cover {
              padding-bottom: 20px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;
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

    .coupons-base {
      padding-bottom: 100px;
    }
  }
}
</style>
