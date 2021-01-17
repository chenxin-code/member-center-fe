<template>
  <div id="coupons-detail">
    <div class="content-header">
      卡券查看
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="content-main">
      <a-row style="height: 100%">
        <!-- 卡券基础信息 -->
        <div class="coupons-common coupons-base">
          <div class="common-title">
            <div class="common-title-content">卡券基础信息</div>
          </div>
          <a-row class="common-row" style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="24">
              <div class="common-single-column">
                <div class="single-column-right">卡券标题:</div>
                <div class="single-column-left">物业抵扣券</div>
              </div>
              <div class="common-single-column">
                <div class="single-column-right">卡券标题:</div>
                <div class="single-column-left">物业抵扣券</div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- 卡券发放信息 -->
        <div class="coupons-common coupons-release">
          <div class="common-title">
            <div class="common-title-content">卡券发放信息</div>
          </div>
          <a-row class="common-row" style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="24"></a-col>
          </a-row>
        </div>

        <!-- 卡券记录信息 -->
        <div class="coupons-common coupons-record">
          <div class="common-title">
            <div class="common-title-content">卡券记录信息</div>
          </div>
          <a-row class="common-row" style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="24"></a-col>
          </a-row>
        </div>

        <!-- 卡券数据 -->
        <div class="coupons-common coupons-data">
          <div class="common-title">
            <div class="common-title-content">卡券数据</div>
          </div>
          <a-row class="common-row" style="padding: 16px; border-bottom: 1px dashed #ccc">
            <a-col :span="24"></a-col>
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
// console.log('CARD_TYPE_MAP :>> ', CARD_TYPE_MAP);

export default {
  name: 'memberInfoDetail',
  components: {},
  data() {
    return {
      memberId: '',
      memberDetails: {}
    };
  },
  computed: {
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
    getMemberDetail() {
      const param = {
        memberId: this.memberId
      };

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

      this.$nextTick(() => {
        const param = {
          memberId: 2,
          pageIndex: 1,
          pageSize: 10
        };

        console.log('getIntegralRecord param :>> ', param);

        api
          .getIntegralRecord(param)
          .finally(() => {
            this.tableLoading = false;
          })
          .then(res => {
            console.log('getIntegralRecord res :>> ', res);
            if (res.code === 200) {
              //
            }
          });
      });
    }
  },
  created() {
    console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    this.memberId = '2';
    this.getMemberDetail();
    this.getIntegralRecord();
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
  .content-main {
    .coupons-common {
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
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
    }

    .coupons-base {
    }
  }
}
</style>
