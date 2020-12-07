<template>
  <div style="height: 100%;">
    <div class="content-header">
      访客功能设置
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);padding: 20px;">
      <a-row type="flex" style="flex-flow: row;height:100%;">
        <a-col flex="186px" class="left-content">
          <a-input v-model="searchValue"  @change="onTreeSearchChange" placeholder="请输入项目名称">
            <a-tooltip slot="suffix" v-if="searchVisible === 1">
              <a-icon type="search" style="color: #CCCCCC" @click="onTreeSearch"/>
            </a-tooltip>
            <a-tooltip slot="suffix" v-if="searchVisible === 2">
              <a-icon type="close-circle" style="color: #CCCCCC" @click="onTreeSearchCancel"/>
            </a-tooltip>
          </a-input>
          <a-list class="left-list">
            <a-list-item v-for="item of tabList" :key="item.id" :class="{active: currentIndex === item.id}" @click="tabChange(item.id)">{{item.name}}</a-list-item>
          </a-list>
        </a-col>
        <a-col flex="auto" style="padding:0 10px;height:100%;">
          <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="height: 100%;overflow: auto;" autoComplete="off">
            <a-form-item label="门岗登记二维码">
              <a-spin class="img-div" :spinning="picUploading">
                <a-upload
                  name="avatar"
                  accept="image/jpeg,image/jpg,image/png"
                  list-type="picture-card"
                  :file-list="fileList"
                  v-decorator="['imageUrl', { rules: [{ required: true, message: '图片不能为空' }] } ]"
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
                可以将此码张贴在项目门岗处，访客使用微信扫码后可以进行访客登记。
              </span>
            </a-form-item>
            <a-form-item label="门岗核验">
              <a-radio-group v-decorator="['isVerification',{ initialValue: 0 }]">
                <a-radio :value="0">开启</a-radio>
                <a-radio :value="1">关闭</a-radio>
              </a-radio-group>
              <div style="margin-left:10px;color:#999999;font-size:12px;">
                此功能开启，则业主邀请的访客支持以门岗核验的方式放行。即在访客邀请小程序内展示门岗核验入口。
              </div>
            </a-form-item>
            <a-form-item label="访客开门">
              <a-radio-group v-decorator="['isOpen',{ initialValue: 0 }]">
                <a-radio :value="0">开启</a-radio>
                <a-radio :value="1">关闭</a-radio>
              </a-radio-group>
              <div style="margin-left:10px;color:#999999;font-size:12px;">
                此功能开启，则业主邀请的访客支持自助开门（蓝牙/二维码，根据项目实际门禁的情况）。即在访客邀请小程序内展示我要开门入口。
              </div>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" @click="onSubmit">保存</a-button>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import { debounce } from '@/utils/util';
  export default {
    name: "visitorSet",
    components: {

    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        tabList:[
          {id: 1,name: "玫瑰花园"},
          {id: 2,name: "时代花园"},
          {id: 3,name: "珠江花园"},
        ],
        originallyTabList:[
          {id: 1,name: "玫瑰花园"},
          {id: 2,name: "时代花园"},
          {id: 3,name: "珠江花园"},
        ],
        currentIndex: 1,
        curTab: 1,
        previewVisible: false,
        previewImage: "",
        fileList: [],
        picUploading: false,
        btnLoading: false,
        searchValue: "",
        searchVisible: 1
      }
    },
    computed: {},
    created() {

    },
    mounted() {

    },
    methods: {
      ...mapActions([
        "FALLBACK"
      ]),
      addPic({ fileList }) {
        if(this.fileList.length>0){
          const that = this;
          that.$confirm({
            title: "删除图片",
            content: "确定删除图片吗？",
            centered: true,
            okText: "确定",
            cancelText: "取消",
            onOk() {
              that.fileList = [];
              that.form.setFieldsValue({
                imageUrl: ""
              });
            },
          });
        }
        else {
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
                fileList.forEach((file) => {
                  formData.append("file", file.originFileObj);
                });
                formData.append('programCode',"app_advertising" );
                api.updateImage(formData).then(res => {
                  if (res.code === 200) {
                    console.log(this.fileList);
                    this.fileList[0]={ uid: "-1", url: res.data ? res.data : "" };
                  }
                }).finally(() => {
                  this.picUploading = false;
                });
              }
            }
          });
        }
      },
      handleCancel() {
        debounce(()=>{
          this.previewVisible = false;
        })
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
      //搜索事件
      onTreeSearchChange(e) {
        debounce(()=>{
          const value = e.target.value;
          if (value === "") {
            this.searchVisible = 1;
            this.tabList = this.originallyTabList;
          }
        })
      },
      //取消搜索
      onTreeSearchCancel() {
        debounce(()=>{
          this.searchValue = "";
          this.searchVisible = 1;
          this.tabList = this.originallyTabList;
        })
      },
      onTreeSearch() {
        debounce(()=>{
          if (this.searchValue === "") {
            this.searchVisible = 1;
            this.tabList = this.originallyTabList;
          } else {
            this.searchVisible = 2;
            this.tabList = this.originallyTabList;
            const chooseList = [];
            this.originallyTabList
              .map(item => {
                if (item.name.indexOf(this.searchValue) > -1) {
                  chooseList.push(item)
                }
              });
            this.tabList = chooseList;
          }
        })
      },
      tabChange(tar){
        this.curTab = tar;
        this.currentIndex = tar;
      },
      onSubmit() {
        debounce(()=>{
          // const isAdd = !this.notice.id;
          this.form.validateFields((err, values) => {
            if (!err) {
              values = {
                // id: !isAdd ? this.notice.id : undefined,
                // projectId: values.projectId,
                // title: values.title ? values.title.trim() : "",
              };
              api[isAdd ? "addPropertyNotice" : "updatePropertyNotice"](values).then(res => {
                if (res.code === 200) {
                  this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                  this.$router.push({ name: "propertyNotice" });
                }
              });
            }
          });
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .left-content{
    width: 100%;
    /*height: calc(100% - 91px);*/
    height: 100%;
    background: #F7F8FC;
    padding: 10px;
    .left-list{
      width: 100%;
      height:  calc(100% - 60px);
      overflow: auto;
      margin-top: 20px;
      li{
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        cursor: pointer;
      }
      li.active{
        background: #E2F3FF;
        border: 1px solid #4B7AFB;
        border-radius: 2px;
        color: #4B7AFB;
        font-family: PingFangSC-Semibold;
      }
    }
  }
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .img-div{
    width:140px;
    height:auto;
  }
  .ant-upload.ant-upload-select-picture-card{
    display: table;
    float: left;
    width: 140px;
    height: 140px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  .ant-upload-list-picture-card-container{
    float: left;
    width: 140px;
    height: auto;
    margin: 0 8px 8px 0;
    /*text-align: center;*/
  }
  .ant-upload-list-picture-card .ant-upload-list-item{
    float: left;
    width: 140px;
    height: auto;
    margin: 0 8px 8px 0;
  }
  .ant-modal-close-x{
    display: block;
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-style: normal;
    line-height: 30px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
  }
</style>
