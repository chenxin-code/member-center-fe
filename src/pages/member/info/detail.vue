<template>
  <div id="member-info-detail">
    <div class="content-header">
      会员详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding-bottom:10px;height:100%;">
        <!-- 基础信息 -->
        <div class="member-base">
          <div class="base-title">
            <div class="base-title-content">基础信息</div>
          </div>
          <a-row class="base-row" style="padding:16px;border-bottom: 1px dashed #ccc;">
            <a-col :span="16">
              <div class="base-left">
                <div class="base-left-top">
                  <div class="left-top-left">
                    <a-avatar
                      class="head-avatar"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  </div>
                  <div class="left-top-right">
                    <div>会员ID:{{ memberId }}</div>
                    <div v-html="`会员手机号:+${memberDetails.phoneAreaCode} ${memberDetails.phone}`"></div>
                  </div>
                </div>
                <div class="base-left-middle">
                  <div class="left-middle-item">昵称: {{ memberDetails.memberName }}</div>
                  <div class="left-middle-item">姓名: {{ memberDetails.memberName }}</div>
                  <div class="left-middle-item">性别: {{ sexStr(memberDetails.sex) }}</div>
                  <div class="left-middle-item">证件类型: {{ cardTypeStr(memberDetails.cardType) }}</div>
                  <div class="left-middle-item">证件号: {{ memberDetails.cardNo }}</div>
                  <div class="left-middle-item" v-html="`生日: ${moment(memberDetails.birthday).format('YYYY-MM-DD')}`">
                    {
                  </div>
                  <div
                    class="left-middle-item"
                    v-html="`加入时间: ${moment(memberDetails.createTime).format('YYYY-MM-DD')}`"
                  ></div>
                  <div class="left-middle-item">邮箱: {{ memberDetails.email }}</div>
                </div>
                <div class="base-left-bottom">
                  <div class="left-bottom-left" style="padding-right:5px;">接入来源:</div>
                  <div class="left-bottom-right">
                    <div v-for="item in memberDetails.memberSources" :key="item.id">
                      {{ item.sourceName }} {{ moment(memberDetails.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="base-right">
                <div class="right-item">邦豆</div>
                <div class="right-item right-item-middle">{{ memberDetails.integral }}</div>
                <div class="right-item right-item-bottom">
                  <div class="right-item-bottom-left">邦豆充值</div>
                  <div class="right-item-bottom-right">邦豆抵扣</div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 会员卡信息 -->
        <div class="member-card">
          <div class="card-title">
            <div class="card-title-content">会员卡信息</div>
          </div>
          <a-row style="padding:16px;border-bottom: 1px dashed #ccc;">
            <a-col :span="24">
              <div class="card-row">
                <div class="card-row-left"></div>
                <div class="card-row-center">aaaa</div>
                <div class="card-row-right">aaaa</div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 会员记录 -->
        <div class="member-record">
          <a-row style="margin-top: 20px">
            <a-tabs type="card" @change="tabChangeCallback">
              <a-tab-pane class="tabs-body-content" key="1" tab="微应用版本">
                <div>
                  <a-table
                    :columns="versionsColumns"
                    :data-source="versionsDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="versionsTotal"
                    :show-total="versionsTotal => `共 ${versionsTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="versionsCurrent"
                    :page-size.sync="versionPageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingVersions"
                    @showSizeChange="pagingVersions"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="2" tab="小区范围">
                <div>
                  <a-table
                    :columns="developmentColumns"
                    :data-source="developmentDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="developmentTotal"
                    :show-total="developmentTotal => `共 ${developmentTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="developmentCurrent"
                    :page-size.sync="developmentPageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingDevelopment"
                    @showSizeChange="pagingDevelopment"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane class="tabs-body-content" key="3" tab="资源包">
                <div>
                  <a-table
                    :columns="resourcePackageColumns"
                    :data-source="resourcePackageDataSource"
                    :pagination="false"
                    :scroll="{ y: scrollY }"
                    :row-key="(r, i) => i"
                    :loading="tableLoading"
                    :selectable="false"
                    style="width:100%;margin-top:8px;"
                  ></a-table>
                  <a-pagination
                    :total="resourcePackageTotal"
                    :show-total="resourcePackageTotal => `共 ${resourcePackageTotal} 条`"
                    show-quick-jumper
                    show-size-changer
                    :default-current="developmentCurrent"
                    :page-size.sync="resourcePackagePageSize"
                    :pageSizeOptions="['10', '20', '50', '100']"
                    @change="pagingResourcePackage"
                    @showSizeChange="pagingResourcePackage"
                    style="margin-top:30px;width:100%;text-align: right;"
                  />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';
import { mapActions } from 'vuex';
const defaultAvatar = require('@/assets/img/user/avatar.png');
import { CARD_TYPE_MAP } from '@/constance';
// console.log('CARD_TYPE_MAP :>> ', CARD_TYPE_MAP);

// import mock from './mock';
// console.log('mock :>> ', mock);

//页面列表数据
const allColumns = {
  versionsColumns: [
    {
      title: '版本号',
      key: 'programVersion',
      dataIndex: 'programVersion'
    },
    {
      title: '小区分布数量',
      dataIndex: 'projectCount',
      key: 'projectCount'
    },
    {
      title: 'App版本分布数量',
      dataIndex: 'appVersionCount',
      key: 'appVersionCount'
    }
  ],
  developmentColumns: [
    {
      title: '小区名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '城市',
      dataIndex: 'orgName',
      key: 'orgName'
    }
  ],
  resourcePackageColumns: [
    {
      title: '资源包名称',
      key: 'resourceName',
      dataIndex: 'resourceName'
    },
    {
      title: '资源包大小',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '版本号',
      dataIndex: 'resourceVersion',
      key: 'resourceVersion'
    },
    {
      title: '下载地址',
      key: 'url',
      dataIndex: 'url'
    }
  ]
};
//基本信息
const microApplicationDetail = {
  appCode: '',
  code: '',
  icon: '',
  id: '',
  isDeleted: '',
  memo: '',
  name: '',
  router: '',
  type: ''
  // microId: "",
};
export default {
  name: 'memberInfoDetail',
  // props: {
  //   id: {
  //     type: Number,
  //     default: () => ({})
  //   },
  // },
  data() {
    return {
      memberId: '',
      memberDetails: {},
      microApplicationDetail: microApplicationDetail,
      //表格高度,与每页大小通用
      scrollY: 100,
      tableLoading: false,
      //微应用版本列表变量
      versionsColumns: allColumns.versionsColumns,
      versionsDataSource: [],
      versionsTotal: 0,
      versionsCurrent: 1,
      versionPageSize: 10,
      //小区范围列表变量
      developmentColumns: allColumns.developmentColumns,
      developmentDataSource: [],
      developmentTotal: 0,
      developmentCurrent: 1,
      developmentPageSize: 10,
      //资源包列表变量
      resourcePackageColumns: allColumns.resourcePackageColumns,
      resourcePackageDataSource: [],
      resourcePackageTotal: 0,
      resourcePackageCurrent: 1,
      resourcePackagePageSize: 10
    };
  },
  computed: {
    cardTypeStr() {
      return param => {
        let str = '';
        if (Object.keys(CARD_TYPE_MAP).includes(param)) {
          str = CARD_TYPE_MAP[param];
        }
        return str;
      };
    },
    sexStr() {
      return param => {
        let str = '';
        if (param === 1) {
          str = '男';
        } else if (param === 2) {
          str = '女';
        } else {
          str = '未知';
        }
        return str;
      };
    }
  },
  methods: {
    moment,
    ...mapActions(['FALLBACK']),
    defImg() {
      this.microApplicationDetail.icon = require('../../../assets/img/user/avatar.png');
    },
    tabChangeCallback(key) {
      if (key == 1) {
        // this.getVersionsDataSource();
      } else if (key == 2) {
        this.getDevelopmentDataSource();
      } else if (key == 3) {
        this.getResourcePackageDataSource();
      }
    },
    getMemberDetail() {
      const param = {
        memberId: this.$route.params.id
      };

      // for (const key in mock.data) {
      //   if (Object.hasOwnProperty.call(mock.data, key)) {
      //     const element = mock.data[key];
      //     this.$set(this.memberDetails, key, element);
      //   }
      // }

      api.getMemberDetail(param).then(res => {
        console.log('getMemberDetail res :>> ', res);
        if (res.code === 200) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              const element = res.data[key];
              this.$set(this.memberDetails, key, element);
            }
          }
          console.log('this.memberDetails :>> ', this.memberDetails);
        }
      });
    },
    //微应用版本
    pagingVersions(current, pageSize) {
      console.log(current, pageSize);
      this.versionPageSize = pageSize;
      this.versionsCurrent = current;
      // this.getVersionsDataSource();
    },
    //小区列表分页
    pagingDevelopment(current, pageSize) {
      this.developmentPageSize = pageSize;
      this.developmentCurrent = current;
      this.getDevelopmentDataSource();
    },
    //资源包列表分页
    pagingResourcePackage(current, pageSize) {
      this.resourcePackagePageSize = pageSize;
      this.resourcePackageCurrent = current;
      this.getResourcePackageDataSource();
    }
  },
  //局部过滤器
  filters: {
    formatType(value) {
      let returnMsg = '未知';
      switch (value) {
        case 1:
          returnMsg = '原生';
          break;
        case 2:
          returnMsg = 'uniapp';
          break;
        case 3:
          returnMsg = '微应用';
          break;
        case 4:
          returnMsg = 'H5';
          break;
      }
      return returnMsg;
    }
  },
  created: function() {
    console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    this.memberId = JSON.parse(window.sessionStorage.routerParams).id;
    this.getMemberDetail();
  },
  mounted() {
    // console.log(this.$store.commit('FALLBACK'));
    // this.getVersionsDataSource();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 204 + 'px';
    }, 100);
  }
};
</script>

<style lang="less" scoped>
#member-info-detail {
  .member-base {
    .base-title {
      color: #666;
      padding: 5px 0 0 26px;
      .base-title-content {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        padding-left: 8px;
        border-left: 3px solid rgba(33, 33, 206, 0.5);
      }
    }
    .base-row {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .base-left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .base-left-top {
          width: 100%;
          padding: 10px;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          // .left-top-left{}
          // .left-top-right{}
        }
        .base-left-middle {
          width: calc(100% -32px);
          margin-left: 32px;
          color: #666;
          padding: 10px 10px 0 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;

          .left-middle-item {
            width: calc(100% / 3);
            margin-bottom: 10px;
          }
        }
        .base-left-bottom {
          width: calc(100% -32px);
          margin-left: 32px;
          color: #666;
          padding: 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }

      .base-right {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .right-item {
          margin-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }

        .right-item-middle {
          padding: 2px 4px;
          background: lightblue;
          font-size: 20px;
          font-weight: bold;
        }
        .right-item-bottom {
          .right-item-bottom-left {
            padding: 2px 4px;
            margin-right: 20px;
            background: skyblue;
          }
          .right-item-bottom-right {
            padding: 2px 4px;
            border: 1px solid skyblue;
          }
        }
      }
    }
  }

  .member-card {
    .card-title {
      color: #666;
      padding: 5px 0 0 26px;
      .card-title-content {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        padding-left: 8px;
        border-left: 3px solid rgba(33, 33, 206, 0.5);
      }
    }
    .card-row {
      padding-left: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;

      .card-row-left {
        margin-right: 45px;
        background-color: red;
        width: 200px;
        height: 150px;
      }
      .card-row-center {
                margin-right: 45px;
        background-color: #ccc;
        width: 200px;
        height: 150px;
      }
      .card-row-right {
        background-color: skyblue;
        width: 200px;
        height: 150px;
      }
    }
  }
  .ant-tabs-bar {
    margin: 0 !important;
  }

  .fallback {
    cursor: pointer;
  }

  .icon-body {
    margin-top: 10px;
    display: flex;
    font-size: 16px;
    font-weight: 500;
  }

  .micro-unable {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../../../assets/img/micro/Icon_unable.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }

  .micro-enable {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../../../assets/img/micro/Icon_enable.png');
    background-size: 100% 100%;
    margin-right: 10px;
  }
}
</style>
