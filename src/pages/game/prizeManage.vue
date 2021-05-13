<template>
  <div class="game-prizeManage">
    <div class="game-prizeManage-title">活动奖品管理</div>
    <div style="margin: 30px">
      <a-table :columns="columns" :data-source="contentData" @change="changePage" :pagination="pagination">
        <span slot="operate" slot-scope="text, record">
          <span @click="turnOn(record)" class="operate">编辑</span>
        </span>
      </a-table>
    </div>

    <a-modal title="奖品管理" :visible="ticketVisible" @cancel="ticketVisible = false">
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">位置：</div>
        <div class="prizeManage-label-text">1</div>
      </div>
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">奖品名称</div>
        <timesInput v-model="prizeName"></timesInput>
      </div>
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">奖品类型</div>
        <timesSelect
          :optionObj="prizeTypeOption"
          @select-option="seleceType"
          placeholder="请选择奖品类型"
        ></timesSelect>
      </div>
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">奖励数量</div>
        <timesInput v-model="awardNum"></timesInput>
      </div>
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">奖品数量</div>
        <timesInput v-model="prizeNum"></timesInput>
      </div>
      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">单日最高中奖数量</div>
        <timesInput v-model="heightNum"></timesInput>
      </div>
      <div class="game-prizeManage-label" style="align-items:flex-start">
        <div class="prizeManage-label-title" style="width: 120px">指定中奖人</div>
        <a-upload style="margin-left: 15px" name="file" :multiple="true" action="" :headers="{}" @change="handleExcel">
          <a-button>
            <a-icon type="upload" />
            上传
          </a-button>
        </a-upload>
      </div>

      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">中奖权重(%)</div>
        <timesInput v-model="prizeNum"></timesInput>
      </div>

      <div class="game-prizeManage-label">
        <div class="prizeManage-label-title" style="width: 120px">奖品缩略图</div>
        <div class="stair">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="stairBefore"
            @change="stairChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </div>
      </div>
    </a-modal>
    <a-modal title="奖品管理" :visible="beanVisible" @cancel="beanVisible = false"></a-modal>
  </div>
</template>

<script>
// 头部标题
const columns = [
  {
    title: '位置',
    dataIndex: 'theme',
    key: 'theme'
  },
  {
    title: '奖品名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '奖品类型',
    key: 'type',
    dataIndex: 'type'
  },
  {
    title: '奖品数量',
    key: 'gameType',
    dataIndex: 'gameType'
  },
  {
    title: '单日最高中奖数量',
    key: 'gameType1',
    dataIndex: 'gameType'
  },
  {
    title: '中奖权重（%）',
    key: 'gameType2',
    dataIndex: 'gameType'
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    slots: { title: 'operate' },
    scopedSlots: { customRender: 'operate' }
  }
];
const contentData = [
  {
    key: '1',
    name: 'John Brown',
    theme: 32,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  },
  {
    key: '2',
    name: 'Jim Green',
    theme: 42,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  },
  {
    key: '3',
    name: 'Joe Black',
    theme: 32,
    type: '随机开奖',
    gameType: 'gameType',
    startTime: 'startTime',
    endTime: 'endTime'
  }
];
import timesInput from './component/form-input';
import timesSelect from './component/form-select';

export default {
  components: { timesInput, timesSelect },
  data() {
    return {
      columns,
      contentData,
      pagination: {
        total: 23
      },
      imageUrl: '',
      loading: false,
      ticketVisible: true,
      beanVisible: false,
      prizeName: '', //奖品名称
      prizeTypeOption: [],
      prizeType: '', // 奖品类型
      awardNum: '', //奖励数量
      prizeNum: '', // 奖品数量
      heightNum: '', //单日最高中奖数量
      percentage: '' //中奖权重
    };
  },
  methods: {
    stairChange() {},
    stairBefore() {},
    changePage() {},
    turnOn() {
      this.ticketVisible = true;
    },
    seleceType(val) {
      this.awardNum = val;
    },
    handleExcel() {
      console.log('handleExcel');
    }
  }
};
</script>

<style lang="less" scoped>
.game-prizeManage-label {
  display: flex;
  margin: 20px 40px;
  align-items: center;
  .prizeManage-label-title {
    text-align: right;
  }
  .prizeManage-label-text {
    margin-left: 15px;
  }
  .stair {
    margin-left: 15px;
  }
}
.game-prizeManage-title {
  width: 200px;
  height: 80px;
  text-align: center;
  line-height: 80px;
}
.operate {
  color: #169bd5;
  margin-left: 10px;
  cursor: pointer;
}
</style>
