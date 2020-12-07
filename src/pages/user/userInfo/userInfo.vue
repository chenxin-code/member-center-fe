<template>
  <div class="user-info">
    <div class="content-header">
      个人中心
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main">
      <a-spin :spinning="loading">
        <a-form
          class="user-form"
          style="padding: 20px;"
          :form="form"
          :label-col="{ md: { span: 2 }, sm: { span: 3 }, xs: { span: 4 } }"
          :wrapper-col="{ md: { span: 8 }, sm: { span: 12 }, xs: { span: 12 } }"
        >
          <a-form-item label="" :wrapper-col="{ span: 20, offset: 2 }">
            <a-row :gutter="8" type="flex" align="middle">
              <a-col :span="3" style="min-width: 100px;">
                <a-avatar :src="userImage" style="width: 84px;height: 84px" />
              </a-col>
              <a-col :span="10">
                <a-button type="link" @click="editAvatar">设置头像</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="姓名">
            <a-input v-if="isHcm" v-decorator="['name']" disabled />
            <a-input v-else v-decorator="['name', { rules: [{ required: true, message: '请输入姓名' }] } ]"
                     :maxLength="15" />
          </a-form-item>
          <a-form-item label="手机号" :wrapper-col="{ span: 16 }">
            <a-row :gutter="8">
              <a-col :span="12">
                <a-input v-decorator="['phone']" disabled />
              </a-col>
              <a-col :span="8">
                <a-button type="link" @click="onVisibleChange('phoneVisible', true)">修改</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="公司">
            <a-input v-decorator="['company']" disabled />
          </a-form-item>
          <template v-if="isHcm">
            <a-form-item label="部门">
              <a-input v-decorator="['department']" disabled />
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-decorator="['email']" disabled />
            </a-form-item>
          </template>
        </a-form>
      </a-spin>
    </div>
    <div class="content-footer">
      <a-button
        type="primary"
        html-type="submit"
        size="large"
        style="width: 120px;"
        @click="onSubmit"
      >更新
      </a-button>
    </div>

    <a-modal
      class="phone-edit-modal"
      centered
      :width="360"
      :title="null"
      :closable="false"
      :footer="false"
      :visible="phoneVisible"
      :confirm-loading="confirmLoading"
      @cancel="onPhoneVisibleChange()"
    >
      <h1 style="font-weight: bold;color: #121212;margin-bottom: 32px;">修改手机号</h1>

      <div style="margin-bottom: 20px;font-weight: 500">
        原手机号：{{form.getFieldValue("phone")}}
      </div>

      <a-form-model
        ref="phoneForm"
        :model="phoneForm"
        :rules="{
          newPhone: [{required: true, message: '请输入新手机号', trigger: 'blur'}],
          validate: [{required: true, message: '请输入验证码', trigger: 'blur'}]
        }"
      >
        <a-form-model-item prop="newPhone">
          <a-input
            class="form-input"
            v-model="phoneForm.newPhone"
            placeholder="请输入新的手机号"
            :maxLength="11"
            @change="phoneForm.newPhone = $event.target.value.replace(/\D/g, '')"
          />
        </a-form-model-item>
        <a-form-model-item class="flex-item-wrapper" prop="validate">
          <a-input
            class="form-input"
            v-model="phoneForm.validate"
            placeholder="请输入验证码"
            :maxLength="6"
            @change="phoneForm.validate= $event.target.value.replace(/\D/g, '')"
          />
          <a-button
            type="primary"
            style="min-width: 110px;height: 50px;margin-left: 8px;"
            :loading="verifyLoading"
            :disabled="disabledSendVerify"
            @click="sendVerify"
          >
            {{verifyLoading ? "发送中" : (validateTimer > 0 ? validateTimer + " 秒后重发" : "发送验证码")}}
          </a-button>
        </a-form-model-item>
      </a-form-model>

      <div class="form-footer">
        <a-button @click="onPhoneVisibleChange()">取消</a-button>
        <a-button type="primary" @click="onPhoneSubmit" :loading="confirmLoading">确定</a-button>
      </div>
    </a-modal>

    <a-modal
      class="avatar-edit-modal"
      title="设置照片"
      cancelText="取消"
      okText="确定"
      centered
      :width="500"
      :closable="false"
      :visible="avatarVisible"
      @cancel="onVisibleChange('avatarVisible', false)"
    >
      <a-upload
        name="avatar"
        class="avatar-uploader"
        accept=".jpg,.jpeg,.png,.webp"
        :showUploadList="false"
        :before-upload="() => false"
        :customRequest="function(){}"
        @change="onAvatarChange"
      >
        <a-button type="link">本地上传</a-button>
      </a-upload>

      <div class="cropper-wrapper">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :outputType="options.outputType"
          :original="options.original"
          :mode="options.mode"
          :fixedNumber="[1, 1]"
          :info="false"
          :fixed="true"
          :centerBox="true"
          @realTime="({w})=> sliderVal = w"
        />
      </div>

      <a-slider
        :tip-formatter="null"
        :min="0"
        :max="280"
        v-model="sliderVal"
        style="width: 80%;margin: 0 auto;"
        @change="resizeAvatar"
      />

      <template slot="footer">
        <a-button key="back" @click="onVisibleChange('avatarVisible', false)">取消</a-button>
        <a-button key="submit" type="primary" @click="onAvatarSubmit" :loading="confirmLoading">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import api from "@/api";
import { file2DataURL, dataURLtoFile, getBase64Img } from "@/utils/util";
import { mapActions } from "vuex"

const defaultAvatar = require("@/assets/img/user/avatar.png");
const PIC_TYPE = "png";
let tempAvatar = '';

export default {
  name: "userInfo",
  components: {
    VueCropper
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: "form" }),
      phoneForm: {
        newPhone: '',
        validate: ''
      },
      validateTimer: 0,
      isHcm: true,
      phoneVisible: false,
      avatarVisible: false,
      confirmLoading: false,
      verifyLoading: false,
      userImage: defaultAvatar, // 头像路径
      options: {
        img: '',//裁剪图片的地址
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: 280, //默认生成截图框宽度
        autoCropHeight: 280, //默认生成截图框高度
        fixedBox: false, //固定截图框大小 不允许改变
        outputType: PIC_TYPE,
        original: false,
        mode: "contain"
      },
      sliderVal: 0,
      isChange: false
    }
  },
  computed: {
    disabledSendVerify() {
      return (this.phoneForm.newPhone && !/^1[3456789]\d{9}$/.test(this.phoneForm.newPhone)) ||
        ['', this.form.getFieldValue('phone')].includes(this.phoneForm.newPhone) ||
        this.validateTimer > 0;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions([
      "FALLBACK"
    ]),
    initData() {
      var that = this;
      api.getUserInfo().then(res => {
        if (res.code !== 200) {
          that.$message.error(res.meassage);
        } else {
          const { data, data: { employeeOrganizationVOS: org } } = res;
          tempAvatar = data.userImage;
          // if (this.isChange) {
            window.localStorage.setItem("SD_USERAVATAR", data.userImage);
            that.$store.commit("setUseravatar", data.userImage);
          // }

          that.isHcm = data.type === 1; // 1 hcm员工 2 非hcm员工
          that.userImage = tempAvatar || defaultAvatar;
          that.form.setFieldsValue({
            name: data.userName,
            phone: data.phone,
            company: org.companyName,
            ...that.isHcm ? {
              department: org.departName,
              email: data.email
            } : {}
          });
        }
      });
    },
    onVisibleChange(type, value) {
      this[type] = value;
      console.log(type,value);
    },
    onPhoneVisibleChange(){
      this.phoneVisible = false;
      this.$refs.phoneForm.resetFields();
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          api.updateUserInfo({ userName: values.name }).then(res => {
            if (res.code !== 200) {
              // this.$message.error(res.message);
            } else {
              this.$message.success("修改成功");
              window.localStorage.setItem("SD_USERNAME", values.name);
              this.$store.commit("setUsername", values.name);
              this.onVisibleChange("phoneVisible", false);
            }
          });
        }
      });
    },
    onPhoneSubmit() {
      this.$refs.phoneForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          api.updateUserPhone({
            phone: this.phoneForm.newPhone,
            verifyCode: this.phoneForm.validate
          }).then(res => {
            if (res.code !== 200) {
              // this.$message.error(res.message);
            } else {
              this.$message.success("修改成功");
              this.$refs.phoneForm.resetFields();
              this.onVisibleChange("phoneVisible", false);
            }
          }).finally(() => {
            this.confirmLoading = false;
          })
        }
      });
    },
    sendVerify() {
      this.verifyLoading = true;
      api.sendCode({
        phoneNumber: this.phoneForm.newPhone,
        areaCode: "86"
      }).then(res => {
        this.validateTimer = 60;
        if (res.code !== 200) {
          // this.$message.error(res.message);
        } else {
          this.$message.success("验证码发送成功");
          const timer = setInterval(() => {
            const newVal = this.validateTimer - 1;
            this.validateTimer = newVal;
            if (newVal <= 0) {
              clearInterval(timer);
            }
          }, 1000);
        }
      }).catch(()=>{
        this.validateTimer = 0;
      }).finally(()=>{
        this.verifyLoading = false;
      });
    },
    editAvatar() {
      if (tempAvatar) {
        const url = this.userImage.split("/oss-backend")[1];
        // const url = this.userImage;
        getBase64Img("/oss-backend" + url, (base64) => {
          this.options = {
            ...this.options,
            img: base64,
            autoCropWidth: 200,
            autoCropHeight: 200,
            original: false,
            mode: "200px"
          };
        });
      } else {
        this.options.img = defaultAvatar;
      }
      this.onVisibleChange("avatarVisible", true);
    },
    onAvatarChange(info) {
      file2DataURL(info.file, imageUrl => {
        this.options = Object.assign({}, this.options, { img: imageUrl });
        this.resizeAvatar(200);
      });
    },
    onAvatarSubmit() {
      this.confirmLoading = true;
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData((data) => {
        // 转换为File对象
        let file = dataURLtoFile(data, "temp." + PIC_TYPE);

        const form = new FormData();
        form.append("image", file);
        api.updateUserAvatar(form).then(res => {
          if (res.code !== 200) {
            // this.$message.error(res.message);
          } else {
            this.$message.success("头像修改成功");
            this.isChange = true;
            this.avatarVisible = false;
            this.initData();
          }
        }).finally(() => {
          this.confirmLoading = false;
        });
      });
    },
    resizeAvatar(value) {
      Object.assign(this, {
        sliderVal: value,
        options: {
          ...this.options,
          autoCropWidth: value,
          autoCropHeight: value
        }
      });
    },
  },
}
</script>

<style lang="less" scoped>
.user-info {
  .user-form.ant-form {
    /deep/ .ant-row.ant-form-item {
      margin-bottom: 20px;

      .ant-input {
        max-width: 408px;
      }
    }
  }

  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.phone-edit-modal, .avatar-edit-modal {
  /deep/ .ant-modal .ant-modal-content {
    border-radius: 10px !important;

    .ant-modal-header {
      border-radius: 10px 10px 0 0;
    }
  }
}

.phone-edit-modal {
  /deep/ .ant-modal-body {
    padding: 30px;

    .ant-form-item {
      margin-bottom: 8px;

      .ant-form-item-children .ant-input {
        margin-bottom: 4px;
      }
    }

    .flex-item-wrapper .ant-form-item-children {
      display: flex;
    }

    .form-input {
      height: 50px;
      margin-bottom: 20px;
    }

    .form-footer {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;

      .ant-btn {
        height: 50px;
        width: 50%;
        font-size: 16px;

        &:first-child {
          margin-right: 18px;
        }
      }
    }
  }
}

.avatar-edit-modal {
  /deep/ .ant-modal-body {
    padding: 30px;
    text-align: center;

    .ant-slider {
      .ant-slider-rail {
        background-color: #FF0000;
      }

      .ant-slider-track {
        background-color: transparent;
      }

      .ant-slider-handle {
        border: solid 2px #FF0000;
        background-color: #FF0000;

        &:focus {
          box-shadow: 0 0 0 5px rgba(255, 0, 0, 0.2);
        }
      }
    }

    .cropper-wrapper {
      width: 280px;
      height: 280px;
      margin: 28px auto;
    }
  }

  .ant-modal-footer {
    height: 70px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .ant-btn {
      width: 80px;
    }
  }
}
</style>
