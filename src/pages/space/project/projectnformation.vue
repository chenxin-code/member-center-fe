<template>
  <div style="height: 100%">
    <div class="content-header">
      {{ this.type == 1 ? "编辑" : "创建" }}社区信息列表
      <span class="fallback" @click="FALLBACK" style="cursor: pointer"
        >返回</span
      >
    </div>
    <div
      class="content-main"
      style="height: calc(100% - 91px); margin-top: 20px"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        :loading="tableLoading"
        autoComplete="off"
        style="height: 100%; overflow: auto"
      >
        <a-form-item label="小区名称">
          <a-select
            v-decorator="['projectName',{
            rules: [{ required: true, message: '请选择小区名称', whitespace: true }],
          },]"
            placeholder="请选择小区名称"
          >
            <a-select-option v-for="item in projectData" :key="item.spaceId">{{
              item.projectName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-decorator="['isStop',{
            rules: [{ required: true, message: '请选择状态', whitespace: true }],
          },]"
            placeholder="请选择状态"
          >
            <a-select-option v-for="item in protype" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="省份">
          <a-select
            v-decorator="['provinceCs',{
            rules: [{ required: true, message: '请选择省份', whitespace: true }],
          },]"
            placeholder="请选择状态"
            @change="handleProvinceChange"
          >
            <a-select-option v-for="item in listProvince" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="城市">
          <a-select
            v-decorator="['cityCs']"
            placeholder="请选择状态"
            :disabled="showpdr"
            @change="handleProvinceChange1"
          >
            <a-select-option v-for="item in listCity" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="区县">
          <a-select
            v-decorator="['DistrictCs',{
            rules: [{ required: true, message: '请选择区县', whitespace: true }],
          },]"
            placeholder="请选择状态"
            :disabled="showpdr1"
             @change="handleProvinceChange2"
          >
            <a-select-option v-for="item in listDistrict" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="小区地址">
          <a-input
            v-decorator="[
              'title',
              {
                rules: [
                  {required: true, message: '小区地址最长30个字', max: 30 },
                  { whitespace: true, message: '标题不能为空' },
                ],
              },
            ]"
            placeholder="请输入标题"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button
        type="primary"
        size="large"
        style="width: 120px"
        @click="onSubmit()"
        >保存</a-button
      >
      <a-button
        type="primary"
        size="large"
        style="width: 120px"
        @click="FALLBACK"
        >取消</a-button
      >
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";
import { debounce } from "@/utils/util";
export default {
  name: "addNotice",
  components: {},
  props: {
    operation: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type:Number,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      loading: false,
      grades: {
        5: "普通",
        4: "提示",
        3: "重要",
        2: "紧急",
        1: "非常紧急",
      },
      types: [],
      projectData: [],
      protype: [
        {
          id: "0",
          name: "启动",
        },
        {
          id: "1",
          name: "禁用",
        },
      ],
      listProvince: [],
      listCity: [],
      listDistrict: [],
      provinceCsdate: "",
      cityCsdate: "",
      DistrictCsdate: "",
      showpdr: true,
      showpdr1: true,
      projectName: "",
      isStop: "",
      title: "",
      tableLoading: false,
    };
  },
  computed: {},
  created() {
    this.getNoticeTypes();
    this.getData();
    this.getMyProject();
  },
  mounted() {
  },
  methods: {
    handleProvinceChange2(value){
        for(let i of this.listDistrict){
        if(i.id == value){
          this.DistrictCsdate =i.name
        }
      }
    },
    handleProvinceChange1(value) {
        for(let i of this.listCity){
        if(i.id == value){
          this.cityCsdate =i.name
        }
      }
      this.listDistrict = [];
      const para = {
        level: 3,
        pCode: value,
      };
      api
        .childlist(para)
        .then((res) => {
          if (res.code == "200") {
            this.showpdr1 = false;
            for (let i of res.data) {
              this.listDistrict.push({
                id: i.cityCode,
                name: i.cityName,
              });
            }
          }
        })
        .finally(() => {});
    },
    handleProvinceChange(value) {
      for(let i of this.listProvince){
        if(i.id == value){
          this.provinceCsdate =i.name
        }
      }
      this.form.setFieldsValue({
        cityCs: "",
        DistrictCs: "",
      });
      this.listDistrict = [];
      this.listCity = [];
      const para = {
        level: 2,
        pCode: value,
      };
      api
        .childlist(para)
        .then((res) => {
          if (res.code == "200") {
            const para = {
              level: 3,
              pCode: value,
            };
            if (res.data.length == 0) {
              api
                .childlist(para)
                .then((res) => {
                  if (res.code == "200") {
                    this.showpdr1 = false;
                    this.showpdr = true;
                    for (let i of res.data) {
                      this.listDistrict.push({
                        id: i.cityCode,
                        name: i.cityName,
                      });
                    }
                  }
                })
                .finally(() => {});
            } else {
              this.showpdr = false;
              this.showpdr1 = true;
              for (let i of res.data) {
                this.listCity.push({ id: i.cityCode, name: i.cityName });
              }
            }
          }
        })
        .finally(() => {});
    },
    ...mapActions(["FALLBACK"]),
    getData() {
       this.provinceCsdate = this.operation.provinceName
      this.cityCsdate = this.operation.cityName
      this.DistrictCsdate = this.operation.districtName
      if (this.type == 1) {
        //组件还没有创建完就被赋值了
        setTimeout(() => {
          this.form.setFieldsValue({
            projectName: this.operation.projectName,
            provinceCs: this.operation.provinceCode,
            cityCs: this.operation.cityCode,
            DistrictCs: this.operation.districtCode,
            isStop:
              this.operation.isStop == 0
                ? "启用"
                : "禁用",
            title: this.operation.address,
          });
        }, 100);
      }
    },
    getNoticeTypes() {
      const para = {
        level: 1,
      };
      api
        .childlist(para)
        .then((res) => {
          if (res.code == "200") {
            for (let i of res.data) {
              this.listProvince.push({ id: i.cityCode, name: i.cityName });
            }
          }
        })
        .finally(() => {});
        if(this.type == 1){
           const para = {
        level: 2,
      };
      api
        .childlist(para)
        .then((res) => {
          if (res.code == "200") {
            for (let i of res.data) {
              this.listCity.push({ id: i.cityCode, name: i.cityName });
            }
          }
        })
         const paras = {
        level: 3,
      };
      api
        .childlist(paras)
        .then((res) => {
          if (res.code == "200") {
            for (let i of res.data) {
              this.listDistrict.push({ id: i.cityCode, name: i.cityName });
            }
          }
        })
        }
    },
    // //获取项目
    getMyProject() {
      api.projectInfoList().then((res) => {
        if (res.code === 200) {
          this.projectData = res.data;
          // this.form.setFieldsValue({
          //   projectId: this.project.id,
          // });
        }
      });
    },
    onSubmit() {

      debounce(() => {
         this.tableLoading = true;
        this.form.validateFields((err, values) => {
          if (!err) {
            if(values.isStop=='启用'){
              values.isStop=0
            }
            if(values.isStop=='禁用'){
              values.isStop=1
            }
            if(values.isStop==0){
              values.isStop=0
            }
            if(values.isStop==1){
              values.isStop=1
            }
            const para = {
              //地址
              address:values.title,
              //所属城市代码
              cityCode:values.cityCs,
              //	所属城市名称
              cityName:values.cityCs==''?'': this.cityCsdate ,
              //所属区代码
              districtCode:values.DistrictCs,
              //所属区名称
              districtName:this.DistrictCsdate,
              //是否停用标记(0：启用；1：禁用)该禁用状态只对C端用户查询项目列表时起作用
              isStop:values.isStop,
              //所属省代码
              provinceCode:values.provinceCs,
              //所属省名称
              provinceName:this.provinceCsdate,
              //空间ID
              spaceId:this.type==1?this.operation.spaceId:values.projectName,
              id:this.type==1?this.operation.id:'',
            }
            if(this.type!=1){
              api.addProjectInfo(para).then(res=>{
                if(res.code==200){
                  this.$message.info('新建成功!');
                this.$router.go(-1)
                }
              }).finally(() => {
                this.tableLoading = false;
          });
            }else{

              api.editProjectInfo(para).then(res=>{
                if(res.code==200){
                  this.$message.info('修改成功!');
                this.$router.go(-1)
                }
              }).finally(() => {
            this.tableLoading = false;
          });
            }
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
</style>
