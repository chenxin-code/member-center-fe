<template>
  <div id="releaseMicroVersion">
    <div class="content-header">微应用版本发布
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <!-- <div class="content-main" style="height: calc(100% - 91px);">-->
    <div class="content-main" ref="contentMain">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"style="height: 100%;overflow: auto;margin-top: 20px"autoComplete="off">
        <a-form-item label="微应用名称">
          <a-select
              v-decorator="['programId',{ rules: [{ required: true, message: '微应用名称不能为空' }] }]"
              placeholder="请选择为应用名称"
              @change="microApplicationChange"
          >
            <a-select-option v-for="item in allMicroDataSource" :value="item.id" :key="item.id">{{
                item.name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="微应用版本">
          <a-input
              v-decorator="['publisher', { rules: [{ required: true, message: '微应用版本不能为空' },{whitespace: true,
              message: '微应用版本不能为空'}],getValueFromEvent: (event) => {return event.target.value.replace(/[\D]/g,'')} } ]"
              placeholder="请输入微应用版本"
          />
        </a-form-item>

        <a-form-item label="资源包">
          <a-select
              v-decorator="['resourceId']"
              placeholder="请选择资源包"
          >
            <a-select-option v-for="item in allReleasePackageDataSource" :key="item.id" :value="item.id">{{
                item.resourceName
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小区范围">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                      v-decorator="['id', { rules: [{ required: true, message: '项目不能为空' }] } ]">
            全部项目
          </a-checkbox>
          <a @click="chooseProject" style="margin-left:38px;">{{targetKeys.length === 0 ? "选择项目" : "已选" + targetKeys.length + "个项目"}}</a>
        </a-form-item>
        <a-form-item label="App版本">
          <a-select
              v-decorator="['mainVersion',{ rules: [{ required: true, message: 'APP版本不能为空' }] }]"
              placeholder="请选择App版本"
          >
           <a-select-option v-for="(item, key) in allAppVersionDataSource" :value="item.mainVersion" :key="key">{{
                item.name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">发布</a-button>
    </div>
    <!-- 选择小区 -->
    <a-modal v-model="visible" :centered="true" :maskClosable="false" title="选择小区"  width="960" @cancel="onCancel">
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
import { mapActions } from 'vuex';
import api from '@/api'
import vTransfer from "@/components/transfer";
export default {
  name: 'releaseMicroVersion',
  components: { vTransfer },
  props: {
    projectId: {
      type: Number,
      default: () => ({})
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'form' }),
      btnLoading: false,
      allMicroDataSource: [],
      allAppVersionDataSource: [],
      allReleasePackageDataSource: [],
      currentApplicationID: null,
      currentApplicationCode: null,
      leftColumns: [
        {
          dataIndex: "title",
          title: "项目",
        }
      ],
      rightColumns: [
        {
          dataIndex: "title",
          title: "项目",
        }
      ],
      mockData: [],
      targetKeys: [],
      oriTargetKeys: [],
      checkAll: false,
      indeterminate: false,
      visible: false,
      id: ""
    }
  },
  created () {
    this.id = this.projectId;
    console.log("id"+this.projectId)
    //获取系统内置应用(微应用名称)
    this.getAllMicroApplication();
    this.getProjectList();
  },
  methods: {
    handleConfirmPass(rule,value, callback){
      if(value)
      callback()
    },
    ...mapActions([
      'FALLBACK'
    ]),
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
      this.visible = true;
    },
    //确定按钮
    onConfirm() {
      this.visible = false;
      this.oriTargetKeys = this.targetKeys;
      this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
      this.checkAll = this.targetKeys.length === this.total;
      this.form.setFieldsValue({
        id: this.targetKeys
      });
      console.log(this.targetKeys)
    },
    //取消按钮
    onCancel() {
      this.visible = false;
      this.targetKeys = this.oriTargetKeys;
      this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
      this.checkAll = this.targetKeys.length === this.total;
      this.form.setFieldsValue({
        id: this.targetKeys
      });
    },
    //发布
    onSubmit(e) {
      e.preventDefault();
      if(this.form.getFieldsValue().id === false) {
        this.form.setFieldsValue({
          id: undefined
        });
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnLoading = true;
          values = {
            programId: values.programId,//微应用名称
            programVersion: values.publisher,//微应用版本
            resourceId: values.resourceId,//资源包
            projectIds: this.targetKeys,//小区范围
            mainVersion: values.mainVersion,//APP版本
          };
          api["microVersionRelease"](values).then(res => {
            if (res.code !== 200) {
            } else {
              this.$message.success("新增成功");
              this.$router.go(-1)
            }
          }).finally(()=>{
            this.btnLoading = false;
          });
        }
      });
    },
    microApplicationChange(value) {
      this.currentApplicationID = value;
      this.allMicroDataSource.forEach((item)=>{
        if (item.id === value) {
          this.currentApplicationCode = item.appCode
        }
      });
      this.getResourcePackage();
      this.getApplicationVersion()
    },
    getApplicationVersion() {
      const para = {
        appCode: this.currentApplicationCode,
      };
      api.getAllAppVersion(para).then(res => {
        if (res.code === 200) {
          this.allAppVersionDataSource = res.data;
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    //获取资源包
    getResourcePackage() {
      this.allReleasePackageDataSource = [];
      const para = {
        programId: this.currentApplicationID,
      };
      api.getResourcePackageNoPaging(para).then(res => {
        if (res.code === 200) {
          if (res.data.length == 0) {
            this.allReleasePackageDataSource = [];
          } else {
            this.allReleasePackageDataSource = res.data;
          }
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    //获取项目列表
    getProjectList() {
      api.microProject().then(res => {
        if (res.code === 200) {
          const newArr = res.data.map(item => ({
            key: item.id,
            title: item.name,
          }));
          this.mockData = newArr;
          this.total = res.data.length;
        }
      })
    },
    //获取系统内置应用(微应用名称)
    getAllMicroApplication() {
      const self = this;
      const programId = this.id;
      const para = {
        programId
      };
      api.allMicro(para).then(res => {
        if (res.code === 200) {
          this.allMicroDataSource = res.data;
          var currentIndex = 0;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == self.id) {
              currentIndex = i;
              break;
            }
          }
          this.currentApplicationID = this.allMicroDataSource[currentIndex].id;
          this.currentApplicationCode = this.allMicroDataSource[currentIndex].appCode;
          //获取对应的资源包列表
          this.getResourcePackage();
          //App版本
          this.getApplicationVersion()
        }
      }).finally(() => {
        //this.tableLoading = false;
      });
    }
  }
}
</script>

<style lang="less">
.fallback {
  cursor: pointer;
}

.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

