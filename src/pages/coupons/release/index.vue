<template>
  <div class="release">
    <div class="release-header">卡券派发</div>
    <div class="release-main" ref="contentMain">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <!--<FilterForm
            ref="form"
            rowCol="3"
            :formList="this.formList"
            :onSubmit="this.onSearch"
            :doubleBtn="true"
            :doubleBtnText="'新建派发'"
            :doubleBtnEvent="() => this.$router.push({ name: 'release_create' })"
          />-->
          <FormList routePath="/couponsRelease/create" ref="form" :rowCol="4" :formList="formList" :onSubmit="onSearch" />
          <a-table :style="{ marginTop: '20px' }" :columns="columns" :data-source="dataList" :pagination="false" :loading="tableLoading" :scroll="{ y: scrollY }">
            <template slot="faceAmountSlot" slot-scope="scope">
              <div class="editable-row-operations">
                <span v-html="faceAmountStr(scope)"></span>
              </div>
            </template>
            <span slot="action" slot-scope="record">
              <a @click="onCheck(record)">查看</a>
              <a style="padding-left:10px;" v-if="record.conditions == 4" @click="getCardCode(record)">下载卡密</a>
              <a style="padding-left:10px;" v-if="record.referrer == 0" @click="cardTop(record)">置顶</a>
              <a style="padding-left:10px;" v-if="record.referrer == 1" @click="cardNotTop(record)">取消置顶</a>
            </span>
          </a-table>
          <a-pagination :total="total" :show-total="total => `共 ${total} 条`" show-quick-jumper show-size-changer v-model="current" :current="current" :pageSize="pageSize"
            :pageSizeOptions="['10', '20', '30', '40', '50', '100']" @change="change" @showSizeChange="showSizeChange" style="margin-top:30px;width:100%;text-align: right;" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
//import FilterForm from '@/components/FilterGroup/index.jsx';
import FormList from '@/components/FormList/index.jsx';
import moment from 'moment';
import api from '@/api';
import axios from 'axios';
const typeList = [
  { id: '', name: '全部' },
  { id: 10, name: '代金券' },
  { id: 20, name: '满减券' },
  { id: 40, name: '折扣券' }
];
const activityList = [
  { id: '', name: '全部' },
  { id: 4014, name: '物业费' },
  { id: 4005, name: '购物券' },
  { id: 4015, name: '实物券' }
];
const conditionsList = [
  { id: '', name: '全部' },
  { id: 1, name: '领券中心' },
  { id: 2, name: '直接发放' },
  { id: 3, name: '邦豆兑换' },
  { id: 4, name: '卡密兑换' },
  { id: 5, name: '分销推广' },
  { id: 6, name: '商品详情' },
  { id: 7, name: '活动领券' },
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
          selectOptions: typeList,
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '卡券标题',
          type: 'input',
          placeholder: '请输入',
          name: 'title',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '卡券业务类型',
          type: 'select',
          placeholder: '全部',
          name: 'activity',
          selectOptions: activityList,
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        {
          label: '派发类型',
          type: 'select',
          name: 'conditions',
          placeholder: '全部',
          selectOptions: conditionsList,
          initialValue: '全部',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '派发时间',
          type: 'rangePicker',
          name: 'rangeDate',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          label: '活动主题',
          type: 'input',
          placeholder: '请输入',
          name: 'themeName',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        },
        {
          type: 'btn-default',
          buttonName: '新建派发',
          htmlType: 'button',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        {
          label: '活动名称',
          type: 'input',
          placeholder: '请输入',
          name: 'activityName',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
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
          customRender: text =>
            typeList.filter(item => item.id == text)[0].name ? typeList.filter(item => item.id == text)[0].name : ''
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
              : `相对有效期: ${record.valiDays}天, 领取后${record.offsetDays}天生效`
        },
        {
          title: '派发类型',
          key: 'conditions',
          dataIndex: 'conditions',
          customRender: text =>
            conditionsList.filter(item => item.id == text)[0].name
              ? conditionsList.filter(item => item.id == text)[0].name
              : ''
        },
        {
          title: '是否置顶',
          key: 'referrer',
          dataIndex: 'referrer',
          customRender: text => text == 1 ? '置顶' : '不置顶'
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
          scopedSlots: { customRender: 'action' },
          width: 150
        }
      ],
      dataList: [],
      activity: '',
      conditions: '',
      title: '',
      type: '',
      rangeDate: [],
      themeName: null,
      activityName: null
    };
  },
  components: {
    //FilterForm,
    FormList
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
      const { activity, conditions, title, type, rangeDate, themeName, activityName } = args;
      this.activity = activity || null;
      this.conditions = conditions || null;
      this.title = title || null;
      this.type = type || null;
      this.rangeDate = rangeDate || [];
      this.themeName = themeName || null;
      this.activityName = activityName || null;
      this.current = 1;
      this.getReleaseList();
    },

    onCheck(record) {
      this.$router.push({ name: 'release_detail', query: { id: record.id } });
    },
    getCardCode(record) {
      this.downloadCamilo(record);
    },

    cardTop(record) {
      const param = {
        id: record.id,
        referrer: "1"
      };
      const paramFormData = Object.keys(param).reduce((pre, key) => {
        pre.append([key], param[key]);
        return pre;
      }, new FormData());
      api
        .recommendCouponActivity(paramFormData)
        .finally(() => {
          this.tableLoading = false;
        })
        .then(res => {
          if (res.code == 200) {
            this.getReleaseList();
          }
        });
    },
    cardNotTop(record) {
      const param = {
        id: record.id,
        referrer: "0"
      };
      const paramFormData = Object.keys(param).reduce((pre, key) => {
        pre.append([key], param[key]);
        return pre;
      }, new FormData());
      api
        .recommendCouponActivity(paramFormData)
        .finally(() => {
          this.tableLoading = false;
        })
        .then(res => {
          if (res.code == 200) {
            this.getReleaseList();
          }
        });
    },

    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getReleaseList();
    // },
    change(page) {
      this.current = page;
      this.getReleaseList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getReleaseList();
    },
    downloadCamilo(item) {
      this.tableLoading = true;
      let args = {
        couponActivitiesId: item.id
      };
      api
        .downloadCamilo(args)
        .then(res => {
          if (res.code === 200) {
            this.downloadInfo(item.id);
          } else if (res.code === 500) {
            this.$warning({
              title: '提示',
              content: '生成中请稍后'
            });
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    downloadInfo(cuid) {
      const args = {
        couponActivitiesId: cuid
      };
      // console.log('downloadInfo args :>> ', args);
      // return;
      axios({
        method: 'get',
        params: args,
        url: '/times/member-center/coupon/api/v1/downloadCamiloExcel',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'blob'
      }).then(res => {
        this.download(res.data);
      });
    },
    download(content) {
      const filename = '卡密信息.xlsx';
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      var blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      URL.revokeObjectURL(eleLink.href);
      // 然后移除
      document.body.removeChild(eleLink);
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
        themeName: this.themeName,
        activityName: this.activityName,
        activity: this.activity,
        conditions: this.conditions
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
        .finally(() => {
          this.tableLoading = false;
        });
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
      this.conditions = '';
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
  overflow: hidden;
  &-header {
    border-bottom: 1px solid #e8e8e8;
    line-height: 60px;
    padding-left: 40px;
  }
  &-main {
    height: 100%;
    ::v-deep .ant-btn {
      width: 98px !important;
    }

    ::v-deep .ant-input-number {
      width: 100%;
    }

    ::v-deep .ant-form > .ant-row > .ant-col {
      width: 27.5% !important;
    }
    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(4) {
      width: 15% !important;
      padding-left: 0 !important;
      padding-right: 30px !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(8) {
      width: 15% !important;
      padding-left: 0 !important;
      padding-right: 30px !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(3) {
      width: 30% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    ::v-deep .ant-form > .ant-row > .ant-col:nth-child(7) {
      width: 30% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
