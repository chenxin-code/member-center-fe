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
                      <a-select :default-value="couponTypes[0].code" @change="couponTypeSelect">
                        <a-select-option :value="item.code" v-for="(item, index) in couponTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>couponType:{{ couponType }}</div>
                    </div>
                  </div>
                  <template v-if="couponType === 10">
                    <div class="column-item">
                      <div class="column-right">代金券金额:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入代金券金额" allow-clear v-model="voucherAmount" />
                        <div>{{ voucherAmount }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="couponType === 20">
                    <div class="column-item">
                      <div class="column-right">满:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入代金券金额" allow-clear v-model="satisfyAmount" />
                        <div>{{ satisfyAmount }}</div>
                      </div>
                      <span>元可用</span>
                    </div>
                    <div class="column-item">
                      <div class="column-right">抵扣金额:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入代金券金额" allow-clear v-model="fullReductionDiscountAmount" />
                        <div>{{ fullReductionDiscountAmount }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="couponType === 30">
                    <div class="column-item">
                      <div class="column-right">满:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入" allow-clear v-model="satisfyAmount" />
                        <div>{{ satisfyAmount }}</div>
                      </div>
                      <span>元可用</span>
                    </div>
                    <div class="column-item">
                      <div class="column-right">最高抵扣金额:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入折扣券最高抵扣金额" allow-clear v-model="discountMaxDeduction" />
                        <div>{{ discountMaxDeduction }}</div>
                      </div>
                    </div>
                    <div class="column-item">
                      <div class="column-right">折扣（0-1）:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入折扣比例，支持小数点后2位" allow-clear v-model="discountRatio" />
                        <div>{{ discountRatio }}</div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 有效期类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">有效期类型:</div>
                    <div class="column-left">
                      <a-select :default-value="validityTypes[0].code" @change="validityTypeSelect">
                        <a-select-option :value="item.code" v-for="(item, index) in validityTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>validityType:{{ validityType }}</div>
                    </div>
                  </div>
                  <template v-if="validityType === 10">
                    <div class="column-item">
                      <div class="column-right">选择日期:</div>
                      <div class="column-left">
                        <a-range-picker
                          :placeholder="['开始时间', '结束时间']"
                          format="YYYY-MM-DD"
                          :value="rangePickerValue"
                          @change="handleRangePicker"
                        />
                        <div>Start:{{ validityStartTime }} ～ End:{{ validityEndTime }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="validityType === 20">
                    <div class="column-item">
                      <div class="column-right">有效天数:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入有效天数，1-999" allow-clear v-model="validityDayNums" />
                        <div>{{ validityDayNums }}</div>
                      </div>
                    </div>
                    <div class="column-item">
                      <div class="column-right">领取后几天后生效:</div>
                      <div class="column-left">
                        <a-input placeholder="输入天数，1-999" allow-clear v-model="takeEffectDayNums" />
                        <div>{{ takeEffectDayNums }}</div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 卡券平台 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券平台:</div>
                    <div class="column-left">
                      <a-select :default-value="sources[0].code" @change="sourceSelect">
                        <a-select-option :value="item.code" v-for="(item, index) in sources" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>source:{{ source }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 卡券业务类型 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">卡券业务类型:</div>
                    <div class="column-left">
                      <a-select :default-value="couponBusinessTypes[0].code" @change="couponBusinessTypeSelect">
                        <a-select-option :value="item.code" v-for="(item, index) in couponBusinessTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                      <div>couponBusinessType:{{ couponBusinessType }}</div>
                    </div>
                  </div>
                  <template v-if="couponBusinessType === 20">
                    <div class="column-item">
                      <div class="column-right">商城订单类型:</div>
                      <div class="column-left">
                        <a-radio-group v-model="classification">
                          <a-radio :value="1">
                            A
                          </a-radio>
                          <a-radio :value="2">
                            B
                          </a-radio>
                        </a-radio-group>
                        <span>订单类型:{{ classification }}</span>
                      </div>
                    </div>
                    <div class="column-item">
                      <div class="column-right">商户id:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入商户id，多个以,间隔" allow-clear v-model="commercialTenants" />
                      </div>
                      <span>{{ commercialTenants }}</span>
                    </div>
                    <div class="column-item">
                      <div class="column-right">商品id:</div>
                      <div class="column-left">
                        <a-input placeholder="请输入商品id，多个以,间隔" allow-clear v-model="merchandises" />
                      </div>
                      <span>{{ merchandises }}</span>
                    </div>
                    <div class="column-item column-form">
                      <div class="column-right">上传优惠券封面图:</div>
                      <div class="column-left">
                        <a-form :form="conponForm">
                          <a-form-item>
                            <a-spin :spinning="picUploading">
                              <a-upload
                                name="avatar"
                                accept="image/jpeg,image/jpg,image/png"
                                list-type="picture-card"
                                :file-list="fileList"
                                v-decorator="['imageUrl', { rules: [{ required: true, message: '图片不能为空' }] }]"
                                :before-upload="() => false"
                                @preview="handlePreview"
                                @change="addPic"
                              >
                                <div v-if="fileList.length < 1">
                                  <a-icon type="plus" />
                                  <div class="ant-upload-text">
                                    上传图片
                                  </div>
                                </div>
                              </a-upload>
                              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img class="img" alt="example" style="width: 100%" :src="previewImage" />
                              </a-modal>
                            </a-spin>
                            <span style="margin-top:-20px;color:#999999;font-size:12px;">
                              建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
                            </span>
                          </a-form-item>
                        </a-form>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- 成本价 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">成本价（可选）:</div>
                    <div class="column-left">
                      <a-input placeholder="请输入卡券的成本价，小数点后两位" allow-clear v-model="cost" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 使用说明 -->
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item column-textarea">
                    <div class="column-right">使用说明:</div>
                    <div class="column-left">
                      <a-textarea
                        v-model="couponDetailsMemo"
                        :disabled="false"
                        :maxLength="50"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        style="width: 267px;"
                        placeholder="请输入使用说明，用户可见"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 提交和取消 -->
              <div class="common-submit-cancle">
                <div class="common-btn common-submit">
                  <a-button type="primary" @click="handleSubmit">提交</a-button>
                </div>
                <div class="common-btn common-cancle">
                  <a-button type="primary" @click="handleCancle">取消</a-button>
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
import api from '@/api';
import moment from 'moment';
import { debounce } from '@/utils/util';
import { mapActions } from 'vuex';
import { CARD_TYPE_MAP } from '@/constance';

export default {
  name: 'couponsManageNew',
  components: {},
  data() {
    return {
      //////////上传图片///////////
      conponForm: this.$form.createForm(this, { name: 'conponForm' }),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      picUploading: false,
      btnLoading: false,
      //////////上传图片///////////
      memoBackup: '1.请在有效期内使用;\n2.只能在指定商铺使用;',
      // couponDetails: {},
      couponTitle: '',
      couponSubhead: '',
      couponType: 10,
      couponTypes: [
        { name: '代金券', code: 10 },
        { name: '满减券', code: 20 },
        { name: '折扣券', code: 30 }
      ],

      voucherAmount: '', //代金券抵扣金额
      satisfyAmount: '', //	折扣券/满减券 满多少金额可用
      fullReductionDiscountAmount: '', //满减券抵扣金额
      discountMaxDeduction: '', //	折扣券 最高抵扣金额
      discountRatio: '', //折扣券 折扣比例
      validityType: 10,
      validityTypes: [
        { name: '固定有效期', code: 10 },
        { name: '相对有效期', code: 20 }
      ],
      rangePickerValue: [], //日期对象清空日期用
      validityStartTime: '', //固定有效期-卡券有效期开始时间
      validityEndTime: '', //	固定有效期-卡券有效期结束时间
      validityDayNums: '', //相对有效期-卡券有效天数
      takeEffectDayNums: '', //相对有效期-领取后几天后生效
      source: 10, //卡券平台 10-地产,20-邻里邦,30-邻里商城,40-会员中心,50-收费中心
      sources: [
        { name: '地产', code: 10 },
        { name: '邻里邦', code: 20 },
        { name: '邻里商城', code: 30 },
        { name: '会员中心', code: 40 },
        { name: '收费中心', code: 50 }
      ],
      couponBusinessType: 20, //卡券业务类型
      couponBusinessTypes: [
        { name: '物业费', code: 10 },
        { name: '购物券', code: 20 }
      ],
      commercialTenants: '', //购物券-商户id
      merchandises: '', //购物券——商品id
      classification: 1, //	商城订单类型: 1全部/2零售
      cost: '', //成本价
      memo: '' //使用说明
    };
  },
  computed: {
    couponDetailsMemo() {
      return this.memo ? this.memo : this.memoBackup;
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
    //////////上传图片///////////
    addPic({ fileList = [] } = {}) {
      if (this.fileList.length > 0) {
        const that = this;
        that.$confirm({
          title: '删除图片',
          content: '确定删除图片吗？',
          centered: true,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            const para = {
              filePath: that.fileList[0].url,
              type: 1
            };
            that.picUploading = true;
            api
              .deleteImage(para)
              .then(res => {
                if (res.code === 200) {
                  that.fileList = [];
                  that.conponForm.setFieldsValue({
                    imageUrl: ''
                  });
                }
              })
              .finally(() => {
                that.picUploading = false;
              });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng = fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png';
          if (!isJpgOrPng) {
            this.$message.error('图片格式错误，请重新上传');
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error('图片过大，请重新上传');
            } else {
              this.picUploading = true;
              const formData = new FormData();
              console.log('fileList :>> ', fileList);
              fileList.forEach(file => {
                formData.append('file', file.originFileObj);
              });
              formData.append('programCode', 'sys-member-center');
              console.log('formData.get(file) :>> ', formData.get('file'));
              console.log('formData.get(programCode) :>> ', formData.get('programCode'));

              api
                .updateImage(formData)
                .finally(() => {
                  this.picUploading = false;
                })
                .then(res => {
                  if (res.code === 200) {
                    console.log(this.fileList);
                    this.conponForm.setFieldsValue({
                      imageUrl: res.data
                    });
                    this.fileList[0] = { uid: '-1', name: 'image.png', status: 'done', url: res.data ? res.data : '' };
                  }
                });
            }
          }
        });
      }
    },
    handleCancel() {
      debounce(() => {
        this.previewVisible = false;
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    //////////上传图片///////////
    handleSubmit() {
      alert('提交按钮');
    },
    handleCancle() {
      this.$router.replace({ path: '/couponsManage' });
    },
    handleRangePicker(dates, dateStrings) {
      console.log('handleRangePicker dates :>> ', dates);
      console.log('handleRangePicker dateStrings :>> ', dateStrings);
      this.rangePickerValue = dates;
      this.validityStartTime = dateStrings[0];
      this.validityEndTime = dateStrings[1];
    },
    couponTypeSelect(value) {
      console.log('couponTypeSelect');
      this.couponType = value;
    },
    validityTypeSelect(value) {
      console.log('validityTypeSelect');
      this.validityType = value;
    },
    sourceSelect(value) {
      console.log('sourceSelect');
      this.source = value;
    },
    couponBusinessTypeSelect(value) {
      console.log('couponBusinessTypeSelect');
      this.couponBusinessType = value;
    }
    // getCouponDetail() {
    //   const param = {
    //     couponId: this.$route.query.id
    //   };
    //   console.log('getCouponDetail param :>> ', param);
    //   api.getCouponDetail(param).then(res => {
    //     console.log('getCouponDetail res :>> ', res);
    //     if (res.code === 200) {
    //       console.log('res.data :>> ', res.data);
    //       for (const key in res.data) {
    //         if (Object.hasOwnProperty.call(res.data, key)) {
    //           const element = res.data[key];
    //           this.$set(this.couponDetails, key, element);
    //         }
    //       }
    //       console.log('this.couponDetails :>> ', this.couponDetails);
    //     }
    //   });
    // }
  },
  created() {
    console.log('this.$route :>> ', this.$route);
    // this.getCouponDetail();
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
              align-items: center;

              .column-right {
                width: 150px;
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
              padding-bottom: 10px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;

              .column-left {
                ::v-deep .ant-input {
                  width: 430px !important;
                }
              }
            }

            .column-item.column-cover {
              padding-bottom: 10px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;
            }

            .column-item.column-form {
              padding-bottom: 10px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;

              ::v-deep .ant-upload.ant-upload-select-picture-card {
                margin-bottom: 0;
              }
            }
          }
        }

        // .common-column-wrapp:last-child {
        //   margin-bottom: 0;
        // }

        .common-submit-cancle {
          padding: 30px 0 0 150px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .common-btn {
            margin-right: 50px;

            ::v-deep .ant-btn {
              width: 90px;
              height: 40px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: 500;
            }
          }

          .common-cancle {
            ::v-deep .ant-btn {
              color: #666;
              background-color: #fff;
              border-color: #ccc;
            }
          }
        }
      }

      .common-row:last-child {
        border: none;
      }
    }

    .coupons-base {
      padding-bottom: 50px;
    }
  }
}
</style>
