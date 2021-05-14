<template>
  <div id="coupons-detail">
    <div class="content-header">
      {{ $route.path === '/gift/add' ? '创建' : '编辑' }}礼包
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%">
        <div class="coupons-common coupons-base">
          <a-row class="common-row">
            <a-col :span="24">
              <a-form
                :form="giftForm"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 12 }"
                style="height: 100%;overflow: auto"
                autoComplete="off">
                <a-form-item label="礼包名称">
                  <div v-if="$route.path === '/gift/edit'">{{ name }}</div>
                  <a-input
                    @change="nameChange"
                    v-decorator="[
                      'name',
                      {
                        initialValue: name,
                        rules: [
                          { required: true, message: '礼包名称不能为空' },
                          { whitespace: true, message: '礼包名称不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入礼包名称"
                    allow-clear v-else/>
                </a-form-item>
                <a-form-item label="礼包状态">
                  <a-switch checked-children="启用" un-checked-children="禁用" v-model="status" @change="statusChange"/>
                </a-form-item>
                <a-form-item label="有效期">
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
                </a-form-item>
                <a-form-item label="礼包描述">
                  <a-textarea
                    @change="memoChange"
                    v-decorator="[
                      'memo',
                      {
                        initialValue: memo,
                        rules: [{ max: 100, message: '最多输入100个字符' }]
                      }
                    ]"
                    :auto-size="{minRows: 1}"
                    placeholder="请输入礼包描述信息"
                    allow-clear/>
                </a-form-item>
                <a-form-item label="礼包背景">
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
                      :remove="deleteOssImage"
                      @preview="handlePreview"
                      @change="addPic"
                    >
                      <template v-if="fileList.length < 1">
                        <a-icon type="plus"/>
                        <div class="ant-upload-text">
                          上传图片
                        </div>
                      </template>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                      <img class="img" alt="example" style="width: 100%" :src="previewImage"/>
                    </a-modal>
                  </a-spin>
                  <!--<span style="margin-top:-20px;color:#999999;font-size:12px;">
                      建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
                  </span>-->
                </a-form-item>
              </a-form>
              <div class="common-submit-cancle">
                <div class="common-btn common-submit">
                  <a-button
                    style="margin-right: 20px"
                    :loading="saveLoading"
                    type="primary"
                    @click="addGift()">
                    保存
                  </a-button>
                </div>
                <div class="common-btn common-cancle">
                  <a-button type="primary" @click="$router.replace({ path: '/gift' })">取消</a-button>
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
import api from './../../api';
import moment from 'moment';
import {debounce} from '../../utils/util';

export default {
  name: 'giftAddEdit',
  components: {},
  data() {
    return {
      saveLoading: false,
      giftForm: this.$form.createForm(this, {name: 'giftForm'}),
      id: null,//编辑用到id
      name: null,
      memo: null,
      status: true,
      rangePickerValue: [], //日期对象清空日期用
      startTime: null, //有效期开始时间
      endTime: null, //有效期结束时间
      picUploading: false,
      fileList: [],
      couponImage: '',
      previewVisible: false,
      previewImage: '',
    };
  },
  computed: {
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
    moment,
    disabledDate(current) {
      return current && current < Date.now() - 86400000;
    },
    handleCancel() {
      debounce(() => {
        this.previewVisible = false;
      });
    },
    //判断日期格式为yyyy-mm-dd和正确的日期
    isDateString(str) {
      const reg = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      if (str === '' || str === undefined || str === null) return false;
      return reg.test(str);
    },
    handleRangePicker(dates, dateStrings) {
      this.rangePickerValue = dates;
      this.startTime = dateStrings[0];
      this.endTime = dateStrings[1];
    },
    nameChange(e) {
      this.name = e.target.value;
    },
    memoChange(e) {
      this.memo = e.target.value;
    },
    statusChange(checked) {
      this.status = checked;
    },
    addGift() {
      if (this.$route.path === '/gift/edit') {
        this.giftForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            api.editGiftBag({
              id: this.id,
              memo: this.memo,
              status: this.status ? 1 : 0,
              picture: this.couponImage,
              startTime: this.startTime,
              endTime: this.endTime,
            }).then(resp => {
              this.saveLoading = false;
              if (resp.code === 200) {
                this.$router.replace({path: '/gift'});
              }
            }).finally(() => {
              this.saveLoading = false;
            });
          }
        });
      } else if (this.$route.path === '/gift/add') {
        this.giftForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            api.createGiftBag({
              name: this.name,
              memo: this.memo,
              status: this.status ? 1 : 0,
              picture: this.couponImage,
              startTime: this.startTime,
              endTime: this.endTime,
            }).then(resp => {
              this.saveLoading = false;
              if (resp.code === 200) {
                this.$router.replace({path: '/gift'});
              }
            }).finally(() => {
              this.saveLoading = false;
            });
          }
        });
      }
    },
    addPic({fileList = []} = {}) {
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
            api.updateImage(formData).then(resp => {
              if (resp.code === 200) {
                console.log(this.fileList);
                this.giftForm.setFieldsValue({
                  couponImage: resp.data
                });
                this.$set(this.fileList, 0, {
                  uid: '-1',
                  name: 'image.png',
                  status: 'done',
                  url: resp.data ? resp.data : ''
                });
                this.couponImage = resp.data ? resp.data : '';
              }
            }).finally(() => {
              this.picUploading = false;
            });
          }
        }
      }
    },
    deleteOssImage() {
      this.$confirm({
        title: '删除图片',
        content: '确定删除图片吗？',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.picUploading = true;
          api.deleteImage({
            filePath: this.fileList[0].url,
            type: 1
          }).then(resp => {
            if (resp.code === 200) {
              this.fileList = [];
              this.couponImage = '';
              this.giftForm.setFieldsValue({
                couponImage: ''
              });
            }
          }).finally(() => {
            this.picUploading = false;
          });
        }
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
  },
  created() {
    if (this.$route.path === '/gift/edit') {
      api.selectGiftBag({
        id: this.$route.query.id
      }).then(resp => {
        if (resp.code === 200) {
          this.id = resp.data.id;
          this.name = resp.data.name;
          this.memo = resp.data.memo;
          this.status = !!Number(resp.data.status);
          this.couponImage = resp.data.picture;
          this.startTime = this.isDateString(this.momentStrHms(resp.data.startTime))
            ? this.momentStrHms(resp.data.startTime)
            : ''; //有效期开始时间
          this.endTime = this.isDateString(this.momentStrHms(resp.data.endTime))
            ? this.momentStrHms(resp.data.endTime)
            : ''; //有效期结束时间
          if (
            this.isDateString(this.startTime) &&
            this.isDateString(this.endTime) &&
            resp.data.startTime > Date.now() &&
            resp.data.endTime > Date.now()
          ) {
            this.rangePickerValue = [moment(this.startTime), moment(this.endTime)];
          } else {
            this.rangePickerValue = [];
            this.startTime = '';
            this.endTime = '';
          }
        }
      });
    }
  },
  mounted() {

  },
  watch: {
    couponImage: {
      handler(newVal) {
        console.log('watch couponImage newVal :>> ', newVal);
        this.couponImage = this.couponImage.replace(/\s+/g, ''); //去除image url空格
        if (newVal) {
          this.$set(this.fileList, 0, {uid: '-1', name: 'image.png', status: 'done', url: newVal});
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
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
