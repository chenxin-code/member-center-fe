<template>
  <div class="detail">
    <div class="detail-header">
      <p class="detail-header-title">任务详情</p>
      <p class="detail-header-btn" @click="goBack()">返回</p>
    </div>
    <div class="detail-main">
      <p class="detail-main-title">
        <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
        基础信息
      </p>
      <div class="detail-main-items" v-for="item in dataList" :key="item.label">
        <span class="detail-main-items-label">{{ item.label }}</span>
        <span class="detail-main-items-value" v-if="item.name === 'result'">
          奖励成长值&nbsp;<a-button type="primary" size="small" @click="bangdouHandle()">{{awardGrow}}</a-button>&nbsp;, 奖励邦豆: {{Math.floor(awardIntegral / 100)}}邦豆/{{awardIntegral}}元（向下取整）
        </span>
        <span class="detail-main-items-value" v-else>{{ dataObj[item.name] || '' }}</span>
      </div>
    </div>
    <!-- modal对话框 -->
    <a-modal
      :centered="true"
      v-model="visibleBangdou"
      title="标题"
      :maskClosable="false"
      on-ok="handleOk">
      <template slot="footer">
        <a-button :disabled="modalLoading" key="back" @click="visibleBangdou = false">取消</a-button>
        <a-button :disabled="modalLoading" key="submit" type="primary" :loading="modalLoading" @click="handleOk">
          确定
        </a-button>
      </template>
      <a-form layout="inline">
        <a-form-item>
          <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center">
            <div style="width: 67px;margin-right: 10px;display: flex;flex-direction: row;justify-content: flex-end;align-items: center">
              <span style="color: red;">*</span>
              <span>邦豆数量</span>
            </div>
            <a-input-number
              v-model="bangdouAddVal"
              :min="1"
              defaultValue="1"
              style="width: 267px"
              :style="bangdouAddValNull ? bangdouAddNullStyle1 : ''"
              placeholder="请输入邦豆数量"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';
export default {
  name: 'task_detail',
  data() {
    return {
      dataList: [
        {
          label: '任务key：',
          name: 'taskKey'
        },
        {
          label: '任务名称：',
          name: 'taskName'
        },
        {
          label: '任务有效期(天)：',
          name: 'validity'
        },
        {
          label: '是否周期性：',
          name: 'isPeriodic'
        },
        {
          label: '状态：',
          name: 'status'
        },
        {
          label: '对应行为：',
          name: 'behaviourName'
        },
        {
          label: '任务来源：',
          name: 'sourceName'
        },
        {
          label: '领取条件：',
          name: 'taskCondition'
        },
        {
          label: '任务结果：',
          name: 'result'
        },
        {
          label: '创建时间：',
          name: 'createTime'
        }
      ],
      dataObj: {},
      awardGrow: null,
      awardIntegral: null,
      visibleBangdou: false,
      modalLoading: false,
      bangdouAddNullStyle1: {
        color: 'red',
        borderColor: 'red'
      },
      bangdouAddValNull: false,
      bangdouAddVal: 1,
    };
  },
  mounted() {
    this.initData(this.$route.query.id);
  },
  methods: {
    initData(id) {
      api.getTaskDetail({ taskId: id }).then(res => {
        this.dataObj = Object.assign(
          res.data,
          { createTime: moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss') },
          { isPeriodic: res.data.isPeriodic === 0 ? '否' : '是' },
          { status: res.data.status === 0 ? '禁用' : '启用' },
          // {
          //   result: `奖励成长值${res.data.awardGrow}, 奖励邦豆: ${Math.floor(res.data.awardIntegral / 100)}邦豆/${
          //     res.data.awardIntegral
          //   }元（向下取整）`
          // }
        );
        this.awardGrow = res.data.awardGrow;
        this.awardIntegral = res.data.awardIntegral;
      });
    },
    goBack() {
      this.$router.push({ name: 'task-manager' });
    },
    handleOk() {
      if (!this.bangdouAddVal) {
        this.bangdouAddValNull = true;
        return;
      }
      this.modalLoading = true;
      setTimeout(() => {
        this.visibleBangdou = false;
        this.modalLoading = false;
      },1000)
    },
    bangdouHandle() {
      this.bangdouAddVal = 1; //充值帮豆
      this.visibleBangdou = true; //显示对话框
    },
  },
  watch: {
    visibleBangdou: {
      handler(newVal) {
        if (!newVal) {
          this.bangdouAddValNull = false;
        }
      },
      immediate: true //刷新加载 立马触发一次handler
    },
    bangdouAddVal: {
      handler(newVal) {
        if (newVal) {
          this.bangdouAddValNull = false;
        }
      },
      immediate: true //刷新加载 立马触发一次handler
    },
  }
};
</script>

<style lang="less" scoped>
.detail {
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    border-bottom: 2px solid #dadada;
    &-title,
    &-btn {
      margin: 0;
      padding: 0 40px;
    }
    &-btn {
      color: #4c79fa;
      cursor: pointer;
    }
  }
  &-main {
    height: calc(100% - 58px);
    overflow: auto;
    padding: 20px;
    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 35px;
      line-height: 50px;
      margin: 0;
    }
    &-items {
      color: #666;
      margin-bottom: 20px;
      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #333;
      }
    }
  }
}
</style>
