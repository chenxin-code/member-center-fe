<template>
  <div class="game-add">
    <div class="game-add-title">新建游戏</div>
    <div class="game-add-content">
      <div class="label-content">
        <div class="label-title" style="margin: 0">游戏主题</div>
        <timesInput v-model="gameTitle"></timesInput>
      </div>

      <div class="choose-isActive">
        <div class="label-title">是否可用</div>
        <a-radio-group v-model="availableFlage" @change="radioChange">
          <a-radio :value="1">
            启用
          </a-radio>
          <a-radio :value="0">
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
        <timesInput v-model="partakeNum"></timesInput>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">每人可参与次数</div>
        <timesInput v-model="luckyDrawLimits"></timesInput>
      </div>

      <div class="label-content">
        <div class="label-title">活动说明</div>
        <a-textarea
          v-model="activityDesc"
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
        <timesSelect
          :optionObj="prizeOption"
          @select-option="selectPrize"
          placeholder="请选择开奖方式"
        ></timesSelect>
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
              accept="image/jpeg,image/jpg,image/png"
              list-type="picture-card"
              :before-upload="() => false"
              :remove="handleImgRemoveBg"
              @preview="handlePreview"
              @change="uploadBg"
              v-decorator="[
                'activityCover',
                { initialValue: activityCover, rules: [{ required: true, message: '图片不能为空' }] }
              ]"
            >
              <template v-if="!activityBackgroundUrl">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
              <!-- <template v-else>
                <img :src="activityBackgroundUrl" alt="" style="width: 80px;height: 80px;" />
              </template> -->
            </a-upload>
          </div>

          <div class="stair">
            <div style="margin-bottom: 15px;">消息层背景</div>
            <a-upload
              name="avatar"
              accept="image/jpeg,image/jpg,image/png"
              list-type="picture-card"
              :before-upload="() => false"
              :remove="handleImgRemoveMessage"
              @preview="handlePreview"
              @change="uploadMessage"
              v-decorator="[
                'activityCover',
                { initialValue: activityCover, rules: [{ required: true, message: '图片不能为空' }] }
              ]"
            >
              <template v-if="!msgUrl">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
            </a-upload>
          </div>

          <div class="stair">
            <div style="margin-bottom: 15px;">游戏层背景</div>
            <a-upload
              name="avatar"
              accept="image/jpeg,image/jpg,image/png"
              list-type="picture-card"
              :before-upload="() => false"
              :remove="handleImgRemoveGame"
              @preview="handlePreview"
              @change="uploadGame"
              v-decorator="[
                'activityCover',
                { initialValue: activityCover, rules: [{ required: true, message: '图片不能为空' }] }
              ]"
            >
              <template v-if="!gameUrl">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
            </a-upload>
          </div>

          <div class="stair">
            <div style="margin-bottom: 15px;">弹框背景</div>
            <a-upload
              name="avatar"
              accept="image/jpeg,image/jpg,image/png"
              list-type="picture-card"
              :before-upload="() => false"
              :remove="handleImgRemoveAlert"
              @preview="handlePreview"
              @change="uploadAlert"
              v-decorator="[
                'activityCover',
                { initialValue: activityCover, rules: [{ required: true, message: '图片不能为空' }] }
              ]"
            >
              <template v-if="!popFrameUrl">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
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
import { getFormatDate } from '@/utils/util';
import { GANE_SAVE_GAME } from '@/api/game';
import { updateImage } from '@/api/member';
import timesInput from './component/form-input';
import timesSelect from './component/form-select';
export default {
  components: {
    timesInput,
    timesSelect
  },
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      picUploading: false,
      activityCover: '',

      gameTitle: '',
      availableFlage: 1,
      validityStartTime: '', // 活动结束时间
      validityEndTime: '', //活动开始时间
      partakeNum: '', // 参与人数
      luckyDrawLimits: '', //每人可参与次数
      activityDesc: '', //活动说明
      noticeType: '', // 通知方式
      lotteryType: '', // 开奖方式
      activityType: '', // 活动方式
      msgUrl: '', //消息层底图
      activityBackgroundUrl: '', //上传抽奖活动背景
      gameUrl: '', // 游戏层底图
      popFrameUrl: '', // 弹窗背景Url

      gamePeopleNum: '',
      gamePeopleTimes: '',
      gameExplain: '',
      informOption: [{ name: '消息推送', value: 1 }],
      informType: '', //通知方式
      // activityOption
      // prizeOption
      activityOption: [
        { name: '幸运转盘', value: 1 },
        { name: '砸金蛋', value: 2 },
        { name: '九宫格', value: 3 },
      ],
      prizeType: '', //开奖方式
      prizeOption: [
        { name: '立即开奖', value: 1 },
        { name: '非立即开奖', value: 2 }
      ],
      loading: false,
      imageUrl: ''
    };
  },
  methods: {
    radioChange(e) {
      this.availableFlage = e.target.value;
    },
    // 日期选择
    changeDate(val) {
      this.validityStartTime = getFormatDate(val[0]._d, 'yyyy-mm-dd MM:mm:ss');
      this.validityEndTime = getFormatDate(val[1]._d, 'yyyy-mm-dd MM:mm:ss');
    },
    selectInform(value) {
      this.noticeType = value;
    },
    selectPrize(value) {
      this.lotteryType = value;
    },
    selectActivity(value) {
      this.activityType = value;
    },
    stairBefore(info) {
      console.log('>>>stairBefore>>>', info);
    },
    handleImgRemoveBg() {
      this.activityBackgroundUrl = '';
    },
    handleImgRemoveMessage() {
      this.msgUrl = '';
    },
    handleImgRemoveGame() {
      this.gameUrl = '';
    },
    handleImgRemoveAlert() {
      this.popFrameUrl = '';
    },
    // 上传背景图片
    uploadBg({ fileList = [] } = {}) {
      this.addPic(fileList, 'activityBackgroundUrl');
    },
    // 上传消息背景图片
    uploadMessage({ fileList = [] } = {}) {
      this.addPic(fileList, 'msgUrl');
    },
    // 上传游戏层背景图片
    uploadGame({ fileList = [] } = {}) {
      this.addPic(fileList, 'gameUrl');
    },
    // 上传弹框背景图片
    uploadAlert({ fileList = [] } = {}) {
      this.addPic(fileList, 'popFrameUrl');
    },
    addPic(fileList, flag) {
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
                this[flag] = res.data;
              }
            });
        }
      }
    },
    handlePreview(file) {
      console.log('>>stairPreview>>>', file);
    },
    cancel() {
      this.$router.go(-1);
    },
    submit() {
      let params = {
        gameTitle: this.gameTitle,
        availableFlage: this.availableFlage,
        validityStartTime: this.validityStartTime,
        validityEndTime: this.validityEndTime,
        partakeNum: this.partakeNum,
        luckyDrawLimits: this.luckyDrawLimits,
        activityDesc: this.activityDesc,
        noticeType: this.noticeType,
        lotteryType: this.lotteryType,
        activityType: this.activityType,
        activityBackgroundUrl: this.activityBackgroundUrl,
        popFrameUrl: this.popFrameUrl,
        gameUrl: this.gameUrl,
        msgUrl: this.msgUrl
      };
      console.log('>>>>>>>>>', params);
      GANE_SAVE_GAME(params).then(res => {
        if (res.code == 200) {
          console.log('res', res);
        }
      });
    }
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
