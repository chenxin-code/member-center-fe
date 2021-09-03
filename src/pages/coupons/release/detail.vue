<template>
  <div class="detail">
    <div class="detail-header">
      <div class="detail-header-title">派发详情</div>
      <span class="detail-header-fallback" @click="$store.dispatch('FALLBACK')">
        返回
      </span>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
        卡券基础信息
      </p>
      <div class="detail-main-items">
        <span class="detail-main-items-label">卡券id：</span>
        <span class="detail-main-items-value">{{ dataObj.couponId }}</span>
      </div>
      <div class="detail-main-items">
        <span class="detail-main-items-label">卡券标题：</span>
        <span class="detail-main-items-value">{{ dataObj.couponName }}</span>
      </div>
      <div class="detail-main-items">
        <span class="detail-main-items-label">卡券有效期：</span>
        <span v-show="dataObj.expirationType == 1" class="detail-main-items-value">
          {{
            `${moment(dataObj.startTime).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(dataObj.expirationTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )}`
          }}
        </span>
        <span v-show="dataObj.expirationType == 3" class="detail-main-items-value">
          相对有效期: {{ dataObj.valiDays }}天, 领取后{{ dataObj.offsetDays }}天生效
        </span>
      </div>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
        卡券发放信息
      </p>
      <div class="detail-main-items">
        <span class="detail-main-items-label">领取条件设置：</span>
        <span class="detail-main-items-value">{{ filterValue(receiveType, dataObj.conditions) }}</span>
      </div>
      <!-- 领取类型：领券中心 -->
      <div v-show="dataObj.conditions == 1 || dataObj.conditions == 5">
        <div class="detail-main-items" v-for="item in receiveCenter" :key="item.label">
          <span class="detail-main-items-label">{{ item.label }}</span>
          <span class="detail-main-items-value">{{ dataObj[item.name] }}</span>
        </div>
      </div>
      <!-- 领取类型：邦豆兑换 -->
      <div v-show="dataObj.conditions == 3">
        <div class="detail-main-items" v-for="item in bangdouList" :key="item.label">
          <span class="detail-main-items-label">{{ item.label }}</span>
          <span class="detail-main-items-value">{{ dataObj[item.name] }}</span>
        </div>
      </div>
      <!-- 领取类型：卡密兑换 -->
      <div v-show="dataObj.conditions == 4">
        <div class="detail-main-items">
          <span class="detail-main-items-label">派发数量：</span>
          <span class="detail-main-items-value">{{ dataObj.issuedCount }}</span>
        </div>
      </div>
      <!-- 领取类型：直接发放 -->
      <div v-show="dataObj.conditions == 2">
        <div class="detail-main-items">
          <span class="detail-main-items-label">发放范围：</span>
          <span class="detail-main-items-value">{{ filterValue(issueRangeList, dataObj.issuedRang) }}</span>
        </div>
        <div class="detail-main-items" v-show="dataObj.issuedRang == 2">
          <span class="detail-main-items-label">指定会员：</span>
          <span class="detail-main-items-value">
            <a-button @click="downloadInfo">
              <a-icon type="download" />
              下载会员信息
            </a-button>
          </span>
        </div>
        <div class="detail-main-items" v-show="dataObj.issuedRang == 3">
          <span class="detail-main-items-label">接入系统：</span>
          <span class="detail-main-items-value">{{ dataObj.clientName }}</span>
        </div>
        <div class="detail-main-items" v-show="dataObj.issuedRang == 4">
          <span class="detail-main-items-label">会员卡：</span>
          <span class="detail-main-items-value">
            {{ `${dataObj.memberCardName}，V${dataObj.startLevelId}-V${dataObj.endLevelId}` }}
          </span>
        </div>
      </div>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
        卡券记录信息
      </p>
      <div class="detail-main-items">
        <span class="detail-main-items-label">卡券发放：</span>
        <span class="detail-main-items-value">
          {{ `${moment(dataObj.createTime).format('YYYY-MM-DD HH:mm:ss')} ${dataObj.operator}` }}
        </span>
      </div>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; background-color: #4c7afb" />
        卡券数据
      </p>
      <div class="detail-main-items" v-if="dataObj.conditions === 4">
        <span class="detail-main-items-label">线下卡密下载：</span>
        <a-button @click="downloadCamilo(dataObj)">
          <a-icon type="download" />
          下载线下卡密
        </a-button>
      </div>
      <div class="detail-main-items" v-for="item in couponSourse" :key="item.label">
        <span class="detail-main-items-label">{{ item.label }}</span>
        <span class="detail-main-items-value">{{ dataObj[item.name] }}</span>
        <a-button style="marginLeft: 20px" v-show="item.type === 'href'" type="primary" @click="goCheck(item.url)">
          {{ item.buttonTxt }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';
import { message } from 'ant-design-vue';
import axios from 'axios';
export default {
  name: 'release_detail',
  data() {
    return {
      receiveType: [
        { label: '领券中心', value: 1 },
        { label: '直接发放', value: 2 },
        { label: '邦豆兑换', value: 3 },
        { label: '卡密兑换', value: 4 },
        { label: '分销推广', value: 5 },
        { label: '商品详情', value: 6 },
      ],
      issueRangeList: [
        { label: '全部会员', value: 1 },
        { label: '指定会员', value: 2 },
        { label: '接入系统', value: 3 },
        { label: '指定会员卡', value: 4 }
      ],
      dataObj: {},
      couponSourse: [
        // { label: '线下卡密下载：'},
        { label: '发放数量：', type: 'msg', name: 'issuedCount' },
        { label: '领取数量：', type: 'href', name: 'received', url: 'couponsClaim', buttonTxt: '查看领取数量' },
        { label: '核销数量：', type: 'href', name: 'offCount', url: 'couponsCancel', buttonTxt: '查看核销数量' }
      ],
      receiveCenter: [
        //领券中心
        { label: '派发数量：', name: 'issuedCount' },
        { label: '每人领取数量限制：', name: 'perPersonLimit' },
        { label: '每日领取数量限制：', name: 'perDayLimit' },
        { label: '每人每日领取数量限制：', name: 'perPersonDayLimit' }
      ],
      bangdouList: [
        { label: '派发数量', name: 'issuedCount' },
        { label: '邦豆兑换值', name: 'integrealCount' },
        { label: '每人领取数量限制：', name: 'perPersonLimit' },
        { label: '每日领取数量限制：', name: 'perDayLimit' },
        { label: '每人每日领取数量限制：', name: 'perPersonDayLimit' }
      ]
    };
  },
  mounted() {
    this.initData(this.$route.query.id);
  },
  methods: {
    moment,
    initData(id) {
      api.getReleaseDetail({ id: id }).then(res => {
        if (res.code === 200) {
          this.dataObj = res.data;
          console.log('this.dataObj :>> ', this.dataObj);
        }
      });
    },
    filterValue(list, type) {
      return type && list.filter(item => item.value == type)[0].label;
    },
    goCheck(url) {
      console.log('url :>> ', url);
      if (url === 'couponsClaim') {
        this.$router.push({ name: url, query: { id: this.dataObj.id, code: this.dataObj.couTypeCode } });
      }

      if (url === 'couponsCancel') {
        this.$router.push({ name: url, query: { code: this.dataObj.couTypeCode } });
      }

    },
    downloadInfo() {
      const args = {
        couponCode: this.dataObj.couTypeCode,
        couponActivitiesId: this.dataObj.id
      };
      // console.log('downloadInfo args :>> ', args);
      // return;
      axios({
        method: 'get',
        params: args,
        url: '/times/member-center/coupon/api/v1/download',
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
      const filename = '会员信息.xlsx';
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
    downloadCamilo(item) {
      this.tableLoading = true;
      let args = {
        couponActivitiesId: item.id
      };
      api
        .downloadCamilo(args)
        .then(res => {
          if (res.code === 200) {
            this.downloadInfo1(item.id);
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
    downloadInfo1(cuid) {
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
        this.download1(res.data);
      });
    },
    download1(content) {
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
        width: 180px;
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
