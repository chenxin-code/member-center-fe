<template>
  <div id="house">
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :row-key="(r,i) => i"
      :data-source="data"
      :pagination="false"
      :loading="tableLoading"
      style="width:100%;margin-top:8px;"
    >
<!--      <template slot="city" slot-scope="operation" >-->
<!--        <div class="editable-row-operations">-->
<!--          {{operation.province + operation.city + operation.district}}-->
<!--        </div>-->
<!--      </template>-->
      <template slot="customerRoomType" slot-scope="customerRoomType" >
          {{personTypeAry[customerRoomType]}}
      </template>
    </a-table>
    <!-- 分页 -->
    <a-pagination
      :total="total"
      :show-total="total => `共 ${total} 条`"
      show-quick-jumper
      show-size-changer
      v-model="current"
      :default-current="current"
      :page-size.sync="pageSize"
      @change="onShowSizeChange"
      @showSizeChange="onShowSizeChange"
      :pageSizeOptions= "['10', '20', '50', '100']"
      style="margin-top:30px;width:100%;text-align: right;"
    />
  </div>
</template>

<script>
  import api from "@/api";
  export default {
    name: "house",
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
        //表头数据
        columns : [
          {
            title: "房产信息",
            dataIndex: "roomName",
            key: "roomName",
          },
          {
            title: "身份",
            dataIndex: "customerRoomType",
            key: "customerRoomType",
            scopedSlots: { customRender: "customerRoomType" },
          },
        ],
        tableLoading: true,
        customerRoomType:"",
        personTypeAry: ["","业主","租户","商户","前期管理费单位","家人","朋友"],
        //列表数据
        data : [],
        //分页
        total: 0,
        pageSize: 10,
        current: 1
      }
    },
    components: {
    
    },
    mounted() {
      // console.log(this.project);
      this.getHouseList();
    },
    methods:{
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getHouseList();
      },
      //获取列表
      getHouseList() {
        const para = {
          customerId: this.project.custId,
          projectId: this.project.projectId,
          pageIndex: this.current,
          pageSize: this.pageSize
        };
        this.tableLoading = true;
        api.getHouse(para).then(res => {
          this.data = res.data.records;
          this.total = res.data.total;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  #house{
    height: 100%;
    overflow: hidden;
    margin-bottom: 40px;
    .editable-row-operations a{
      margin-right: 10px;
    }
  }
</style>
