<template>
  <div style="height: 100%;">
    <a-form
      :form="conponForm"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 14 }"
      style="height: 100%;overflow: auto;"
      autoComplete="off"
    >
      <a-form-item label="设置图片">
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
        <span style="margin-left:10px;color:#999999;font-size:12px;">
          建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
        </span>
      </a-form-item>
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">
        保存
      </a-button>
    </a-form>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';
import { debounce } from '@/utils/util';
export default {
  name: 'guidePageAppB',
  data() {
    return {
      conponForm: this.$form.createForm(this, { name: 'conponForm' }),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      picUploading: false,
      btnLoading: false
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
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
    //提交
    onSubmit(e) {
      debounce(() => {
        e.preventDefault();
        const isAdd = !this.id;
        this.conponForm.validateFields((err, values) => {
          if (!err) {
            this.btnLoading = true;
            values = {
              advertAreaId: 8,
              id: !isAdd ? this.id : undefined,
              title: values.title ? values.title.trim() : '',
              status: Number(values.status),
              advertPicture: this.fileList[0].url,
            };
            api[isAdd ? 'addAdvertise' : 'updateAdvertise'](values)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success((isAdd ? '新增' : '编辑') + '成功');
                }
              })
              .finally(() => {
                this.btnLoading = false;
              });
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
