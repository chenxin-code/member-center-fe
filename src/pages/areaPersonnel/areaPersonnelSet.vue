<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "添加" }}区域人员
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;" autoComplete="off">
        <a-form-item label="项目" style="margin-top:16px;">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['projectId',{ rules: [{ required: true, message: '项目不能为空' }] }]"
            placeholder="请选择项目"
            @change="onProject"
          >
            <a-select-option v-for="item in projectData" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['role',{ rules: [{ required: true, message: '所属角色不能为空' }] }]"
            placeholder="请选择角色"
            @change="onRole"
          >
            <a-select-option v-for="item in roleData" :key="item.code">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择员工">
          <a @click="chooseStaff">{{staffKeys.length === 0 ? "选择员工" : staffKeys[0].userName}}</a>
          <span style="font-size:14px;color:#f5222d !important;margin-left:40px;" v-if="visible === 2">员工不能为空</span>
          <span style="font-size:14px;color:#f5222d !important;margin-left:40px;" v-if="visible === 1">请先选择所属角色</span>
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '联系电话不能为空' },{ pattern:/^1[3456789]\d{9}$/,message: '联系电话格式错误' }] } ]"
            placeholder="请输入联系方式"
          />
        </a-form-item>
        <a-form-item label="管辖范围">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                      v-decorator="['id', { rules: [{ required: true, message: '管辖范围不能为空' }] } ]">
            全部区域
          </a-checkbox>
          <a @click="chooseArea" style="margin-left:38px;">{{targetKeys.length === 0 ? "选择区域" : "已选" + targetKeys.length + "个区域"}}</a>
        </a-form-item>
        <a-form-item label="设置照片">
          <div class="img-div" @click="editAvatar" v-if="img == ''">
            <a-icon type="plus"/>
            <span class="text">
              上传图片
            </span>
          </div>
          <div v-else>
            <img :src="img"  class="img" @click="editAvatar"/>
          </div>
          <span style="margin-left:10px;color:#999999;font-size:12px;">图片要求：建议上传尺寸为：86*106，格式为jpg、png，大小不超过5MB。不传图片，则显示默认照片</span>
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">保存</a-button>
    </div>
    <!-- 选择人员 -->
    <a-modal v-model="staffVisible" :centered="true" :maskClosable="false" title="选择员工"  width="960" @cancel="onStaffCancel">
      <template slot="footer">
        <a-button key="back" @click="onStaffCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="onStaffConfirm">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="请输入员工姓名" @change="onSearch"></a-input>
          <div style="width:500px;height:480px;">
            <a-table
              :columns="tableColumns"
              :data-source="staffData"
              :pagination="false"
              :scroll="{ y: 400 }"
              :rowKey="(r,i) => i"
              style="width:100%;margin-top:8px;"
              :selectable="false"
              :row-selection="
                rowSelection
              "
            ></a-table>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 选择区域 -->
    <a-modal v-model="areaVisible" :centered="true" :maskClosable="false" title="选择区域"  width="960" @cancel="onAreaCancel">
      <template slot="footer">
        <a-button key="back" @click="onAreaCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="onAreaConfirm">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <div style="width:796px;height:480px;">
            <vTransfer v-model="targetKeys" :mockData="areaData" :leftColumns="areaLeftColumns" :rightColumns="areaRightColumns"/>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--    -->
    <a-modal
      class="avatar-edit-modal"
      title="设置照片"
      okText="确定"
      cancelText="取消"
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
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment";
  import { debounce } from '@/utils/util';
  import vTransfer from "@/components/transfer";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import { VueCropper } from "vue-cropper";
  import { file2DataURL, dataURLtoFile, getBase64Img } from "@/utils/util";
  const defaultAvatar = require("@/assets/img/user/avatar.png");
  const PIC_TYPE = "png";
  let tempAvatar = "";
  export default {
    name: "areaPersonnelSet",
    components: {AFormItem,vTransfer,VueCropper },
    props: {
      project: {
        type: Object,
        default: () => ({})
      },
      id: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        projectData: [],
        roleData: [],
        projectId: "",
        roleCode: "",
        roleName: "",
        //选择员工
        staffData: [],
        originallyStaffData: [],
        staffKeys: [],
        staffOriTargetKeys: [],
        chooseStaffKey: [],
        chooseStaffIndex: [],
        chooseStaffOriTargetIndex: [],
        staffVisible: false,
        //选择区域
        areaData: [],
        targetKeys: [],
        areaOriTargetKeys: [],
        areaVisible: false,
        checkAll: false,
        indeterminate: false,
        total: "",
        areaLeftColumns: [
          {
            dataIndex: "title",
            title: "区域",
          }
        ],
        areaRightColumns: [
          {
            dataIndex: "title",
            title: "区域",
          }
        ],
        previewVisible: false,
        previewImage: "",
        fileList: [],
        picUploading: false,
        btnLoading: false,
        tableColumns: [
          {
            title: "员工",
            key: "userName",
            dataIndex: "userName",
          },
          {
            title: "手机号",
            key: "phone",
            dataIndex: "phone",
          },
        ],
        rowSelection: {
          type: "radio",
          selections: true,
          selectedRowKeys: [],
          onChange:this.onChange
        },
        avatarVisible: false,
        confirmLoading: false,
        verifyLoading: false,
        //userImage: defaultAvatar, // 头像路径
        options: {
          img: "",//裁剪图片的地址
          autoCrop: true, //是否默认生成截图框
          autoCropWidth: 280, //默认生成截图框宽度
          autoCropHeight: 280, //默认生成截图框高度
          fixedBox: false, //固定截图框大小 不允许改变
          outputType: PIC_TYPE,
          original: false,
          mode: "contain"
        },
        sliderVal: 0,
        isChange: false,
        img: "",
        visible: 0,
        areaTime: 0
      }
    },
    computed: {},
    created() {

    },
    mounted() {
      if(this.project.id) {
        this.form.setFieldsValue({
          projectId: this.project.id
        });
        this.projectId = this.project.id;
      }else{
        // this.form.setFieldsValue({
        //   projectId: this.id.id
        // });
        this.projectId = this.id.projectId;
      }
      this.getMyProject();//获取项目列表
      this.getAreaList();//获取区域列表
      this.getMyRole();//获取角色列表
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      //选择员工
      chooseStaff() {
        debounce(()=>{
          console.log(this.form.getFieldsValue().role);
          if (this.form.getFieldsValue().role === undefined) {
            this.visible = 1
          } else {
            this.visible = 0;
            this.staffVisible = true;
          }
        })
      },
      //选择员工搜索事件
      onSearch(e) {
        const value = e.target.value;
        const chooseList = [];
        if (value === "") {
          this.staffData = this.originallyStaffData;
          if (this.chooseStaffKey[0]) {
            this.staffData.forEach((item,index)=>{
              if (item.id == this.chooseStaffKey[0].id) {
                this.rowSelection.selectedRowKeys = [index]
              }
            })
          }
        } else {
          this.staffData
            .map(item => {
              if (item.userName.indexOf(value) > -1) {
                chooseList.push(item)
              }
            });
          this.staffData = chooseList;
          if (this.chooseStaffKey[0]) {
            this.staffData.forEach((item,index)=>{
              if (item.id == this.chooseStaffKey[0].id) {
                this.rowSelection.selectedRowKeys = [index]
              } else {
                this.rowSelection.selectedRowKeys = []
              }
            })
          }
        }
      },
      //radio的change事件
      onChange(selectedRowKeys, selectedRows) {
        this.rowSelection.selectedRowKeys = selectedRowKeys;
        this.chooseStaffKey = selectedRows;
        this.chooseStaffIndex = selectedRowKeys;
        // console.log(this.chooseStaffKey)
      },
      //选择员工确定按钮
      onStaffConfirm() {
        debounce(()=>{
          this.staffVisible = false;
          this.staffKeys = this.chooseStaffKey;
          this.staffOriTargetKeys = this.chooseStaffKey;
          this.rowSelection.selectedRowKeys = this.chooseStaffIndex;
          this.chooseStaffOriTargetIndex = this.chooseStaffIndex;
          console.log(this.staffKeys);
          this.form.setFieldsValue({
            phone: this.staffKeys[0].phone
          });
          if (this.staffKeys.length > 0) {
            this.visible = 0
          }
        })
      },
      //选择员工取消按钮
      onStaffCancel() {
        debounce(()=>{
          this.staffVisible = false;
          this.staffKeys = this.staffOriTargetKeys;
          this.rowSelection.selectedRowKeys = this.chooseStaffOriTargetIndex;
          if (this.staffKeys.length > 0) {
            this.visible = 0
          } else {
            this.visible = 2
          }
        })
      },
      //选择区域
      chooseArea() {
       debounce(()=>{
         this.areaVisible = true;
       })
      },
      onCheckAllChange(e) {
        Object.assign(this, {
          checkAll: e.target.checked,
        });
        if (this.checkAll === true) {
          this.targetKeys = [];
          this.areaData.forEach((item)=>{
            this.targetKeys.push(item.key)
          });
          this.areaOriTargetKeys = this.targetKeys;
          this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
          this.checkAll = this.targetKeys.length === this.total;
        }else{
          this.targetKeys = [];
          this.areaOriTargetKeys = this.targetKeys;
        }
      },
      //选择区域确定按钮
      onAreaConfirm() {
        debounce(()=>{
          this.areaVisible = false;
          this.areaOriTargetKeys = this.targetKeys;
          this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
          this.checkAll = this.targetKeys.length === this.total;
          this.form.setFieldsValue({
            id: this.targetKeys
          });
          console.log(this.targetKeys)
        })
      },
      //选择区域取消按钮
      onAreaCancel() {
       debounce(()=>{
         this.areaVisible = false;
         this.targetKeys = this.areaOriTargetKeys;
         this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
         this.checkAll = this.targetKeys.length === this.total;
         this.form.setFieldsValue({
           id: this.targetKeys
         });
       })
      },
      //设置照片
      onVisibleChange(type, value) {
        this[type] = value;
      },
      editAvatar() {
        if (tempAvatar) {
          const url = this.img.split("/oss-frontend")[1];
          getBase64Img("/oss-frontend" + url, (base64) => {
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
          form.append("file", file);
          form.append('programCode',"app_area_emp" );
          api.updateImage(form).then(res => {
            if (res.code === 200) {
              this.img = res.data;
              tempAvatar = this.img
              console.log(res.data);
              this.avatarVisible = false;
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
      //获取项目列表
      getMyProject() {
        api.areaPersonnelProject().then(res => {
          if (res.code === 200) {
            this.projectData = res.data;
          }
        });
      },
      //获取角色
      getMyRole() {
        api.areaPersonnelRoles().then(res => {
          if (res.code === 200) {
            this.roleData = res.data;
          }
        });
      },
      onProject(e) {
        this.projectId = e;
        this.targetKeys = [];
        this.areaOriTargetKeys = this.targetKeys;
        this.indeterminate = false;
        this.checkAll = false;
        this.getStaff();
        this.getAreaList()
      },
      onRole(e) {
        this.roleCode = e;
        this.visible = 0;
        this.roleData.forEach((item)=>{
          if (item.code == e) {
            this.roleName = item.name;
          }
        });
        this.getStaff()
      },
      //获取员工
      getStaff() {
        if (this.projectId && this.roleCode) {
          const para = {
            projectId: this.projectId,
            roleCode: this.roleCode
          };
          api.areaPersonnelStaff(para).then(res => {
            if (res.code === 200) {
              this.staffData = res.data;
              this.originallyStaffData = res.data;
              if (this.chooseStaffKey[0]) {
                this.staffData.forEach((item,index)=>{
                  if (item.id == this.chooseStaffKey[0].id) {
                    this.rowSelection.selectedRowKeys = [index];
                  }
                })
              }
            }
          });
        }
      },
      //获取区域列表
      getAreaList() {
        const para = {
          projectId: this.projectId
        };
        api.areaPersonnelArea(para).then(res => {
          if (res.code === 200) {
            const newArr = res.data.map(item => ({
              key: item.id,
              title: item.areaName,
              projectId: item.projectId,
            }));
            this.areaData = newArr;
            this.total = this.areaData.length;
            if(this.areaTime === 0) {
              this.areaTime = 1;
              this.getData()
            }
          }
        })
      },
      //获取详情
      getData() {
        if (this.id?.id) {
          api.areaPersonnelDetail({ regionUserId: this.id.id }).then(res => {
            if (res.code === 200) {
              const data = res.data;
              this.targetKeys = data.regionIds;
              this.areaOriTargetKeys = data.regionIds;
              this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
              this.checkAll = this.targetKeys.length === this.total;
              this.img = data.imageUrl;
              tempAvatar = data.imageUrl;
              this.chooseStaffKey = [{userName:data.userName,id:data.userId}];
              this.roleName = data.roleName;
              this.staffKeys = this.chooseStaffKey;
              this.staffOriTargetKeys = this.chooseStaffKey;
              this.projectId = data.projectId;
              this.roleCode = data.roleCode;
              this.form.setFieldsValue({
                projectId: data.projectId,
                role: data.roleCode,
                phone: data.phone,
                id: true,
                imageUrl: data.imageUrl,//图片
              });
              this.getStaff();
              console.log(data)
            }
          });
        }
      },
      //保存
      onSubmit(e) {
        debounce(()=>{
          e.preventDefault();
          if (this.staffKeys.length === 0) {
            this.visible = 2;
          } else {
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
                  id: !isAdd ? this.id.id : undefined,
                  projectId: values.projectId,
                  roleCode: this.roleCode,
                  roleName: this.roleName,
                  userId: this.staffKeys[0].id,
                  userName: this.staffKeys[0].userName,
                  phone: values.phone,
                  regionIds: this.targetKeys,
                  imageUrl: this.img
                };
                api[isAdd ? "addAreaPersonnel" : "updateAreaPersonnel"](values).then(res => {
                  if (res.code === 200) {
                    this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                    this.$router.push({ name: "areaPersonnel" });
                  }
                }).finally(()=>{
                  this.btnLoading = false;
                });
              }
            });
          }
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
  .img-div{
    width: 86px;
    height: 106px;
    background: #F7F8FC;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
  }
  .text{
    width: 100%;
    text-align: center;
  }
  .img{
    width: 86px;
    height: auto;
  }
  .avatar-edit-modal {
    /deep/ .ant-modal .ant-modal-content {
      border-radius: 10px !important;

      .ant-modal-header {
        border-radius: 10px 10px 0 0;
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
      justify-content: flex-end;
      align-items: center;

      .ant-btn {
        width: 80px;
      }
    }
  }
</style>
