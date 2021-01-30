<template>
  <div class="release">
    <div class="release-header">卡券派发</div>
    <div class="release-main" ref="contentMain">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <FilterForm
            ref="form"
            rowCol="3"
            :formList="this.formList"
            :onSubmit="this.onSearch"
            :doubleBtn="true"
            :doubleBtnText="'新建派发'"
            :doubleBtnEvent="() => this.$router.push({ name: 'release_create' })"
          />
          <a-table
            :style="{ marginTop: '20px' }"
            :columns="columns"
            :data-source="dataList"
            :pagination="false"
            :loading="tableLoading"
            :scroll="{ y: scrollY }"
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
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
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
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import api from '@/api';

const typeList = [
  { id: '', name: '全部' },
  { id: 10, name: '代金券' },
  { id: 20, name: '满减券' },
  { id: 40, name: '抵扣券' }
];
const activityList = [
  { id: '', name: '全部' },
  { id: 4014, name: '物业费' },
  { id: 4005, name: '消费券' }
];
const conditionList = [
  { id: '', name: '全部' },
  { id: 1, name: '领券中心' },
  { id: 2, name: '直接发放' },
  { id: 3, name: '邦豆兑换' }
];
export default {
  name: 'release',
  data() {
    return {
      scrollY: 100,
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      formList: [
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
        },
        {
          label: '派发类型',
          type: 'select',
          name: 'condition',
          placeholder: '全部',
          selectOptions: conditionList,
          initialValue: '全部'
        },
        {
          label: '派发时间',
          type: 'rangePicker',
          name: 'rangeDate'
        }
      ],
      columns: [
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
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => (text ? typeList.filter(item => item.id == text)[0].name : '')
        },
        {
          title: '卡券业务类型',
          key: 'businessType',
          dataIndex: 'businessType',
          customRender: text =>
            activityList.filter(item => item.id == text)[0].name
              ? activityList.filter(item => item.id == text)[0].name
              : ''
        },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' }
        },
        {
          title: '卡券有效期',
          key: 'expirationType',
          dataIndex: 'expirationType',
          customRender: (text, record) =>
            text == 1
              ? moment(record.startTime).format('YYYY-MM-DD HH:mm:ss') +
                '-' +
                moment(record.expirationTime).format('YYYY-MM-DD HH:mm:ss')
              : `相对有效期, ${record.offsetDays}天, 领取后${record.valiDays}天生效`
        },
        {
          title: '派发类型',
          key: 'condition',
          dataIndex: 'condition',
          customRender: text => (text ? conditionList.filter(item => item.id == text)[0].name : '')
        },
        {
          title: '操作人员',
          key: 'updateUserName',
          dataIndex: 'updateUserName'
        },
        {
          title: '派发时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataList: [],
      activity: '',
      condition: '',
      title: '',
      type: '',
      rangeDate: []
    };
  },
  components: {
    FilterForm
  },
  mounted() {
    this.getReleaseList();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 340 + 'px';
    }, 0);
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
    }
  },
  methods: {
    onSearch(args) {
      console.log(args);
      const { activity, condition, title, type, rangeDate } = args;
      this.activity = activity || null;
      this.condition = condition || null;
      this.title = title || null;
      this.type = type || null;
      this.rangeDate = rangeDate || [];
      this.current = 1;
      this.getReleaseList();
    },

    onCheck(record) {
      this.$router.push({ name: 'release_detail', query: { id: record.id } });
    },

    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getReleaseList();
    },

    getReleaseList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        createTimeStart: this.rangeDate.length ? moment(this.rangeDate[0]).format('YYYY-MM-DD') : null,
        createTimeEnd: this.rangeDate.length ? moment(this.rangeDate[1]).format('YYYY-MM-DD') : null,
        type: this.type,
        title: this.title,
        activity: this.activity,
        condition: this.condition
      };
      api
        .getReleaseList(args)
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.dataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            };
          });
          this.total = res.data.total;
        })
        .finally(() => (this.tableLoading = false));
    }
  },
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 通过这个控制刷新
    if (!this.$route.meta.isUseCache) {
      //重置data
      this.total = 0;
      this.current = 1;
      this.pageSize = 10;
      this.condition = '';
      this.type = '';
      this.title = '';
      this.activity = '';
      //初始化加载数据
      this.$refs.form.form.resetFields();
      this.getReleaseList();
    }

    //重置
    this.$route.meta.isUseCache = false;
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'release_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'release_detail') {
      to.meta.isUseCache = true;
    } else {
      to.meta.isUseCache = false;
    }

    next();
  }
};
</script>

<style lang="less" scoped>
.release {
  height: 100%;
  overflow: hide;
  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }
  &-main {
    height: 100%;
  }
}
</style>
