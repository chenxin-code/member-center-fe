<template>
  <div id="space">
    <div class="content-header">空间管理</div>
    <div class="content-main" ref="content_main">
      <a-row type="flex" style="height:100%;flex-flow: row;">
        <!-- 左边树形控件 -->
        <a-col flex="220px" style="height:100%;border-right: 1px solid #E9E9E9;">
          <a-select
            style="width:90%;margin:23px 10px 10px 10px;"
            v-model="projectId"
            @change="onProjectChange"
          >
            <a-select-option v-for="item in projectList" :key="item.id" >
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-input style="width:90%;margin:0 10px 5px 10px;" v-model="searchValue"  @change="onTreeSearchChange" placeholder="请输入空间名称">
            <a-tooltip slot="suffix" v-if="searchVisible === 1">
              <a-icon type="search" style="color: #CCCCCC" @click="onTreeSearch"/>
            </a-tooltip>
            <a-tooltip slot="suffix" v-if="searchVisible === 2">
              <a-icon type="close-circle" style="color: #CCCCCC" @click="onTreeSearchCancel"/>
            </a-tooltip>
          </a-input>
          <a-tree
            blockNode
            :expanded-keys="expandedKeys"
            :selected-keys="[treeId]"
            :auto-expand-parent="autoExpandParent"
            :tree-data="treeData"
            defaultExpandAll
            :replaceFields="replaceFields"
            @select="onTreeSelect"
            @expand="onTreeExpand"
            style="height:calc(100% - 122px);overflow: scroll"
          >
            <span slot="0" slot-scope="operation">{{operation.name+'（存）'}}</span>
            <span slot="1" slot-scope="operation">{{operation.name+'（主）'}}</span>
            <span slot="2" slot-scope="operation" style="color: #1890ff">{{operation.name}}</span>
          </a-tree>
        </a-col>
        <!-- 右边列表 -->
        <a-col flex="auto" style="padding:20px 10px;height:100%;">
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
            :loading="tableLoading"
            :scroll="{ y: scrollY }"
            :rowKey="(r,i) => i"
            style="width:100%;margin-top:8px;"
            :selectable="false"
          >
            <template slot="name" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-if="operation.dataSource === 0">{{operation.name+'（存）'}}</span>
                <span v-if="operation.dataSource === 1">{{operation.name+'（主）'}}</span>
                <span v-if="operation.dataSource === 2" style="color:#1890ff">{{operation.name}}</span>
              </div>
            </template>
            <template slot="labelName" slot-scope="operation">
              <div class="editable-row-operations">
                <span v-for="item in operation.labelList" :key="item.id">{{item.name+' '}}</span>
              </div>
            </template>
            <template slot="operation" slot-scope ="operation">
              <div class="editable-row-operations">
                <a v-if="operation.dataSource === 0" @click="onMainEdit(operation)">编辑</a>
                <a v-if="operation.dataSource === 1" @click="onMainEdit(operation)">编辑</a>
                <a v-if="operation.dataSource === 2" @click="onEdit(operation)">编辑</a>
                <a v-if="operation.dataSource === 2" @click="onDelete(operation)" style="margin-left:10px;">删除</a>
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
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import FormList from "@/components/FormList/index.jsx";
  import api from "@/api";
  import { debounce } from '@/utils/util';
  import message from 'ant-design-vue/es/message';
  export default {
    name: "space",
    data() {
      return {
        projectList: [],
        projectId: "",
        sendProjectId: "",
        searchVisible: 1,
        //关联空间的树形控件的Data(不变)
        originallyTreeData: [],
        //关联空间的树形控件的Data
        treeData: [],
        //关联空间的树形控件的Data（重排）
        resetTreeData: [],
        originallyTreeId: "",
        treeId: "",
        searchValue: "",
        replaceFields: {children:'childrenList', title:'name', key:'id'},
        autoExpandParent: true,
        expandedKeys: [],
        formList: [
          {
            label: "标签",
            type: "select",
            name: "label",
            placeholder: "请选择标签",
            selectOptions: [],
            rules: [],
            initialValue: "全部",
          },
          {
            label: "空间名称",
            type: "input",
            name: "name",
            placeholder: "请输入空间名称",
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
            title: "空间名称",
            key: "name",
            scopedSlots: { customRender: "name" },
          },
          {
            title: "项目主数据名称",
            dataIndex: "fname",
            key: "fname",
            ellipsis: true,
          },
          {
            title: "项目主数据营销名称",
            dataIndex: "fSalesName",
            key: "fSalesName",
            ellipsis: true,
          },
          {
            title: "主项目层级",
            key: "levelName",
            dataIndex: "levelName",
            ellipsis: true,
          },
          {
            title: "标签",
            key: "labelName",
            scopedSlots: { customRender: "labelName" },
          },
          {
            title: "操作",
            key: "type",
            scopedSlots: { customRender: "operation" },
          },
        ],
        //表格高度
        scrollY: 100,
        //列表数据(表格)
        tableData: [],
        tableLoading: false,
        //分页
        pageSize: 10,
        current: 1,
        total: 0,
        tableRefresh: false,
        pageRefresh: true
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
    beforeRouteLeave(to, from, next) {
      if (to.name === "spaceAdd" || to.name === "spaceEdit" || to.name === "mainSpaceEdit" ) {
        this.tableRefresh = true;
        this.pageRefresh = false;
      } else {
        this.tableRefresh = false;
        this.pageRefresh = true;
      }
      next();
    },
    activated(){
      if(this.pageRefresh){
        this.$refs.form.setFieldsValue({
          name: "",
        });
        this.projectList = [];
        this.projectId = "";
        this.sendProjectId = "";
        this.searchVisible = 1;
        this.originallyTreeData = [];
        this.treeData = [];
        this.resetTreeData = [];
        this.originallyTreeId = "";
        this.treeId = "";
        this.searchValue = "";
        this.replaceFields = {children:'childrenList', title:'name', key:'id'};
        this.autoExpandParent = true;
        this.expandedKeys = [];
        this.tableData = [];
        this.tableLoading = false;
        this.pageSize = 10;
        this.current = 1;
        this.total = 0;
        this.tableRefresh = false;
        this.pageRefresh = true;
        this.getSpaceProjectList();//获取所有项目
        this.getLabelList();//获取查询条件标签列表
      }else  if (this.tableRefresh) {
        this.getSpaceTreeData();
        // this.getSpaceList(this.treeId);
      }
    },
    created () {
      // this.getSpaceProjectList();//获取所有项目
      // this.getLabelList();//获取查询条件标签列表
    },
    methods: {
      //选择项目
      onProjectChange(value) {
        debounce(()=>{
          this.projectId = value;
          this.current = 1;
          this.getSpaceTreeData();
        })
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
          const key = node.id;
          const title = node.name;
          const fullName=node.fullName;
          this.resetTreeData.push({ id:key, name: title,fullName:fullName });
          if (node.childrenList) {
            this.generateLists(node.childrenList);
          }
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
            this.treeId = this.originallyTreeId
          } else {
            this.originallyTreeId = selectedKeys[0];
            this.treeId = selectedKeys[0];
            this.current = 1;
            this.getSpaceList(this.treeId)
          }
        })
      },
      onTreeExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      //查询按钮
      onCheck() {
        debounce(()=>{
          this.current = 1;
          this.getSpaceList(this.treeId);
        })
      },
      //添加按钮
      onAdd() {
        debounce(()=>{
          // this.$router.push({path: "/space/add",query: {projectId:this.projectId, treeId: this.treeId}})
          this.$router.push({
            name: "spaceAdd",
            params: {
              project: this.projectId,
              treeId: this.treeId
            }
          })
        })
      },
      //编辑按钮（主项目）
      onMainEdit(operation){
        debounce(()=>{
          // this.$router.push({path: "/space/mainEdit",query: {projectId: this.projectId,id:operation.id}})
          this.$router.push({
            name: "mainSpaceEdit",
            params: {
              project: this.projectId,
              id:operation.id
            }
          })
        })
      },
      //编辑按钮
      onEdit(operation) {
        debounce(()=>{
          // this.$router.push({path: "/space/edit",query: {projectId: this.projectId,id:operation.id}})
          this.$router.push({
            name: "spaceEdit",
            params: {
              project: this.projectId,
              id:operation.id
            }
          })
        })
      },
      //删除按钮
      onDelete(operation) {
        debounce(()=>{
          const that = this;
          that.$confirm({
            title: "删除空间",
            content: "是否删除该空间",
            centered: true,
            okText: "是",
            cancelText: "否",
            onOk() {
              const para ={
                uid: operation.id
              };
              that.tableLoading = true;
              // const dataSource = [...that.data];
              api.delSpace(para).then(res => {
                if (res.code === 200) {
                  if (that.tableData.length === 1) {
                    that.current--;
                    that.getSpaceList(that.treeId);
                    that.getSpaceTreeData()
                  } else {
                    that.getSpaceList(that.treeId);
                    that.getSpaceTreeData()
                  }
                  // that.data = dataSource.filter(item => item.id !== operation.id);
                } else {
                  that.$error({
                    title: "删除空间",
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
              console.log("否")
            },
          });
        })
      },
      // 分页
      onShowSizeChange(current, pageSize) {
        this.current = current;
        this.pageSize = pageSize;
        this.getSpaceList(this.treeId)
      },
      //获取项目列表
      getSpaceProjectList() {
        api.getSpaceProject().then(res => {
          this.projectList = res.data;
          this.projectId = res.data[0].id;
          if (this.projectId) {
            this.getSpaceTreeData();//获取空间树
          }
        });
      },
      //获取空间树
      getSpaceTreeData() {
        const para = {
          id: this.projectId
        };
        api.getSpaceTree(para).then(res => {
          if (res.code === 200) {
            this.treeData = res.data;
            this.originallyTreeData = res.data;
            this.treeId = this.treeData[0].id;
            this.originallyTreeId = this.treeData[0].id;
            if (this.treeId) {
              this.getSpaceList(this.treeId);
            }
          }
        });
      },
      //获取查询条件标签列表
      getLabelList() {
        const para = {
          name: "",
          pageIndex: 1,
          pageSize: 999,
          tag: ""
        };
        api.getLabel(para).then(res => {
          const label={
            id:"",
            name:"全部"
          };
          this.formList[0] = {
            ...this.formList[0],
            selectOptions: res.data.records,
          };
          this.formList[0].selectOptions.unshift(label);
          this.$refs.form.setFieldsValue({
            label: this.formList[0].selectOptions[0]?.id,
          });
          console.log(this.formList[0].selectOptions)
        });
      },
      //获取列表
      getSpaceList(id) {
        this.tableLoading = true;
        const { label, name} = this.$refs.form.getFieldsValue();
        const para = {
          labelIds: label,
          name: name ? name.trim() : "",
          pageIndex: this.current,
          pageSize: this.pageSize,
          pid: id
        };
        api.getSpace(para).then(res => {
          this.total = res.data.total;
          this.tableData = res.data.records;
          this.tableLoading = false;
        }).finally(()=>{
          this.tableLoading = false;
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  #space{
    height: 100%;
    overflow: hidden;
  }
  .ant-tree li[class^="ant-tree-treenode"] {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

