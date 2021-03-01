<template>
  <div id="coupons-detail">
    <div class="content-header">
      新建活动主题
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
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
                :form="actThemeForm"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 12 }"
                style="height: 100%;overflow: auto"
                autoComplete="off">
                <a-form-item label="活动主题名称">
                  <a-input
                    @change="actThemeTitleChange"
                    v-decorator="[
                      'actThemeTitle',
                      {
                        initialValue: actThemeTitle,
                        rules: [
                          { required: true, message: '活动主题名称不能为空' },
                          { whitespace: true, message: '活动主题名称不能为空' },
                          //{ max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入活动主题名称"
                    allow-clear/>
                </a-form-item>
                <a-form-item label="备注">
                  <a-input
                    @change="actThemeRemarkChange"
                    v-decorator="[
                      'actThemeRemark',
                      {
                        initialValue: actThemeRemark,
                        //rules: [{ max: 20, message: '最多输入20个字符' }]
                      }
                    ]"
                    placeholder="请输入备注信息"
                    allow-clear
                  />
                  <!-- <div>couponSubhead: {{ couponSubhead }}</div> -->
                </a-form-item>
                <a-form-item label="活动主题状态">
                  <a-switch checked-children="启用" un-checked-children="禁用" default-checked />
                </a-form-item>
              </a-form>
              <!-- 提交和取消 -->
              <div class="common-submit-cancle">
                <div class="common-btn common-submit">
                  <a-button
                    style="margin-right: 20px;"
                    :loading="saveLoading"
                    type="primary"
                    @click="handleSubmit(3, 'saveLoading')">
                    保存
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
import api from '@/api'

export default {
  name: 'actThemeNew',
  components: {},
  data() {
    return {
      submitLoading: false,
      actThemeForm: this.$form.createForm(this, { name: 'actThemeForm' }),
      actThemeTitle: null,
      actThemeRemark: null,
    };
  },
  computed: {

  },
  methods: {
    actThemeTitleChange(e) {
      this.actThemeTitle = e.target.value;
    },
    actThemeRemarkChange(e) {
      this.actThemeRemark = e.target.value;
    },
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
