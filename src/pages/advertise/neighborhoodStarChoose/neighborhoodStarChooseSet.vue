<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "添加" }}邻里星选
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;" autoComplete="off">
        <a-form-item label="标题" style="margin-top:16px;">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '标题不能为空' },{ message: '标题最长50个字',max: 50 },{whitespace: true,
              message: '标题不能为空'}] } ]"
            placeholder="请输入标题"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['status',{ initialValue: '0' }]"
            placeholder="请选择状态"
          >
            <a-select-option v-for="(item,key) in status" :key="key">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="适用项目">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                      v-decorator="['id', { rules: [{ required: true, message: '项目不能为空' }] } ]">
            全部项目
          </a-checkbox>
          <a @click="chooseProject" style="margin-left:38px;">{{targetKeys.length === 0 ? "选择项目" : "已选" + targetKeys.length + "个项目"}}</a>
        </a-form-item>
        <a-form-item label="设置图片">
          <a-spin :spinning="picUploading">
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
          <span style="margin-left:10px;color:#999999;font-size:12px;">建议上传尺寸为：494*618，格式为jpg、png，大小不超过5MB。</span>
        </a-form-item>
        <a-form-item label="优先级" style="margin-top:16px;">
          <a-input-number :min="1" :max="999" v-decorator="['priority', { rules: [{ required: true, message: '优先级不能为空' }] } ]" style="width:88px"/>
          <span style="margin-left:10px;color:#999999;font-size:12px;">取值范围1-999，数值越大优先级越高</span>
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['type',{ initialValue: '0' }]"
            placeholder="请选择类型"
            @change="onType"
          >
            <a-select-option v-for="(item, key) in type" :key="key">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="跳转链接" v-if="typeId == 0">
          <a-input
            v-decorator="['url', { rules: [{ required: true, message: '链接不能为空' },{ message: '链接最长500个字',max: 500 },{whitespace: true,
              message: '链接不能为空'}] } ]"
            placeholder="请输入链接"
          />
        </a-form-item>
        <a-form-item label="有赞链接" v-if="typeId == 0">
          <a-radio-group v-decorator="['isYouZan',{ initialValue: 1 }]">
            <a-radio :value="1">否</a-radio>
            <a-radio :value="0">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="详细内容" v-if="typeId == 1">
          <richTextLike
            v-decorator="['richText', { rules: [ { required: true, message: '请填写详细内容' }] }]"
            :urls="{
              picUpload: 'uploadPropertyNoticePic',
              previewQRCode: 'app_advertising'
            }"
          />
        </a-form-item>
        <a-form-item label="跳转模块" v-if="typeId == 2">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['model',{ initialValue: model[0].id }]"
            placeholder="请选择跳转模块"
          >
            <a-select-option v-for="item in model" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小程序ID" v-if="typeId == 3">
          <a-input
            v-decorator="['miniId', { rules: [{ required: true, message: '小程序ID不能为空' },{whitespace: true,
              message: '小程序ID不能为空'}] } ]"
            placeholder="miniId"
          />
        </a-form-item>
        <a-form-item label="小程序路径" v-if="typeId == 3">
          <a-input
            v-decorator="['miniPath', { rules: [{ required: true, message: '小程序路径不能为空' },{whitespace: true,
              message: '小程序路径不能为空'}] } ]"
            placeholder="miniPath"
          />
        </a-form-item>
        <a-form-model-item label="是否显示标题" v-if="typeId == 0 || typeId == 1 || typeId == 2 ||typeId == 3">
          <a-radio-group v-decorator="['isShowTitle',{ initialValue: 0 }]">
            <a-radio :value="0">显示</a-radio>
            <a-radio :value="1">不显示</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">保存</a-button>
    </div>
    <!-- 选择项目 -->
    <a-modal v-model="visible" :centered="true" :maskClosable="false" title="选择项目"  width="960" @cancel="onCancel">
      <template slot="footer">
        <a-button key="back" @click="onCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="onConfirm">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <div style="width:796px;height:480px;">
            <vTransfer v-model="targetKeys" :mockData="mockData" :leftColumns="leftColumns" :rightColumns="rightColumns"/>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex";
  import { ADVERTISE_SKIP_TYPE } from "@/constance";
  import moment from "moment"
  import { debounce } from "@/utils/util";
  import richTextLike from "@/components/richTextLike";
  import vTransfer from "@/components/transfer";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  export default {
    name: "neighborhoodStarChooseSet",
    components: {AFormItem, richTextLike,vTransfer },
    props: {
      id: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        loading: false,
        type: ADVERTISE_SKIP_TYPE,
        status: {
          0: "启用",
          1: "禁用",
        },
        model: [],
        types: [],
        visible: false,
        typeId: 0,
        leftColumns: [
          {
            dataIndex: "title",
            title: "项目",
          },
          {
            dataIndex: "orgName",
            title: "城市公司",
          },
        ],
        rightColumns: [
          {
            dataIndex: "title",
            title: "项目",
          },
          {
            dataIndex: "orgName",
            title: "城市公司",
          },
        ],
        mockData: [],
        targetKeys: [],
        oriTargetKeys: [],
        checkAll: false,
        indeterminate: false,
        total: "",
        previewVisible: false,
        previewImage: "",
        fileList: [],
        picUploading: false,
        btnLoading: false,
        modelData: {}
      }
    },
    computed: {},
    created() {

    },
    mounted() {
      this.getProjectList();
      this.getModel()
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      onType(e) {
        this.typeId = e;
        console.log(this.typeId)
      },
      onCheckAllChange(e) {
        Object.assign(this, {
          checkAll: e.target.checked,
        });
        if (this.checkAll === true) {
          this.targetKeys = [];
          this.mockData.forEach((item)=>{
            this.targetKeys.push(item.key)
          });
          this.oriTargetKeys = this.targetKeys;
          this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
          this.checkAll = this.targetKeys.length === this.total;
        }else{
          this.targetKeys = [];
          this.oriTargetKeys = this.targetKeys;
        }
      },
      //选择项目
      chooseProject() {
        debounce(()=>{
          this.visible = true;
        })
      },
      addPic({ fileList = [] } = {}) {
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
      //确定按钮
      onConfirm() {
       debounce(()=>{
         this.visible = false;
         this.oriTargetKeys = this.targetKeys;
         this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
         this.checkAll = this.targetKeys.length === this.total;
         this.form.setFieldsValue({
           id: this.targetKeys
         });
         console.log(this.targetKeys)
       })
      },
      //取消按钮
      onCancel() {
       debounce(()=>{
         this.visible = false;
         this.targetKeys = this.oriTargetKeys;
         this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
         this.checkAll = this.targetKeys.length === this.total;
         this.form.setFieldsValue({
           id: this.targetKeys
         });
       })
      },
      //获取详情
      getData() {
        if (this.id?.id) {
          api.getAdvertiseDetail({ advertId: this.id.id }).then(res => {
            if (res.code === 200) {
              const data = res.data;
              this.targetKeys = res.data.projectIds ? res.data.projectIds : [];
              this.oriTargetKeys = res.data.projectIds ? res.data.projectIds : [];
              this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
              this.checkAll = this.targetKeys.length === this.total;
              this.typeId = res.data.type;
              this.fileList.push({ uid: "-1", url: res.data.advertPicture });
              this.$nextTick(()=>{
                this.form.setFieldsValue({
                  title: data.title,
                  status: data.status.toString(),
                  id: true,
                  type: data.type.toString(),
                  imageUrl: data.advertPicture,
                  priority: data.priorityLevel,
                  url: data.url,
                  isYouZan: data.youzan,
                  richText:  data.customContent,
                  model: Number(data.microappId),
                  miniId: data.miniId,
                  miniPath: data.miniPath,
                  isShowTitle: data.isShowTitle,
                });
              });
              console.log(data)
            }
          });
        }
      },
      //获取模块
      getModel() {
        api.advertiseModel().then(res => {
          if (res.code === 200) {
            this.model = res.data
          }
        })
      },
      //获取列表
      getProjectList() {
        api.advertiseProject().then(res => {
          if (res.code === 200) {
            const newArr = res.data.map(item => ({
              key: item.id,
              title: item.name,
              orgId: item.orgId,
              orgName: item.orgName,
            }));
            this.mockData = newArr;
            this.total = res.data.length;
            this.getData()
          }
        })
      },
      //保存
      onSubmit(e) {
        debounce(()=>{
          e.preventDefault();
          if(this.typeId == 2) {
            this.model.forEach((item)=>{
              if(item.id === this.form.getFieldsValue().model) {
                this.modelData = item;
              }
            });
          }
          if(this.form.getFieldsValue().id === false) {
            this.form.setFieldsValue({
              id: undefined
            });
          }
          const isAdd = !this.id.id;
          this.form.validateFields((err, values) => {
            if (!err) {
              this.btnLoading = true;
              values = {
                advertAreaId: 6,
                id: !isAdd ? this.id.id : undefined,
                title: values.title ? values.title.trim() : "",
                status: Number(values.status),
                advertPicture:this.fileList[0].url,
                projectIds: this.targetKeys,
                type: Number(values.type),
                priorityLevel: values.priority,
                //url: values.url ? values.url.trim() : "",
                youzan: values.isYouZan,
                // customContent: isAdd ? JSON.stringify(values.richText) : values.richText,
                customContent: values.richText,
                url: values.url ? values.url.trim() : this.typeId == 2 ? this.modelData.uri : "",
                model: this.modelData.name ? this.modelData.name : "",
                routerType: this.modelData.type ?  this.modelData.type : "",
                microappId: this.modelData.id ? this.modelData.id : "",
                miniId: values.miniId ? values.miniId.trim() : "",
                miniPath: values.miniPath ? values.miniPath.trim() : "",
                isShowTitle: values.isShowTitle,
              };
              api[isAdd ? "addAdvertise" : "updateAdvertise"](values).then(res => {
                if (res.code === 200) {
                  this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                  this.$router.push({ name: "neighborhoodStarChoose" });
                }
              }).finally(()=>{
                this.btnLoading = false;
              });
            }
          });
        })
      },
    }
  }
</script>

<style lang="less">
  .content-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & > *:not(.last-child) {
      margin-right: 10px;
    }
  }
  /*.img-div{*/
  /*  width:335px;*/
  /*  height:auto;*/
  /*}*/
  .ant-upload.ant-upload-select-picture-card{
    display: table;
    float: left;
    width: 335px;
    height: 115px;
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
    width: 335px;
    height: auto;
    margin: 0 8px 8px 0;
    /*text-align: center;*/
  }
  .ant-upload-list-picture-card .ant-upload-list-item{
    float: left;
    width: 335px;
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

