<template>
  <div id="coupons-detail">
    <div class="content-header">
      {{$route.path === '/gift/add'?'新建':'编辑'}}礼包
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
                  <div v-if="$route.path === '/gift/edit'">{{giftName}}</div>
                  <a-input
                    @change="giftNameChange"
                    v-decorator="[
                      'giftName',
                      {
                        initialValue: giftName,
                        rules: [
                          { required: true, message: '礼包名称不能为空' },
                          { whitespace: true, message: '礼包名称不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入礼包名称"
                    allow-clear v-else />
                </a-form-item>
                <a-form-item label="礼包状态">
                  <a-switch checked-children="启用" un-checked-children="禁用" v-model="isEnable" @change="isEnableChange" />
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
                  <!-- <div>validityStartTime:{{ validityStartTime }}</div> -->
                  <!-- <div>validityEndTime:{{ validityEndTime }}</div> -->
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
                    allow-clear />
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
export default {
  name: 'giftAddEdit',
  components: {},
  data() {
    return {
      saveLoading: false,
      giftForm: this.$form.createForm(this, { name: 'giftForm' }),
      id: null,//编辑用到id
      giftName: null,
      memo: null,
      isEnable: true,


      picUploading: false,
      fileList: [],
      couponImage: '',
    };
  },
  computed: {

  },
  methods: {
    moment,
    giftNameChange(e) {
      this.giftName = e.target.value;
    },
    memoChange(e) {
      this.memo = e.target.value;
    },
    isEnableChange(checked){
      this.isEnable = checked;
    },
    addGift() {
      if(this.$route.path === '/gift/edit'){
        this.giftForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            api.editGift({
              id: this.id,
              memo: this.memo,
              isEnable: this.isEnable?0:1
            }).finally(() => {
              this.saveLoading = false;
            }).then(res => {
              this.saveLoading = false;
              if (res.code === 200) {
                this.$router.replace({ path: '/gift' });
              }
            });
          }
        });
      }else if(this.$route.path === '/gift/add'){
        this.giftForm.validateFields((err) => {
          if (!err) {
            this.saveLoading = true;
            api.addGift({
              giftName: this.giftName,
              memo: this.memo,
              isEnable: this.isEnable?0:1
            }).finally(() => {
              this.saveLoading = false;
            }).then(res => {
              this.saveLoading = false;
              if (res.code === 200) {
                this.$router.replace({ path: '/gift' });
              }
            });
          }
        });
      }
    }
  },
  created() {
    if(this.$route.path === '/gift/edit'){
      api.editGiftShowDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.code === 200) {
          this.id = res.data.id;
          this.giftName = res.data.giftName;
          this.memo = res.data.memo;
          this.isEnable = !Number(res.data.isEnable);
        }
      });
    }
  },
  mounted() {

  },
  watch: {

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
