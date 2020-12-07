<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ id.id ? "编辑" : "新建" }}巡检点
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);">
      <a-form
        :form="form"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 14}"
        style="height: 100%;overflow: auto;"
      >
        <a-form-item label="所属项目" style="margin-top:16px;">
          <span v-if="project.name">{{ project.name}}</span>
          <a-select
            v-else
            v-decorator="['projectId',{ rules: [{ required: true, message: '项目不能为空' }] }]"
            placeholder="请选择项目"
            @change="onProjectChange"
          >
            <a-select-option
              v-for="(item,index) in projectData"
              :key="index"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属区域" style="margin-top:16px;">
          <a-select
            :disabled="id.id"
            v-decorator="['areaId',{ rules: [{ required: true, message: '区域不能为空' }] }]"
            placeholder="请选择区域"
            @change="onAreaChange"
          >
            <a-select-option
              v-for="(item,index) in areaData"
              :key="index"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="位置描述">
          <a-input v-decorator="['position',{ rules: [{ max: 30, message: '位置描述不能超过30位' }] }]" />
        </a-form-item>

        <a-form-item label="巡检单元" style="margin-top:16px;">
          <a-select
            :disabled="id.id"
            v-decorator="['inspectionUnitId',{ rules: [{ required: true, message: '巡检单元不能为空' }] }]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in inspectionUnitData" :key="item.codeId">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="名称">
          <a-input
            v-decorator="['name',{rules:[{required:true, message:'名称不能为空'},{max: 20, message:'名称不能超过20位'}]}]"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button size="large" style="width: 120px;" :loading="btnLoading" @click="FALLBACK">取消</a-button>
      <a-button type="primary" size="large" style="width: 120px;margin-left:20px" :loading="btnLoading" @click="onSubmit">确定</a-button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";
export default {
  name: "inspectionPointEdit",
  // props: {
  //   project: {
  //     type: Object,
  //     default: () => ({})
  //   },
  //   id: {
  //     type: Object,
  //     default: () => ({})
  //   },
  // },
  data() {
    return {
      project: {}, // 项目信息
      id: {}, // 上页传来的本条信息
      form: this.$form.createForm(this, { name: "form" }),
      projectData: [],
      tags: [],
      //被选中的标签
      chooseData: [],
      //主项目层级Data
      mainProjectTier: [],
      //树选择数据
      treeData: [],
      checkedList: [],
      tagOptions: [],
      visible: false,
      //空间名称input框的status
      validateStatus: "",
      //空间名称input框的error提示语
      inputErrorTitle: "",
      projectId: "",
      projectName: "",
      projectOption: [],
      areaData: [],
      inspectionUnitData: [],
      areaId: "",
      areaName: "",
      btnLoading: false
    };
  },

  mounted() {
    console.log(this.$route, 1231);

    let { project, id } = this.$route.params;
    this.id = id ? id : {}; // 本条信息
    this.project = project ? project : {}; // 项目id  项目名
    if(project.id){ //获取上页传过来的项目信息
      this.form.setFieldsValue({ projectId: this.project.id });
    }
    this.getMyProject(); //获取项目列表
    this.getAreaList(); //获取区域列表
    this.getInspectionUnitList(); //获取巡检单元
    this.getData();
  },

  methods: {
    ...mapActions(["FALLBACK"]),

    // 项目下拉切换
    onProjectChange(e, { data }) {
      this.project = {
        id: e,
        name: this.projectData[data.key].name
      };
      this.getAreaList();
    },

    // 获取项目列表
    getMyProject() {
      api.qualityPersonProject().then(res => {      
        if (res.code === 200 && res.data.length) {
          console.log(res);
          this.projectData = res.data;
        }
      });
    },

    onAreaChange(e) {
      let obj = {};
      console.log(this.areaData);
      obj = this.areaData.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.id === e; //筛选出匹配数据
      });
      this.areaId = obj.id;
      this.areaName = obj.name;
    },

    //获取详情
    getData() {
      if (this.id.id) {
        api.detailInspectionPoint({ id: this.id.id }).then(res => {
          if (res.code === 200) {
            const data = res.data;
            this.areaName = data.areaName;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                projectId: data.projectId, //项目
                areaId: data.areaId - 0, //区域
                position: data.position, //位置
                inspectionUnitId: data.inspectionUnitId, //巡检单元
                name: data.name //名称
              });
            });
          }
        });
      }
    },

    //保存
    onSubmit(e) {
      e.preventDefault();
      const isAdd = !this.id.id;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnLoading = true;
          values = {
            id: !isAdd ? this.id.id : undefined,
            projectId: this.project.id,
            projectName: this.project.name,
            areaId: values.areaId,
            areaName: this.areaName,
            position: values.position,
            inspectionUnitId: values.inspectionUnitId,
            name: values.name
          };
          api[isAdd ? "addInspectionPoint" : "editInspectionPoint"](values)
            .then(res => {
              if (res.code === 200) {
                this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                this.$router.push({
                  path: "/qualityManagement/inspectionPoint"
                });
              }
            })
            .finally(() => {
              this.btnLoading = false;
            });
        }
      });
    },

    //获取区域列表
    getAreaList() {
      api
        .getQualityAreaList({
          projectId: this.project.id
        })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            const newArr = res.data.map(item => ({
              id: item.id,
              name: item.areaName,
              projectId: item.projectId
            }));
            this.areaData = newArr;
            this.total = this.areaData.length;
          }
        });
    },

    //获取巡检列表
    getInspectionUnitList() {
      const para = {
        parentId: 8
      };
      api.getQuCommonCodeList(para).then(res => {
        if (res.code === 200) {
          this.inspectionUnitData = res.data.list;
        }
      });
    }
  }
};
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
.img-div {
  width: 335px;
  height: auto;
}
.ant-upload.ant-upload-select-picture-card {
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
.ant-upload-list-picture-card-container {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
  /*text-align: center;*/
}
.ant-upload-list-picture-card .ant-upload-list-item {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
}
.ant-modal-close-x {
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

