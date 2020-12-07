<template>
  <div id="project">
    <div class="content-header">项目管理</div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding: 20px; height: 100%">
        <a-col flex:auto>
          省份：<a-select
            :value="provValue"
            style="width: 200px"
            @change="provChange"
          >
            <a-select-option v-for="i of this.prov" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
          城市：
          <a-select
            :value=cityValue
            style="width: 200px"
            @change="cityChange"
            :disabled="cityDisabled"
          >
            <a-select-option v-for="i of this.city" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
          区县：
          <a-select
            :disabled="districtDisabled"
            :value=districtValue
            style="width: 200px"
            @change="districtChange"
          >
            <a-select-option v-for="i of this.district" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
            autoComplete="off"
          />
          <a-button type="primary" @click="onAdd">添加项目信息</a-button>
          <!-- 表格 -->
          <a-table
            :columns="columns"
            :row-key="(r, i) => i"
            :data-source="data"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="width: 100%; margin-top: 8px"
          >
          <template slot="isStop" slot-scope="operation">
            <div class="editable-row-operations">
              <span v-if="operation.isStop === 0">启用</span>
              <span v-if="operation.isStop === 1">禁用</span>
            </div>
          </template>
          <template slot="operation" slot-scope="operation">
          <div class="editable-row-operations" style="display:flex">
            <a @click="onChangeStatus(operation)">{{operation.isStop === 0 ? "禁用" : "启用" }}</a>
            <a @click="onEdit(operation)">编辑</a>
            <a @click="onDelete(operation)">删除</a>
          </div>
            </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="(total) => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="pageIndex"
            :page-size.sync="pageSize"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions="['10', '20', '50', '100']"
            style="margin-top: 30px; width: 100%; text-align: right"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import FormList from "@/components/FormList/index.jsx";
import api from "@/api";
import { debounce } from "@/utils/util";
export default {
  components: { FormList },
  data() {
    return {
      formList: [
        // {
        //   label: "省份",
        //   type: "select",
        //   name: "prov",
        //   placeholder: "请选择省份",
        //   selectOptions: [],
        //   initialValue: "全部",
        //   disabled: true
        // },
        // {
        //   label: "城市",
        //   type: "select",
        //   name: "city",
        //   placeholder: "请选择城市",
        //   selectOptions: [],
        //   initialValue: "全部",
        // },
        // {
        //   label: "区县",
        //   type: "select",
        //   name: "district",
        //   placeholder: "请选择区县",
        //   selectOptions: [],
        //   initialValue: "全部",
        // },
        {
          label: "小区名称",
          type: "input",
          name: "projectName",
          placeholder: "请输入小区名称",
        },
        {
          label: "类型",
          type: "select",
          name: "tag",
          placeholder: "请选择类型",
          selectOptions: [
            {
              id: "0",
              name: "启动",
            },
            {
              id: "1",
              name: "禁用",
            },
          ],
          initialValue: "全部",
        },
        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
        },
      ],
      //表格高度
      scrollY: 100,
      //表头数据
      columns: [
        {
          title: "小区名称",
          dataIndex: "projectName",
          key: "projectName",
        },
        {
          title: "省份",
          dataIndex: "provinceName",
          key: "provinceCode",
        },
        {
          title: "城市",
          dataIndex: "cityName",
          key: "cityCode",
        },
        {
          title: "区县",
          dataIndex: "districtName",
          key: "districtCode",
        },
        {
          title: "小区地址",
          dataIndex: "address",
          key: "address",
        },
        {
          title: "类型",
           scopedSlots: { customRender: "isStop" },
          key: "isStop",
        },
        {
          title: "操作",
          key: "type",
          width: 150,
          scopedSlots: { customRender: "operation" },
        },
      ],
      tableLoading: false,
      loading: true,
      //列表数据
      data: [],
      //分页
      pageIndex:1,
      pageSize:10,
      total: 0,
      prov: [],
      city: [],
      district: [],
      cityDisabled: true,
      districtDisabled: true,
      provValue:'全部',
      cityValue:'全部',
      districtValue:'全部',
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.getProjectInfo();
    setTimeout(()=>{
      this.scrollY = this.$refs.contentMain.offsetHeight - 275 + "px";
    },100)
  },
  methods: {
    //获取列表
    getProjectInfo() {
      this.tableLoading = true;
      // const { tag, projectName, provValue, cityValue, districtValue } = this.$refs.form.getFieldsValue();
      const data={
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isStop: this.$refs.form.getFieldsValue().tag,
        projectName: this.$refs.form.getFieldsValue().projectName,
        provinceCode: this.provValue === '全部' ? '' : this.provValue,
        cityCode: this.cityValue === '全部' ? '': this.cityValue,
        districtCode: this.districtValue === '全部' ? '' : this.districtValue
      };
      api.projectInfo(data).then(res=>{
        if(res.code === 200){
          this.data = res.data.records;
          this.total = res.data.total
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    init() {
      const para = {
        level: 1,
      };
      api.childlist(para).then((res) => {
        if (res.code === 200) {
          for (let i of res.data) {
            this.prov.push({ id: i.cityCode, name: i.cityName });
          }
        }
      }).finally(() => {});
    },
    provChange(value) {
      this.provValue =value;
      this.cityValue='全部';
      this.districtValue='全部';
      this.district=[];
      this.city=[];
      const para = {
        level: 2,
        pCode: value,
      };
      api.childlist(para).then((res) => {
        if (res.code === 200) {
          const para = {
            level: 3,
            pCode: value,
          };
          console.log(res.data);
          if (res.data.length === 0) {
            this.districtDisabled = false;
             this.cityDisabled = true;
            console.log("第三层");
            api.childlist(para).then((res) => {
              if (res.code === 200) {
                for (let i of res.data) {
                  this.district.push({ id: i.cityCode, name: i.cityName });
                }
              }
            })
            .finally(() => {});
          } else {
            this.districtDisabled = true;
            this.cityDisabled = false;
            for (let i of res.data) {
              this.city.push({ id: i.cityCode, name: i.cityName });
            }
          }
        }
      }).finally(() => {});
    },
    cityChange(value) {
      this.cityValue =value;
      this.district=[];
      const para = {
        level: 3,
        pCode: value,
      };
      api.childlist(para).then((res) => {
        if (res.code === 200) {
          this.districtDisabled = false;
          for (let i of res.data) {
            this.district.push({ id: i.cityCode, name: i.cityName });
          }
        }
        }).finally(() => {});
    },
    districtChange(value) {
      this.districtValue = value;
    },
    onChangeStatus(operation) {
      const that = this;
      that.$confirm({
        title: operation.isStop === 0 ? "禁用项目信息" : "启用项目信息",
        content: operation.isStop === 0 ? "确定禁用" + operation.projectName + "吗？" : "确定启用" + operation.projectName + "吗？",
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.tableLoading = true;
          const para ={
            id:operation.id,
            isStop:operation.isStop === 0 ? 1 : 0,
          };
          api.projectInfoStatus(para).then(res=>{
            if(res.code === 200){
              that.getProjectInfo()
            }
          }).finally(()=>{
            that.tableLoading = false;
          })
        },
      });
    },
    onAdd() {
      this.$router.push({
        path: "/project/projectnformation",
        // query: {
        //   name: item.blockName,
        //   id: item.buildingName + item.roomName,
        //   idr: item.id,
        // },
      });
    },
    //编辑
    onEdit(operation) {
      console.log(operation)
      this.$store.commit('setrowEditinformationSync', operation);
         debounce(()=>{
      this.$router.push({
         name: "projectnformation",
          params: {
          operation:operation,
            type:1
         }
      });
      })
    },
    //删除
    onDelete(operation){
      const that = this;
      that.$confirm({
        title: "删除项目信息",
        content: "确定删除" + operation.projectName + "吗？",
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.tableLoading = true;
          const para={
            id:operation.id
          };
          api.deleteProjectInfo(para).then(res=>{
            if(res.code === 200){
              that.$message.success('删除成功！');
              if(that.data.length === 1){
                that.pageIndex --;
                that.getProjectInfo()
              }else{
                that.getProjectInfo()
              }
            }
          }).finally(()=>{
            that.tableLoading = false;
          });
        },
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.pageIndex = current;
      this.pageSize = pageSize;
      this.getProjectInfo();
    },
    //查询
    onCheck() {
      debounce(() => {
        this.pageIndex = 1;
        this.getProjectInfo();
      });
    },
  }
};
</script>
<style lang="less" scoped>
  #project {
    height: 100%;
    overflow: hidden;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
