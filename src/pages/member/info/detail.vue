<template>
  <div id="microDetail">
    <div class="content-header">
      会员详情
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding-bottom:10px;height:100%;">
        <!-- 1 -->
        <a-row style="padding:16px;border-bottom: 1px dashed #ccc;">
          <div>基础信息</div>
          <a-col style="background: #ccc;" :span="16">
            <div class="member-info">
              <!-- <a-avatar
                class="user-avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                @loadError="loadError"
              /> -->
              <a-avatar class="user-avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <div>会员ID:{{}}</div>
              <div>会员手机号:{{}}</div>
            </div>
            <div>aaaa</div>
            <div>aaaa</div>
          </a-col>
          <a-col style="background: skyblue;" :span="8">
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
          </a-col>
        </a-row>
        <!-- 2 -->
        <a-row style="padding:16px;border-bottom: 1px dashed #ccc;">
          <div>会员卡信息</div>
          <a-col style="background: #ccc;" :span="16">
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
          </a-col>
          <a-col style="background: skyblue;" :span="8">
            <div>aaaa</div>
            <div>aaaa</div>
            <div>aaaa</div>
          </a-col>
        </a-row>
        <!-- 3 -->
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
      </a-row>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapActions } from 'vuex';
const defaultAvatar = require('@/assets/img/user/avatar.png');

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
  name: 'microDetail',
  // props: {
  //   id: {
  //     type: Number,
  //     default: () => ({})
  //   },
  // },
  data() {
    return {
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
    // console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    // this.getVersionsDataSource();
    // this.getMicroDetail();
    this.getMemberDetail();
  },
  mounted() {
    // console.log(this.$store.commit('FALLBACK'));
    // this.getVersionsDataSource();
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 204 + 'px';
    }, 100);
  },
  methods: {
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
  }
};
</script>

<style scoped>
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
</style>
