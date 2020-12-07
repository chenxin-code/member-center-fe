<template>
  <div id="clientUser">
    <div class="content-header">C端用户管理</div>
    <div class="content-main" ref="contentMain">
      <FormList
        ref="form"
        rowCol="3"
        :formList="formList"
        :onSubmit="onCheck"
        style="padding:20px;"
      />
      <div>
        <a-tabs
          class="tabs-with-padding"
          default-active-key="1"
          @change="key => getList({ dataType: key })"
        >
          <a-tab-pane key="0" tab="全部用户"></a-tab-pane>
          <a-tab-pane key="2" tab="显示已注销用户"></a-tab-pane>
        </a-tabs>
        <div style="padding: 0 20px 0 20px;">
          <a-table
            :columns="columns"
            :data-source="data"
            :row-key="(r,i) => i"
            :loading="loading"
            :scroll="{ x: 1800, y: scrollY }"
            :pagination="{
            current: params.pageIndex,
            pageSize: params.pageSize,
            total: Number(total),
            showTotal: (total, range) => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }"
            @change="p => getList({...this.params, pageIndex: p.current, pageSize: p.pageSize})"
          >
            <template slot="phone" slot-scope="areaphone">
              <div class="editable-row-operations">
                <span>{{areaphone.phoneAreaCode + " " + areaphone.phone}}</span>
              </div>
            </template>
            <template slot="birthday" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.birthday">{{moment(operation.birthday).format("YYYY-MM-DD")}}</span>
              </div>
            </template>
            <template slot="identity" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.identity">{{operation.identity}}</span>
                <span v-else>游客</span>
              </div>
            </template>
            <span slot="action" slot-scope="row">
            <template v-if="row.isDeleted !== 1">
              <a-button
                type="link"
                @click="onStatusChange(row)">
                {{getStatus?getStatus(row.isEnable, true):''}}
              </a-button>
              <a-divider type="vertical"/>
              <a-button type="link" @click="editPhone(row)">修改手机号</a-button>
              <a-divider type="vertical" v-if="row.cardNo"/>
              <a-button type="link" @click="editId(row)" v-if="row.cardNo">修改证件号</a-button>
              <a-divider type="vertical" v-if="row.isShowUnbundling === 1"/>
              <a-button type="link" v-if="row.isShowUnbundling === 1" @click="unbind(row)">住户身份解绑</a-button>
            </template>
          </span>
          </a-table>

          <a-modal
            title="修改手机号"
            okText="确定"
            cancelText="取消"
            centered
            destroyOnClose
            :visible="phoneVisible"
            :confirm-loading="confirmLoading"
            @ok="onPhoneSubmit"
            @cancel="onVisibleChange('phoneVisible', false)"
          >
            <a-form-model
              ref="phoneForm"
              :model="phoneForm"
              :rules="{newPhone: [{required: true, message: '请输入新手机号', trigger: 'blur'}]}"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-form-model-item label="原手机号" prop="oldPhone">
                <span>{{phoneForm.oldPhone}}</span>
              </a-form-model-item>
              <a-form-model-item label="新手机号" prop="newPhone" :validate-status="validateStatus" :help="validateHelp">
                <a-input-group compact>
                  <a-select default-value="86" @change="handleChange" class="area-code-content" :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}">
                    <a-select-option v-for="(item,index) in areaCodeArr" :value="item" class="select-areaoptions" :key="index">
                      +{{item}}
                    </a-select-option>
                  </a-select>
                  <a-input
                    v-model="phoneForm.newPhone" class="areacode-input"
                    @change="phoneChange"/>
                </a-input-group>
              </a-form-model-item>
            </a-form-model>
          </a-modal>

          <a-modal
            title="修改证件号"
            okText="确定"
            cancelText="取消"
            centered
            :visible="idVisible"
            :confirm-loading="confirmLoading"
            @ok="onIdSubmit"
            @cancel="onVisibleChange('idVisible', false)"
          >
            <a-form-model
              ref="idForm"
              :model="idForm"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 12 }"
              :rules="{
                cardType: [{required: true, message: '请选择证件类型', trigger: 'blur'}],
                cardNo: [{required: true, message: '请输入证件号', trigger: 'blur'}]
              }"
            >
              <a-form-model-item label="证件类型" prop="cardType">
                <a-select v-model="idForm.cardType" :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}">
                  <a-select-option v-for="(value, key) in cardTypeOptions" :key="key" :value="key" >
                    {{value}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="证件号" prop="cardNo">
                <a-input v-model="idForm.cardNo" :maxLength="30"></a-input>
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import api from "@/api";
  import {CARD_TYPE_MAP, SEX_MAP} from "@/constance";
  import { isTruePhone } from "@/utils/util";
  import { debounce } from '@/utils/util';
  import FormList from "@/components/FormList/index.jsx";


  function getStatus(isEnable, isReverse = false) {
    if (isReverse) {
      isEnable === 0 ? (isEnable = 1) : (isEnable = 0);
    }
    return {0: "启用", 1: "禁用"}[isEnable] || ''
  }

  const columns = [
    {
      title: "昵称",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "手机号",
      key: "phone",
      width: 150,
      ellipsis: true,
      scopedSlots: {customRender: "phone"},
    },
    {
      title: "证件类型",
      dataIndex: "cardType",
      key: "cardType",
      width: 120,
      ellipsis: true,
      customRender: (val) => CARD_TYPE_MAP[val] || val
    },
    {
      title: "证件号",
      dataIndex: "cardNo",
      key: "cardNo",
      width: 200,
      ellipsis: true,
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      width: 100,
      ellipsis: true,
      customRender: (val) => SEX_MAP[val] || val
    },
    {
      title: "生日",
      key: "birthday",
      width: 120,
      ellipsis: true,
      scopedSlots: {customRender: "birthday"},
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "注册时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 200,
      ellipsis: true,
      customRender: (val) => moment(val).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      title: "状态",
      dataIndex: "isEnable",
      key: "isEnable",
      width: 100,
      ellipsis: true,
      customRender: function (val, row) {
        // isDeleted 0: 未注销, 1: 已注销
        // isEnable  0: 启用, 1: 禁用
        if (row.isDeleted === 1) {
          return "已注销";
        } else {
          return getStatus(row.isEnable);
        }
      }
    },
    {
      title: "身份",
      // dataIndex: "identity",
      key: "identity",
      scopedSlots: {customRender: "identity"},
      width: 150,
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      scopedSlots: {customRender: "action"},
      // width: 350,
    },
  ];

  export default {
    name: "clientUser",
    data() {
      return {
        formList: [
          {
            label: "昵称",
            type: "input",
            name: "name",
            placeholder: "请输入昵称",
            selectOptions: [],
            rules: [],
            initialValue: "全部",
          },
          {
            label: "手机号",
            type: "input",
            name: "phone",
            placeholder: "请输入手机号",
          },
          {
            label: "身份",
            type: "select",
            name: "identity",
            placeholder: "请选择身份",
            selectOptions: [
              {
                id: null,
                name: "全部"
              },
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
          },
          {
            type: "button",
            buttonName: "查询",
            htmlType: "submit",
            align: "right",
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
          }
        ],
        tabKey: "1",
        columns,
        scrollY: 100,
        data: [],
        areaCode: "86",
        areaCodeArr: ["86","886","852","853"],
        validateStatus: "",
        validateHelp: "",
        loading: false,
        confirmLoading: false,
        phoneVisible: false,
        idVisible: false,
        total: 0,
        params: {
          dataType: 0,
          pageIndex: 1,
          pageSize: 10,
          phone: '',
          userName: '',
          identity: ''
        },
        phoneForm: {
          oldPhone: '',
          newPhone: ''
        },
        idForm: {
          cardNo: '',
          cardType: '',
          userId: '',
        },
        cardTypeOptions: CARD_TYPE_MAP,
      }
    },
    components: {
      FormList
    },
    computed:{
      disabledSendVerify() {
        return (this.phoneForm.newPhone && !/^1[3456789]\d{9}$/.test(this.phoneForm.newPhone)) ||
          ['', this.phoneForm.oldPhone].includes(this.phoneForm.newPhone);
      }
    },
    mounted () {
      this.$refs.form.setFieldsValue({
        identity: this.formList[2].selectOptions[0]?.id,
      });
      setTimeout(()=>{
        this.scrollY = this.$refs.contentMain.offsetHeight - 270 + "px";
      },100)
      console.log(this.$refs.contentMain.offsetHeight)
    },
    created() {
      this.getList();
    },
    methods: {
      moment,
      phoneChange(e) {
        this.validateStatus = "";
        this.validateHelp = "";
        // this.phoneForm.newPhone = e.target.value.replace(/\D/g, '')
      },
      onCheck() {
        debounce(()=>{
          const { name, phone,identity } = this.$refs.form.getFieldsValue();
          this.params.userName = name;
          this.params.phone = phone;
          this.params.identity = identity;
          this.params.pageIndex = 1;
          this.getList()
        })
      },
      getList(params = {}) {
        this.params = {...this.params, ...params};
        !this.loading && (this.loading = true);
        api.getClientUser(this.params).then(res => {
          if (res.code === 200) {
            const {records, total} = res.data;
            this.data = records;
            this.total = total || 0;
          }
        }).finally(() => {
          this.loading = false;
        });
      },
      onStatusChange(row) {
        debounce(()=>{
          const oppStatus = this.getStatus(row.isEnable, true);
          this.$confirm({
            title: `是否${oppStatus}该用户？`,
            okText: "是",
            cancelText: "否",
            okType: "danger",
            centered: true,
            onOk: () => {
              return new Promise((resolve) => {
                api[oppStatus === "禁用" ? "disableClient" : "enableClient"]({uid: row.id})
                  .then(res => {
                    if (res.code === 200) {
                      this.$message.success(`${oppStatus}成功`);
                      this.getList();
                      resolve();
                    }
                  });
              })
                .catch((e) => console.log("Oops errors!", e));
            },
          });
        })
      },
      editPhone(row) {
        debounce(()=>{
          this.phoneForm = {
            newPhone: '',
            oldPhone: row.phone,
            userId: row.id,
          };
          this.onVisibleChange("phoneVisible", true);
        })
      },
      editId(row) {
        debounce(()=>{
          this.idForm = {
            ...this.idForm,
            cardNo: row.cardNo,
            cardType: row.cardType ? row.cardType.toString() : "",
            userId: row.id,
          };
          this.onVisibleChange("idVisible", true);
        })
      },
      unbind(row) {
        this.$confirm({
          title: "解绑后用户身份将变成游客，确定解绑？",
          okText: "是",
          cancelText: "否",
          okType: "danger",
          centered: true,
          onOk: () => {
            const para = {
              uid: row.id
            };
            api.unbindClient(para).then((res) => {
              if (res.code === 200) {
                this.$message.success("解绑成功");
                this.getList();
              }
            })
          },
        });
      },
      onVisibleChange(type, value) {
        this.validateStatus = "";
        this.validateHelp = "";
        this[type] = value;
      },
      handleChange(e) {
        this.areaCode = e;
        if (this.phoneForm.newPhone && !isTruePhone(this.areaCode,this.phoneForm.newPhone)) {
          this.validateStatus = "error";
          this.validateHelp = "请输入正确的手机号";
        } else {
          this.validateStatus = "";
          this.validateHelp = "";
        }
      },
      onPhoneSubmit() {
        debounce(()=>{
          if (!isTruePhone(this.areaCode,this.phoneForm.newPhone)) {
            this.validateStatus = "error";
            this.validateHelp = "请输入正确的手机号";
          } else {
            this.$refs.phoneForm.validate(valid => {
              if (valid) {
                this.confirmLoading = true;
                api.updateClientPhone({
                  phoneAreaCode: this.areaCode,
                  phone: this.phoneForm.newPhone,
                  userId: this.phoneForm.userId
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success("手机号修改成功");
                    this.$refs.phoneForm.resetFields();
                    this.onVisibleChange("phoneVisible", false);
                    this.getList();
                  }
                }).finally(() => {
                  this.confirmLoading = false;
                });
              } else {
                return false;
              }
            });
          }
        })
      },
      onIdSubmit() {
        debounce(()=>{
          this.$refs.idForm.validate(valid => {
            if (valid) {
              this.confirmLoading = true;
              api.updateClientId(this.idForm).then((res) => {
                if (res.code === 200) {
                  this.$message.success("证件号修改成功");
                  this.$refs.idForm.resetFields();
                  this.onVisibleChange("idVisible", false);
                  this.getList();
                }
              }).finally(() => {
                this.confirmLoading = false;
              });
            } else {
              return false;
            }
          });
        })
      },
      getStatus,
    }
  }
</script>


<style lang="less" scoped>
  #clientUser{
    height: 100%;
    /*overflow: hidden;*/
  }
  .area-code-content{
    display: inline-block;
    width: auto;
    float: left;
  }
  .areacode-input{
    width: 200px;
  }
  .ant-table .ant-table-content {
    overflow-x: auto !important;
    overflow-y: auto !important;

    tr.ant-table-row td .ant-btn.ant-btn-link {
      padding: 0;
    }
  }
</style>
