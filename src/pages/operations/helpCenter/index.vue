<template>
  <div id="microDetail">
    <div class="content-header">帮助中心管理
    </div>
    <div class="content-main" ref="contentMain" style="padding: 20px;">
      <a-row>
        <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
        />
      </a-row>
      <a-row>
        <a-button type="primary" @click="onAdd">+ 新建</a-button>
      </a-row>
      <a-row>
        <a-table
            :columns="tableColumns"
            :data-source="tableDataSource"
            :pagination="false"
            :scroll="{ y: scrollY }"
            :rowKey="(r,i) => i"
            style="width:100%;margin-top:8px;"
            :selectable="false"
            :loading="tableLoading"
        >
          <template slot="createdAt" slot-scope="operation">
            <div class="editable-row-operations">
              <span>{{ moment(operation.createdAt).format('YYYY-MM-DD HH:MM') }}</span>
            </div>
          </template>
          <template slot="status" slot-scope="operation">
            <div class="editable-row-operations">
              <span v-if="operation.status === 0">未发布</span>
              <span v-if="operation.status === 1">已发布</span>
            </div>
          </template>
          <template slot="operation" slot-scope="operation">
            <div class="editable-row-operations">
              <a @click="editItem(operation)">编辑</a>
              <a @click="deleteItem(operation)" style="margin-left: 10px;">删除</a>
            </div>
          </template>
        </a-table>

        <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="current"
            :page-size.sync="pageSize"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
        />
      </a-row>
    </div>
  </div>
</template>

<script>
//import api from '@/api';
import FormList from '@/components/FormList/index.jsx';
import { mapActions } from 'vuex';

const testData = {
  table: [
    {
      id:'1',
      title: 'xxxxxxxxxxxxxxxxx',
      content:'xxxxxxxxxxxxxxxxxxxxxxxx'
    },
    {
      id:'2',
      title: 'xxxxxxxxxxxxxxxxx',
      content:'xxxxxxxxxxxxxxxxxxxxxxxx'
    },
    {
      id:'3',
      title: 'xxxxxxxxxxxxxxxxx',
      content:'xxxxxxxxxxxxxxxxxxxxxxxx'
    },
    {
      id:'4',
      title: 'xxxxxxxxxxxxxxxxx',
      content:'xxxxxxxxxxxxxxxxxxxxxxxx'
    }
  ]
}

export default {
  name: 'helpCenter',
  data () {
    return {
      formList: [
        {
          label: '标题',
          type: 'input',
          name: 'content',
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
        }
      ],
      tableDataSource: [],//项目
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: '标题',
          key: 'title',
          dataIndex: 'title'
        },
        {
          title: '详细内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [],
      tableLoading: false,
      //分页
      total: 0,
      current: 1,
      pageSize: 10,
    }
  },
  created () {
    this.tableDataSource = testData.table;
  },
  components: {
    FormList,
    // vtables
  },
  mounted() {
    //this.getproList();
    setTimeout(()=>{
      console.log(this.$refs.contentMain.offsetHeight);
      this.scrollY =  this.$refs.contentMain.offsetHeight - 100 + "px";
    },100)

  },
  methods: {
    ...mapActions([
      'FALLBACK'
    ]),
    onCheck(){
      console.log('提交');
    },
    //新建帮助
    onAdd () {
      this.$router.push({
        name: 'helpCenterEdit',
        params: {
          project: this.project
        }
      });
    },
    editItem(option){
      alert(JSON.stringify(option));
    },
    deleteItem(option){
      alert(JSON.stringify(option));
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getproList();
    },
  }
}
</script>

<style lang="less">
.fallback {
  cursor: pointer;
}

.content-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
