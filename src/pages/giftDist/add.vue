<template>
  <div id="coupons-detail">
    <div class="content-header">
      新建派发
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%">
        <div class="coupons-common coupons-base">
          <a-row class="common-row">
            <a-col :span="24">
              <a-form
                :form="giftDistForm"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 12 }"
                style="height: 100%;overflow: auto"
                autoComplete="off">
                <a-form-item label="礼包名称">
                  <a-input
                    @change="giftDistNameChange"
                    v-decorator="[
                      'giftDistName',
                      {
                        initialValue: giftDistName,
                        rules: [
                          { required: true, message: '礼包名称不能为空' },
                          { whitespace: true, message: '礼包名称不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入礼包名称"
                    allow-clear />
                </a-form-item>


                <a-form-item label="派发时间">
                  <a-date-picker @change="onChange" style="width: 100%" />
                </a-form-item>


                <a-form-item label="会员来源">
                  <a-radio-group v-model="value" @change="onChange">
                    <a-radio :value="1">时代+</a-radio>
                    <a-radio :value="2">邻里PRO</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="会员等级">
                  <a-radio-group v-model="value" @change="onChange">
                    <a-radio :value="1">V1级会员</a-radio>
                    <a-radio :value="2">V2级会员</a-radio>
                    <a-radio :value="3">V3级会员</a-radio>
                    <a-radio :value="4">V4级会员</a-radio>
                    <a-radio :value="5">V5级会员</a-radio>
                  </a-radio-group>
                </a-form-item>




                <a-form-item label="指定会员">
                  <a-spin :spinning="picUploading">
                    <a-upload name="file">
                      <a-button>
                        <a-icon type="upload" /> 上传文件
                      </a-button>
                    </a-upload>
                  </a-spin>
                  <span style="margin-top:-20px;color:#999999;font-size:12px;">支持扩展名：.xlsx，支持批量上传会员手机号，重复会员计算一次</span>
                  <div style="margin-top: 5px;color: #169BD5;font-size: 14px;cursor: pointer">下载上传模板</div>
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
                <div class="common-btn common-submit">
                  <a-button
                    style="margin-right: 20px"
                    :loading="saveLoading"
                    type="primary"
                    @click="addGift()">
                    提交
                  </a-button>
                </div>
                <div class="common-btn common-cancle">
                  <a-button type="primary" @click="$router.replace({ path: '/giftDist' })">取消</a-button>
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
  name: 'giftDistAdd',
  components: {},
  data() {
    return {
      saveLoading: false,
      giftDistForm: this.$form.createForm(this, { name: 'giftDistForm' }),
      id: null,//编辑用到id
      giftDistName: null,
      memo: null,




    };
  },
  computed: {

  },
  methods: {
    moment,
    giftDistNameChange(e) {
      this.giftDistName = e.target.value;
    },
    memoChange(e) {
      this.memo = e.target.value;
    },

    addGift() {
      this.giftDistForm.validateFields((err) => {
        if (!err) {
          this.saveLoading = true;
          api.addGift({
            giftDistName: this.giftDistName,
            memo: this.memo,
          }).finally(() => {
            this.saveLoading = false;
          }).then(res => {
            this.saveLoading = false;
            if (res.code === 200) {
              this.$router.replace({ path: '/giftDist' });
            }
          });
        }
      });
    }
  },
  created() {

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
