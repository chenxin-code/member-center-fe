<!-- 标签页面 -->
<template>
  <div id="editTag">
    <a-tag v-for="tag of labelList" :key="tag.id" :closable="true" @close="() => handleClose(tag)">
      {{tag.name}}
    </a-tag>
    <div class="add-btn" @click="addTag"><a-icon type="plus"/>添加标签</div>
    <!-- 添加标签 -->
    <a-modal v-model="visible" :centered="true" :maskClosable="false" title="添加标签"  @cancel="addHandleCancel">
      <template slot="footer">
        <a-button key="back" @click="addHandleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary"  :loading="btnLoading" @click="addHandleOk">
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
</template>
<script>
import api from "@/api";
export default {
  name: "EditTag",
  data(){
    return{
      chooseData: [],
      checkedList: [],
      labelList: [],
      tagOptions: [],
      visible: false,
      btnLoading: false
    }
  },
  created() {
    this.getLabelList();
    this.getResidentLabelList()
  },
  methods: {
    //添加标签按钮
    addTag() {
      this.visible = true;
    },
    onChange(checkedList) {
      this.checkedList = checkedList
    },
    //添加标签的取消按钮
    addHandleCancel() {
      this.visible = false;
      const chooseList = [];
      for (let i = 0; i < this.labelList.length; i++) {
        const node = this.labelList[i];
        const id = node.id;
        chooseList.push(id);
      }
      this.checkedList=chooseList;
    },
    //添加标签的确定按钮
    addHandleOk() {
      this.chooseData = [];
      this.btnLoading = true;
      const para = {
        userId: this.$route.query.custId,
        labelIds: this.checkedList
      };
      api.addResidentTag(para).then(res => {
        if (res.code === 200) {
          this.visible = false;
          // for (let i = 0; i < this.tagOptions.length; i++) {
          //   const node = this.tagOptions[i];
          //   const id = node.id;
          //   const name = node.name;
          //   if (this.checkedList.some(item => item === id)) {
          //     this.chooseData.push({id:id, name: name});
          //   }
          // }
          // this.labelList = this.chooseData;
          this.getResidentLabelList();

        }
      }).finally(()=>{
        this.btnLoading = false;
      });
    },
    //删除标签
    handleClose(removedTag) {
      const para = {
        userId: this.$route.query.custId,
        labelId: removedTag.id
      };
      api.deleteResidentTag(para).then(res => {
        if (res.code === 200) {
          // const tags = this.labelList.filter(tag => tag !== removedTag);
          // const checkedList = this.checkedList.filter(item => item !== removedTag.id);
          // this.labelList = tags;
          // this.checkedList = checkedList;
          this.getResidentLabelList();
        }
      });
    },
    //获取全部住户标签
    getLabelList() {
      const para = {
        pageIndex: 1,
        pageSize: 9999
      };
      api.getResidentLabel(para).then(res => {
        if (res.code === 200) {
          this.tagOptions = res.data.records;
        }
      });
    },
    //获取当前业主的标签
    getResidentLabelList() {
      this.labelList = [];
      this.checkedList = [];
      const para = {
        customerId: this.$route.query.custId,
        pageIndex: 1,
        pageSize: 9999,
      };
      api.getResidentLabel(para).then(res => {
        if (res.code === 200) {
          res.data.records.map((item)=>{
            if (item.status === 0) {
              this.labelList.push(item);
              this.checkedList.push(item.id)
            }
          })
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.right-tag{
  .ant-tag{
    font-size: 14px;
    margin: 0 10px 10px 0;
    padding: 2px 5px;
  }
}
.add-btn{
  width:100px;
  height:30px;
  border-radius: 2px;
  border: 1px dashed #4B7AFB;
  color:#4B7AFB;
  text-align: center;
  line-height: 30px;
  font-size:12px;
}
</style>
