<template>
  <div class="create">
    <div class="create-header">
      <div class="create-header-title">卡券派发</div>
      <span class="create-header-fallback" @click="$store.dispatch('FALLBACK')">
        返回
      </span>
    </div>
    <div class="create-main">
      <a-form :form="formBasic" :label-col="{ span: 4 }" :wrapper-col="{ span: 9 }">
        <p class="create-main-title">
          <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
          卡券信息
        </p>
        <a-form-item label="选择卡券：">
          <div :class="`create-main-couponSelect ${showRedBorder && 'border-red'}`" @click="handleSelectCoupon">
            {{ couponName }}
          </div>
          <p v-show="showRedBorder" class="create-main-couponSelectTip">请选择卡券！</p>
        </a-form-item>
        <a-form-item label="卡券有效期：">
          <a-input :placeholder="couponValid" disabled />
        </a-form-item>
        <p class="create-main-title">
          <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
          卡券发放信息
        </p>
        <a-form-item label="领取条件设置：">
          <a-select
            @change="conditionsChange"
            placeholder="请选择"
            v-decorator="[
              'conditions',
              {
                initialValue: 1,
                rules: [{ required: true, message: '请设置领取条件!' }]
              }
            ]"
          >
            <a-select-option v-for="item in receiveList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <div v-if="conditions !== 2">
          <a-form-item v-for="item in issueForm" :key="item.label" :label="item.label">
            <a-input-number
              style="width: 100%"
              :placeholder="item.placehold"
              v-decorator="[`${item.name}`, { rules: item.rules }]"
            />
          </a-form-item>
        </div>
        <div v-if="conditions == 2">
          <a-form-item label="发放范围">
            <a-select
              v-decorator="[
                'issuedRang',
                {
                  initialValue: 2,
                  rules: [{ required: true, message: '请设置发放范围!' }]
                }
              ]"
              @change="val => (issuedRang = val)"
            >
              <a-select-option v-for="item in issueRange" :key="item.label" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="上传指定会员" v-if="issuedRang == 2">
            <a-upload
              v-decorator="[
                'file',
                {
                  rules: [
                    {
                      validator: (rule, value, callback) => validatorFn1(rule, value, callback, '请选择文件上传!')
                    }
                  ]
                }
              ]"
              :file-list="fileList"
              :remove="handleRemove"
              name="file"
              accept=".xls,.xlsx"
              :before-upload="uploadBefor"
            >
              <a-button>
                <a-icon type="upload" />
                上传文件
              </a-button>
              <p class="create-main-uploadTip">支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次</p>
            </a-upload>
            <p>
              <a v-show="!downLoadTplExist" @click.prevent="handleNullTpl">暂无模板文件</a>
              <a v-show="downLoadTplExist" :href="downLoadTplUrl">下载模板文件</a>
            </p>
          </a-form-item>
          <a-form-item label="接入系统" v-if="issuedRang == 3">
            <a-checkbox-group v-decorator="['clientId', { rules: [{ required: true, message: '请选择接入系统!' }] }]">
              <a-checkbox v-for="item in systemList" :key="item.label" :value="item.appCode">
                {{ item.appName }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="指定会员卡" v-if="issuedRang == 4">
            <a-select
              @change="changeMemberCard"
              v-decorator="['memberCardId', { rules: [{ required: true, message: '请选择会员卡!' }] }]"
            >
              <a-select-option v-for="item in cardList" :key="item.id" :value="item.id">
                {{ item.memberCardName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="会员等级" v-if="issuedRang == 4">
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-select
                style="width: 100%"
                v-decorator="['startLevelId', { rules: [{ required: true, message: '请选择会员等级' }] }]"
              >
                <a-select-option v-for="item in levelList" :key="item.id" :value="item.id">
                  {{ item.levelName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
              -
            </span>
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-select
                style="width: 100%"
                v-decorator="['endLevelId', { rules: [{ required: true, message: '请选择会员等级' }] }]"
              >
                <a-select-option v-for="item in levelList" :key="item.id" :value="item.id">
                  {{ item.levelName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form-item>
        </div>
        <a-form-item
          label="领取有效期"
          v-if="conditions === 1 || conditions === 3 || conditions === 5 || conditions === 6 || conditions === 7"
        >
          <a-range-picker
            v-decorator="[
              'rangePickerValue',
              {
                initialValue: rangePickerValue,
                rules: [{ validator: (rule, value, callback) => validatorDate(rule, value, callback) }]
              }
            ]"
            :placeholder="['开始时间', '结束时间']"
            format="YYYY-MM-DD HH:mm:ss"
            @change="handleRangePicker"
            :show-time="{ defaultValue: [moment(moment().format('HH:mm:ss')), moment('23:59:59', 'HH:mm:ss')] }"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item class="create-main-button">
          <a-button
            :disabled="submitLoading"
            :loading="submitLoading"
            type="primary"
            class="create-main-button-items"
            @click="couponDistribute"
          >
            发放
          </a-button>
          <a-button class="create-main-button-items" @click="$router.push({ name: 'release' })">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-modal title="卡券选择" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch" />
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: scrollY }"
        :row-selection="rowSelection"
      >
        <template slot="faceAmountSlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="faceAmountStr(scope)"></span>
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
import { couponsCenterList, bangdouList, cardList, level, typeList, activityList } from './createForms';
import FilterForm from './../../../components/FilterGroup/index.jsx';
import moment from 'moment';
import api from '@/api';
import { debounce } from '@/utils/util';

const validatorFn1 = (rule, value, callback, message) => {
  console.log('validatorFn1 value :>> ', value);
  if (!value) {
    callback(message);
  } else {
    if (value.fileList.length === 0) {
      callback(message);
    } else {
      callback();
    }
  }
};

export default {
  name: 'release_create',
  components: {
    FilterForm
  },
  data() {
    return {
      downLoadTplExist: false,
      downLoadTplUrl: '',
      submitLoading: false,
      showRedBorder: false,
      cardList: [],
      couponName: '请选择',
      couponValid: '',
      selectedRows: [],
      scrollY: 300,
      pageSize: 10,
      current: 1,
      total: null,
      tableLoading: false,
      tableDataList: [],
      visible: false,
      formBasic: this.$form.createForm(this, { name: 'formBasic' }),
      levelList: [],
      receiveList: [
        { label: '领券中心', value: 1 },
        { label: '直接发放', value: 2 },
        { label: '邦豆兑换', value: 3 },
        { label: '卡密兑换', value: 4 },
        { label: '分销推广', value: 5 },
        { label: '商品详情', value: 6 },
        { label: '活动领券', value: 7 }
      ],
      systemList: [],
      issueRange: [
        // { label: '全部会员', value: 1 },
        { label: '指定会员', value: 2 }
        // { label: '指定接入系统', value: 3 },
        // { label: '指定会员卡', value: 4 }
      ],
      issueForm: couponsCenterList,
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
      newid: null,
      activity: null,
      title: '',
      type: null,
      conditions: 1, // 领取类型
      issuedRang: 2, // 发放范围
      couTypeCode: '', // 卡券类型编号
      dataSourse: {
        memberCardName: '', // 会员卡名称
        file: null //会员文件
      },
      fileList: [],
      id: null,
      rangePickerValue: [], //日期对象清空日期用
      validityStartTime: null, //领取有效期-开始时间
      validityExpirationTime: null, //	领取有效期-结束时间
      classification: null,
      overlying: null,
      merchanDises: null
    };
  },
  created() {
    this.getCouponList();
    this.getCardList();
    this.getSystemList();
  },
  methods: {
    validatorFn1,
    validatorDate(rule, value, callback) {
      let time1 = new Date(value[1]).getTime(), //领取有效期结束时间
        time2 = new Date(this.selectedRows[0].validityEndTime).getTime(); //卡券有效期结束时间
      console.log('领取有效期结束时间', time1);
      console.log('卡券有效期结束时间', time2);
      if (this.selectedRows[0].validityType == 1 && time1 < time2) {
        callback('领取有效期结束时间不能小于卡券有效期结束时间');
      } else {
        callback();
      }
    },
    moment,
    disabledDate(current) {
      return current && current < Date.now() - 86400000;
    },
    handleRangePicker(dates, dateStrings) {
      console.log('handleRangePicker dates :>> ', dates);
      console.log('handleRangePicker dateStrings :>> ', dateStrings);
      this.rangePickerValue = dates;
      this.validityStartTime = dateStrings[0];
      this.validityExpirationTime = dateStrings[1];
    },
    handleNullTpl() {
      this.$warning({
        title: '提示',
        content: '暂无模板文件, 您可以尝试刷新页面重新加载～'
      });
    },
    conditionsChange(val) {
      console.log('conditionsChange val :>> ', val);
      this.conditions = val;
      if (this.conditions === 2) {
        this.getTplDownload();
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.dataSourse.file = null;
    },
    uploadBefor(file) {
      this.dataSourse.file = file;
      this.$set(this.fileList, 0, file);
      // this.fileList[0] = file;
      console.log('uploadBefor this.fileList :>> ', this.fileList);
      return false;
    },
    changeMemberCard(val, option) {
      const activityArr = this.cardList.filter(item => item.id == val);
      this.dataSourse.memberCardName = activityArr[0].memberCardName;
      api.getMemberLevelList({ cardId: val }).then(res => (this.levelList = res.data));
    },
    // 关闭弹窗
    handleCancel(e) {
      this.visible = false;
    },
    // 点击弹窗确定
    handleOk(e) {
      this.confirmLoading = true;
      if (this.selectedRows.length > 0) {
        this.visible = false;
        this.couponName = this.selectedRows[0].couponTitle;
        this.couTypeCode = this.selectedRows[0].couTypeCode;
        this.showRedBorder = false;
        this.id = this.selectedRows[0].id;
        console.log('=======', this.selectedRows);
        if (this.selectedRows[0].validityType == 1) {
          this.couponValid = `${this.selectedRows[0].validityStartTime} - ${this.selectedRows[0].validityEndTime}`;
        } else {
          this.couponValid = `有效天数: ${this.selectedRows[0].validityDayNums}天，${this.selectedRows[0].takeEffectDayNums}天后生效`;
        }
        this.classification = this.selectedRows[0].classification;
        this.overlying = this.selectedRows[0].overlying;
        this.merchanDises = this.selectedRows[0].merchanDises;
      } else {
        this.$message.error('必须选择一个卡券!');
      }
      this.confirmLoading = false;
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
    // 切换卡券列表分页
    // onShowSizeChange(current, pageSize) {
    //   this.current = current;
    //   this.pageSize = pageSize;
    //   this.getCouponList();
    // },
    change(page) {
      this.current = page;
      this.getCouponList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
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
        status: 99
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
    // 打开弹窗
    handleSelectCoupon() {
      this.visible = true;
    },
    // 获取下载模版
    getTplDownload() {
      this.downLoadTplExist = false;
      api.getTplDownload().then(res => {
        console.log('getTplDownload res :>> ', res);
        this.downLoadTplExist = true;
        this.downLoadTplUrl = res.data;
      });
    },
    // 获取会员卡列表
    getCardList() {
      api.getCardList({}).then(res => {
        this.cardList = res.data;
      });
    },
    // 获取系统列表
    getSystemList() {
      api.getClientList().then(res => {
        this.systemList = res.data;
      });
    },
    // 开始派发
    couponDistribute() {
      if (!this.couTypeCode) {
        this.showRedBorder = true;
      }
      let args = {
        couTypeCode: this.couTypeCode,
        id: this.id
      };
      this.formBasic.validateFields((err, values) => {
        console.log('couponDistribute err :>> ', err);
        console.log('couponDistribute values :>> ', values);
        if (this.validityStartTime && this.validityExpirationTime) {
          Object.assign(args, {
            validityStartTime: this.validityStartTime,
            validityExpirationTime: this.validityExpirationTime
          });
        }
        Object.assign(args, {
          classification: this.classification,
          overlying: this.overlying,
          merchanDises: this.merchanDises
        });
        console.log('couponDistribute args :>> ', args);
        if (!err && !this.showRedBorder) {
          if (values.file) {
            Object.assign(args, values, { file: this.dataSourse.file });
          } else if (values.clientId) {
            Object.assign(args, values, { clientId: values.clientId.join(',') });
          } else if (values.conditions === 2) {
            Object.assign(args, values, { memberCardName: this.dataSourse.memberCardName });
          } else {
            Object.assign(args, values);
          }

          this.submitLoading = true;
          api
            .couponDistribute(
              Object.keys(args).reduce((pre, key) => {
                if (args[key] !== null) {
                  pre.append([key], args[key]);
                }
                return pre;
              }, new FormData())
            )
            .finally(() => {
              this.submitLoading = false;
            })
            .then(res => res.code == 200 && this.$router.push({ name: 'release_status' }));
        }
      });
    }
  },
  watch: {
    conditions: function(newVal, oldVal) {
      console.log('conditions newVal :>> ', newVal);
      switch (newVal) {
        case 1:
          this.issueForm = couponsCenterList;
          break;
        case 5:
          this.issueForm = couponsCenterList;
          break;
        case 6:
          this.issueForm = couponsCenterList;
          break;
        case 7:
          this.issueForm = couponsCenterList;
          break;
        case 4:
          this.issueForm = cardList;
          break;
        case 3:
          this.issueForm = bangdouList;
          break;
        default:
          this.issueForm = [];
          break;
      }
    },
    visible: function(newVal, oldVal) {
      if (newVal) {
        this.getCouponList();
      }
    },
    fileList: {
      handler(newVal) {
        console.log('watch fileList newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    }
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
  }
};
</script>
<style lang="less" scoped>
.create {
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
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 40px;
      line-height: 50px;
      margin: 0;

      .ant-divider,
      .ant-divider-vertical {
        margin: 0 8px 0 0;
      }
    }
    &-uploadTip {
      font-size: 12px;
      color: #c1c1c1;
    }
    &-button {
      text-align: right;
      padding-top: 40px;
      &-items {
        margin: 0 10px;
      }
    }
    &-couponSelect {
      width: 100%;
      line-height: 32px;
      height: 32px;
      border: 1px solid #bfbfbf;
      color: #bfbfbf;
      padding-left: 10px;
      border-radius: 3px;
    }
    &-couponSelectTip {
      color: #f5222d;
      margin: 0;
      line-height: 1.5;
      padding-top: 3px;
    }
  }
}
.border-red {
  border-color: #f5222d;
}
</style>
