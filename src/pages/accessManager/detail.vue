<template>
  <div class="detail">
    <div class="detail-header">
      <div class="detail-header-title">接入平台详情</div>
      <span class="detail-header-fallback" @click="$store.dispatch('FALLBACK')">
        返回
      </span>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
        基础信息
      </p>
      <div class="detail-main-items" v-for="item in dataList1" :key="item.label">
        <span class="detail-main-items-label">{{ item.label }}</span>
        <span v-if="item.name === 'createTime'" class="detail-main-items-value">
          {{ moment(dataObj[item.name]).format('YYYY-MM-DD HH:MM:SS') || '' }}
        </span>
        <span v-else class="detail-main-items-value">{{ dataObj[item.name] || '' }}</span>
      </div>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
        会员信息
      </p>
      <div class="detail-main-items" v-for="item in dataList2" :key="item.label">
        <span class="detail-main-items-label">{{ item.label }}</span>
        <span v-if="item.name === 'createTime'" class="detail-main-items-value">
          {{ moment(dataObj[item.name]).format('YYYY-MM-DD HH:MM:SS') || '' }}
        </span>
        <span v-else class="detail-main-items-value">{{ dataObj[item.name] || '' }}</span>
      </div>
    </div>
    <div class="detail-main detail-table-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
        会员来源
      </p>
      <div class="detail-main-items">
        <a-table :columns="columns" :data-source="tableData" :row-key="(r, i) => i" bordered>
          <template slot="appDescribeSlot" slot-scope="rowData">
            <span>{{ '#' + rowData.appDescribe + '#' }}</span>
          </template>
        </a-table>
      </div>
      <div class="detail-main-blank"></div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';

const columns = [
  {
    title: '来源名称',
    dataIndex: 'appName',
    key: 'appName'
  },
  {
    title: '来源标识',
    dataIndex: 'appCode',
    key: 'appCode'
  },
  {
    title: '状态',
    key: 'appDescribeSlot',
    scopedSlots: { customRender: 'appDescribeSlot' }
  },
  // {
  //   title: '状态',
  //   dataIndex: 'appDescribe',
  //   key: 'appDescribe'
  // },
  {
    title: '注册会员数',
    dataIndex: 'memberCount',
    key: 'memberCount'
  },
  {
    title: '创建来源会员数',
    dataIndex: 'createTime',
    key: 'createTime'
  }
];

export default {
  name: 'access_detail',
  data() {
    return {
      tableData: [],
      columns,
      dataList1: [
        {
          label: '接入系统名称: ',
          name: 'appCode'
        },
        {
          label: 'AppKey: ',
          name: 'appName'
        },
        {
          label: 'AppSecret: ',
          name: 'memberCount'
        },
        {
          label: '接入系统简介: ',
          name: 'appDescribe'
        },
        {
          label: '创建时间: ',
          name: 'createTime'
        }
      ],
      dataList2: [
        {
          label: '注册会员: ',
          name: 'appCode'
        },
        {
          label: '创建来源会员: ',
          name: 'appName'
        }
      ],
      dataObj: {}
    };
  },
  mounted() {
    this.initData(this.$route.query.code);
  },
  methods: {
    moment,
    initData(code) {
      api.getClientDetail({ appCode: code }).then(res => {
        if (res.code === 200) {
          this.dataObj = res.data;
          this.tableData.push(res.data);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  background-color: #fff;

  &-header {
    padding: 16px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;

    &-title {
      font-weight: 600;
      color: #666666;
    }
    &-fallback {
      cursor: pointer;
      font-weight: 400;
      color: #374fc7;
    }
  }
  &-main {
    padding: 20px 0;
    border-bottom: 1px dashed #e9e9e9;
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 20px;
      line-height: 50px;
      margin: 0;

      .ant-divider,
      .ant-divider-vertical {
        margin: 0 8px 0 0;
      }
    }
    &-items {
      color: #686868;
      margin-bottom: 20px;
      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        padding-right: 10px;
      }
    }
  }

  .detail-table-main {
    border-bottom: none;
    padding: 20px 0 0 0;

    .detail-main-items {
      margin-bottom: 46px;
      padding: 0 30px;
    }

    .detail-main-blank {
      height: 20px;
      background: #f0f2f5;
    }

    ::v-deep .ant-pagination {
      display: none;
    }
  }
}
</style>
