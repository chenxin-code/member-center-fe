<template>
  <div id="area">
    <div class="content-header">区域管理</div>
    <div class="content-main" ref="content_main">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <!-- 左边项目列表 -->
        <a-col flex="220px" style="height:100%;border-right: 1px solid #E9E9E9;position: relative">
          <a-input style="width:90%;margin:23px 10px 10px 10px;" v-model="searchValue"  @change="onTreeSearchChange" placeholder="请输入分期名称">
            <a-tooltip slot="suffix" v-if="searchVisible === 1">
              <a-icon type="search" style="color: #CCCCCC" @click="onTreeSearch"/>
            </a-tooltip>
            <a-tooltip slot="suffix" v-if="searchVisible === 2">
              <a-icon type="close-circle" style="color: #CCCCCC" @click="onTreeSearchCancel"/>
            </a-tooltip>
          </a-input>
          <a-tree
            v-if="treeData.length > 0"
            blockNode
            :selected-keys="[blockId]"
            :default-expanded-keys="keys"
            :tree-data="treeData"
            :replaceFields="replaceFields"
            @select="onTreeSelect"
            style="height:calc(100% - 90px);overflow: scroll"
          >
          </a-tree>
        </a-col>
        <!-- 右边列表 -->
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
          <!-- 查询条件 -->
          <FormList
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" html-type="submit" @click="onAdd">+添加</a-button>
          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="false"
            :scroll="{ y: scrollY }"
            :loading="tableLoading"
            :rowKey="(r,i) => i"
            style="width:100%;margin-top:8px;"
          >
            <template slot="areaType" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.areaType === 1">楼栋</span>
                <span v-if="operation.areaType === 2">公共区域</span>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a @click="onEdit(operation)" style="margin-left:20px;">编辑</a>
                <a @click="onDelete(operation)" style="margin-left:20px;">删除</a>
              </div>
            </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions="['10','20','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:30px;width:100%;text-align: right;"
          />
          <!-- 添加区域 -->
          <a-modal v-model="addVisible" :centered="true" title="添加区域" :maskClosable="false" on-ok="handleOk" @cancel="addHandleCancel">
            <template slot="footer">
              <a-button key="back" @click="addHandleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="btnLoading" @click="addHandleOk">
                确定
              </a-button>
            </template>
            <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
              <a-form-item label="区域名称" :validate-status="validateStatus" :help="inputErrorTitle">
                <a-input v-model="addAreaName"  @change="watchChange"/>
              </a-form-item>
              <a-form-item label="区域类型">
                <a-select
                  :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
                  v-model="typeId"
                  placeholder="请选择状态"
                >
                  <a-select-option v-for="item in type" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="关联空间"  v-if="typeId === 1">
                <div style="width:100%;height:300px;overflow:auto;">
                  <div>
                    <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                      全选
                    </a-checkbox>
                  </div>
                  <a-checkbox-group  v-model="checkedList" @change="onLabelChange" >
                    <div v-for="(item,index) in towerList" :key="index" style="width:100%;margin-top:10px;">
                      <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-form-item>
            </a-form>
          </a-modal>
          <!-- 编辑区域 -->
          <a-modal v-model="updateVisible" :centered="true" :maskClosable="false" title="编辑区域" on-ok="handleOk" @cancel="updateHandleCancel">
            <template slot="footer">
              <a-button key="back" @click="updateHandleCancel">
                取消
              </a-button>
              <a-button key="submit" type="primary" :loading="btnLoading" @click="updateHandleOk">
                确定
              </a-button>
            </template>
            <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
              <a-form-item label="区域名称" :validate-status="validateStatus" :help="inputErrorTitle">
                <a-input v-model="updateAreaName"  style="width:195px;" @change="watchChange"/>
              </a-form-item>
              <a-form-item label="关联空间" v-if="typeId === 1">
                <div style="width:100%;height:200px;overflow:auto;">
                  <div>
                    <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                      全选
                    </a-checkbox>
                  </div>
                  <a-checkbox-group  v-model="checkedList" @change="onLabelChange" >
                    <div v-for="(item,index) in towerList" :key="index" style="width:100%;margin-top:10px;">
                      <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-form-item>
            </a-form>
          </a-modal>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import FormList from "@/components/FormList/index.jsx";
  import { debounce } from '@/utils/util';
  import message from 'ant-design-vue/es/message';
  export default {
    name: "areas",
    data() {
      return {
        //项目列表选中项目的id
        projectId: "",
        blockId: "",
        originallyBlockId: "",
        searchVisible: 1,
        //关联空间的树形控件的Data(不变)
        originallyTreeData: [],
        //关联空间的树形控件的Data
        treeData: [],
        //关联空间的树形控件的Data（重排）
        resetTreeData: [],
        treeId: "",
        searchValue: "",
        replaceFields: {children:'childrenList', title:'name', key:'id'},
        keys:["2233300942864784348"],
        type: [
          {
            id: 2,
            name: "公共区域"
          },
          {
            id: 1,
            name: "楼栋"
          },
        ],
        typeId: 2,
        formList: [
          {
            label: "区域名称",
            type: "input",
            name: "name",
            placeholder: "请输入区域名称",
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
        //表头数据
        tableColumns: [
          {
            title: "区域名称",
            dataIndex: "areaName",
            key: "areaName"
          },
          {
            title: "区域类型",
            key: "areaType",
            scopedSlots: { customRender: "areaType" },
          },
          {
            title: "操作",
            key: "type",
            scopedSlots: { customRender: "operation" },
          },
        ],
        //列表数据(表格)
        tableData: [],
        tableLoading: false,
        //表格高度
        scrollY: 100,
        //分页
        pageSize: 10,
        current: 1,
        total: 0,
        //区域id
        areaId: '',
        towerList: [],
        checkedList: [],
        //控制添加区域的modal
        addVisible: false,
        btnLoading: false,
        //控制编辑区域的modal
        updateVisible: false,
        //控制关联空间的modal
        visible: false,
        //添加区域的input绑定值
        addAreaName: "",
        //编辑区域的input绑定值
        updateAreaName: "",
        //添加区域编辑区域input框的status
        validateStatus: "",
        //添加区域编辑区域input框的error提示语
        inputErrorTitle: "",
        loading: false,
        //点编辑获取到的Data
        operation: {},
        indeterminate: false,
        checkAll: false,
      };
    },
    components: {
      FormList
    },
    mounted () {
      setTimeout(()=>{
        this.scrollY = this.$refs.content_main.offsetHeight - 245 + "px";
      },100)
    },
    created () {
      this.getProjectData();
    },
    methods: {
      onCheckAllChange(e) {
        Object.assign(this, {
          checkAll: e.target.checked,
        });
        if (this.checkAll === true) {
          this.checkedList = [];
          this.towerList.forEach((item)=>{
            this.checkedList.push(item.id)
          });
          this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.towerList.length;
          this.checkAll = this.checkedList.length === this.towerList.length;
        }else{
          this.checkedList = [];
        }
      },
      onLabelChange(checkedList) {
        this.checkedList = checkedList;
        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.towerList.length;
        this.checkAll = this.checkedList.length === this.towerList.length;
      },
      //treeData搜索框watch事件
      onTreeSearchChange(e) {
        debounce(()=>{
          const value = e.target.value;
          if (value === "") {
            this.searchVisible = 1;
            this.replaceFields = {children:'childrenList',title:'name', key:'id'};
            this.treeData = this.originallyTreeData;
          }
        })
      },
      //treeData取消搜索
      onTreeSearchCancel() {
        debounce(()=>{
          this.searchValue = "";
          this.searchVisible = 1;
          this.replaceFields = {children:'childrenList',title:'name', key:'id'};
          this.treeData = this.originallyTreeData;
        })
      },
      // 树形控件方法（重排数据）
      generateLists(data) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          node.childrenList.forEach((item)=>{
            const key = item.id;
            const title = item.name;
            const fullName=item.fullName;
            this.resetTreeData.push({ id:key, name: title,fullName:fullName });
          });
          // if (node.childrenList) {
          //   this.generateLists(node.childrenList);
          // }
        }
      },
      // 树形控件的搜索事件
      onTreeSearch() {
        debounce(()=>{
          if (this.searchValue === "") {
            this.searchVisible = 1;
            this.replaceFields = {children:'childrenList',title:'name', key:'id'};
            this.treeData = this.originallyTreeData;
          } else {
            this.searchVisible = 2;
            this.treeData = this.originallyTreeData;
            this.generateLists(this.treeData);
            const chooseList = [];
            this.resetTreeData
              .map(item => {
                if (item.name.indexOf(this.searchValue) > -1) {
                  chooseList.push(item)
                }
              });
            this.resetTreeData = [];
            this.treeData = chooseList;
            this.replaceFields = {children:'childrenList',title:'fullName', key:'id'};
          }
        })
      },
      //点击树节点触发事件（获取树节点的key）
      onTreeSelect(selectedKeys) {
       debounce(()=>{
         if (selectedKeys.length === 0) {
           this.blockId = this.originallyBlockId
         } else {
           this.current = 1;
           this.originallyBlockId = selectedKeys[0];
           this.blockId = selectedKeys[0];
           this.getAreaList();
           // this.getTowerList()
         }
         console.log(selectedKeys)
       })
      },
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getAreaList()
        })
      },
      //添加按钮
      onAdd() {
        debounce(()=>{
          // this.addVisible = true;
          this.addAreaName = "";
          this.areaId = "";
          this.typeId = 2;
          this.getTowerList()
        })
      },
      //input框watch事件
      watchChange(e) {
        const value  = e.target.value;
        if(value.trim().length > 0){
          this.validateStatus = "";
          this.inputErrorTitle = "";
          if(value.trim().length > 20){
            this.validateStatus = "error";
            this.inputErrorTitle = "区域名称最长20字";
          }else{
            this.validateStatus = "";
            this.inputErrorTitle = "";
          }
        }else{
          this.validateStatus = "error";
          this.inputErrorTitle = "区域名称不能为空";
        }
      },
      //添加的取消按钮
      addHandleCancel() {
        debounce(()=>{
          this.validateStatus = "";
          this.inputErrorTitle = "";
          this.addVisible = false;
          this.btnLoading = false;
        })
      },
      //添加的确定按钮
      addHandleOk() {
        debounce(()=>{
          if (this.addAreaName.trim() === "") {
            this.validateStatus = "error";
            this.inputErrorTitle = "区域名称不能为空";
          } else {
            if (this.addAreaName.length > 20) {
              this.validateStatus = "error";
              this.inputErrorTitle = "区域名称最长20字";
            } else {
              this.validateStatus = "";
              this.inputErrorTitle = "";
              this.btnLoading = true;
              const para = {
                areaName: this.addAreaName.trim(),
                areaType: this.typeId,
                blockId: this.blockId,
                spaceIdList: this.checkedList
              };
              api.addArea(para).then(res => {
                if (res.code === 200) {
                  this.addVisible = false;
                  this.getAreaList();
                } else {
                  this.validateStatus = "error";
                  this.inputErrorTitle = res.message;
                }
              }).finally(() => {
                this.btnLoading = false;
              })
            }
          }
        })
      },
      //编辑按钮
      onEdit(operation) {
        debounce(()=>{
          this.operation = operation;
          this.updateAreaName = operation.areaName;
          // this.updateVisible = true;
          this.areaId = operation.id;
          this.typeId = operation.areaType;
          this.getTowerList()
        })
      },
      //编辑的取消按钮
      updateHandleCancel() {
        debounce(()=>{
          this.updateVisible = false;
          this.btnLoading = false;
          this.validateStatus = "";
          this.inputErrorTitle = "";
        })
      },
      //编辑的确定按钮
      updateHandleOk() {
        debounce(()=>{
          if (this.updateAreaName.trim() === "") {
            this.validateStatus = "error";
            this.inputErrorTitle = "区域名称不能为空";
          } else {
            if (this.updateAreaName.length > 20) {
              this.validateStatus = "error";
              this.inputErrorTitle = "区域名称最长20字";
            } else {
              this.validateStatus = "";
              this.inputErrorTitle = "";
              this.btnLoading = true;
              const para = {};
              para.areaName = this.updateAreaName.trim();
              para.id = this.operation.id;
              para.spaceIdList = this.checkedList;
              api.updateArea(para).then(res => {
                if (res.code === 200) {
                  this.updateVisible = false;
                  this.getAreaList();
                } else {
                  this.validateStatus = "";
                  this.inputErrorTitle = res.message;
                }
              }).finally(() => {
                this.btnLoading = false;
              })
            }
          }
        })
      },
      //删除按钮
      onDelete(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除区域",
            content: "是否删除该区域",
            centered: true,
            okText: "是",
            cancelText: "否",
            onOk() {
              that.tableLoading=true;
              const para = {
                id: operation.id
              };
              // const dataSource = [...that.tableData];
              api.delArea(para).then(res => {
                if (res.code === 200) {
                  if (that.tableData.length === 1) {
                    that.current--;
                    that.getAreaList()
                  } else {
                    that.getAreaList()
                  }
                  // that.tableLoading = false;
                  // that.tableData = dataSource.filter(item => item.id !== operation.id);
                } else {
                  that.$success({
                    title: "删除区域",
                    content: res.message
                  });
                  that.tableLoading = false;
                  message.destroy()
                }
              }).catch(()=>{
                that.tableLoading = false;
              });
            },
            onCancel() {
              // console.log('否')
            },
          });
        })
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.pageSize = pageSize;
        this.current = current;
        this.getAreaList()
      },
      //获取项目分期树
      getProjectData() {
        api.projectBlock().then(res => {
          if (res.data) {
            this.treeData = res.data;
            this.originallyTreeData = res.data;
            this.keys = [this.treeData[0].id];
            console.log(this.keys);
            this.blockId = this.treeData[0].childrenList[0].id;
            this.treeData.forEach((item)=>{
              item.disabled = true
            });
            this.originallyTreeData.forEach((item)=>{
              item.disabled = true
            });
            this.getAreaList();
          }
        });
      },
      //获取区域列表
      getAreaList() {
        this.tableLoading = true;
        const { name } = this.$refs.form.getFieldsValue();
        const para = {
          areaName: name,
          pageIndex: this.current,
          pageSize: this.pageSize,
          blockId: this.blockId
      };
        api.getArea(para).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //获取楼栋列表
      getTowerList() {
        this.tableLoading = true
        this.towerList = [];
        const para = {
          areaId: this.areaId,
          blockId: this.blockId
        };
        api.tower(para).then(res => {
          this.towerList = res.data;
          this.getCiteArea()
        }).finally(()=>{
          this.tableLoading = false
        })
      },
      //区域引用情况
      getCiteArea() {
        const para = {
          areaId: this.areaId
        };
        this.tableLoading = true;
        api.citeArea(para).then(res => {
          this.checkedList = res.data.useSpaceIds;
          if(this.towerList.length > 0) {
            this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.towerList.length;
            this.checkAll = this.checkedList.length === this.towerList.length;
          } else {
            this.indeterminate = false;
            this.checkAll = false
          }
          if (this.areaId === ""){
            this.addVisible = true
          } else {
            this.updateVisible = true
          }
        }).finally(()=>{
          this.tableLoading = false;
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  #area{
    height: 100%;
    overflow: hidden;
  }
  .btn{
    width:24px;
    height:40px;
    background:#4B7AFB;
    border-radius:2px;
    border:none;
    outline: none;
    color:white;
    text-align: center;
  }
  .active{
    background: #E2F3FF;
  }
</style>

