<template>
  <div class="game-prizeManage">
    <div class="game-prizeManage-title">活动奖品管理</div>
    <div style="margin: 30px">
      <a-table
        :columns="columns"
        :data-source="prizeList"
        @change="changePage"
        :pagination="pagination"
        :rowKey="record => record.positionIndex"
      >
        <span slot="operate" slot-scope="text, record">
          <span @click="turnOn(record)" class="operate">编辑</span>
        </span>
      </a-table>
    </div>

    <a-modal title="奖品管理" :visible="ticketVisible" @ok="submit" @cancel="ticketVisible = false">
      <div style="height: 400px;overflow-y: scroll;">
        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">位置：</div>
          <div class="prizeManage-label-text">{{ prizeTarget.positionIndex }}</div>
        </div>
        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">奖品名称</div>
          <timesInput v-model="prizeName"></timesInput>
        </div>
        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">奖品类型</div>
          <timesSelect
            :optionObj="PRIZE_TYPE_DICT"
            @select-option="seleceType"
            placeholder="请选择奖品类型"
          ></timesSelect>
        </div>
        <div class="game-prizeManage-label" v-if="prizeType == 1 || prizeType == 2">
          <div class="prizeManage-label-title" style="width: 120px">奖励数量</div>
          <timesInput v-model="rewardNum"></timesInput>
        </div>

        <div class="game-prizeManage-label" v-if="prizeType >= 4005">
          <div class="prizeManage-label-title" style="width: 120px">选择卡券</div>
          <timesSelect
            :optionObj="couponOpton"
            @select-option="selectCoupon"
            placeholder="请选择奖品类型"
          ></timesSelect>
        </div>

        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">奖品数量</div>
          <timesInput v-model="prizeNum"></timesInput>
        </div>
        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">单日最高中奖数量</div>
          <timesInput v-model="dayMaxLotteryNum"></timesInput>
        </div>
        <div class="game-prizeManage-label" style="align-items:flex-start" v-if="ticketVisible">
          <div class="prizeManage-label-title" style="width: 120px">指定中奖人</div>
          <a-upload
            style="margin-left: 15px"
            name="file"
            :before-upload="() => false"
            @change="handleExcel"
            :remove="handRemoveExcel"
          >
            <a-button>
              <a-icon type="upload" />
              上传
            </a-button>
          </a-upload>
        </div>

        <div class="game-prizeManage-label">
          <div class="prizeManage-label-title" style="width: 120px">中奖权重(%)</div>
          <timesInput v-model="lotteryWeight" type="number"></timesInput>
        </div>

        <div class="game-prizeManage-label" v-if="ticketVisible">
          <div class="prizeManage-label-title" style="width: 120px">奖品缩略图</div>
          <div class="stair">
            <a-upload
              name="avatar"
              accept="image/jpeg,image/jpg,image/png"
              list-type="picture-card"
              :before-upload="() => false"
              :remove="handleImgRemove"
              @preview="handlePreview"
              @change="uploadPic"
              :default-file-list="fileList"
            >
              <template v-if="!prizeUrl && !fileList.length">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
            </a-upload>
          </div>
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
    dataIndex: 'positionIndex',
    key: 'positionIndex'
  },
  {
    title: '奖品名称',
    dataIndex: 'prizeName',
    key: 'prizeName'
  },
  {
    title: '奖品类型',
    key: 'prizeTypeName',
    dataIndex: 'prizeTypeName'
  },
  {
    title: '奖品数量',
    key: 'prizeNum',
    dataIndex: 'prizeNum'
  },
  {
    title: '单日最高中奖数量',
    key: 'dayMaxLotteryNum',
    dataIndex: 'dayMaxLotteryNum'
  },
  {
    title: '中奖权重（%）',
    key: 'lotteryWeight',
    dataIndex: 'lotteryWeight'
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    slots: { title: 'operate' },
    scopedSlots: { customRender: 'operate' }
  }
];

const PRIZE_TYPE_DICT = [
  {
    name: '成长值',
    value: 1
  },
  {
    name: '邦豆',
    value: 2
  },
  {
    name: '物业券',
    value: 4014
  },
  {
    name: '实物券',
    value: 4015
  },
  {
    name: '购物券',
    value: 4005
  },
  {
    name: '谢谢惠顾',
    value: 6
  }
];
import timesInput from './component/form-input';
import timesSelect from './component/form-select';

import { GANE_PRIZE_MANAGE_LIST, GANE_UPDATE_PRIZE, GANE_DEL_PRIZE_PEOPLE, GANE_UPLOAD_PEOPLE } from '@/api/game';
import { updateImage } from '@/api/member';
import api from '@/api';

export default {
  components: { timesInput, timesSelect },
  data() {
    return {
      paramsPage: {}, //页面传递参数

      fileList: [], // 奖品缩略图

      columns,
      PRIZE_TYPE_DICT, // 奖品类型
      couponOpton: [], // 卡券类型
      pagination: {
        total: 23
      },
      prizeUrl: '', //图片url
      picUploading: false,
      loading: false,
      ticketVisible: false,
      beanVisible: false,
      prizeList: [], // 奖品管理列表
      prizeTarget: {},
      prizeName: '', //奖品名称
      prizeTypeOption: [],
      prizeType: '', // 奖品类型
      rewardNum: '', //奖励数量
      prizeNum: '', // 奖品数量
      dayMaxLotteryNum: '', //单日最高中奖数量
      lotteryWeight: '' //中奖权重
    };
  },
  created() {
    this.paramsPage = this.$route.query;
    console.log('paramsPage', this.paramsPage);
    this.init();
  },
  methods: {
    init() {
      GANE_PRIZE_MANAGE_LIST({
        gameId: this.paramsPage.id,
        pageNum: 1,
        pageSize: 10
      }).then(({ code, data }) => {
        if (code == 200) {
          this.prizeList = data.records;
          this.pagination.total = data.total * 1;
        }
      });
    },
    // 修改奖品信息
    submit() {
      console.log('target', this.prizeTarget);
      let params = {
        appointPersonUrl: this.appointPersonUrl, //指定中奖人
        dayMaxLotteryNum: this.dayMaxLotteryNum, // 单日最高中奖数量
        gameId: this.prizeTarget.gameId,
        id: this.prizeTarget.id,
        lotteryWeight: this.lotteryWeight, //中奖权重
        positionIndex: this.prizeTarget.positionIndex,
        prizeName: this.prizeName,
        prizeNum: this.prizeNum,
        prizeType: this.prizeType,
        prizeUrl: this.prizeUrl
      };
      if (this.prizeType == 1 || this.prizeType == 2) {
        params.rewardNum = this.rewardNum;
      } else {
        params.ticketCode = this.ticketCode;
        params.ticketName = this.prizeTarget.ticketName;
      }
      GANE_UPDATE_PRIZE(params).then(res => {
        if (res.code == 200) {
          this.ticketVisible = false;
          this.$message.info('修改成功');
          this.init();
        }
      });
    },
    // 每次编辑时候清空表单数据
    initForm() {
      this.prizeName = '';
      this.rewardNum = '';
      this.prizeNum = '';
      this.dayMaxLotteryNum = '';
    },
    changePage() {},
    handleImgRemove() {
      this.prizeUrl = '';
    },
    handlePreview() {},
    uploadPic({ fileList = [] } = {}) {
      if (fileList.length > 0) {
        const isJpgOrPng = fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('图片格式错误，请重新上传');
        } else {
          this.picUploading = true;
          const formData = new FormData();
          fileList.forEach(file => {
            formData.append('file', file.originFileObj);
          });
          formData.append('programCode', 'sys-member-center');
          updateImage(formData)
            .finally(() => {
              this.picUploading = false;
            })
            .then(res => {
              if (res.code === 200) {
                this.prizeUrl = res.data;
              }
            });
        }
      }
    },
    // 点击编辑
    turnOn(val) {
      this.ticketVisible = true;
      this.prizeTarget = val;
      this.prizeName = val.prizeName;
      this.rewardNum = val.rewardNum + '';
      this.prizeNum = val.prizeNum + '';
      this.dayMaxLotteryNum = val.dayMaxLotteryNum + '';
      this.lotteryWeight = val.lotteryWeight + '';
      this.prizeUrl = '';
      if (val.prizeUrl) {
        this.fileList = [
          {
            uid: '-1',
            status: 'done',
            url: val.prizeUrl,
            thumbUrl: val.prizeUrl
          }
        ];
      }
      console.log('remove', this.prizeTarget);
    },
    // 选择卡券类型
    selectCoupon(val) {
      console.log('ticketCode', val);
      this.ticketCode = val;
    },
    seleceType(val) {
      // 实物券/物业费/购物券 4015/4014/4005
      // 当奖品类型是券时，查询卡券列表反显让操作着选择
      // 当奖励类型是非券，显示奖品奖励数量（邦豆， 成长值）
      this.prizeType = val;
      console.log('val', this.prizeType);
      if (val == 4015 || val == 4005 || val == 4014) {
        api
          .getCouponList({
            pageIndex: 1,
            pageSize: 30,
            activity: val,
            status: 1 // 启用
          })
          .then(({ code, data }) => {
            if (code == 200) {
              this.couponOpton = [];
              data.records.forEach(item => {
                this.couponOpton.push({
                  value: item.couTypeCode,
                  name: item.couponTitle
                });
              });
              console.log('couponOpton', this.couponOpton);
            }
          });
      }
    },
    handRemoveExcel() {
      GANE_DEL_PRIZE_PEOPLE({
        gameId: this.prizeTarget.gameId,
        positionIndex: this.prizeTarget.positionIndex,
        prizeId: this.prizeTarget.id
      }).then(res => {
        if (res.code == 200) {
          this.$message.info('删除成功');
        }
      });
    },
    handleExcel({ fileList = [] } = {}) {
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file.originFileObj);
        });
        formData.append('gameId', this.prizeTarget.gameId);
        formData.append('positionIndex', this.prizeTarget.positionIndex);
        formData.append('prizeId', this.prizeTarget.id);
        GANE_UPLOAD_PEOPLE(formData).then(res => {
          if (res.code === 200) {
            this.appointPersonUrl = res.data;
          }
        });
      }
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
