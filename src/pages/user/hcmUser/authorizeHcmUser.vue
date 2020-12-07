<template>
  <div id="authorizeHcmUser">
    <div class="content-header">授权用户
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-form :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" style="padding:30px 10px;height: 100%;overflow: scroll;">
        <a-row>
          <a-col :span="10">
            <a-form-item label="手机号">
              <span>{{data.phone}}</span>
            </a-form-item>
            <a-form-item label="公司">
              <ul>
                <li v-for="(item) in data.employeeOrganizationVOS" :key="item.companyId">
                  <span>{{item.companyName}}</span>
                </li>
              </ul>
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item label="姓名">
              <span>{{data.name}}</span>
            </a-form-item>
            <a-form-item label="部门" v-if="data.employeeOrganizationVOS && data.employeeOrganizationVOS.departName">
              <ul>
                <li v-for="(item) in data.employeeOrganizationVOS" :key="item.departId">
                  <span>{{item.departName}}</span>
                </li>
              </ul>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item label="角色">
              <a-tabs type="card" @change="changeCompany">
                <a-tab-pane v-for="(managerCompany, comIndex) in data.managerCompanyRoleProjectVOS" :tab="managerCompany.companyName" :key="comIndex">
                  <a-checkbox-group @change="onChange" v-model="checkedRoles[comIndex]">
                    <a-row>
                      <a-col class="check-item" :span="24" v-for="(item, roleIndex) in managerCompany.roleProjects" :key="roleIndex">
                        <a-checkbox :value="item.optionCode">
                          {{item.roleName}}
                        </a-checkbox>
                        <a-button v-if="item && item.needSelectProject" type="link" @click="chooseRange" :companyIndex="comIndex" :roleIndex="roleIndex" :value="item.optionCode">范围</a-button>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </a-tab-pane>
              </a-tabs>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onConfirm" :loading="submitLoading">
                确定
              </a-button>
              <a-button style="margin-left: 10px;" @click="FALLBACK">
                取消
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-modal v-model="visibles" title="选择范围" on-ok="handleOk">
        <template slot="footer">
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
            确定
          </a-button>
        </template>
        <div class="range-item">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
          <a-input-search v-model="searchText" placeholder="搜索" style="width: 200px" @search="onSearch" />
          <br/>
          <div style="height: calc(100% - 42px);margin-top: 10px;">
            <template v-if="needAllProject">
              <a-checkbox-group v-model="checkedList" @change="onChangeRang" class="rang-check-group">
                <template v-for="(item, index) in rangArr">
                  <a-checkbox v-show="search ? (item.name && item.name.indexOf(searchArr) >= 0) : true" :key="index" :value="item.optionCode">
                    {{item.name}}
                  </a-checkbox>
                </template>
              </a-checkbox-group>
            </template>
            <template v-else>
              <a-checkbox-group v-model="checkedList" @change="onChangeRang" class="rang-check-group">
                <template v-for="(item, index) in rangArr">
                  <a-checkbox v-show="search ? (paraName[item.id] && paraName[item.id].indexOf(searchArr) >= 0) : true" :value="item.optionCode" :key="index">
                    {{paraName[item.id]}}

                  </a-checkbox>
                </template>
              </a-checkbox-group>
            </template>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/user";
import { mapActions } from "vuex"


export default {
  name: "authorizeHcmUser",
  props: {
    id: {
      type: String,
      default: () => ({})
    },
  },
  data() {
    return {
      needAllProject: false,
      roleTag: 0,
      form: {},
      visibles: false,
      loading: false,
      submitLoading: false,
      userId: "",
      data: {
        phone: "",
        name: ""
      },
      searchText: "",
      phone: "",
      company: [
        {
          name: "佛山公司",
          isadd: false
        },
        {
          name: "上行地产",
          isadd: false
        },
        {
          name: "北京邦道",
          isadd: true
        },
      ],
      tabKey: 0,
      checkedRoles: [],
      checkedProjects: [],
      checkedList: [],
      selectedOptionsArr: [],
      rangArr: [],
      selectedOptions: [],
      searchRangArr: [],
      indeterminate: true,
      checkAll: false,
      tabIndex: 1,
      roleIndex: 1,
      disabled: false,
      paraId: [],
      paraName: [],
      search: false,
      searchOptions: [],
      searchChangeRang: [],
      lastRangArr: [],
      searchArr: [],
    }
  },
  components: {

  },
  created () {
    this.userId = this.id;
    console.log(this.id)
    this.spaceProject();
  },
  methods:{
    ...mapActions([
      "FALLBACK"
    ]),
    spaceProject() {
      api.spaceProject().then(res => {
        this.allProject = res.data;
        this.getUserDetail();
      }).finally(() => {
      });
    },
    getUserDetail() {
      api.getUserDetail({id: this.userId}).then(res => {
        if (res.code === 200 && res.data !== null) {
          this.needAllProject = res.data.needAllProject;
          this.data = res.data;
          this.allOptions = res.data.allOptions;
          this.selectedOptions = res.data.selectedOptions;
          res.data.managerCompanyRoleProjectVOS.map((roles, index) => {
            this.checkedRoles.push([]);
            this.checkedProjects.push([]);
            roles.roleProjects.map((pro, proIndex) => {
              if (res.data.selectedOptions.indexOf(pro.optionCode) >= 0) {
                this.checkedRoles[index].push(pro.optionCode);
              }
              this.checkedProjects[index].push([]);
              if (this.needAllProject) {

                  res.data.selectedOptions.map((select) => {
                    if (select.indexOf(pro.optionCode + "&") >= 0) {
                      this.checkedProjects[index][proIndex].push(select)
                    }
                  })
              } else {
                pro.projectDTOS.map((dtos) => {
                  if (res.data.selectedOptions.indexOf(dtos.optionCode) >= 0) {
                    this.checkedProjects[index][proIndex].push(dtos.optionCode)
                  }
                })
              }

            })
          })
        } else {
          // this.$router.push({ path: "/500" })
          this.$message.error(res.message);
        }

      }).finally(() => {
        this.loading = false;
      });

    },
    onConfirm() {
      this.submitLoading = true;
      this.selectedOptionsArr = [];
      this.checkedRoles.map((roles) => {
        this.selectedOptionsArr = this.selectedOptionsArr.concat(roles)
      })
      this.checkedProjects.map((projects) => {
        projects.map((item) => {
          this.selectedOptionsArr = this.selectedOptionsArr.concat(item)
        })

      })
      this.selectedOptionsArr = [...new Set(this.selectedOptionsArr)]
      const para={
        empId: this.userId,
        selectedOptions: this.selectedOptionsArr
      }
      api.userAuth(para).then(res => {
        this.submitLoading = false;
        if (res.code === 200) {
          this.$router.go(-1);
        }
      }).finally(() => {
        this.submitLoading = false;
      });
    },
    onCancel() {

    },
    changeCompany(key) {
      this.tabKey = key;
    },

    chooseRange(e) {
      this.searchText = "";
      if (this.checkedRoles[this.tabKey].indexOf(e.target.value) >= 0) {
        this.tabIndex = e.currentTarget.getAttribute("companyIndex");
        this.roleIndex = e.currentTarget.getAttribute("roleIndex");
        if (this.needAllProject) {
          this.visibles = true;
          this.allOptions = [];
          this.allProject.map((project, index) => {
            this.allProject[index].optionCode = e.target.value + "&" + project.id;
            this.allOptions.push(e.target.value + "&" + project.id);
          })
          this.rangArr = this.allProject;
          console.log(this.rangArr)
          this.searchRangArr = this.rangArr;
          this.lastRangArr = this.rangArr;
        } else {
          // this.paraId = [];

          this.allOptions = [];
          this.rangArr = this.data.managerCompanyRoleProjectVOS[this.tabIndex].roleProjects[this.roleIndex].projectDTOS;
          this.lastRangArr = this.rangArr;
          this.rangArr.map((rang) => {

            this.paraId.push(rang.id);
            this.allOptions.push(rang.optionCode)
          })
          // this.searchRangArr = this.rangArr;
          const para = {
            ids: this.paraId
          }
          console.log(this.rangArr)
          this.searchRangArr = [];
          api.getProname(para).then(res => {
            if (res.code === 200) {
              this.visibles = true;
              this.paraName = res.data;
              this.rangArr.map((roles) => {
              this.searchRangArr.push({name: res.data[roles.id], optionCode: roles.optionCode, id: roles.id});
              if (this.checkedList.indexOf(roles.optionCode) >= 0) {
                this.checkAll = true;
              } else {
                this.checkAll = false;
                return;
              }
            })
            } else {
              this.$message.error(res.message);
            }
          }).finally(() => {
            this.submitLoading = false;
          });

        }
        this.checkedList = this.checkedProjects[this.tabIndex][this.roleIndex];
        console.log(this.checkedList)
        // this.checkedProjects = this.checkedList;
        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.rangArr.length;


      } else {
        this.$message.error("请先选择角色");
      }
    },
    onChange(checkedValues) {
      console.log(checkedValues)
      console.log(this.checkedRoles)
      // this.checkedRoles[this.tabKey] = checkedValues;
      // if (checkedValues.length > 0) {
      //   // this.selectedOptions = this.selectedOptions.concat(checkedValues);
      // }
    },
    handleOk() {
      this.visibles = false;
    },
    handleCancel() {
      this.visibles = false;
    },
    onCheckAllChange(e) {
      this.checkedList = e.target.checked ? (this.search ? this.searchOptions.concat(this.checkedProjects[this.tabIndex][this.roleIndex]) : this.allOptions) : [];
      this.checkedProjects[this.tabKey][this.roleIndex] = this.checkedList;
      this.indeterminate = false;
      this.checkAll = e.target.checked;
    },
    onChangeRang(onChangeRang) {
      console.log(onChangeRang)
      // this.searchChangeRang = onChangeRang;
      if(this.search){
        // this.searchChangeRang = this.checkedProjects[this.tabIndex][this.roleIndex];
        // this.checkAll = onChangeRang.length === this.rangArr.length;
        this.checkedList = this.checkedProjects[this.tabIndex][this.roleIndex].concat(onChangeRang);
        this.checkedProjects[this.tabIndex][this.roleIndex] = this.checkedList;
        console.log(this.checkedList)
        // this.checkedProjects[this.tabIndex][this.roleIndex] = this.checkedProjects[this.tabIndex][this.roleIndex].concat(onChangeRang);
      }else{
        this.checkedList = onChangeRang;
        this.checkedProjects[this.tabIndex][this.roleIndex] = this.checkedList;
      }
      // this.checkedProjects[this.tabIndex][this.roleIndex] = onChangeRang;
      this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.rangArr.length;
      this.checkAll = onChangeRang.length === this.rangArr.length;
      // this.checkedList = this.checkedProjects[this.tabIndex][this.roleIndex];
    },
    onSearch(value) {
      // this.searchChangeRang = this.checkedList;
      console.log(this.searchChangeRang)
      if (value != "") {
        this.searchArr = value;
        const search_arr = [];
        this.searchRangArr.map(item => {
          if (item.name.indexOf(value) > -1) {
            search_arr.push(item)
          }
        })
        // console.log(this.rangArr)
        // this.searchArr = search_arr
        // // this.rangArr = search_arr;
        // console.log(this.rangArr)
        this.searchOptions = [];
        search_arr.map(item => {
          this.searchOptions.push(item.optionCode);
        })
        this.search = true;
      } else {
        this.checkAll = this.checkedList.length === this.rangArr.length;
        this.search = false;
        this.rangArr = this.lastRangArr;
        this.checkedList = this.checkedProjects[this.tabIndex][this.roleIndex];
        console.log(this.checkedList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #authorizeHcmUser{
    height: 100%;
    overflow: hidden;

    li{
      span{
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        border-radius: 2px;
        padding: 0 10px;
        display: inline-block;
        margin-bottom: 20px;
      }
    }

    li:last-child{
      span{
        margin-bottom: 0px;
      }
    }

    .close_circle{
      margin-left: 10px;
      font-size: 24px;
      color: #999;
      position: relative;
      top: 3px;
    }

    .check-item{
      margin-bottom: 26px;
    }

  }
  .range-item{
    height: 240px;
    /*overflow: scroll;*/
  }
  .ant-checkbox-group-item{
    width: 100%;
    display: block;
    margin-top: 20px;
  }
  .ant-form-item{
    margin-bottom: 20px;
  }
</style>
