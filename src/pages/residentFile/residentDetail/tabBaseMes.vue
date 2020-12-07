<!-- 基本信息 -->
<template>
  <div id="tabBaseMes">
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      style="height: 100%; overflow: auto"
      autoComplete="off"
    >
      <a-form-item label="姓名">
        <span class="ant-form-text">
          {{ custName }}
        </span>
      </a-form-item>
      <a-form-item label="性别">
        <span class="ant-form-text">
          {{ custSex == "1" ? "男" : "女" }}
        </span>
      </a-form-item>
      <a-form-item label="出生日期">
        <span class="ant-form-text">
          {{ custBirthday }}
        </span>
      </a-form-item>
      <a-form-item label="国籍">
        <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                  placeholder="请选择" v-decorator="['country']">
          <a-select-option v-for="item in country" :key="item.code">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="户籍省市区">
        <a-cascader :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                    :options="prov"
                    v-decorator="['householdAddress']"
                    :fieldNames="{ label: 'name', value: 'code', children: 'children' }"
                    placeholder="请选择省/市/区"
                    @change="onChange"
        />
      </a-form-item>
      <a-form-item label="户籍街道">
        <a-input placeholder="请输入" v-decorator="['householdStreet',{rules:[
        {max:30, message: '不能超过30个字'}]}]"/>
      </a-form-item>
      <a-form-item label="身份证地址">
        <a-input placeholder="请输入" v-decorator="['idAddress',{rules:[
        {max:50, message: '不能超过50个字'}]}]"/>
      </a-form-item>
      <a-form-item label="是否党员">
        <a-radio-group name="radioGroup" v-decorator="['isMembers']">
          <a-radio :value="1"> 是</a-radio>
          <a-radio :value="0"> 否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="婚姻状态">
        <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                  placeholder="请选择" v-decorator="['maritalStatus']">
          <!--          <a-select-option-->
          <!--            :value="index"-->
          <!--            v-for="(item, key, index) of maritalStatusList"-->
          <!--            :key="key"-->
          <!--          >-->
          <!--            {{ item }}-->
          <!--          </a-select-option>-->
          <a-select-option v-for="(item, key) in maritalStatusList" :key="key">{{item}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="紧急联系人">
        <a-input
          placeholder="请输入"
          v-decorator="[
        'emergencyContact',
          {
            rules:[
              {max:30, message: '不能超过30个字'}
            ]
          }
        ]"/>
      </a-form-item>
      <a-form-item label="联系电话" :validate-status="contactPhone" :help="errorMsg">
        <a-input
          placeholder="请输入"
          v-decorator="[
        'mobile',
        {rules:[{required: false}]}
        ]"
          @change="handlePhoneChange"
        >
          <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                    slot="addonBefore"
                    v-decorator="['areaCode', { initialValue: '86' }]"
                    style="width: 70px"
                    @change="handleAreaChange"
          >
            <a-select-option v-for="(item,index) in areaCodeArr" :value="item.value" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-form-item label="兴趣爱好">
        <a-checkbox-group v-decorator="['hobbies']">
          <!-- <a-col :span="24"> -->
          <!-- <a-checkbox v-for="item of hobby" :key="item.CODE" :value="item.CODE">
              {{item.NAME}}
            </a-checkbox> -->
          <!-- </a-col> -->
          <a-row>
            <a-col :span="8" v-for="item of hobby" :key="item.CODE">
              <a-checkbox :value="item.CODE">
                {{ item.NAME }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="其他爱好">
        <a-input
          placeholder="请输入"
          v-decorator="[
          'otherHobbies',
          {
            rules:[
              {max:100, message: '不能超过100个字'}
            ]
          }
          ]"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit" :loading="btnLoading" @click="subBaseMes">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import api from "@/api";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import country from "@/assets/json/country.json";
  import provinces from "@/assets/json/provinces.json";
  import hobby from "@/assets/json/interest.json";
  import {MARITAL_STATUS} from "@/constance/index.js";
  import {isTruePhone} from "@/utils/util";   // 手机号码验证校验
  import {debounce} from "@/utils/util";   // 防抖

  export default {
    name: "TabBaseMes",
    props:{
      project:{
        type:Object,
        default(){
          return{}
        }
      }
    },
    data() {
      return {
        form: this.$form.createForm(this, {name: "form"}),
        maritalStatusList: [],
        custName: "",
        custSex: "",
        custBirthday: "",
        hobby: [],
        areaData: {},
        country: [], //国家列表
        streetList: [], //省市区街道列表
        id: "", // 唯一id
        remark: "", // 备注
        wechatNumber: "", // 微信号
        dataId: "",
        prov: [],
        province: "",
        city: "",
        district: "",
        // areaCodeArr: ["86","886","852","853"],  // 电话区间
        areaCodeArr: [
          {value: "86", name: "+86"},
          {value: "886", name: "+886"},
          {value: "852", name: "+852"},
          {value: "853", name: "+853"}
        ],
        areaCode: "86",   //区号
        contactPhone: "",
        errorMsg: null,
        mobile: "",    //电话号
        btnLoading: false,
        otherHobbies: "",   // 其他爱好
        // hobbies:[],
      };
    },
    created() {
      // console.log(this.project)
      this.getJsonData();
    },
    mounted() {
      // console.log(this.project);
      this.getBaseDetail();
    },
    methods: {
      // 校验手机号
      handleAreaChange(e) {
        // console.log(e)
        this.areaCode = e;
        this.mobile = this.form.getFieldValue('mobile');
        // console.log(this.mobile)
        if (this.mobile && this.mobile != "") {
          this.checkPhone()
        }
      },
      handlePhoneChange(e) {
        this.mobile = e.currentTarget.value;
        this.areaCode = this.form.getFieldValue("areaCode");
        // console.log(this.mobile);
        this.checkPhone();
      },
      checkPhone() {
        console.log(this.mobile, this.areaCode)
        if (this.mobile === "") {
          this.contactPhone = 'success';
          this.errorMsg = null
        } else if (!isTruePhone(this.areaCode, this.mobile)) {
          this.contactPhone = "error";
          this.errorMsg = "请输入正确的手机号";
        } else {
          this.contactPhone = "success";
          this.errorMsg = null;
        }
      },

      getJsonData() {
        return new Promise(() => {
          this.country = country["country"];
          this.prov = provinces["prov"];
          this.hobby = hobby["interest"];
          this.maritalStatusList = MARITAL_STATUS;
          // console.log(this.maritalStatusList);
        });
      },
      onChange(value) {
        // console.log(value);
        this.province = value[0];
        this.city = value[1];
        this.district = value[2];
        console.log(this.province);
      },
      // 得到基本信息
      getBaseDetail() {
        this.btnLoading = true
        // console.log(this.id);
        let sdata = {
          customerId: this.project.custId,
        };
        // 路由接收参数
        api.residentTabBase(sdata)
          .then((res) => {
            if (res.code === 200) {
              this.btnLoading = false
              this.custName = this.project.custName;
              this.custSex = this.project.custSex;
              this.custBirthday = this.project.custBirthday;
              // console.log(res.data);
              if (res.data) {
                this.dataId = res.data.id; //?add:edit
                this.remark = res.data.remark;
                this.wechatNumber = res.data.wechatNumber;
                const phone = res.data.contactPhone == "" ? [] : res.data.contactPhone.split("-");
                // console.log(phone)
                // const phone = res.data.contactPhone.split("-");
                // if(phone[1] !== "undefined"){
                //   this.areaCode = phone[0];
                //   this.mobile = phone[1];
                // };
                // console.log(this.province,this.city,this.district)
                // console.log(phone.length == 0 ? "111" : "123")
                this.$nextTick(() => {   // 防止页面没有进行DOM 更新
                  this.form.setFieldsValue({
                    country: res.data.country,
                    areaCode: phone.length == 0 ? "86" : phone[0],
                    mobile: phone.length == 0 ? "" : phone.length == 1 ? "" : phone[1],
                    householdStreet: res.data.householdStreet,
                    idAddress: res.data.idAddress,
                    isMembers: res.data.isMembers,
                    maritalStatus: res.data.maritalStatus ? res.data.maritalStatus.toString() : "",
                    emergencyContact: res.data.emergencyContact,
                    // contactPhone: res.data.contactPhone,
                    hobbies: res.data.hobbies ? JSON.parse(res.data.hobbies) : res.data.hobbies.split(','),
                    // hobbies:  res.data.hobbies!=""?JSON.parse(res.data.hobbies):[],
                    // "1,2,3,4"  "[1,2,3,4]"
                    // hobbies: JSON.parse(res.data.hobbies),
                    householdAddress: [
                      res.data.province,
                      res.data.city,
                      res.data.district,
                    ],
                    otherHobbies: res.data.otherHobbies,
                    // remark: res.data.remark,
                    // wechatNumber: res.data.wechatNumber,
                  });
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      //提交方法
      subBaseMes(e) {
        // console.log('为什么会出现在这？？？？？？？',this.mobile)
        e.preventDefault();
        debounce(() => {
          if (this.mobile && !isTruePhone(this.areaCode, this.mobile)) {
            this.errorMsg = "请输入正确的手机号";
          } else {
            const isAdd = !this.dataId;
            this.form.validateFields((err, values) => {
              console.log(values);
              if (!err) {
                this.btnLoading = true;
                const sdata = {
                  id: !isAdd ? this.dataId : undefined,
                  contactPhone: values.areaCode + "-" + values.mobile,
                  country: values.country ? values.country : "",
                  customerId: this.$route.query.custId,
                  emergencyContact: values.emergencyContact ? values.emergencyContact : "",
                  // hobbies: values.hobbies.join(","),
                  hobbies: values.hobbies ? values.hobbies : "",
                  // hobbies: values.hobbies.join(',') ,
                  householdStreet: values.householdStreet ? values.householdStreet : "",
                  idAddress: values.idAddress ? values.idAddress : "",
                  isMembers: values.isMembers ? values.isMembers : "",
                  maritalStatus: values.maritalStatus ? values.maritalStatus : "",
                  remark: this.remark,
                  wechatNumber: this.wechatNumber,
                  province: values.householdAddress ? values.householdAddress[0] : "",
                  city: values.householdAddress ? values.householdAddress[1] : "",
                  district: values.householdAddress ? values.householdAddress[2] : "",
                  otherHobbies: values.otherHobbies ? values.otherHobbies : "",
                };
                api[isAdd ? "residentTabBaseAdd" : "residentTabBaseUpdate"](
                  sdata
                ).then((res) => {
                  if (res.code === 200) {
                    this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                    this.getBaseDetail();
                  }
                }).finally(() => {
                  this.btnLoading = false;
                })
              } else {
                console.log("添加失败")
              }
            });
          }
        })
      },
    },
    components: {
      AFormItem,
    },
  };

</script>
