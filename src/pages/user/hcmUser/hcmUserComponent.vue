<template>
  <a-row type="flex" style="height:calc(100% - 44px);flex-flow: row;margin-top: -16px;">
    <a-col flex="220px" style="height: 100%;border-right: 1px solid #E9E9E9">
      <a-input-search
        style="padding: 16px 8px"
        placeholder="请输入公司名称"
        :loading="treeSearchLoading"
        v-model="company"
        @change="onTreeSearch"
      />
      <a-tree
        style="height:calc(100% - 84px);overflow:scroll"
        :expanded-keys="expandedKeys"
        :selected-keys="[params.orgId]"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        :replace-fields="{ children: 'children', title: 'name', key: 'id' }"
        @expand="onTreeExpand"
        @select="onTreeSelect"
      />
    </a-col>

    <a-col flex="auto">
      <div class="content-main" ref="contentMain" style="padding:20px;height:100%;">
        <FormList
          ref="form"
          rowCol="3"
          :formList="formList"
          :onSubmit="onCheck"
        />
        <a-button v-if="isNotHcm && hasRangeAuthorityWithoutProject(['button_add_user'])" type="primary" html-type="submit" @click="addHcmUser">+ 添加用户</a-button>

        <div style="padding: 20px 0 0 0;">
          <a-table
            :columns="columns"
            :data-source="data"
            :row-key="(r,i) => i"
            :loading="loading"
            :scroll="{ y: scrollY }"
            :pagination="{
            current: params.pageIndex,
            pageSize: params.pageSize,
            total: Number(total),
            showTotal: (total, range) => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }"
            @change="p => getList({...this.params, pageIndex: p.current, pageSize: p.pageSize})"
          >
            <template slot="action" slot-scope="row">
              <div class="editable-row-operations">
                <a-button type="link" @click="authorizeHcmUser(row.id)">授权</a-button>
                <a-divider type="vertical" v-if="hasRangeAuthorityWithoutProject(['button_del_user'])"/>
                <a-button type="link" @click="deleteUser(row)" v-if="hasRangeAuthorityWithoutProject(['button_del_user'])">删除</a-button>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import api from "@/api";
import { EMPLOYEE } from "@/constance";
import { debounce } from "@/utils/util";
import FormList from "@/components/FormList/index.jsx";
import hasRangeAuthorityWithoutProject from '@/utils/authority'

function getStatus(isEnable, isReverse = false) {
  if (isReverse) {
    isEnable === 0 ? (isEnable = 1) : (isEnable = 0);
  }
  return { 0: "启用", 1: "禁用" }[isEnable] || ''
}

const columns = [
  {
    title: "姓名",
    dataIndex: "empName",
    key: "empName",
    ellipsis: true,
  },
  {
    title: "HCM账号",
    dataIndex: "userPrincipalName",
    key: "userPrincipalName",
    ellipsis: true,
  },
  {
    title: "公司",
    dataIndex: "companyName",
    key: "companyName",
    ellipsis: true,
  },
  {
    title: "部门",
    dataIndex: "departmentName",
    key: "departmentName",
    ellipsis: true,
  },
  {
    title: "手机号",
    dataIndex: "mobilePhone",
    key: "mobilePhone",
    ellipsis: true,
  },
  {
    title: "员工状态",
    dataIndex: "state",
    key: "state",
    ellipsis: true,
    customRender: (val) => EMPLOYEE[val] || val
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width:120,
    scopedSlots: { customRender: "action" },

  },
];

let originTreeData = [];

function filterTree(value, data = [], resData = []) {
  data.forEach((item) => {
    const { children = [], ...others } = item;
    if (others.name.includes(value)) {
      resData.push(others);
    }
    if (children.length > 0) {
      filterTree(value, children, resData);
    }
  });
  return resData;
}

export default {
  name: "hcmUserComponent",
  props: {
    tabKey: String,
    tableRefresh: Boolean,
    pageRefresh: Boolean
  },
  data() {
    return {
      formList: [
        {
          label: "姓名",
          type: "input",
          name: "name",
          placeholder: "请输入昵称",
          selectOptions: [],
          rules: [],
          initialValue: "全部",
        },
        {
          label: "手机号",
          type: "input",
          name: "phone",
          placeholder: "请输入手机号",
        },
        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
        }
      ],
      expandedKeys: [],
      searchValue: '',
      treeSearchLoading: false,
      autoExpandParent: true,
      selectedKeys: [],
      treeData: [],
      orgName: '',
      columns,
      scrollY:200,
      data: [],
      isNotHcm: '', // 1: 行政，2：项目，3：非HCM，4：其他。需组织parentId不为0的，type为3
      loading: false,
      total: 0,
      params: {
        orgId: '',
        pageIndex: 1,
        pageSize: 10,
        phone: '',
        name: ''
      },
      company: ""
    };
  },
  components: {
    FormList
  },
  watch: {
    tabKey() {
      console.log(this.tabKey)
      if (this.treeData.length <= 0) {
        this.getTreeData();
      }
    },
  },
  mounted() {
    setTimeout(()=>{
      this.scrollY = this.$refs.contentMain.offsetHeight - 270 + "px";
    },100);
    this.getTreeData();
  },
  activated(){
    if(this.pageRefresh) {
      this.$refs.form.setFieldsValue({
        name: "",
        phone: ""
      });
      this.expandedKeys = [];
      this.searchValue = '';
      this.treeSearchLoading = false;
      this.autoExpandParent = true;
      this.selectedKeys = [];
      this.treeData = [];
      this.orgName = '';
      this.data = [];
      this.isNotHcm = '';// 1: 行政，2：项目，3：非HCM，4：其他。需组织parentId不为0的，type为3
      this.loading = false;
      this.total = 0;
      this.params = {
        orgId: '',
        pageIndex: 1,
        pageSize: 10,
        phone: '',
        name: ''
      };
      this.company = "";
      this.getTreeData();
    }else if (this.tableRefresh) {
      this.getList();
    }
  },
  methods: {
    hasRangeAuthorityWithoutProject(authKeys){
      return hasRangeAuthorityWithoutProject(authKeys)
    },
    getTreeData({ type = this.tabKey, orgName } = {}) {
      this.treeSearchLoading = true;
      api.getOrganizationTree({
        type,
        orgName
      }).then(res => {
        if (res.code === 200) {
          const data = res.data[0];
          this.params.orgId = data.id;
          this.isNotHcm = data.parentId !== 0 && data.type === 3;
          this.treeData = originTreeData = res.data.map(item => {
            if (['HCM公司', '非HCM公司'].includes(item.name)) {
              item.disabled = true;
            }
            return item;
          });
        }
      }).catch(() => {
        this.loading = false;
      }).finally(() => {
        this.treeSearchLoading = false;
      });
    },
    //查询按钮
    onCheck() {
      debounce(()=>{
        const {name,phone} = this.$refs.form.getFieldsValue();
        this.params.pageIndex = 1;
        this.params.name = name;
        this.params.phone = phone;
        this.getList();
      })
    },
    getList(params = {}) {
      this.params = { ...this.params, ...params };
      !this.loading && (this.loading = true);

      api.getHcmUser(this.params).then(res => {
        if (res.code !== 200) {
          this.$message.error(res.message);
        } else {
          this.data = res.data.records;
          this.total = res.data.total
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onTreeSelect(keys, info) {
      const data = info.selectedNodes[0].data.props;
      this.params.orgId = keys[0];
      this.params.pageIndex = 1;
      this.isNotHcm = data.parentId !== 0 && data.type === 3;
      this.companyName = data.name;
      this.getList({ orgId: this.params.orgId });
    },
    onTreeExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onTreeSearch(e) {
      debounce(() => {
        const value = e.target.value;
        if (!value) {
          this.treeData = originTreeData;
          return;
        }
        const res = filterTree(value, originTreeData);
        this.treeData = res;
      });
    },
    onNumberInput(e) {
      this.phone = e.target.value.replace(/\D/g, '');
    },
    addHcmUser() {
      window.localStorage.setItem("companyName", this.companyName);
      // this.$router.push({ path: "/user/hcmUser/addHcmUser", query: { orgId: this.params.orgId } })
      this.$router.push({
        // path: "/user/hcmUser/addHcmUser",
        name: "addHcmUser",
        params: {
          id: this.params.orgId
        }
      })
    },
    authorizeHcmUser(id) {
      // this.$router.push({ path: "/user/hcmUser/authorizeHcmUser", query: { userId: id } })
      this.$router.push({
        // path: "/user/hcmUser/authorizeHcmUser",
        name: "authorizeHcmUser",
        params: {
          id: id
        }
      })
    },
    getStatus,
    deleteUser(row) {
      this.$confirm({
        title: "是否删除该用户？",
        okType: "danger",
        centered: true,
        okText: "是",
        cancelText: "否",
        onOk: () => {
          return new Promise((resolve) => {
            api.deleteHcmUser({ orgId: this.params.orgId, userId: row.id })
              .then(res => {
                if (res.code !== 200) {
                  this.$message.error(res.message || "删除失败");
                  resolve();
                } else {
                  this.$message.success("删除成功");
                  if (this.data.length === 1) {
                    this.params.pageIndex--;
                    this.getList();
                  } else {
                    this.getList();
                  }
                  resolve();
                }
              });
          })
            .catch((e) => console.log("Oops errors!", e));
        },
      });
    },
  }
}
</script>

<style lang="less" scoped>
.ant-table .ant-table-content {
  overflow-x: auto !important;
  overflow-y: auto !important;

  tr.ant-table-row td .ant-btn.ant-btn-link {
    padding: 0;
  }
}
.ant-table-fixed-header .ant-table-body-inner{
  overflow: initial;
}
.ant-tree li[class^="ant-tree-treenode"] {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
