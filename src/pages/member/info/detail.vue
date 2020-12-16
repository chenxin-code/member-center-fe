<template>
  <div id="microDetail">
    <div class="content-header">
      会员详情<span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px 0;height:100%;">
        <!-- 1 -->
        <a-row style="padding:20px;border-bottom: 1px dashed #ccc;">
          <a-col :span="8">
            <div>
              <img :src="microApplicationDetail.icon" @error="defImg()" style="width: 84px;height: 84px;" />
            </div>
            <div>
              <div v-show="microApplicationDetail.isDeleted != 0" class="icon-body" style="color: red">
                <span class="micro-unable"></span>
                不可用
              </div>
              <div v-show="microApplicationDetail.isDeleted == 0" class="icon-body" style="color: green;">
                <span class=" micro-enable"></span>
                可用
              </div>
            </div>
          </a-col>
          <a-col :span="16">
            <a-descriptions title="">
              <a-descriptions-item label="微应用名称">
                {{ microApplicationDetail.name }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用平台">
                {{ microApplicationDetail.appCode }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用类型">
                {{ microApplicationDetail.type }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用路由">
                {{ microApplicationDetail.path }}
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
        <!-- 2 -->
        <a-row style="padding:20px;border-bottom: 1px dashed #ccc;">
          <a-col :span="8">
            <div>
              <img :src="microApplicationDetail.icon" @error="defImg()" style="width: 84px;height: 84px;" />
            </div>
            <div>
              <div v-show="microApplicationDetail.isDeleted != 0" class="icon-body" style="color: red">
                <span class="micro-unable"></span>
                不可用
              </div>
              <div v-show="microApplicationDetail.isDeleted == 0" class="icon-body" style="color: green;">
                <span class=" micro-enable"></span>
                可用
              </div>
            </div>
          </a-col>
          <a-col :span="16">
            <a-descriptions title="">
              <a-descriptions-item label="微应用名称">
                {{ microApplicationDetail.name }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用平台">
                {{ microApplicationDetail.appCode }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用类型">
                {{ microApplicationDetail.type }}
              </a-descriptions-item>
              <a-descriptions-item label="微应用路由">
                {{ microApplicationDetail.path }}
              </a-descriptions-item>
            </a-descriptions>
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
    console.log('detail this.$store :>> ', this.$store);
    console.log('this.$route :>> ', this.$route);

    //一进入这个页面必须执行
    // this.getVersionsDataSource();
    // this.getResourcePackageDataSource();
    // this.microId = this.id;
    this.getVersionsDataSource();
    this.getMicroDetail();
  },
  mounted() {
    // console.log(this.$store.commit('FALLBACK'));
    this.getVersionsDataSource();
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
        this.getVersionsDataSource();
      } else if (key == 2) {
        this.getDevelopmentDataSource();
      } else if (key == 3) {
        this.getResourcePackageDataSource();
      }
    },
    getMicroDetail() {
      //const programId = this.$route.query.id;
      const para = {
        id: this.$route.query.id
      };
      // api
      //   .microApplicationDetail(para)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.microApplicationDetail = res.data;
      //       if (this.microApplicationDetail.icon == undefined) {
      //         this.microApplicationDetail.icon =
      //           'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00408-1094.jpg';
      //       }
      //     }
      //   })
      //   .finally(() => {
      //     //this.tableLoading = false;
      //   });
    },
    //获取小区范围数据列表
    getDevelopmentDataSource() {
      // this.tableLoading = true;
      const programId = this.$route.query.id;
      const para = {
        programId,
        pageIndex: this.developmentCurrent,
        pageSize: this.developmentPageSize
      };
      // api
      //   .getAllPlot(para)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.developmentTotal = res.data.total;
      //       this.developmentDataSource = res.data.records;
      //     }
      //   })
      //   .finally(() => {
      //     this.tableLoading = false;
      //   });
    },
    //获取微应用资源包列表
    getResourcePackageDataSource() {
      // this.tableLoading = true;
      const programId = this.$route.query.id;
      const para = {
        programId,
        pageIndex: this.resourcePackageCurrent,
        pageSize: this.resourcePackagePageSize
      };
      // api
      //   .getResourcePackage(para)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.resourcePackageTotal = res.data.total;
      //       this.resourcePackageDataSource = res.data.records;
      //     }
      //   })
      //   .finally(() => {
      //     this.tableLoading = false;
      //   });
    },
    //获取微应用版本列表
    getVersionsDataSource() {
      // this.tableLoading = true;
      const programId = this.$route.query.id;
      const para = {
        programId,
        pageIndex: this.versionsCurrent,
        pageSize: this.versionPageSize
      };
      // api
      //   .getMicroApplicationVersion(para)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.versionsTotal = res.data.total;
      //       this.versionsDataSource = res.data.records;
      //     }
      //   })
      //   .finally(() => {
      //     this.tableLoading = false;
      //   });
    },
    //微应用版本
    pagingVersions(current, pageSize) {
      console.log(current, pageSize);
      this.versionPageSize = pageSize;
      this.versionsCurrent = current;
      this.getVersionsDataSource();
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
