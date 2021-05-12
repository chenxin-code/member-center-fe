<template>
  <div class="game-add">
    <div class="game-add-title">新建游戏</div>
    <div class="game-add-content">
      <div class="label-content">
        <div class="label-title" style="margin: 0">游戏主题</div>
        <timesInput v-model="gameTheme"></timesInput>
      </div>

      <div class="choose-isActive">
        <div class="label-title">是否可用</div>
        <a-radio-group v-model="radio" @change="radioChange">
          <a-radio :value="1">
            启用
          </a-radio>
          <a-radio :value="2">
            禁用
          </a-radio>
        </a-radio-group>
      </div>
      <div class="label-content">
        <div class="label-title">有效期</div>
        <a-range-picker @change="changeDate" />
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">参与人数</div>
        <timesInput v-model="gamePeopleNum"></timesInput>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">每人可参与次数</div>
        <timesInput v-model="gamePeopleTimes"></timesInput>
      </div>

      <div class="label-content">
        <div class="label-title">活动说明</div>
        <a-textarea
          v-model="gameExplain"
          placeholder="请输入内容"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          style="width: 400px;"
        />
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">通知方式</div>
        <timesSelect :optionObj="informOption" @select-option="selectInform" placeholder="请选择通知方式"></timesSelect>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">开奖方式</div>
        <timesSelect :optionObj="prizeOption" @select-option="selectPrize" placeholder="请选择开奖方式"></timesSelect>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">活动方式</div>
        <timesSelect
          :optionObj="activityOption"
          @select-option="selectActivity"
          placeholder="请选择活动方式"
        ></timesSelect>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">上传抽奖素材</div>
        <div class="game-imgupload">
          <div class="stair">
            <div style="margin-bottom: 15px;">背景图片</div>
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

          <div class="stair">
            <div style="margin-bottom: 15px;">消息层背景</div>
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

          <div class="stair">
            <div style="margin-bottom: 15px;">游戏层背景</div>
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
      </div>

      <div class="game-button">
        <a-button @click="cancel" style="width: 150px;margin-left: 20px;">取消</a-button>
        <a-button @click="submit" style="width: 150px;margin-left: 10px" type="primary">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      gameTheme: '',
      radio: 1,
      gamePeopleNum: '',
      gamePeopleTimes: '',
      gameExplain: '',
      informOption: [
        { name: '消息通知', value: 'sudoku' },
        { name: '短信通知', value: 'turntable' }
      ],
      informType: '', //通知方式
      prizeOption: [
        { name: '消息通知', value: 'sudoku' },
        { name: '短信通知', value: 'turntable' }
      ],
      prizeType: '', //开奖方式
      activityOption: [
        { name: '消息通知', value: 'sudoku' },
        { name: '短信通知', value: 'turntable' }
      ],
      activityType: '', //活动方式
      loading: false,
      imageUrl: ''
    };
  },
  methods: {
    radioChange(e) {
      this.radio = e.target.value;
    },
    changeDate(val) {
      console.log('val', val);
    },
    selectInform(value) {
      this.informType = value;
    },
    selectPrize(value) {
      this.prizeType = value;
    },
    selectActivity(value) {
      this.activityType = value;
    },
    stairBefore() {},
    stairChange() {},
    cancel() {
      this.$router.go(-1);
    },
    submit() {}
  }
};
</script>

<style lang="less" scoped>
.game-add {
  .game-add-title {
    width: 200px;
    height: 80px;
    text-align: center;
    line-height: 80px;
  }
  .game-add-content {
    .label-content {
      display: flex;
      margin-top: 20px;
      align-items: center;
    }
    .label-title {
      width: 200px;
      text-align: right;
      margin-right: 15px;
    }
    .game-imgupload {
      display: flex;
      text-align: center;
      .stair {
        margin-left: 15px;
      }
    }
    .choose-isActive {
      display: flex;
      margin-top: 20px;
    }
  }

  .game-button {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
