<template>
  <div id="coupons-detail">
    <div class="content-header">
      礼包详情
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%">
        <div class="coupons-common coupons-base">
          <a-row class="common-row">
            <a-col :span="24">
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">礼包名称:</div>
                    <div class="column-left">{{name}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">礼包状态:</div>
                    <div class="column-left">{{statusStr}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期:</div>
                    <div class="column-left">{{startTime}} ~ {{endTime}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">礼包描述:</div>
                    <div class="column-left">{{memo}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">礼包背景:</div>
                    <div class="column-left">
                      <img :src="couponImage.replace(/\s+/g, '')" width="85" height="85" alt="" v-if="couponImage" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">内容列表:</div>
                    <div>
                      <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :pagination="false"
                        :loading="tableLoading"
                        :rowKey="(r, i) => i"
                        :scroll="{ x: 1000, y: 400 }"
                      >
                        <template slot="activitySlot" slot-scope="scope">
                          <div class="editable-row-operations">
                            <span v-html="activityStr(scope.couponBusinessType)"></span>
                          </div>
                        </template>
                        <template slot="faceAmountSlot" slot-scope="scope">
                          <div class="editable-row-operations">
                            <span v-html="faceAmountStr2(scope)"></span>
                          </div>
                        </template>
                        <template slot="validitySlot" slot-scope="scope">
                          <div class="editable-row-operations">
                            <span v-html="parseValidity(scope)"></span>
                          </div>
                        </template>
                      </a-table>
                      <a-pagination
                        :total="total"
                        :show-total="total => `共 ${total} 条`"
                        show-quick-jumper
                        show-size-changer
                        :current="current"
                        :pageSize="pageSize"
                        :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
                        @change="change"
                        @showSizeChange="showSizeChange"
                        style="margin-top: 30px;width: 100%;text-align: right;"/>
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
import api from './../../api';
import {activityList, typeList} from "../coupons/release/createForms";
export default {
  name: 'giftDetail',
  components: {},
  data() {
    return {
      name: null,
      memo: null,
      statusStr: null,
      couponImage: null,
      startTime: '',
      endTime: '',
      columns: [
        {
          dataIndex: 'id',
          key: 'id',
          title: '卡券ID'
        },
        {
          title: '卡券标题',
          key: 'couponTitle',
          dataIndex: 'couponTitle'
        },
        {
            title: '卡券副标题',
            key: 'couponSubhead',
            dataIndex: 'couponSubhead'
        },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券业务类型',
          key: 'activitySlot',
          scopedSlots: { customRender: 'activitySlot' }
        },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' }
        },
        {
          title: '卡券有效期',
          scopedSlots: { customRender: 'validitySlot' },
          key: 'validitySlot'
        }
      ],
      tableData: [],
      tableLoading: false,
      //分页
      total: 0,
      current: 1,
      pageSize: 10
    };
  },
  computed: {
    parseValidity() {
      return param => {
        if (param.validityType === 1) {
          //固定有效期
          return this.momentStrHms(param.validityStartTime) + ' ~ ' + this.momentStrHms(param.validityEndTime);
        } else if (param.validityType === 3) {
          //相对有效期
          return '相对有效期: ' + param.validityDayNums + '天，领取后' + param.takeEffectDayNums + '天生效';
        } else {
          return '';
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
    activityStr() {
      return param => {
        if(param === '4014'){
          return '物业费';
        }else if(param === '4005'){
          return '购物券';
        }else if(param === '4015'){
          return '实物券';
        }else{
          return '';
        }
      };
    },
    faceAmountStr2() {
      return param => {
        if (param.couponType === 10) {
          return param.voucherAmount;
        } else if (param.couponType === 20) {
          return param.fullReductionDiscountAmount;
        } else if (param.couponType === 40) {
          return param.discountRatio * 10 + '折';
        } else {
          return '';
        }
      };
    },
  },
  methods: {
    //判断日期格式为yyyy-mm-dd和正确的日期
    isDateString(str) {
      const reg = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      if (str === '' || str === undefined || str === null) return false;
      return reg.test(str);
    },
    change(page) {
      this.current = page;
      this.getList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      this.$nextTick(() => {
        return api.selectCoupon({
          giftBagId: this.$route.query.id,
          pageIndex: this.current,
          pageSize: this.pageSize
        }).then(resp => {
          if (resp.code === 200) {
            this.total = resp.data.total;
            this.tableData.splice(0, this.tableData.length);
            resp.data.records.forEach((v, k) => {
              this.tableData.push(v);
            });
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      });
    }
  },
  created() {
    api.selectGiftBag({
      id: this.$route.query.id
    }).then(resp => {
      if (resp.code === 200) {
        this.id = resp.data.id;
        this.name = resp.data.name;
        this.memo = resp.data.memo;
        this.statusStr = Number(resp.data.status)?'启用':'禁用';
        this.couponImage = resp.data.picture;
        this.startTime = this.isDateString(this.momentStrHms(resp.data.startTime)) ? this.momentStrHms(resp.data.startTime) : '';
        this.endTime = this.isDateString(this.momentStrHms(resp.data.endTime)) ? this.momentStrHms(resp.data.endTime) : '';
      }
    });
    this.getList();
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
                padding-right: 10px;
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
