<template>
  <div>
    <a-transfer
      v-if="reFresh"
      show-search
      :list-style="{
      width: '240px',
      height: '320px',
    }"
      :data-source="dataSource"
      :target-keys="value"
      :render="item => item.fullName"
      :show-select-all="false"
      @change="onChanged"
      @search="onSearch"
    >
      <template
        slot="children"
        slot-scope="{
        props: { direction, selectedKeys },
        on: { itemSelect },
      }"
      >
        <a-tree
          v-if="direction === 'left'"
          style="height:210px;overflow:scroll"
          :selectable="false"
          blockNode
          checkable
          checkStrictly
          :checkedKeys="[...selectedKeys, ...value]"
          :treeData="tree"
          :replaceFields="replaceFields"
          @check="(_, props) => {onChecked(_, props, [...selectedKeys, ...value],itemSelect)}"
        />
        <!--:expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @expand="onTreeExpand"-->
      </template>
    </a-transfer>
  </div>
</template>

<script>
  export default {
    name: "spaceTransfer",
    props: ["value","treeData","dataSource","originallyTreeData","invariantTargetKeys","otherAreaBind"],
    data() {
      return {
        reFresh: true,
        targetKeys: this.value,
        tree: this.treeData,
        resetTreeData: [],
        expandedKeys:[],
        autoExpandParent: true,
        replaceFields: {children:'childrenList',title:'name', key:'id'}
      }
    },
    watch: {
      treeData: function (val) {
        try {
          console.log(val);
          this.tree = val
        } catch (e) {
          console.error('JSON序列化失败');
        }
      }
    },
    created(){
      // this.handleTreeData(this.tree, this.value,this.otherAreaBind);
      // console.log("created")
    },
    methods: {
      refresh() {
        this.reFresh = false;
        this.$nextTick(function() {
          this.reFresh = true;
        });
      },
      callMethod () {
        this.refresh();
        this.handleTreeData(this.tree, this.value,this.otherAreaBind);
        console.log("refresh")
      },
      onTreeExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      // 关联空间的树形控件（重排数据）
      generateLists(data) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const key = node.id;
          const title = node.name;
          const fullName=node.fullName;
          this.resetTreeData.push({ id:key, name: title ,fullName:fullName});
          if (node.childrenList) {
            this.generateLists(node.childrenList);
          }
        }
      },
      //关联空间穿梭框的搜索
      onSearch(dir, value) {
        if (dir === "left") {
          if (value === "") {
            this.replaceFields = {children:'childrenList',title:'name', key:'id'};
            this.tree = this.originallyTreeData;
            this.handleTreeData(this.tree, this.value,this.otherAreaBind);
          } else {
            this.tree = this.originallyTreeData;
            this.generateLists(this.tree);
            const chooseList = [];
            this.resetTreeData
              .map(item => {
                if (item.name.indexOf(value) > -1) {
                  chooseList.push(item)
                }
              });
            this.resetTreeData = [];
            this.tree = chooseList;
            this.replaceFields = {children:'childrenList',title:'fullName', key:'id'};
            this.handleTreeData(this.tree, this.value,this.otherAreaBind);
          }
        }
      },
      isChecked(selectedKeys, eventKey) {
        return selectedKeys.indexOf(eventKey) !== -1;
      },
      handleTreeData(data, targetKeys = [],otherAreaBind=[]) {
        data.forEach(item => {
          item["disabled"] = targetKeys.includes(item.id);
          otherAreaBind.forEach((id)=>{
            if (item.id === id) {
              item.disabled = true
            }
          });
          if (item.childrenList) {
            this.handleTreeData(item.childrenList, targetKeys,otherAreaBind);
          }
        });
        return data;
      },
      onChanged(targetKeys) {
        this.targetKeys = targetKeys;
        this.$emit('input',this.targetKeys);
        this.handleTreeData(this.tree, this.targetKeys,this.otherAreaBind);
      },
      onChecked(_, e, checkedKeys, itemSelect) {
        const { eventKey } = e.node;
        itemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
      },
    }
  }
</script>

<style scoped>

</style>
