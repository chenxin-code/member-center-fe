<template>
  <div id="coupons-detail">
    <div class="content-header">
      礼包内容管理
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer">返回</span>
    </div>
    <a-button type="primary" style="margin: 25px 0 0 35px" @click="visible = true">添加卡券</a-button>
    <a-table
      :columns="columns2"
      :data-source="tableDataList2"
      :pagination="false"
      :loading="tableLoading2"
      :rowKey="(r, i) => i"
      style="margin: 30px 35px;">
      <template slot="faceAmountSlot" slot-scope="rowData">
        <div class="editable-row-operations">
          <span v-html="faceAmountStr2(rowData)"></span>
        </div>
      </template>
      <template slot="detailsSlot" slot-scope="scope">
        <div class="editable-row-operations">
          <a @click="goDel(scope.id)">删除</a>
        </div>
      </template>
    </a-table>
    <a-pagination
      :total="total2"
      :show-total="total => `共 ${total2} 条`"
      show-quick-jumper
      show-size-changer
      :current="current2"
      :pageSize="pageSize2"
      :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
      @change="change2"
      @showSizeChange="showSizeChange2"
      style="margin-top: 30px;width: 100%;text-align: right;"/>
    <a-modal title="卡券选择" :visible="visible" @ok="handleOk" @cancel="visible = false" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch"/>
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: 300 }"
        :row-selection="rowSelection"
        :rowKey="(r, i) => i"
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
        style="margin-top: 30px;width: 100%;text-align: right;"
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
        {
          title: '卡券副标题',
          key: 'couponSubhead',
          dataIndex: 'couponSubhead'
        },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        // {
        //   title: '卡券业务类型',
        //   key: 'activity',
        //   dataIndex: 'activity',
        //   customRender: text => activityList.filter(item => item.id == text)[0].name || ''
        // },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: {customRender: 'faceAmountSlot'}
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
      columns2: [
        {
          dataIndex: 'couponId',
          key: 'couponId',
          title: '卡券ID'
        },
        {
          title: '卡券标题',
          key: 'couponName',
          dataIndex: 'couponName'
        },
        {
          title: '卡券副标题',
          key: 'couponSubhead',
          dataIndex: 'couponSubhead'
        },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        // {
        //   title: '卡券业务类型',
        //   key: 'activity',
        //   dataIndex: 'activity',
        //   customRender: text => activityList.filter(item => item.id == text)[0].name || ''
        // },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: {customRender: 'faceAmountSlot'}
        },
        {
          title: '操作',
          key: 'detailsSlot',
          scopedSlots: {customRender: 'detailsSlot'},
          width: 180
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
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        }
      ],
      tableDataList: [],
      tableDataList2: [],
      tableLoading: false,
      tableLoading2: false,
      total: 0,
      current: 1,
      pageSize: 10,
      newid: null,
      activity: null,
      title: '',
      type: null,
      selectedRows: [],
      total2: 0,
      current2: 1,
      pageSize2: 10
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
    faceAmountStr2() {
      return param => {
        if (param.couponType === 10) {
          return param.couponCost;
        } else if (param.couponType === 20) {
          return param.couponCost;
        } else if (param.couponType === 40) {
          return param.couponCost * 10 + '折';
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
    goDel(id) {
      this.$confirm({
        title: `删除卡券`,
        content: `您确定要删除该卡券吗？`,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.tableLoading2 = true;
          const formData = new FormData();
          formData.append('id', id);
          api.delCoupon(formData).then(resp => {
            if (resp.code === 200) {
              this.getList2();
            }
          }).finally(() => {
            this.tableLoading2 = false;
          });
        }
      });
    },
    change(page) {
      this.current = page;
      this.getList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getList();
    },
    change2(page) {
      this.current2 = page;
      this.getList2();
    },
    showSizeChange2(current, size) {
      this.current2 = 1;
      this.pageSize2 = size;
      this.getList2();
    },
    handleOk(e) {
      if (this.selectedRows.length > 0) {
        console.log('selectedRows[0]------->', this.selectedRows[0]);
        //这个couponCost是后端的坑
        let couponCost;
        if (this.selectedRows[0].couponType === 10) {
          couponCost = this.selectedRows[0].faceAmount;
        } else if (this.selectedRows[0].couponType === 20) {
          couponCost = this.selectedRows[0].faceAmount;
        } else if (this.selectedRows[0].couponType === 40) {
          couponCost = this.selectedRows[0].discountRatio;
        } else {
          couponCost = '';
        }
        api.giftBagManagement({
          giftBagId: this.$route.query.id,
          couponId: this.selectedRows[0].id,
          couponCode: this.selectedRows[0].couTypeCode,
          couponName: this.selectedRows[0].couponTitle,
          couponSubhead: this.selectedRows[0].couponSubhead,
          couponType: this.selectedRows[0].couponType,
          couponBusiness: this.selectedRows[0].activity,
          couponCost: couponCost,
          validityType: this.selectedRows[0].validityType,
          validityNum: this.selectedRows[0].validityDayNums,
          effectNum: this.selectedRows[0].takeEffectDayNums,
          validityStartTime: this.selectedRows[0].validityStartTime,
          validityEndTime: this.selectedRows[0].validityEndTime,
        }).then(resp => {
          if (resp.code === 200) {
            this.current2 = 1;
            this.pageSize2 = 10;
            this.getList2();
          }
        }).finally(() => {
          this.visible = false;
        });

      } else {
        this.$message.error('必须选择一个卡券!');
      }
    },
    onSearch(args) {
      console.log(args);
      const {newid, activity, title, type} = args;
      this.newid = parseInt(newid) || null;
      this.activity = activity || null;
      this.title = title || null;
      this.type = type || null;
      this.current = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      api.getCouponList({
        pageIndex: this.current,
        pageSize: this.pageSize,
        id: this.newid,
        activity: this.activity,
        type: this.type,
        title: this.title,
        status: 99
      }).then(resp => {
        this.tableLoading = false;
        this.tableDataList = resp.data.records.map((item, index) => {
          return {
            ...item,
            key: index
          };
        });
        this.total = resp.data.total;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    getList2() {
      this.tableLoading2 = true;
      this.$nextTick(() => {
        return api.selectCoupon({
          giftBagId: this.$route.query.id,
          pageIndex: this.current2,
          pageSize: this.pageSize2
        }).then(resp => {
          if (resp.code === 200) {
            this.total2 = resp.data.total;
            this.tableDataList2.splice(0, this.tableDataList2.length);
            resp.data.records.forEach((v, k) => {
              this.tableDataList2.push(v);
            });
          }
        }).finally(() => {
          this.tableLoading2 = false;
        });
      });
    }
  },
  created() {
    this.getList();
    this.getList2();
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
