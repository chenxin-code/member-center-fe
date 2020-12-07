<template>
  <div id="resourcePackage">
    <div class="content-header">资源包列表</div>
    <div class="content-main" ref="content_main">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <!-- 右边列表 -->
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" html-type="submit" @click="onAdd">+创建资源包</a-button>
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="false"
            :loading="tableLoading"
            :scroll="{ y: scrollY }"
            :rowKey="(r,i) => i"
            style="width:100%;margin-top:8px;"
            :selectable="false"
          >
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions="['10','20','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import FormList from "@/components/FormList/index.jsx";
  import api from "@/api";
  export default {
    name: "resourcePackage",
    data() {
      return {
        formList: [
          {
            label: "微应用名称",
            type: "select",
            name: "microId",
            placeholder: "请选择名称",
            selectOptions: [],
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
        //表头数据
        tableColumns: [
          {
            title: "资源包名称",
            key: "resourceName",
            dataIndex: "resourceName"
          },
          {
            title: "资源包大小",
            dataIndex: "size",
            key: "size",
          },
          {
            title: "资源包版本",
            dataIndex: "resourceVersion",
            key: "resourceVersion",
          },
          {
            title: "下载地址",
            dataIndex: "url",
            key: "url",
          },
          {
            title: "MD5签名",
            key: "md5",
            dataIndex: "md5",
          },
          {
            title: "微应用名称",
            key: "programName",
            dataIndex: "programName"
          },
          // {
          //   title: "微应用版本",
          //   key: "programVersion",
          //   dataIndex: "programVersion"
          // },
        ],
        //表格高度
        scrollY: 100,
        //列表数据(表格)
        tableData: [],
        tableLoading: false,
        //分页
        pageSize: 10,
        current: 1,
        total: 0
      };
    },
    components: {
      FormList
    },
    mounted () {
      this.getMicroList();//获取微应用
      this.getResourcePackageList();//获取列表
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 260 + "px";
      },100)
    },
    created () {

    },
    methods: {
      //查询按钮
      onCheck() {
        this.current = 1;
        this.getResourcePackageList();
      },
      //创建资源包按钮
      onAdd() {
        this.$router.push({path: "/resourcePackage/resourcePackageAdd"})
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getResourcePackageList()
      },
      //获取微应用
      getMicroList() {
        api.allMicro().then(res => {
          if (res.code === 200) {
            const micro = {
              id: "",
              name: "全部"
            };
            this.data = res.data;
            this.formList[0] = {
              ...this.formList[0],
              selectOptions: res.data,
            };
            this.formList[0].selectOptions.unshift(micro);
            this.$refs.form.setFieldsValue({
              microId: this.formList[0].selectOptions[0]?.id,
            });
          }
        });
      },
      //获取表格数据
      getResourcePackageList() {
        this.tableLoading = true;
        const { microId } = this.$refs.form.getFieldsValue();
        const para = {
          programId: microId,
          pageIndex: this.current,
          pageSize: this.pageSize,
        };
        api.getResourcePackage(para).then(res => {
         if (res.code === 200) {
          this.total = res.data.total;
          this.tableData = res.data.records;
          }
        }).finally(()=>{
          this.tableLoading = false;
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  #resourcePackage{
    height: 100%;
    overflow: hidden;
  }
</style>

