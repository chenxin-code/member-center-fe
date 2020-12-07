<template>
  <div id="addHcmUser">
    <div class="content-header">添加用户
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" ref="contentMain">
      <a-form layout="inline" style="padding:20px;" v-if="!showAll">
        <a-form-item label="手机号">
          <a-input v-model="phone" style="width:195px;" @pressEnter="addHcmUser" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="addHcmUser" :loading="buttonLoading">
            查询
          </a-button>
        </a-form-item>
      </a-form>
      <template v-else-if="showAll">
        <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }" style="padding:30px 10px;height: 100%;overflow: scroll;">
          <a-form-item label="手机号">
            <span>{{phone}}</span>
          </a-form-item>
          <a-form-item label="姓名">
            <a-input v-model="userName"/>
          </a-form-item>
          <a-form-item label="公司">
            <ul>
              <li>
                <a-input v-model="companyName" disabled></a-input>
              </li>
            </ul>
          </a-form-item>
          <a-form-item label="角色">
            <a-checkbox-group @change="onChange" class="check-group" v-model="checkedRoles">
              <a-row>
                <a-col class="check-item"  v-for="(roles, roleIndex) in rolesArr" :key="roleIndex">
                  <a-checkbox :value="roles.optionCode">
                    {{roles.roleName}}
                  </a-checkbox>
                  <a-button v-if="roles && roles.needSelectProject" type="link" @click="chooseRange" :value="roles.optionCode" :roleIndex="roleIndex">范围</a-button>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onConfirm" :loading="submitLoading">
              确定
            </a-button>
            <a-button style="margin-left: 10px;" @click="FALLBACK">
              取消
            </a-button>
          </a-form-item>
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
            <div style="height: calc(100% - 42px);overflow: scroll;margin-top: 10px;">
              <template v-if="needAllProject">
                <a-checkbox-group v-model="checkedList" @change="onChangeRang" :disabled="disabled" class="rang-check-group">
                  <template v-for="(item, index) in rangArr">
                    <a-checkbox v-show="search ? (item.name && item.name.indexOf(searchArr) >= 0) : true" :key="index" :value="item.optionCode">
                      {{item.name}}
                    </a-checkbox>
                </template>
                </a-checkbox-group>
              </template>
              <template v-else>
                <a-checkbox-group v-model="checkedList" @change="onChangeRang" :disabled="disabled" class="rang-check-group">
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
      </template>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { debounce } from '@/utils/util';
import { mapActions } from "vuex"

export default {
  name: "addHcmUser",
  props: {
    id: {
      type: String,
      default: () => ({})
    },
  },
  data() {
    return {
      needAllProject: false,
      "status": "", //1:手机号不存在、2:手机号存在，但不在该公司下、3：手机号存在，并在该公司下
      orgId: "",
      userId: "",
      showAll: false,
      buttonLoading: false,
      searchText: "",
      phone: "",
      userName: "",
      form: {},
      visibles: false,
      loading: false,
      submitLoading: false,
      disabled: false,
      companyName: "",
      checkedProjects: [],
      checkedRoles: [],
      selectedOptionsArr: [],
      selectedOptions: [],
      rolesArr: [],
      searchRangArr: [],
      rangArr: [],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      allProject: [],
      paraId: [],
      paraName: [],
      search: false,
      searchOptions: [],
      searchArr: "",
    }
  },
  components: {

  },
  created () {
    this.orgId = this.id;
    console.log(this.id)
    this.companyName = window.localStorage.getItem("companyName");
    this.spaceProject();
  },
  methods:{
    ...mapActions([
      "FALLBACK"
    ]),
    spaceProject() {
      api.spaceProject().then(res => {
        this.allProject = res.data;
      }).finally(() => {
      });
    },
    addHcmUser() {
      if(!(/^1[3456789]\d{9}$/.test(this.phone))){
        this.$warning({
          title: "提示",
          content: "请输入正确手机号",
          okText: "确定",
        });
      }else{
        const para = {
          orgId: this.orgId,
          phone: this.phone
        }
        this.buttonLoading = true;
        api.checkHcmUser(para).then(res => {

          if (res.data.status === 1) {
            this.getRoles();
          } else if (res.data.status === 2) {
            this.userId = res.data.userId;
            this.$confirm({
              title: "提示",
              content: "用户已存在，是否将该用户添加至当前公司下？",
              okText: "确定",
              okType: "danger",
              cancelText: "取消",
              onOk: () => {
                return new Promise((resolve) => {
                  const para = {
                    orgId: this.orgId,
                    userId: this.userId
                  }
                  api.addOrg(para).then(res => {
                    resolve();
                    if(res.code === 200){
                      this.$router.push({ name: "authorizeHcmUser", query: { userId: this.userId }})
                    }
                  }).finally(() => {
                    resolve();
                  });
                })
                //添加用户api，成功跳转授权页
              },
              onCancel: () => {
              },
            });
          } else {
            this.$warning({
              title: "提示",
              content: "该用户已存在该公司下。",
              okText: "知道了",
            });
          }

        }).finally(() => {
          this.buttonLoading = false;
        })

      }
    },

    getRoles() {
      this.buttonLoading = true;
      const para = {
        orgId: this.orgId
      }
      api.getRoles(para).then(res => {
        if (res.code === 200) {
          this.needAllProject = res.data.needAllProject;

          this.allOptions = res.data.allOptions;
          this.rolesArr = res.data.managerCompanyRoleProjectVOS[0].roleProjects;
          this.checkedRoles = res.data.selectedOptions;
          console.log(this.rolesArr)
          this.showAll = true;
          this.rolesArr.map((projects, index) => {
            this.checkedProjects.push([]);
            if (projects.length > 0) {
              projects.map((projects) => {
                if(res.data.selectedOptions.indexOf(projects.optionCode) >= 0){
                  this.checkedProjects[index].push(projects.optionCode)
                }
              })
            }
          })
        }

      }).finally(() => {
        this.buttonLoading = false;
      });
    },
    onConfirm() {
      debounce(()=>{
        if(this.userName.trim() === ""){
          this.$message.error("姓名不能为空");
        }else{
          if(this.userName.length > 15) {
            this.$message.error("姓名最长15个字");
          }else{
            this.submitLoading = true;
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
              orgId : this.orgId,
              userName: this.userName ? this.userName.trim() : "",
              phone: this.phone,
              selectedOptions: this.selectedOptionsArr
            }
            api.createUser(para).then(res => {
              if(res.code === 200){
                this.$message.success("添加成功");
                this.$router.go(-1);
              }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      })
    },
    onCancel() {

    },
    changeCompany(key) {
      console.log(key);
    },
    deleItem(index) {
      this.company.splice(index, 1);
    },

    chooseRange(e) {
      this.searchText = "";
      if(this.checkedRoles.indexOf(e.target.value) >= 0){
        this.roleIndex = e.currentTarget.getAttribute("roleIndex");
        if(this.needAllProject){
          this.visibles = true;

          this.allProject.map((project, index) => {
            this.allProject[index].optionCode = e.target.value + "&" + project.id;
            this.allOptions.push(e.target.value + "&" + project.id);
          })
          this.rangArr = this.allProject;
          this.searchRangArr = this.rangArr;
        }else{
          this.paraId = [];
          this.allOptions = [];
          this.rangArr = this.rolesArr[this.roleIndex].projectDTOS;
          // this.searchRangArr = this.rangArr;
          this.rangArr.map((rang) => {
            this.paraId.push(rang.id);
            this.allOptions.push(rang.optionCode)
          })
          const para = {
            ids: this.paraId
          }
          this.searchRangArr = [];
          api.getProname(para).then(res => {
            if(res.code === 200){
              this.visibles = true;
              this.paraName = res.data;
              this.checkedList = this.checkedProjects[this.roleIndex];
              this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.rangArr.length;
              this.rangArr.map((roles) => {
                this.searchRangArr.push({name: res.data[roles.id], optionCode: roles.optionCode, id: roles.id});
                if(this.checkedList.indexOf(roles.optionCode) >= 0){
                  this.checkAll = true;
                }else{
                  this.checkAll = false;
                  return;
                }
              })
            }else{
              this.$message.error(res.message);
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
        // this.visibles = true;


      }else{
        this.$message.error("请先选择角色");
      }
    },
    onChange() {
    },
    handleOk() {
      this.visibles = false;
    },
    handleCancel() {
      this.visibles = false;
    },
    onCheckAllChange(e) {
      this.checkedList = e.target.checked ? (this.search ? this.searchOptions.concat(this.checkedProjects[this.roleIndex]) : this.allOptions) : [];
      this.checkedProjects[this.roleIndex] = this.checkedList;
      this.indeterminate = false;
      this.checkAll = e.target.checked;
    },
    onChangeRang(onChangeRang) {
      if(this.search){
        // this.searchChangeRang = this.checkedProjects[this.tabIndex][this.roleIndex];
        this.checkedList = onChangeRang;
        // this.checkedList = this.checkedProjects[this.roleIndex].concat(onChangeRang);
        this.checkedProjects[this.roleIndex] = this.checkedList;
        console.log(this.checkedList)
        // this.checkedProjects[this.tabIndex][this.roleIndex] = this.checkedProjects[this.tabIndex][this.roleIndex].concat(onChangeRang);
      }else{
        this.checkedList = onChangeRang;
        this.checkedProjects[this.roleIndex] = this.checkedList;
      }
      // this.checkedProjects[this.roleIndex] = onChangeRang;
      this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.rangArr.length;
      this.checkAll = onChangeRang.length === this.rangArr.length;
    },
    onSearch(value) {
      if (value != "") {
        this.searchArr = value;
        const search_arr = [];
        this.searchRangArr.map(item => {
          if (item.name.indexOf(value) > -1) {
            search_arr.push(item)
          }
        })

        // this.rangArr = search_arr;
        this.searchOptions = [];
        search_arr.map(item => {
          this.searchOptions.push(item.optionCode);
        })
        this.search = true;
      } else {
        this.checkAll = this.checkedList.length === this.rangArr.length;
        this.search = false;
        this.rangArr = this.searchRangArr;
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-form-item-control{
    display: block;
    width: 100%;
  }

  #addHcmUser{
    height: 100%;
    overflow: hidden;
    .check-group{
      min-height: 40px;
      line-height: 40px;
      /*overflow: scroll;*/
      background: #FFFFFF;
      /*border: 1px solid #D9D9D9;*/
      border-radius: 2px;
      padding: 0 10px;
    }

    li{
      span{
        width: 500px;
        height: 35px;
        line-height: 35px;
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

    .check-item{
      margin-bottom: 26px;
    }

    .check-item:last-child{
      margin-bottom: 0px;
    }
  }
  .range-item{
    height: 240px;
    overflow: scroll;
  }
</style>
