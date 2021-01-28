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
              <a-form
                :form="conponForm"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 12 }"
                style="height: 100%; overflow: auto"
                autoComplete="off"
              >
                <!-- 卡券标题 -->
                <a-form-item label="卡券标题">
                  <a-input
                    @change="couponTitleChange"
                    v-decorator="[
                      'couponTitle',
                      {
                        initialValue: couponTitle,
                        rules: [
                          { required: true, message: '卡券标题不能为空' },
                          { whitespace: true, message: '卡券标题不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入卡券标题，最多20个字符"
                    allow-clear
                  />
                  <div>couponTitle: {{ couponTitle }}</div>
                </a-form-item>
                <!-- 卡券副标题 -->
                <a-form-item label="卡券副标题">
                  <a-input
                    @change="couponSubheadChange"
                    v-decorator="[
                      'couponSubhead',
                      {
                        initialValue: couponSubhead,
                        rules: [{ max: 20, message: '最多输入20个字符' }]
                      }
                    ]"
                    placeholder="请输入卡券副标题，最多20个字符"
                    allow-clear
                  />
                  <div>couponSubhead: {{ couponSubhead }}</div>
                </a-form-item>
                <!-- 卡券类型 -->
                <a-form-item label="卡券类型">
                  <a-select
                    v-decorator="[
                      'couponType',
                      {
                        initialValue: couponType,
                        rules: [{ required: true, message: '卡券类型不能为空' }]
                      }
                    ]"
                    @change="couponTypeSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in couponTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <div>couponType: {{ couponType }}</div>
                </a-form-item>
                <!-- 代金券:10 -->
                <template v-if="couponType === 10">
                  <a-form-item label="代金券金额">
                    <a-input
                      @change="voucherAmountChange"
                      v-decorator="[
                        'voucherAmount',
                        {
                          initialValue: voucherAmount,
                          rules: [
                            { required: true, message: '代金券金额不能为空' },
                            { whitespace: true, message: '代金券金额不能为空' },
                            { validator: this.checkAmountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入代金券金额"
                      allow-clear
                      prefix="￥"
                    />
                    <div>voucherAmount:{{ voucherAmount }}</div>
                  </a-form-item>
                </template>
                <!-- 满减券:20 -->
                <template v-else-if="couponType === 20">
                  <a-form-item label="满">
                    <a-input
                      @change="satisfyAmountChange"
                      v-decorator="[
                        'satisfyAmount',
                        {
                          initialValue: satisfyAmount,
                          rules: [
                            { required: true, message: '满多少金额可用不能为空' },
                            { whitespace: true, message: '满多少金额可用不能为空' },
                            { validator: this.checkAmountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <div>satisfyAmount:{{ satisfyAmount }}</div>
                  </a-form-item>
                  <a-form-item label="抵扣金额">
                    <a-input
                      @change="fullReductionDiscountAmountChange"
                      v-decorator="[
                        'fullReductionDiscountAmount',
                        {
                          initialValue: fullReductionDiscountAmount,
                          rules: [
                            { required: true, message: '抵扣金额不能为空' },
                            { whitespace: true, message: '抵扣金额不能为空' },
                            { validator: this.checkAmountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入满减券抵扣金额"
                      allow-clear
                    />
                    <div>fullReductionDiscountAmount:{{ fullReductionDiscountAmount }}</div>
                  </a-form-item>
                </template>
                <!-- 折扣券:40 -->
                <template v-else-if="couponType === 40">
                  <a-form-item label="满">
                    <a-input
                      @change="satisfyAmountChange"
                      v-decorator="[
                        'satisfyAmount',
                        {
                          initialValue: satisfyAmount,
                          rules: [
                            { required: true, message: '满多少金额可用不能为空' },
                            { whitespace: true, message: '满多少金额可用不能为空' },
                            { validator: this.checkAmountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <div>satisfyAmount:{{ satisfyAmount }}</div>
                  </a-form-item>
                  <a-form-item label="最高抵扣金额">
                    <a-input
                      @change="discountMaxDeductionChange"
                      v-decorator="[
                        'discountMaxDeduction',
                        {
                          initialValue: discountMaxDeduction,
                          rules: [
                            { required: true, message: '最高抵扣金额不能为空' },
                            { whitespace: true, message: '最高抵扣金额不能为空' },
                            { validator: this.checkAmountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入折扣券最高抵扣金额"
                      allow-clear
                    />
                    <div>discountMaxDeduction:{{ discountMaxDeduction }}</div>
                  </a-form-item>
                  <a-form-item label="折扣（0-1）">
                    <a-input
                      @change="discountRatioChange"
                      v-decorator="[
                        'discountRatio',
                        {
                          initialValue: discountRatio,
                          rules: [
                            { required: true, message: '折扣比例不能为空' },
                            { validator: this.checkDiscountFormat, trigger: ['blur'] }
                          ]
                        }
                      ]"
                      placeholder="请输入折扣比例，支持小数点后2位"
                      allow-clear
                    />
                    <div>discountRatio:{{ discountRatio }}</div>
                  </a-form-item>
                </template>

                <!-- 有效期类型 -->
                <a-form-item label="有效期类型">
                  <a-select
                    v-decorator="[
                      'validityType',
                      {
                        initialValue: validityType,
                        rules: [{ required: true, message: '有效期类型不能为空' }]
                      }
                    ]"
                    @change="validityTypeSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in validityTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <div>validityType:{{ validityType }}</div>
                </a-form-item>
                <!-- 固定有效期:1 -->
                <template v-if="validityType === 1">
                  <a-form-item label="选择日期">
                    <a-range-picker
                      v-decorator="[
                        'rangePickerValue',
                        {
                          initialValue: rangePickerValue,
                          rules: [{ type: 'array', required: true, message: '日期不能为空,请选择日期!' }]
                        }
                      ]"
                      :placeholder="['开始时间', '结束时间']"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="handleRangePicker"
                      :show-time="{
                        defaultValue: [moment(moment().format('HH:mm:ss')), moment('23:59:59', 'HH:mm:ss')]
                      }"
                      :disabled-date="disabledDate"
                    />
                    <div>validityStartTime:{{ validityStartTime }}</div>
                    <div>validityEndTime:{{ validityEndTime }}</div>
                  </a-form-item>
                </template>
                <!-- 相对有效期:2 -->
                <template v-else-if="validityType === 3">
                  <a-form-item label="有效天数">
                    <a-input-number
                      :min="1"
                      :max="999"
                      @change="validityDayNumsChange"
                      v-decorator="[
                        'validityDayNums',
                        {
                          initialValue: validityDayNums,
                          rules: [{ required: true, message: '有效天数不能为空' }]
                        }
                      ]"
                      placeholder="请输入有效天数，1-999"
                      allow-clear
                    />
                    <div>validityDayNums:{{ validityDayNums }}</div>
                  </a-form-item>
                  <a-form-item label="领取后几天后生效">
                    <a-input-number
                      :min="1"
                      :max="999"
                      @change="takeEffectDayNumsChange"
                      v-decorator="[
                        'takeEffectDayNums',
                        {
                          initialValue: takeEffectDayNums,
                          rules: [{ required: true, message: '领取后几天后生效不能为空' }]
                        }
                      ]"
                      placeholder="输入天数，1-999"
                      allow-clear
                    />
                    <div>takeEffectDayNums:{{ takeEffectDayNums }}</div>
                  </a-form-item>
                </template>

                <!-- 卡券平台 -->
                <a-form-item label="卡券平台">
                  <a-select
                    v-decorator="[
                      'source',
                      {
                        initialValue: source,
                        rules: [{ required: true, message: '卡券平台不能为空' }]
                      }
                    ]"
                    @change="sourceSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in sources" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <div>source:{{ source }}</div>
                </a-form-item>

                <!-- 卡券业务类型 -->
                <a-form-item label="卡券业务类型">
                  <a-select
                    v-decorator="[
                      'couponBusinessType',
                      {
                        initialValue: couponBusinessType,
                        rules: [{ required: true, message: '卡券业务类型不能为空' }]
                      }
                    ]"
                    @change="couponBusinessTypeSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in couponBusinessTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <div>couponBusinessType:{{ couponBusinessType }}</div>
                </a-form-item>

                <!-- 购物券 -->
                <template v-if="couponBusinessType === '4005'">
                  <a-form-item label="商城订单类型">
                    <a-radio-group
                      @change="classificationChange"
                      v-decorator="[
                        'classification',
                        {
                          initialValue: classification,
                          rules: [{ required: true, message: '商城订单类型不能为空' }]
                        }
                      ]"
                    >
                      <a-radio :value="1">
                        全部
                      </a-radio>
                      <a-radio :value="2">
                        零售
                      </a-radio>
                    </a-radio-group>
                    <div>classification:{{ classification }}</div>
                  </a-form-item>
                  <a-form-item label="商户id">
                    <a-input
                      @change="commercialTenantsChange"
                      v-decorator="[
                        'commercialTenants',
                        {
                          initialValue: commercialTenants,
                          rules: [
                            { required: true, message: '商户id不能为空' },
                            { whitespace: true, message: '商户id不能为空' }
                          ]
                        }
                      ]"
                      placeholder="请输入商户id，多个以,间隔"
                      allow-clear
                    />
                    <div>commercialTenants:{{ commercialTenants }}</div>
                  </a-form-item>
                  <a-form-item label="商品id">
                    <a-input
                      @change="merchandisesChange"
                      v-decorator="[
                        'merchandises',
                        {
                          initialValue: merchandises,
                          rules: [
                            { required: true, message: '商品id不能为空' },
                            { whitespace: true, message: '商品id不能为空' }
                          ]
                        }
                      ]"
                      placeholder="请输入商品id，多个以,间隔"
                      allow-clear
                    />
                    <div>merchandises:{{ merchandises }}</div>
                  </a-form-item>
                  <a-form-item label="上传优惠券封面图">
                    <a-spin :spinning="picUploading">
                      <a-upload
                        name="avatar"
                        accept="image/jpeg,image/jpg,image/png"
                        list-type="picture-card"
                        :file-list="fileList"
                        v-decorator="[
                          'couponImage',
                          { initialValue: couponImage, rules: [{ required: true, message: '图片不能为空' }] }
                        ]"
                        :before-upload="() => false"
                        :remove="handleRemove"
                        @preview="handlePreview"
                        @change="addPic"
                      >
                        <template v-if="fileList.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">
                            上传图片
                          </div>
                        </template>
                      </a-upload>
                      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img class="img" alt="example" style="width: 100%" :src="previewImage" />
                      </a-modal>
                    </a-spin>
                    <span style="margin-top:-20px;color:#999999;font-size:12px;">
                      建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
                    </span>
                  </a-form-item>
                </template>

                <!-- 成本价 -->
                <a-form-item label="成本价（可选）">
                  <a-input
                    @change="costChange"
                    v-decorator="[
                      'cost',
                      {
                        initialValue: cost,
                        rules: [{ validator: this.checkAmountFormat, trigger: ['blur'] }]
                      }
                    ]"
                    placeholder="请输入卡券的成本价，小数点后两位"
                    allow-clear
                    prefix="￥"
                  />
                  <div>cost:{{ cost }}</div>
                </a-form-item>
                <!-- 使用说明 -->
                <a-form-item label="使用说明">
                  <a-textarea
                    @change="memoChange"
                    v-decorator="[
                      'memo',
                      {
                        initialValue: memo,
                        rules: [
                          { required: true, message: '使用说明不能为空' },
                          { whitespace: true, message: '使用说明不能为空' }
                        ]
                      }
                    ]"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    :maxLength="200"
                    placeholder="请输入使用说明"
                  />
                  <div>memo:{{ memo }}</div>
                </a-form-item>
              </a-form>
              <!-- 提交和取消 -->
              <div class="common-submit-cancle">
                <div class="common-btn common-submit">
                  <a-button
                    style="margin-right: 20px;"
                    :loading="saveLoading"
                    type="primary"
                    @click="handleSubmit(3, 'saveLoading')"
                  >
                    保存
                  </a-button>

                  <a-button :loading="submitLoading" type="primary" @click="handleSubmit(1, 'submitLoading')">
                    提交
                  </a-button>
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

// moment(Date.now(), 'YYYY-MM-DD HH:mm:ss').split(' ')[1]

export default {
  name: 'couponsManageNew',
  components: {},
  data() {
    return {
      submitLoading: false,
      saveLoading: false,
      //////////上传图片///////////
      conponForm: this.$form.createForm(this, { name: 'conponForm' }),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      couponImage: '',
      picUploading: false,
      //////////上传图片///////////
      // pcRuleId:'',//没用
      couponTitle: '',
      couponSubhead: '',
      couponType: 10,
      couponTypes: [
        { name: '代金券', code: 10 },
        { name: '满减券', code: 20 },
        { name: '折扣券', code: 40 }
      ],

      voucherAmount: '', //代金券抵扣金额
      satisfyAmount: '', //	折扣券/满减券 满多少金额可用
      fullReductionDiscountAmount: '', //满减券抵扣金额
      discountMaxDeduction: '', //	折扣券 最高抵扣金额
      discountRatio: '0.9', //折扣券 折扣比例
      validityType: 1,
      validityTypes: [
        { name: '固定有效期', code: 1 },
        { name: '相对有效期', code: 3 }
      ],
      rangePickerValue: [], //日期对象清空日期用
      validityStartTime: '', //固定有效期-卡券有效期开始时间
      validityEndTime: '', //	固定有效期-卡券有效期结束时间
      validityDayNums: 1, //相对有效期-卡券有效天数
      takeEffectDayNums: 1, //相对有效期-领取后几天后生效
      source: '10', //卡券平台 10-地产,20-邻里邦,30-邻里商城,40-会员中心,50-收费中心
      sources: [
        { name: '地产', code: '10' },
        { name: '邻里邦', code: '20' },
        { name: '邻里商城', code: '30' },
        { name: '会员中心', code: '40' },
        { name: '收费中心', code: '50' }
      ],
      couponBusinessType: '4014', //卡券业务类型
      couponBusinessTypes: [
        { name: '物业费', code: '4014' },
        { name: '购物券', code: '4005' }
      ],
      commercialTenants: '', //购物券-商户id
      merchandises: '', //购物券——商品id
      classification: 1, //	商城订单类型: 1全部/2零售
      cost: '', //成本价
      memo: '' //使用说明
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
    moment,
    disabledDate(current) {
      return current && current < Date.now() - 86400000;
    },
    checkAmountFormat(rule, value, callback) {
      console.log('checkAmountFormat value :>> ', value);
      if (value && !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
        callback(new Error('金额格式不正确'));
      } else {
        if (value === '0') {
          callback(new Error('金额不能为0'));
        }
        callback();
      }
    },
    checkDiscountFormat(rule, value, callback) {
      if (value && !/^(0(\.\d{1,2})?|1(\.0{1,2})?)$/.test(value)) {
        callback(new Error('折扣格式不正确'));
      } else {
        if (value == 0) {
          callback(new Error('折扣不能为0'));
        } else if (value == 1) {
          callback(new Error('折扣不能为1'));
        }
        callback();
      }
    },
    ...mapActions(['FALLBACK']),
    //////////上传图片///////////
    //{ fileList = [] } = {}是解构赋至拿到参数中的fileList
    addPic({ fileList = [] } = {}) {
      console.log('addPic fileList:>> ', fileList);
      if (fileList.length > 0) {
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
                    couponImage: res.data
                  });
                  this.$set(this.fileList, 0, {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data ? res.data : ''
                  });
                  this.couponImage = res.data ? res.data : '';
                }
              });
          }
        }
      }
    },
    handleRemove(file) {
      console.log('handleRemove');
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.couponImage = '';
    },
    deleteOssImage() {
      console.log('deleteOssImage');
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
            .finally(() => {
              that.picUploading = false;
            })
            .then(res => {
              if (res.code === 200) {
                that.fileList = [];
                that.couponImage = '';
                that.conponForm.setFieldsValue({
                  couponImage: ''
                });
              }
            });
        }
      });
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

    /**
     **判断日期格式为yyyy-mm-dd和正确的日期
     */
    isDateString(str) {
      const reg = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      if (str === '' || str === undefined || str === null) return false;
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },

    //输入框
    couponTitleChange(e) {
      this.couponTitle = e.target.value;
    },
    couponSubheadChange(e) {
      this.couponSubhead = e.target.value;
    },
    voucherAmountChange(e) {
      this.voucherAmount = e.target.value;
    },
    satisfyAmountChange(e) {
      this.satisfyAmount = e.target.value;
    },
    discountMaxDeductionChange(e) {
      this.discountMaxDeduction = e.target.value;
    },
    discountRatioChange(e) {
      // console.log('discountRatioChange e.target.value :>> ', e.target.value);
      this.discountRatio = e.target.value.toString();
    },
    fullReductionDiscountAmountChange(e) {
      this.fullReductionDiscountAmount = e.target.value;
    },
    validityDayNumsChange(newVal) {
      this.validityDayNums = newVal;
    },
    takeEffectDayNumsChange(newVal) {
      this.takeEffectDayNums = newVal;
    },
    commercialTenantsChange(e) {
      this.commercialTenants = e.target.value;
    },
    merchandisesChange(e) {
      this.merchandises = e.target.value;
    },
    costChange(e) {
      this.cost = e.target.value;
    },
    memoChange(e) {
      this.memo = e.target.value;
    },

    //单选
    classificationChange(e) {
      this.classification = e.target.value;
    },

    //下拉
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
    },

    //获取详情
    getCouponDetail() {
      const param = {
        couponId: this.$route.query.id
      };

      console.log('getCouponDetail param :>> ', param);
      api.getCouponDetail(param).then(res => {
        console.log('getCouponDetail res :>> ', res);

        // //////////////////mock/////////////////
        // res.data = {
        //   // pcRuleId:136994,//没用
        //   classification: 1,
        //   commercialTenants: '123456',
        //   cost: '',
        //   couponBusinessType: '4014',
        //   couponCode: this.$route.query.id,
        //   couponId: '',
        //   couponImage:
        //     'https://hystxt-oss.oss-cn-shenzhen.aliyuncs.com/oss-frontend/sys-member-center/4402197751161_lalala.png',
        //   couponSubhead: '',
        //   couponTitle: '卡券标题',
        //   couponType: 10,
        //   createOperator: '',
        //   createTime: null,
        //   dateTime: null,
        //   discountMaxDeduction: '150',
        //   discountRatio: '0.7',
        //   fullReductionDiscountAmount: '100',
        //   memo: 'mock 999',
        //   merchandises: '123456',
        //   satisfyAmount: '200',
        //   source: '10',
        //   state: 1,
        //   takeEffectDayNums: 3,
        //   validityDayNums: 30,
        //   validityStartTime: '2021-01-11',
        //   validityEndTime: '2020-01-22',
        //   validityType: 1,
        //   voucherAmount: '100'
        // };
        // //////////////////mock/////////////////

        if (res.code === 200) {
          if (Object.prototype.toString.call(res.data) !== '[object Object]') {
            res.data = {};
          }

          // this.pcRuleId = res.data.pcRuleId || this.pcRuleId;//没用
          this.classification = res.data.classification || this.classification;
          this.commercialTenants = res.data.commercialTenants || this.commercialTenants;
          this.couponImage = res.data.couponImage || this.couponImage;
          this.discountMaxDeduction = res.data.discountMaxDeduction || this.discountMaxDeduction;
          this.discountRatio = res.data.discountRatio || this.discountRatio;
          this.fullReductionDiscountAmount = res.data.fullReductionDiscountAmount || this.fullReductionDiscountAmount;
          this.merchandises = res.data.merchandises || this.merchandises;
          this.satisfyAmount = res.data.satisfyAmount || this.satisfyAmount;
          this.state = res.data.state || this.state;
          this.takeEffectDayNums = res.data.takeEffectDayNums || this.takeEffectDayNums;
          this.validityDayNums = res.data.validityDayNums || this.validityDayNums;
          ////////////init show/////////
          this.couponTitle = res.data.couponTitle || this.couponTitle;
          this.couponSubhead = res.data.couponSubhead || this.couponSubhead;
          this.couponType = res.data.couponType || this.couponType;
          this.voucherAmount = res.data.voucherAmount || this.voucherAmount;
          this.validityType = res.data.validityType || this.validityType;
          ///////////日期//////////
          this.validityStartTime = this.isDateString(this.momentStrHms(res.data.validityStartTime))
            ? this.momentStrHms(res.data.validityStartTime)
            : ''; //固定有效期-卡券有效期开始时间
          this.validityEndTime = this.isDateString(this.momentStrHms(res.data.validityEndTime))
            ? this.momentStrHms(res.data.validityEndTime)
            : ''; //	固定有效期-卡券有效期结束时间
          if (
            this.isDateString(this.validityStartTime) &&
            this.isDateString(this.validityEndTime) &&
            res.data.validityStartTime > Date.now() &&
            res.data.validityEndTime > Date.now()
          ) {
            this.rangePickerValue = [moment(this.validityStartTime), moment(this.validityEndTime)];
          } else {
            this.rangePickerValue = [];
            this.validityStartTime = '';
            this.validityEndTime = '';
          }
          ///////////日期//////////
          this.source = res.data.source || this.source;
          this.couponBusinessType = res.data.couponBusinessType || this.couponBusinessType;
          this.cost = res.data.cost || this.cost;
          this.memo = res.data.memo || this.memo;
          /////////////init show/////////////
        }
      });
    },

    handleSubmit(state, loadingType) {
      this.conponForm.validateFields((err, values) => {
        console.log('handleSubmit validateFields err :>> ', err);
        //没有错误的情况下
        if (!err) {
          console.log('handleSubmit values :>> ', values);
          // this.getCouponCreate(state, loadingType);
        }
      });
    },

    getCouponCreate(state, loadingType) {
      const param = {
        // pcRuleId: this.pcRuleId,//没用
        state: state,
        classification: this.classification,
        commercialTenants: this.commercialTenants,
        cost: this.cost,
        couponBusinessType: this.couponBusinessType,
        // couponCode: '', //没用
        // couponId: '',//没用
        couponImage: this.couponImage,
        couponSubhead: this.couponSubhead,
        couponTitle: this.couponTitle,
        couponType: this.couponType,
        // createOperator: '', //没用
        // createTime: '', //没用
        // dateTime: '', //没用
        discountMaxDeduction: this.discountMaxDeduction,
        discountRatio: this.discountRatio.toString(),
        fullReductionDiscountAmount: this.fullReductionDiscountAmount,
        memo: this.memo,
        merchandises: this.merchandises,
        satisfyAmount: this.satisfyAmount,
        source: this.source,
        takeEffectDayNums: this.takeEffectDayNums,
        validityDayNums: this.validityDayNums,
        validityEndTime: this.validityEndTime,
        validityStartTime: this.validityStartTime,
        validityType: this.validityType,
        voucherAmount: this.voucherAmount
      };

      console.log('getCouponCreate param :>> ', param);

      this[loadingType] = true;

      api
        .getCouponCreate(param)
        .finally(() => {
          this[loadingType] = false;
        })
        .then(res => {
          console.log('getCouponCreate res :>> ', res);
          if (res.code === 200) {
            console.log('res.data :>> ', res.data);
            this.$router.replace({ path: '/couponsManage' });
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
    fileList: {
      handler(newVal) {
        console.log('watch fileList newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    couponImage: {
      handler(newVal) {
        console.log('watch couponImage newVal :>> ', newVal);
        this.couponImage = this.couponImage.replace(/\s+/g, ''); //去除image url空格
        if (newVal) {
          this.$set(this.fileList, 0, { uid: '-1', name: 'image.png', status: 'done', url: newVal });
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    rangePickerValue: {
      handler(newVal) {
        console.log('watch rangePickerValue newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    }
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

        ::v-deep .ant-form .ant-input-number {
          width: 100%;
        }

        .common-submit-cancle {
          padding: 30px 0 0 150px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .common-btn {
            margin-right: 30px;

            ::v-deep .ant-btn {
              box-sizing: content-box;
              padding: 2px 15px;
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
