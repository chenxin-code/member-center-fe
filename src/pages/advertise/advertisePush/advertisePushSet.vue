<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "添加" }}广告推送
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
        <a-form-item label="推送状态">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['status',{ initialValue: '0' }]"
            placeholder="请选择状态"
            @change="onStatus"
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
        <a-form-item label="推送用户">
          <a-radio-group v-model="isPush"  @change="onPushChange">
            <a-radio :value="0">按用户身份</a-radio>
            <a-radio :value="1">按业主标签</a-radio>
          </a-radio-group>
          <div v-if="isPush === 0">
            <a-checkbox :indeterminate="indeterminateIdentity" :checked="checkAllIdentity" @change="onCheckAllChangeIdentity"
                        v-decorator="['user', { rules: [{ required: true, message: '用户不能为空' }] } ]" style="margin-left: 20px;">
              全部
            </a-checkbox>
            <a-checkbox-group  v-model="identityList" @change="onIdentityChange" style="margin-left: 38px;">
              <a-checkbox v-for="(item,index) in identityData" :key="index" :value="item.id">{{item.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-if="isPush === 1">
            <a-checkbox :indeterminate="indeterminateLabel" :checked="checkAllLabel" @change="onCheckAllChangeLabel"
                        v-decorator="['userLabel', { rules: [{ required: true, message: '用户不能为空' }] } ]" style="margin-left: 20px;">
              全部用户
            </a-checkbox>
            <a @click="choosePushUser" style="margin-left:38px;border: none;outline: none;color: #4B7AFB">{{labelList.length === 0 ? "选择用户" : "已选" + labelList.length + "类用户"}}</a>
          </div>
        </a-form-item>
        <a-form-item label="推送时间" v-if="statusId == 1">
          <a-date-picker
            :getCalendarContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            format="YYYY-MM-DD HH:mm:ss"
            v-decorator="['date',{ rules: [{ required: true, message: '时间不能为空' }] },]"
            :disabled-date="disabledDate"
            :disabled-time="disabledDateTime"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm') }"
            @change="onChange"
          />
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
        <a-form-item label="是否显示标题" v-if="typeId == 0 || typeId == 1 || typeId == 2 ||typeId == 3">
          <a-radio-group v-decorator="['isShowTitle',{ initialValue: 0 }]">
            <a-radio :value="0">显示</a-radio>
            <a-radio :value="1">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" :loading="btnLoading" @click="onSubmit">推送</a-button>
    </div>
    <!-- 选择项目 -->
    <a-modal v-model="visible" :centered="true" :maskClosable="false" title="选择项目"  width="960" @cancel="onProjectCancel">
      <template slot="footer">
        <a-button key="back" @click="onProjectCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="onProjectConfirm">
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
    <!-- 选择用户 -->
    <a-modal v-model="userVisible" :centered="true" :maskClosable="false" title="选择用户"  width="570" @cancel="addHandleCancel">
      <template slot="footer">
        <a-button key="back" @click="addHandleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary"  @click="addHandleOk">
          确定
        </a-button>
      </template>
      <div style="width:400px;height:300px;overflow:auto;">
        <a-checkbox-group  v-model="checkedList" @change="onLabelChange" >
          <div v-for="(item,index) in tagOptions" :key="index" style="width:100%;margin-top:10px;">
            <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  import { debounce } from '@/utils/util';
  import richTextLike from "@/components/richTextLike";
  import vTransfer from "@/components/transfer";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  export default {
    name: "guidePageAppCSet",
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
        defaultData: {
          0: "是",
          1: "否",
        },
        type: {
          0: "链接",
          1: "自定义",
          2: "模块",
        },
        status: {
          0: "立即推送",
          1: "定时推送",
        },
        statusId: 0,
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
        userVisible: false,
        btnLoading: false,
        day: new Date().getDate(),
        hours: "",
        tagOptions: [],
        checkedList: [],
        chooseData: [],
        labelList: [],
        identityData: [
          {
            id: 1,
            name: "业主"
          },
          {
            id: 2,
            name: "租户"
          },
          {
            id: 3,
            name: "商户"
          },
          {
            id: 4,
            name: "前期管理费单位"
          },
          {
            id: 5,
            name: "家人"
          },
          {
            id: 6,
            name: "朋友"
          },
        ],
        isPush: 0,
        checkAllLabel: false,
        indeterminateLabel: false,
        checkAllIdentity: false,
        indeterminateIdentity: false,
        identityList: [],
        modelData: {}
      }
    },
    computed: {},
    created() {

    },
    mounted() {
      this.form.setFieldsValue({
        user: this.identityList
      });
      this.getUserLabel();
      this.getProjectList();
      this.getModel();
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      onPushChange(e) {
        console.log(e.target.value);
        if(e.target.value === 0) {
          this.checkedList = [];
          this.labelList = [];
          this.checkAllLabel = false;
          this.indeterminateLabel = false;
        } else {
          this.identityList = [];
          this.checkAllIdentity = false;
          this.indeterminateIdentity = false;
        }
      },
      onChange(e) {
        this.day = moment(e).format("DD");
        this.hours = moment(e).format("HH");
      },
      disabledDate(current) {
        return current && current < Date.now() - 8.64e7;
      },
      range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      },
      disabledDateTime() {
        const day = new Date().getDate();
        const hours = new Date().getHours();
        const min = new Date().getMinutes();
        if (this.day == day) {
          if (this.hours != hours) {
            return {
              disabledHours: () => this.range(0,hours),
              disabledMinutes: () => this.range(),
              disabledSeconds: () => this.range(),
            };
          }else{
            return {
              disabledHours: () => this.range(0,hours),
              disabledMinutes: () => this.range(0,min+1),
              disabledSeconds: () => this.range(),
            };
          }
        }
      },
      onType(e) {
        this.typeId = e;
      },
      onStatus(e) {
        this.statusId = e;
      },
      //项目
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
      //选择项目确定按钮
      onProjectConfirm() {
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
      //选择项目取消按钮
      onProjectCancel() {
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
      //选择用户
      onIdentityChange(checkedList) {
        this.identityList = checkedList;
        console.log(this.identityList);
        this.indeterminateIdentity = !!this.identityList.length && this.identityList.length < this.identityData.length;
        this.checkAllIdentity = this.identityList.length === this.identityData.length;
        if(this.identityList.length > 0) {
          this.form.setFieldsValue({
            user: this.identityList
          });
        } else {
          this.form.setFieldsValue({
            user: this.identityList
          });
        }

      },
      //选择用户
      onCheckAllChangeIdentity(e) {
        Object.assign(this, {
          checkAllIdentity: e.target.checked,
        });
        if (this.checkAllIdentity === true) {
          this.identityList = [];
          this.identityData.forEach((item)=>{
            this.identityList.push(item.id)
          });
          this.indeterminateIdentity = !!this.identityList.length && this.identityList.length < this.identityData.length;
          this.checkAllIdentity = this.identityList.length === this.identityData.length;
        }else{
          this.identityList = [];
        }
      },
      //选择业主标签
      onLabelChange(checkedList) {
        this.checkedList = checkedList;
        console.log(this.checkedList)
      },
      //选择业主标签
      onCheckAllChangeLabel(e) {
        Object.assign(this, {
          checkAllLabel: e.target.checked,
        });
        if (this.checkAllLabel === true) {
          this.labelList = [];
          this.tagOptions.forEach((item)=>{
            this.labelList.push(item.id)
          });
          this.checkedList = this.labelList;
          this.indeterminateLabel = !!this.labelList.length && this.labelList.length < this.tagOptions.length;
          this.checkAllLabel = this.labelList.length === this.tagOptions.length;
        }else{
          this.labelList = [];
          this.checkedList = [];
        }
      },
      //添加标签的取消按钮
      addHandleCancel() {
        debounce(()=>{
          this.userVisible = false;
          const chooseList = [];
          for (let i = 0; i < this.labelList.length; i++) {
            const node = this.labelList[i];
            const id = node.id;
            if (this.chooseData.some(item => item.id === id)) {
              chooseList.push(id);
            }
          }
          this.checkedList=chooseList;
          this.indeterminateLabel = !!this.labelList.length && this.labelList.length < this.tagOptions.length;
          this.checkAllLabel = this.labelList.length === this.tagOptions.length;
          console.log(this.checkedList)
        })
      },
      //添加标签的确定按钮
      addHandleOk() {
        debounce(()=>{
          // this.labelList = [];
          this.chooseData = [];
          this.userVisible = false;
          for (let i = 0; i < this.tagOptions.length; i++) {
            const node = this.tagOptions[i];
            const id = node.id;
            const name = node.name;
            if (this.checkedList.some(item => item === id)) {
              this.chooseData.push({id:id,name:name});
            }
          }
          this.labelList = this.chooseData;
          this.indeterminateLabel = !!this.labelList.length && this.labelList.length < this.tagOptions.length;
          this.checkAllLabel = this.labelList.length === this.tagOptions.length;
          this.form.setFieldsValue({
            userLabel: this.labelList
          });
        })
      },
      //选择用户
      choosePushUser() {
        debounce(()=>{
          this.userVisible = true
        })
      },
      //确定按钮
      onPushUserConfirm() {
        debounce(()=>{
          this.userVisible = false
        })
      },
      //取消按钮
      onPushUserCancel() {
        debounce(()=>{
          this.userVisible = false
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
              this.isPush = data.pushType;
              if(data.pushType === 0) {
                this.identityList = data.identities;
                this.indeterminateIdentity = !!this.identityList.length && this.identityList.length < this.identityData.length;
                this.checkAllIdentity = this.identityList.length === this.identityData.length;
              } else {
                this.checkedList = data.labels;
                this.labelList = data.labels;
                this.indeterminateLabel = !!this.labelList.length && this.labelList.length < this.tagOptions.length;
                this.checkAllLabel = this.labelList.length === this.tagOptions.length;
              }
              this.typeId = res.data.type;
              this.statusId = res.data.pushStatus;
              this.$nextTick(()=>{
                this.form.setFieldsValue({
                  title: data.title,
                  status: data.pushStatus.toString(),
                  id: true,
                  user: data.pushType === 0 ? true : false,
                  userLabel: data.pushType === 1 ? true : false,
                  type: data.type.toString(),
                  date: moment(data.pushTime).format("YYYY-MM-DD HH:mm:ss"),
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
      //获取项目列表
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
      //获取用户标签
      getUserLabel() {
        api.advertiseUserLabel().then(res => {
          if (res.code === 200) {
            // console.log(res.data);
            this.tagOptions = res.data
          }
        })
      },
      //获取模块
      getModel() {
        api.advertiseModel().then(res => {
          if (res.code === 200) {
            this.model = res.data
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
          if(this.form.getFieldsValue().user === false) {
            this.form.setFieldsValue({
              user: undefined
            });
          }
          if(this.form.getFieldsValue().userLabel === false) {
            this.form.setFieldsValue({
              userLabel: undefined
            });
          }
          const isAdd = !this.id.id;
          this.form.validateFields((err, values) => {
            if (!err) {
              this.btnLoading = true;
              values = {
                advertAreaId: 9,
                id: !isAdd ? this.id.id : undefined,
                pushStatus: values.status,
                title: values.title ? values.title.trim() : "",
                projectIds: this.targetKeys,
                pushType: this.isPush,
                labels: this.checkedList ? this.checkedList : "" ,
                identities: this.identityList ? this.identityList : "",
                type: Number(values.type),
                pushTime: values.date ? moment(values.date).format("YYYY-MM-DD HH:mm:ss") : "",
                url: values.url ? values.url.trim() : this.typeId == 2 ? this.modelData.uri : "",
                youzan: values.isYouZan,
                // customContent: isAdd ? JSON.stringify(values.richText) : values.richText,
                customContent: values.richText,
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
                  this.$router.push({ name: "advertisePush" });
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
  .img-div{
    width:335px;
    height:auto;
  }
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

