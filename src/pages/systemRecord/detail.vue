<template>
  <div id="act-detail">
    <div class="content-header">
      日志详情
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <div class="act-main">
      <a-row style="height: 100%">
        <div class="act-common act-base">
          <div class="common-title">
            <div class="common-title-content">基础信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员ID:</div>
                    <div class="column-left">{{ memberId }}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">会员手机号:</div>
                    <div class="column-left">{{ memberPhone }}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">记录时间:</div>
                    <div class="column-left" v-html="momentStrHms(date)"></div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="act-common act-award">
          <div class="common-title">
            <div class="common-title-content">异常信息</div>
          </div>
          <a-row class="common-row">
            <a-col :span="24">
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">异常类型:</div>
                    <div class="column-left" v-html="behaviorParse(behavior)"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 2">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">优惠券ID:</div>
                    <div class="column-left"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 0">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">邦豆数量:</div>
                    <div class="column-left">{{ num }}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-else-if="behavior === 1">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">成长值数量:</div>
                    <div class="column-left">{{ num }}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-else-if="behavior === 2">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">发放数量:</div>
                    <div class="column-left">{{ num }}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 3">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">修改前的手机号:</div>
                    <div class="column-left">{{memberPhone}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 3">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">修改后的手机号:</div>
                    <div class="column-left">{{changePhone}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 3">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">冲突手机号:</div>
                    <div class="column-left">{{reusePhone}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">异常说明:</div>
                    <div class="column-left" v-html="memo"></div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 0 && !isSolution">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right"></div>
                    <a-button type="primary" @click="bdff()">邦豆发放</a-button>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 1 && !isSolution">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right"></div>
                    <a-button type="primary" @click="czzff()">成长值发放</a-button>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp" v-if="behavior === 2 && !isSolution">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right"></div>
                    <a-button type="primary" @click="pfcyhq()">派发此优惠券</a-button>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-row>
    </div>
    <a-modal
      :centered="true"
      v-model="visibleBangdou"
      title="邦豆充值"
      :maskClosable="false"
      on-ok="bdczGo">
      <template slot="footer">
        <a-button :disabled="modalLoading" key="back" @click="visibleBangdou = false">取消</a-button>
        <a-button :disabled="modalLoading" key="submit" type="primary" :loading="modalLoading" @click="bdczGo">
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
              :max="100000"
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
          <div :style="modalInputStyle">
            <div :style="modalInputStyleTop">
              <span style="color: red;">*</span>
              <span>描述</span>
            </div>
            <a-textarea
              v-model="bangdouAddDescr"
              :maxLength="20"
              :auto-size="{ minRows: 1, maxRows: 2 }"
              style="width: 267px;"
              :style="bangdouAddDescrNull ? bangdouAddNullStyle1 : ''"
              placeholder="请输入描述"
            />
          </div>
          <div v-if="bangdouAddDescrNull" :style="bangdouAddNullStyle2">
            请输入描述
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import api from './../../api';
import moment from 'moment';
export default {
  name: 'systemRecordDetail',
  components: {},
  data() {
    return {
      memberId: null,
      memberPhone: null,
      changePhone: null,
      reusePhone: null,
      date: null,
      behavior: null,
      num: null,
      memo: null,
      isSolution: null,//是否已解决
      //邦豆发放
      bangdouAddValNull: false,
      bangdouAddRemarkNull: false,
      bangdouAddDescrNull: false,
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
      visibleBangdou: false,
      bangdouAddVal: 1,
      bangdouAddRemark: '',
      bangdouAddDescr: ''
    };
  },
  computed: {
    behaviorParse() {
      return param => {
        if (param === 0) {
          return '邦豆充值异常';
        } else if (param === 1) {
          return '成长值发放异常';
        } else if (param === 2) {
          return '优惠券派发异常';
        } else if (param === 3) {
          return '手机号修改异常';
        } else {
          return '';
        }
      }
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
  },
  methods: {
    systemRecordDetail(){
      api.systemRecordDetail({
        id: this.$route.query.id
      }).then(resp => {
        console.log('日志详情接口--------->', resp);
        if (resp.code === 200) {
          this.memberId = resp.data.memberId;
          this.memberPhone = resp.data.memberPhone;
          this.changePhone = resp.data.changePhone;
          this.reusePhone = resp.data.reusePhone;
          this.date = resp.data.date;
          this.behavior = resp.data.behavior;
          this.num = resp.data.num;
          this.memo = resp.data.memo;
          this.isSolution = resp.data.type;
        }
      });
    },
    bdff() {
      this.bangdouAddVal = 1;
      this.bangdouAddRemark = '';
      this.bangdouAddDescr = '';
      this.visibleBangdou = true;
    },
    bdczGo() {
      if (!this.bangdouAddVal || !this.bangdouAddRemark || !this.bangdouAddDescr) {
        if (!this.bangdouAddVal) {
          this.bangdouAddValNull = true;
        }
        if (!this.bangdouAddRemark) {
          this.bangdouAddRemarkNull = true;
        }
        if (!this.bangdouAddDescr) {
          this.bangdouAddDescrNull = true;
        }
        return;
      }
      this.modalLoading = true;
      api.payOrDeductionIntegral({
        memberId: this.memberId,
        type: 1,
        integral: this.bangdouAddVal,
        notes: this.bangdouAddRemark,
        reason: this.bangdouAddDescr
      }).then(resp => {
        if(resp.code === 200){
          this.$message.success(resp.message);
          const formData = new FormData();
          formData.append('id', this.$route.query.id);
          api.editRecord(formData).then(resp2 => {
            if(resp2.code === 200){
              this.systemRecordDetail();
            }
          })
        }
      }).finally(() => {
        this.visibleBangdou = false;
        this.modalLoading = false;
      });
    },
    czzff() {
      const formData = new FormData();
      formData.append('id', this.$route.query.id);
      formData.append('memberId', this.memberId);
      formData.append('num', this.num);
      api.updateGrowth(formData).then(resp => {
        if(resp.code === 200){
          this.$message.success(resp.message);
          this.systemRecordDetail();
        }
      })
    },
    pfcyhq() {
      api.reissueCoupon({
        id: this.$route.query.id,
        memberId: this.memberId,
        couTypeCode: this.couTypeCode
      }).then(resp => {
        if(resp.code === 200){
          this.$message.success(resp.message);
          this.systemRecordDetail();
        }
      })
    }
  },
  created() {
    this.systemRecordDetail();
  },
  mounted() {
  },
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
