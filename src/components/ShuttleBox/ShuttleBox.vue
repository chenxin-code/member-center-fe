<template>
  <a-modal
    v-model="visible"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
    :title="title"
    :width="modalWidth"
    :dialog-style="{ top: '50px' }"
  >
    <div class="dialog-wrap">
      <!-- 左边表格 -->
      <div class="left-box" ref="leftRef">
        <div class="left-head" ref="left_head">
          <!-- 左边头部插槽 -->
          <slot></slot>
        </div>
        <a-table
          v-if="isShow"
          :row-key="(r, i) => i"
          :rowClassName="rowClassName"
          size="small"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            columnWidth: '40px',
          }"
          :columns="columns"
          :data-source="allHide ? [] : listData"
          :scroll="{ y: `${leftH}px` }"
          :pagination="false"
          :loading="tableLoading"
        />
        <!-- 分页插槽 -->
        <div class="pagination" v-if="pagination">
          <slot name="pagination"></slot>
        </div>
      </div>

      <div class="btn-box">
        <a-button
          type="primary"
          icon="right"
          @click="toRight"
          :disabled="selectedRows.length == 0"
        />
      </div>

      <!-- 右边表格 -->
      <div class="right-box">
        <div class="right-head" ref="right_head">
          <div class="num">
            {{ rightData.length ? `已选${rightData.length}个` : `未选择` }}
          </div>
          <a-button
            type="primary"
            :disabled="rightRows.length == 0"
            @click="del_right"
            >删除</a-button
          >
        </div>
        <a-table
          :row-key="(r, i) => i"
          size="small"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: rightRowKey,
            onChange: rightSelectChange,
            columnWidth: '40px',
          }"
          :columns="columns"
          :data-source="rightData"
          :scroll="{ y: `${rightH}px` }"
        />
      </div>
    </div>
    <template slot="footer">
      <a-button key="back" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="onOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ShuttleBox",
  props: {
    tableLoading:{ //左侧表格 加载状态
      type: Boolean,
      default: false,
    },
    pagination:{ // 表格是否有 分页插槽
      type: Boolean,
      default: false,
    },
    modalWidth: { // 模态框宽度
      type: Number,
      default: 960,
    },
    visible: { // 弹框是否显示
      type: Boolean,
      default: false,
    },
    title: { // 弹框名称
      type: String,
      default: "选择项目",
    },
    dataSource: { // 表格数据源
      type: Array,
      default: () => [],
    },
    columns: { // 表格的表头设置
      type: Array,
      default: () => [],
    },
    selectData: { // 已经选择的右边数据
      type: Array,
      default: () => [],
    },
  },
  watch: {
    visible(newVal) {
      // 监听弹框显示
      if (newVal) {
        this.$nextTick(() => {
          let boxWrap = this.$refs["leftRef"].offsetHeight; // 外层盒子高度
          let left_head = this.$refs["left_head"].offsetHeight; // 左边头部高度
          let right_head = this.$refs["right_head"].offsetHeight; // 右边头部的高度
          let pagiH = this.pagination ? 40 : 0 // 底部是否有表格分页
          this.leftH = boxWrap - 37 - left_head - pagiH; // 左边表格高度  (37表头高度)
          this.rightH = boxWrap - 37 - right_head; // 右边表格高度
        });
      } else {
        // 关闭了 去掉表格勾选
        this.selectedRowKeys = [];
        this.selectedRows = []; // 左边表格勾选的数据
        this.rightRowKey = []; //右边选中的key
        this.rightRows = []; // 右边表格勾选的数据
      }
    },
    dataSource: {
      handler(newVal) {
        // console.log(newVal,'数据源变化')
        this.isShow = false;
        this.listData = JSON.parse(JSON.stringify(newVal));
        this.listData.length &&
          this.listData.forEach((e) => {
            e.isHide = false;
            e.key = e.id;
          });
        this.$nextTick(() => {
          this.rightData.length && this.checkShow(); // 重新校验左边表格
          this.isShow = true;
        });

        this.selectedRowKeys = [];
        this.selectedRows = []; // 左边表格勾选的数据
        this.rightRowKey = []; //右边选中的key
        this.rightRows = []; // 右边表格勾选的数据
      },
      deep: true,
      immediate: true, //立即执行
    },
    selectData: {
      handler(newVal) {
        // console.log(newVal,'右边变化了')
        this.rightData = JSON.parse(JSON.stringify(newVal));
        this.rightData.length &&
          this.rightData.forEach((e) => {
            e.isHide = false;
            e.key = e.id;
          });
        this.$nextTick(() => {
          this.checkShow(); // 重新校验左边表格
        });
      },
      deep: true,
      immediate: true, //立即执行
    },
  },
  data() {
    return {
      listData: [], // 左边数据 （同dataSource）
      rightData: [], // 右边数据 （同selectData）
      leftH: 0,
      rightH: 0,

      selectedRowKeys: [],
      selectedRows: [], // 左边表格勾选的数据

      rightRowKey: [], //右边选中的key
      rightRows: [], // 右边表格勾选的数据

      allHide: false,
      isShow: true,
    };
  },
  mounted() {},
  methods: {
    // 控制表格某一行是否隐藏
    rowClassName(record, index) {
      if (record.isHide == true) {
        return "hide";
      }
    },

    onCancel() {
      this.$emit("handle", {
        type: "cancel",
      });
      this.rightData = this.selectData; // 点击取消了，没有选择，复制成原来的
      this.checkShow(); // 重新校验左边显示
    },
    onOk() {
      this.$emit("handle", {
        type: "ok",
        data: this.rightData,
      });
    },

    // 左边表格选择
    onSelectChange(leftRowKeys, leftRows) {
      // console.log('selectedRowKeys changed: ', leftRowKeys,leftRows);
      this.selectedRowKeys = leftRowKeys;
      this.selectedRows = leftRows;
    },
    // 右边选择
    rightSelectChange(rightRowKeys, rightRows) {
      // console.log('right changed: ', rightRowKeys,rightRows);
      this.rightRowKey = rightRowKeys;
      this.rightRows = rightRows;
    },

    // 向右穿梭
    toRight() {
      if (this.selectedRows.length) {
        let newArr = [];
        this.selectedRows.forEach((e, i) => {
          // 如果选择了全部，那个可能包含了已经隐藏掉的行，在这里这过滤
          if (!JSON.stringify(this.rightData).includes(e.id)) {
            newArr.push(e);
          }
        });
        this.rightData = this.rightData.concat(newArr);
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.checkShow();
      }
    },
    // 删除右边 （向左穿梭）
    del_right() {
      if (this.rightRows.length) {
        let arr = this.rightData.filter((e) => {
          // 过滤没有选中的项，重新赋值新的右边表格
          if (!this.rightRows.includes(e)) {
            return e;
          }
        });
        this.rightData = arr;
        this.rightRows = [];
        this.rightRowKey = [];
        this.checkShow();
      }
    },

    // 检测如果左边的某一项，在右边已近有了 那么隐藏
    checkShow() {
      this.listData.length &&
        this.listData.forEach((e, i) => {
          e.isHide = false;
        });
      this.listData.length &&
        this.listData.forEach((e, i) => {
          if (JSON.stringify(this.rightData).includes(e.id)) {
            e.isHide = true;
          }
        });
      this.allHide = this.listData.length
        ? this.listData.every((e) => e.isHide)
        : false; // 判断所有的行都隐藏了, 表格显示空状态
    },
  },
};
</script>

<style scoped lang="less">
.dialog-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 420px;
  .left-box {
    width: 50%;
    height: 100%;
    // border: 1px solid #eee;
    border-radius: 5px;
    box-sizing: border-box;
    .left-head {
      width: 100%;
    }
    .pagination{
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .btn-box {
    // width: 2%;
    text-align: center;
  }
  .right-box {
    width: 42%;
    height: 100%;
    // border: 1px solid #eee;
    border-radius: 5px;
    box-sizing: border-box;
    .right-head {
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      align-items: flex-end;
    }
  }
}

// /deep/ .ant-empty-normal {
//     margin: 140px 0 !important;
// }

/deep/ .hide {
  display: none;
}

/deep/ .ant-modal-body{
  padding: 15px;
}
</style>