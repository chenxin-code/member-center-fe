<template>
  <div style="height: 100%;">
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form autoComplete="off" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }" style="height: 100%;overflow: auto;">
        <a-form-item label="年出游次数">
          <a-input
            :maxLength = "3"
            placeholder="请输入"
            v-decorator="[
            'travelCount',
              {rules:[
                { required: false, message: '请输入正确次数', pattern: new RegExp(/^(0|[1-9][0-9]*)$/),}
              ]}
            ]"
          />
        </a-form-item>
        <a-form-item label="偏好目的地">
          <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['preferenceDestination']"
            placeholder="请选择"
          >
            <a-select-option v-for="item in tourPlace" :key="item.CODE">{{item.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="出游人偏好">
          <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['visitorPreference']"
            placeholder="请选择"
          >
            <a-select-option v-for="item in tourPreference" :key="item.CODE">{{item.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="出游类型偏好">
          <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['travelType']"
            placeholder="请选择"
          >
            <a-select-option v-for="item in tourType" :key="item.CODE">{{item.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="出游预定商家">
          <a-select :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['travelBookingMerchant']"
            placeholder="请选择"
          >
            <a-select-option v-for="item in tourShop" :key="item.CODE">{{item.NAME}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否翻修">
          <a-radio-group v-decorator="['isRenovation',{ initialValue: 1 }]">
            <a-radio :value="0">是</a-radio>
            <a-radio :value="1">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="翻修年份">
          <a-date-picker :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
          format="YYYY"
          mode="year"
          :value="year"
          :open="open"
          @openChange="openChange"
          @panelChange="panelChange"
          @change="onChange"
          />
        <div>
  </div>
        </a-form-item>
        <a-form-item label="是否习惯网购">
          <a-radio-group v-decorator="['isComplain',{ initialValue: 0 }]">
            <a-radio :value="0">是</a-radio>
            <a-radio :value="1">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" style="width: 120px;margin-left:160px;" :loading="btnLoading" @click="onSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import addService from "@/assets/json/addService.json";
  import moment from "moment"
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import { debounce } from "@/utils/util";   // 防抖

  export default {
    name: "addService",
    props:{
      project:{
        type:Object,
        default(){
          return{}
        }
      }
    },
    components: { AFormItem },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        tourPlace: [],
        tourPreference: [],
        tourType: [],
        tourShop: [],
        id: "",
        btnLoading: false,
        errorMsgYearSize: null,
        travelCount:"",
        validateStatusYearSize:"",
        open: false,
        year: moment()
      }
    },
    computed: {},
    created() {
      this.id = this.project.custId
    },
    mounted() {
      // console.log(this.project);
      this.getData();
      this.getTourData()
    },
    methods: {
      openChange(status) {
        if (status) {
          this.open = true;
        } else {
          this.open = false;
        }
      },
      panelChange(value){
        this.year = value;
        this.open = false;
      },
      onChange(date, dateString) {
        this.year = ''
      },
      // 年出游次数校验
      // handleChangeYearSize(e){
      //   this.travelCount = e.currentTarget.value
      //   console.log(this.travelCount)
      //   this.validateYearSize()
      // },
      // validateYearSize(){
      //    if( /^(0|[1-9][0-9]*)$/.test(this.travelCount)){
      //     this.validateStatusYearSize = "success";
      //     this.errorMsgYearSize = null
      //   }else{
      //     this.validateStatusYearSize = "error";
      //     this.errorMsgYearSize = "请输入正确数字"
      //   }
      // },
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      getTourData() {
        return new Promise(()=>{
          this.tourPlace = addService["tourPlace"];
          this.tourPreference = addService["tourPreference"];
          this.tourType = addService["tourType"];
          this.tourShop = addService["tourShop"];
          console.log(this.tourPlace)
        })
      },
      //获取详情
      getData() {
        if (this.id) {
          api.getAddService({ customerId: this.id }).then(res => {
            if (res.code === 200) {
              const data = res.data;
              if (data) {
                this.year = data.renovationTime
                this.$nextTick(()=>{
                  this.form.setFieldsValue({
                    travelCount: data.travelCount,
                    preferenceDestination: data.preferenceDestination,
                    visitorPreference: data.visitorPreference,
                    travelType: data.travelType,
                    travelBookingMerchant: data.travelBookingMerchant,
                    isRenovation: data.isRenovation,
                    // renovationTime: data.renovationTime,
                    isComplain: data.isComplain
                  });
                });
              }
              console.log(data)
            }
          });
        }
      },
      //保存
      onSubmit(e) {
        e.preventDefault();
        debounce(() => {
          this.form.validateFields((err, values) => {
            if (!err) {
              this.btnLoading = true;
              values = {
                customerId: this.id,
                travelCount: values.travelCount,
                preferenceDestination: values.preferenceDestination,
                visitorPreference: values.visitorPreference,
                travelType: values.travelType,
                travelBookingMerchant: values.travelBookingMerchant,
                isRenovation: values.isRenovation,
                renovationTime:this.year == ''?this.year:moment(this.year).format("YYYY"),
                isComplain: values.isComplain
              };
              api["updateAddService"](values).then(res => {
                if (res.code === 200) {
                  this.$message.success("保存成功");
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
</style>

