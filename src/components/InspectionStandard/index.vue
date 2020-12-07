<template>
  <a-spin :spinning="picUploading">
    <div class="btn-wrapper">
      <div class="btn" @click="addStand"><a-icon type="plus" /> 添加</div>
    </div>

    <div>
      <div v-for="(item, index) in list" :key="index" style="display: flex;margin-bottom: 4px;">
        <div style="width: 30%">
            <a-select v-model="item.unitId" >
              <a-select-option v-for="item1 in inspectionUnitData" :key="item1.codeId">{{item1.name}}</a-select-option>
            </a-select>
        </div>
        <div style="width: 20%">
          <a @click="chooseStandard(index)" style="margin-left:38px;">{{item.standardIds.length === 0 ? "选择标准" : "已选" + item.standardIds.length + "个"}}</a>
        </div>
        <div style="width: 15%"> 
           <a-checkbox :checked="item.scanFlg == 1 ? true : false" :value="item.scanFlg == 1 ? true : false" @change="onScanflag($event,index)">是否扫码</a-checkbox>
        </div>
        <div v-if="list.length>1" class="operate-wrapper" style="width: 20%;">
          <a-icon type="minus-circle" style="font-size:20px;color:gray" @click="deleteItem(index)" />
        </div>
      </div> 
    </div>

    <!-- 选择标准 -->
    <a-modal v-model="visible" :centered="true" :maskClosable="false" title="选择标准"  width="960" @cancel="onCancel">
      <template slot="footer">
        <a-button key="back" @click="onCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="onConfirm">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <div style="width:796px;height:480px;">
            <vTransfer v-model="targetKeys" :mockData="mockData" :leftColumns="leftColumns" :rightColumns="rightColumns"/>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-spin>
</template>

<script>
import api from '@/api';
import { debounce } from '@/utils/util';
import vTransfer from "@/components/transfer";

export default {
  name: "InspectionStandard",
  components: {vTransfer },
  props: ['value'],
  data() {
    return {
      list: this.value || [],
      qrCode: '',
      qrCodeLoading: false,
      picUploading: false,
      mockData: [],
      targetKeys: [],
      oriTargetKeys: [],
      checkAll: false,
      indeterminate: false,
      leftColumns: [
        {
            dataIndex: "title",
            title: "标准code",
        },
        ],
        rightColumns: [
          {
            dataIndex: "title",
            title: "标准code",
          },
        ],
      inspectionUnitData:[],
      visible:false,
      index:0,
    };
  },
  created() {
    this.getInspectionUnitList();
  },
  watch: {
    value: function (val) {
      console.log(val)
      try {
        if (typeof val === 'string') {
          this.list = JSON.parse(val);
          console.log(this.list);
        }
      } catch (e) {
        console.error('JSON序列化失败');
      }
    }
  },
  methods: {
    onScanflag(e,index){
      let status = e.target.checked ? 1 : 0
      this.list[index].scanFlg = status
    },

    addStand() {
      let isTrue = true
      let repeat = false
      this.list.forEach((n) => {
        if(!n.unitId || !n.standardIds.length) {
          this.$message.error("请先选择巡检单元和巡查标准")
          isTrue = false
          return
        }
        let q = 0
        this.list.forEach((o) => {
          if(n.unitId == o.unitId) {
            q++;
          } 
        })
        if (q > 1) {
          repeat = true
        }
      })
      if(!isTrue){ return false}
      if (repeat) {
        this.$message.error("巡检单元不能重复")
        return false
      }

      this.list.push({ 
        unitId: '', 
        standardIds:[],
        scanFlg: 1 
      })
      this.triggerChange(this.list);
    },
    deleteItem(index) {
      this.list.splice(index, 1);
      this.triggerChange(this.list);
    },
    triggerChange(changedValue) {
      this.$emit('change', changedValue);
    },
    chooseStandard(index){
      this.index = index;
      this.targetKeys = this.list[index].standardIds;
      this.visible = true;
      //获得标准列表
      this.getStandardList();
    },
      //确定按钮
      onConfirm() {
        this.visible = false;
        this.list[this.index].standardIds =  this.targetKeys;
      },
      //取消按钮
      onCancel() {
        this.visible = false;
      },
      //获取巡检列表
      getInspectionUnitList(){
		    const para = {
		      parentId: 8
	      };
        api.getQuCommonCodeList(para).then(res => {
            if (res.code === 200) {
			        this.inspectionUnitData = res.data.list;
			  }
		    })
      },
      //获取标准列表
      getStandardList(){
        api.getStandardListIn().then(res => {
          if (res.code === 200) {
            const newArr = res.data.map(item => ({
              key: item.id,
              title: item.standardCode
            }));
            this.mockData = newArr;
            this.total = res.data.length;
            //this.getData()
          }
        })
      },
  }
}
</script>

<style lang="less" scoped>
.btn-wrapper {
  display: flex;
  align-items: center;
  height: 38px;
  .btn{
    border:1px dashed #ccc;
    width: 50%;
    text-align: center;
    height: 32px;
    line-height: 32px;
  }
}

.operate-wrapper {
  // margin-left: auto;
  display: flex;
  align-items: center;

  .ant-btn {
    padding: 6px;

    &.hidden {
      visibility: hidden;
      cursor: default;
    }
  }
}

</style>
