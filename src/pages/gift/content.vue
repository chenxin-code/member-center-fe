<template>
  <div id="coupons-detail">
    <div class="content-header">
      礼包内容管理
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <a-button type="primary" style="margin: 25px 0 0 35px" @click="visible = true">添加卡券</a-button>
    <a-table :columns="columns" :data-source="[]" :pagination="false" style="margin: 30px 35px"></a-table>
    <a-modal title="卡券选择" :visible="visible" @ok="handleOk" @cancel="visible = false" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: 300 }"
        :row-selection="rowSelection"
      >
        <template slot="faceAmountSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="faceAmountStr(rowData)"></span>
          </div>
        </template>
        <span slot="action" slot-scope="record">
          <a @click="onCheck(record)">查看</a>
        </span>
      </a-table>
      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        v-model="current"
        :current="current"
        :pageSize="pageSize"
        :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
        @change="change"
        @showSizeChange="showSizeChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </a-modal>
  </div>
</template>

<script>
import {activityList, typeList} from "../coupons/release/createForms";
import FilterForm from './../../components/FilterGroup/index.jsx';
import api from './../../api';
import moment from 'moment';

export default {
  name: "giftContent",
  components: {
    FilterForm
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'id',
          key: 'id',
          title: '卡券ID'
        },
        {
          title: '卡券标题',
          key: 'couponTitle',
          dataIndex: 'couponTitle'
        },
        // {
        //     title: '卡券副标题',
        //     key: 'couponSubhead',
        //     dataIndex: 'couponSubhead'
        // },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券业务类',
          key: 'activity',
          dataIndex: 'activity',
          customRender: text => activityList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' }
        },
        {
          title: '操作人员',
          key: 'operator',
          dataIndex: 'operator'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      ],
      visible: false,
      formList: [
        {
          label: '卡券ID',
          type: 'input',
          placeholder: '请输入',
          name: 'newid'
        },
        {
          label: '卡券类型',
          name: 'type',
          type: 'select',
          placeholder: '全部',
          selectOptions: typeList
        },
        {
          label: '卡券标题',
          type: 'input',
          placeholder: '请输入',
          name: 'title'
        },
        {
          label: '卡券业务类型',
          type: 'select',
          placeholder: '全部',
          name: 'activity',
          selectOptions: activityList,
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        }
      ],
      tableDataList: [],
      tableLoading: false,
      total: null,
      current: 1,
      pageSize: 10,
      newid: null,
      activity: null,
      title: '',
      type: null,
      selectedRows: [],
    };
  },
  computed: {
    faceAmountStr() {
      return param => {
        if (param.couponType === 10) {
          return param.faceAmount;
        } else if (param.couponType === 20) {
          return param.faceAmount;
        } else if (param.couponType === 40) {
          return param.discountRatio * 10 + '折';
        } else {
          return '';
        }
      };
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    }
  },
  methods: {
    change(page) {
      this.current = page;
      this.getCouponList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getCouponList();
    },
    // 点击弹窗确定
    handleOk(e) {
      if (this.selectedRows.length > 0) {
        this.visible = false;
        console.log('=======', this.selectedRows);
        console.log('couTypeCode------->',this.selectedRows[0].couTypeCode,'id------->',this.selectedRows[0].id);
        //调用添加接口


      } else {
        this.$message.error('必须选择一个卡券!');
      }
    },
    // 查询卡券列表
    onSearch(args) {
      console.log(args);
      const { newid, activity, title, type } = args;
      this.newid = parseInt(newid) || null;
      this.activity = activity || null;
      this.title = title || null;
      this.type = type || null;
      this.current = 1;
      this.getCouponList();
    },
    // 获取卡券列表
    getCouponList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        id: this.newid,
        activity: this.activity,
        type: this.type,
        title: this.title,
        //status: 99
      };
      api
        .getCouponList(args)
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.tableDataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            };
          });
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
  created() {
    this.getCouponList();
  },
}
</script>

<style lang="less" scoped>
#coupons-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }
}
</style>
