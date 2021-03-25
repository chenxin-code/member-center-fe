<template>
  <div id="act-detail">
    <div class="content-header">
      查看活动
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="act-main">
      <a-row style="height: 100%">
        <!-- 活动基础信息 -->
        <div class="act-common act-base">
          <div class="common-title">
            <div class="common-title-content">活动基础信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <!-- 活动主题名称 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">活动主题名称:</div>
                    <div class="column-left">{{ actDetails.themeName || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 活动名称 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">活动名称:</div>
                    <div class="column-left">{{ actDetails.activityName || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 活动有效期 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">活动有效期:</div>
                    <div class="column-left">
                      {{ momentStr(actDetails.startTime) }} ~
                      {{ momentStr(actDetails.endTime) }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- 备注 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item column-memo">
                    <div class="column-right">活动描述:</div>
                    <div class="column-left">
                      <div class="column-left">
                        <a-textarea
                          v-model="actDetailsMemo"
                          :disabled="true"
                          :maxLength="200"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          style="width: 267px;"
                          placeholder="请输入备注"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 活动类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">活动类型:</div>
                    <div class="column-left">{{ actDetails.typeName || '' }}</div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- 活动配置信息 -->
        <div class="act-common act-config">
          <div class="common-title">
            <div class="common-title-content">活动配置信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <!-- 每月活动日包含 -->
              <div class="common-column-wrapp" v-show="actDetails.monthlyDay">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">每月活动日包含:</div>
                    <div class="column-left">{{ actDetails.monthlyDay || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 每周活动日包含 -->
              <div class="common-column-wrapp" v-show="actDetails.weeklyDay">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">每周活动日包含:</div>
                    <div class="column-left">{{ weeklyDayStr(actDetails.weeklyDay) || '' }}</div>
                  </div>
                </div>
              </div>
              <!-- 会员权益类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员权益类型:</div>

                    <div class="column-left">{{ rightsTypeStr(actDetails.rightsType) }}</div>
                  </div>
                </div>
              </div>
              <!-- scopeType 是否指定 0 不指定 1 指定 -->
              <!-- 会员卡及等级包含 -->
              <div class="common-column-wrapp" v-show="actDetails.scopeType === 0">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员卡及等级包含:</div>
                    <div class="column-left">
                      {{ cardLevelRangeStr(actDetails.startLevelId, actDetails.endLevelId) }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- 指定会员 -->
              <div class="common-column-wrapp" v-show="actDetails.scopeType === 1">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">指定会员:</div>
                    <div class="column-left">
                      <a-button @click="getDownloadInfo">
                        <a-icon type="download" />
                        下载会员信息
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- 活动奖品信息 -->
        <div class="act-common act-award">
          <div class="common-title">
            <div class="common-title-content">活动奖品信息</div>
          </div>
          <a-row
            class="common-row"
            :class="`common-row-${index}`"
            v-for="(item, index) in actDetails.activityAwards"
            :key="index"
          >
            <a-col :span="24">
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券ID:</div>
                    <div class="column-left">
                      {{ item.couponId || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">发放数量:</div>
                    <div class="column-left">
                      {{ item.issuedCount || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="item.integrealCount">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">邦豆兑换值:</div>
                    <div class="column-left">
                      {{ item.integrealCount || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">每人{{ claimExchangeStr(item.condition) }}限制:</div>
                    <div class="column-left">
                      {{ item.perPersonLimit || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">每日{{ claimExchangeStr(item.condition) }}限制:</div>
                    <div class="column-left">
                      {{ item.perDayLimit || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">每人每日{{ claimExchangeStr(item.condition) }}限制:</div>
                    <div class="column-left">
                      {{ item.perPersonDayLimit || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="item.monthGetDay">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">月可领取天:</div>
                    <div class="column-left">
                      {{ item.monthGetDay || '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="item.weekGetDay">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">周可领取天:</div>
                    <div class="column-left">
                      {{ item.weekGetDay || '' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="common-column-wrapp" v-if="item.startTime && item.expirationTime">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券有效期:</div>
                    <div class="column-left">
                      {{ momentStrHms(item.startTime) }} ~
                      {{ momentStrHms(item.expirationTime) }}
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
import axios from 'axios';
import { mapActions } from 'vuex';
import { CARD_TYPE_MAP } from '@/constance';

export default {
  name: 'couponsManageDetail',
  components: {},
  data() {
    return {
      weekStrs: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      actDetails: {}
    };
  },
  computed: {
    actDetailsMemo() {
      return this.actDetails.memo ? this.actDetails.memo : '';
    },
    claimExchangeStr() {
      return param => {
        if (param === 1) {
          return '领取';
        } else if (param === 3) {
          return '兑换';
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
    },
    rightsTypeStr() {
      return param => {
        if (param === 1) {
          return '会员卡券';
        } else {
          return '';
        }
      };
    },
    cardLevelStr() {
      return param => {
        if (param === 1) {
          return '邻里会员V1';
        } else if (param === 2) {
          return '邻里会员V2';
        } else if (param === 3) {
          return '邻里会员V3';
        } else if (param === 4) {
          return '邻里会员V4';
        } else if (param === 5) {
          return '邻里会员V5';
        } else {
          return '';
        }
      };
    },
    cardLevelRangeStr() {
      return (startParam, endParam) => {
        if (startParam === endParam) {
          return this.cardLevelStr(startParam);
          // return `${this.cardLevelStr(startParam)} ～ ${this.cardLevelStr(endParam)}`;
        } else {
          return `${this.cardLevelStr(startParam)} ～ ${this.cardLevelStr(endParam)}`;
        }
      };
    },

    weeklyDayStr() {
      return param => {
        console.log('param :>> ', param);
        if (!param) {
          return '';
        }
        let tempStr = '';
        param.split(',').forEach(element => {
          tempStr += this.weekStrs[parseInt(element) - 1] + '，';
        });
        tempStr = tempStr.substring(0, tempStr.length - 1);
        return tempStr;
      };
    }
  },
  methods: {
    ...mapActions(['FALLBACK']),

    downloadFile(event) {
      this.$refs.downloadFileDom.click();
    },
    // 下载会员信息
    getDownloadInfo() {
      const args = {
        activityId: this.$route.query.id
      };
      // console.log('getDownloadInfo args :>> ', args);
      // return;
      axios({
        method: 'get',
        params: args,
        url: '/times/member-center/activity/api/v1/activity-member/download',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'blob'
      }).then(res => {
        console.log('getDownloadInfo res.data :>> ', res.data);
        // return;
        this.handleDownload(res.data);
      });
    },
    handleDownload(content) {
      const filename = '会员信息.xlsx';
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      var blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
      console.log('blob :>> ', blob);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      URL.revokeObjectURL(eleLink.href);
      // 然后移除
      document.body.removeChild(eleLink);
    },
    getActDetail() {
      const param = {
        activityId: this.$route.query.id
      };

      console.log('getActDetail param :>> ', param);

      api.getActDetail(param).then(res => {
        console.log('getActDetail res :>> ', res);
        if (res.code === 200) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.actDetails, key, element);
            }
          }
          // this.actDetails.activityAwards = this.actDetails.activityAwards.concat(
          //   this.actDetails.activityAwards
          // );
          console.log('this.actDetails :>> ', this.actDetails);
        }
      });
    }
  },
  created() {
    console.log('this.$route :>> ', this.$route);
    // this.getActDownload();
    this.getActDetail();
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="less" scoped>
#act-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }
  .act-main {
    height: calc(100% - 50px);
    overflow-y: auto;
    .act-common {
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
        padding: 30px 16px 0;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        .common-column-wrapp {
          margin-bottom: 20px;
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
                width: 180px;
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

            .column-memo {
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

    .act-award {
      padding-bottom: 20px;

      .common-row {
        .common-column-wrapp {
          margin-bottom: 20px !important;
        }
      }
    }
  }
}
</style>
