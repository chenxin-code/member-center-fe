<template>
  <div id="addSpace">
    <div class="content-header">
      添加空间
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main">
      <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }" style="padding:30px 10px;" autoComplete="off">
        <a-form-item label="空间名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '空间名称不能为空' },{ message: '空间名称最长30个字',max: 30 },{whitespace: true,
              message: '空间名称不能为空'}] } ]"
            placeholder="请输入空间名称"
          />
        </a-form-item>
        <a-form-item label="上级节点">
          <a-tree-select
            v-decorator="['pid', { rules: [{ required: true, message: '上级节点不能为空' }] } ]"
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :tree-data="treeData"
            :replaceFields="{children:'childrenList', title:'name', key:'id',value:'id'}"
            placeholder="请选择上级节点"
          >
            <span slot="1" slot-scope="operation">{{operation.name+'（主）'}}</span>
            <span slot="2" slot-scope="operation" style="color: #1890ff">{{operation.name}}</span>
          </a-tree-select>
        </a-form-item>
<!--        <a-form-item label="主项目层级">-->
<!--          <a-select-->
<!--            placeholder="暂无选择"-->
<!--            v-decorator="['levelCode']"-->
<!--            @change="handleChange"-->
<!--          >-->
<!--            <a-select-option v-for="item in mainProjectTier" :key="item.code" >-->
<!--              {{item.name}}-->
<!--            </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
        <a-form-item label="标签">
          <a-tooltip v-for="(tag) in labelList" :key="tag.id" :title="tag.name">
            <a-tag :key="tag.id" :closable="true" @close="() => handleClose(tag)">
              {{ tag.name }}
            </a-tag>
          </a-tooltip>
          <span @click="addTag" style="color:#4B7AFB;">+添加</span>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
          <a-button type="primary" :loading="btnLoading" @click="onAddSpace">
            确定
          </a-button>
          <a-button style="margin-left: 10px;" @click="FALLBACK">
            取消
          </a-button>
        </a-form-item>
      </a-form>
      <!-- 添加标签 -->
      <a-modal v-model="visible" :centered="true" :maskClosable="false" title="添加标签"  @cancel="addHandleCancel">
        <template slot="footer">
          <a-button key="back" @click="addHandleCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary"  @click="addHandleOk">
            确定
          </a-button>
        </template>
        <div style="height:200px;overflow:auto;">
          <a-checkbox-group  v-model="checkedList" @change="onChange" >
            <div v-for="(item,index) in tagOptions" :key="index" style="width:100%;margin-top:10px;">
              <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import { debounce } from '@/utils/util';
  // import message from 'ant-design-vue/es/message'
  export default {
    name: "addSpace",
    props: {
      project: {
        type: String,
        default: () => ({})
      },
      treeId: {
        type: String,
        default: () => ({})
      }
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: "form" }),
        labelList:[],
        tags: [],
        //被选中的标签
        chooseData: [],
        //主项目层级Data
        mainProjectTier: [],
        //树选择数据
        treeData: [],
        checkedList: [],
        tagOptions: [],
        visible: false,
        projectId: "",
        btnLoading: false,
        validateStatus: "",
        validateHelp: ""
    }
    },
    components: {

    },
    created () {
      // this.form.pid = this.$route.query.treeId;
      // this.projectId = this.$route.query.projectId;
      this.form.pid = this.project;
      this.projectId = this.treeId;
      this.getSpaceTreeData();
      // this.getSpaceLevel();
      this.getLabelList();
    },
    methods: {
      ...mapActions([
        "FALLBACK"
      ]),
      //主项目层级选择事件
      handleChange(value) {
        console.log(`selected ${value}`);
      },
      //添加标签按钮
      addTag() {
        debounce(()=>{
          this.visible = true;
        })
      },
      onChange(checkedList) {
        this.checkedList = checkedList
      },
      //添加标签的取消按钮
      addHandleCancel() {
        debounce(()=>{
          this.visible = false;
          const chooseList = [];
          for (let i = 0; i < this.labelList.length; i++) {
            const node = this.labelList[i];
            const id = node.id;
            if (this.chooseData.some(item => item.id === id)) {
              chooseList.push(id);
            }
          }
          this.checkedList=chooseList;
        })
      },
      //添加标签的确定按钮
      addHandleOk() {
        debounce(()=>{
          this.chooseData = [];
          this.visible = false;
          for (let i = 0; i < this.tagOptions.length; i++) {
            const node = this.tagOptions[i];
            const id = node.id;
            const name = node.name;
            if (this.checkedList.some(item => item === id)) {
              this.chooseData.push({id:id, name: name});
            }
          }
          this.labelList = this.tags.concat(this.chooseData);
        })
      },
      //删除标签
      handleClose(removedTag) {
        const tags = this.labelList.filter(tag => tag !== removedTag);
        const checkedList = this.checkedList.filter(item => item !== removedTag.id);
        this.labelList = tags;
        this.checkedList = checkedList
      },
      //获取上级节点
      getSpaceTreeData() {
        const para = {
          id: this.projectId
        };
        api.getSpaceTree(para).then(res => {
          this.treeData = res.data;
        });
      },
      //获取主项目层级
      // getSpaceLevel() {
      //   api.spaceLevel().then(res => {
      //     this.mainProjectTier =  res.data.filter(item => item.code !== 10000 && item.code !== 60000);
      //   });
      // },
      //获取标签
      getLabelList() {
        const para = {
          name: "",
          pageIndex: 1,
          pageSize: 999,
          tag: ""
        };
        api.getLabel(para).then(res => {
          this.tagOptions = res.data.records;
        });
      },
      //添加空间
      onAddSpace() {
        debounce(()=>{
          this.form.validateFields((err, values) => {
            if (!err) {
              this.btnLoading = true;
              values = {
                labelVoList: this.labelList,//空间标签
                // levelCode: values.levelCode,//空间层级
                name: values.name ? values.name.trim() : "",//空间名称
                pid: values.pid,//上级节点
                projectId: this.projectId
              };
              api["addSpace"](values).then(res => {
                if (res.code === 200) {
                  this.$message.success("新增成功");
                  this.$router.push({path: "/space"})
                }
                // else {
                //   this.validateStatus = "";
                //   this.validateHelp = res.message;
                //   message.destroy()
                // }
              }).finally(()=>{
                this.btnLoading = false;
              });
            }
          });
        })
      },
    },
  }
</script>

<style lang="less" scoped>
#addSpace{
  height: 100%;
  /*overflow: hidden;*/
}
</style>
