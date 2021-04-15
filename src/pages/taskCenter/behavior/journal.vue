<template>
  <div class="detail">
        <div class="detail-main">
            <p class="detail-main-title">
                <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                基础信息
            </p>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为类型：</span>
                <span class="detail-main-items-value">消费行为</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为名称：</span>
                <span class="detail-main-items-value">购买家政商品</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">行为来源：</span>
                <span class="detail-main-items-value">邻里邦Pro</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">创建时间：</span>
                <span class="detail-main-items-value">2020-12-10 22:00:00</span>
            </div>
            <div class="detail-main-items">
                <span class="detail-main-items-label">状态：</span>
                <span class="detail-main-items-value">启用</span>
            </div>
            <p class="detail-main-title">
                <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                行为日志
            </p>
            <div class="taskManager-main" ref="contentMain">
                <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
                <a-row type="flex" style="height:100%;flex-flow: row;">
                    <a-col flex="auto" style="padding:20px 10px;height:100%;">
                    <a-table
                        :columns="columns"
                        :data-source="dataList"
                        :pagination="false"
                        :loading="tableLoading"
                        :scroll="{ y: scrollY }"
                    >
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
                    </a-col>
                </a-row>
            </div>
        </div>
  </div>
</template>
<script>
import FilterForm from '@/components/FilterGroup/index.jsx';
import api from '@/api';
import moment from 'moment';
export default {
  components: {
    FilterForm
  },
  name: "journal",
  data() {
    return {
        scrollY: 300,
        pageSize: 10,
        current: 1,
        total: null,
        tableLoading: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        dataList:[],
        formList: [
            {
            label: '记录时间',
            type: 'rangePicker',
            name: 'taskDate'
            },
            {
            label: '唯一标识',
            type: 'input',
            placeholder: '请输入',
            name: 'Key'
            },
            {
            label: '手机号',
            type: 'input',
            placeholder: '请输入',
            name: 'phone'
            },
        ],
        columns: [{
            key: 'type',
            title: '记录时间',
            dataIndex: 'createTime',
            customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '行为描述',
            key: 'describe',
            dataIndex: 'describe'
        },
        {
            title: '会员昵称',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: '会员UUID',
            key: 'uuid',
            dataIndex: 'uuid',
        },
        {
            title: '会员手机号',
            key: 'tel',
            dataIndex: 'tel'
        }],
    }
  },
  methods:{
    onSearch(args) {

    },
    change(page) {
      this.current = page;
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
    },
  }
}
</script>
<style lang="less" scoped>
.detail {
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    border-bottom: 2px solid #dadada;
    &-title,
    &-btn {
      margin: 0;
      padding: 0 40px;
    }
    &-btn {
      color: #4c79fa;
      cursor: pointer;
    }
  }
  &-main {
    height: calc(100% - 58px);
    overflow: auto;
    padding: 20px;
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 35px;
      line-height: 50px;
      margin: 0;
    }
    &-items {
      color: #666;
      margin-bottom: 20px;
      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #333;
      }
    }
  }
}
</style>