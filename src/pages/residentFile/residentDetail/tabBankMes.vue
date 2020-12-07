<template>
  <div id="tabBankMes">
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :row-key="(r,i) => i"
      :data-source="data"
      :pagination="false"
      :loading="tableLoading"
      style="width:100%;margin-top:8px;"
      :scroll="{ x: '160%' }"
    >
      <template slot="accountBank" slot-scope="operation" >
        <div class="editable-row-operations">
          {{changeBank(bankType,operation.accountType)}}
        </div>
      </template>
      <template slot="accountBank" slot-scope="operation" >
        <div class="editable-row-operations">
          {{changeBank(bankData,operation.accountBank)}}
        </div>
      </template>
      <template slot="city" slot-scope="operation" >
        <div class="editable-row-operations">
          {{operation.accountProv + operation.city + operation.district}}
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
  import api from "@/api";
  import bank from "@/assets/json/bank.json";
  export default {
    name: "TabBankMes",
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
            title: "开户人",
            dataIndex: "accountHolder",
            key: "accountHolder",
            width: 100,
            fixed: 'left'
          },
          {
            title: "开户行卡类型",
            key: "accountType",
            scopedSlots: { customRender: "accountType" },
            width: 150
          },
          {
            title: "开户行",
            key: "accountBank",
            scopedSlots: { customRender: "accountBank" },
          },
          {
            title: "开户行账号",
            dataIndex: "accountNo",
            key: "accountNo",
          },
          {
            title: "开户行网点",
            dataIndex: "roomName",
            key: "roomName",
          },
          {
            title: "开户行省市区",
            key: "city",
            scopedSlots: { customRender: "city" },
          },
        ],
        tableLoading: true,
        bankData: [],
        bankType: [],
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
      this.getBank();
      this.getBankList();
    },
    methods:{
      getBank() {
        return new Promise(()=>{
          this.bankData = bank["bank"];
          this.bankType = bank["bankType"]
        })
      },
      changeBank(data,id,name){
        data.forEach((item)=>{
          if (item.CODE === id) {
            name = item.NAME
          }
        });
        return name
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getBankList();
      },
      //获取列表
      getBankList() {
        const para = {
          custId: this.project.custId,
        };
        this.tableLoading = true;
        api.getBank(para).then(res => {
          this.data = res.data;
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
