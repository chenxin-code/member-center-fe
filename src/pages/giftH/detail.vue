<template>
  <div id="coupons-detail">
    <div class="content-header">
      节日礼包详情
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
                    <div class="column-left"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">派发时间:</div>
                    <div class="column-left"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员来源:</div>
                    <div class="column-left"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员等级:</div>
                    <div class="column-left"></div>
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

export default {
  name: 'giftHDetail',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {
    api.selectGiftBagHolidayId({
      id: this.$route.query.id
    }).then(resp => {
      if (resp.code === 200) {

      }
    });
  },
  mounted() {
  },
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
