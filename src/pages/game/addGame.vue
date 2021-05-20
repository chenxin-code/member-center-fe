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
        <timesInput v-model="partakeNum" type="number"></timesInput>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">每人可参与次数</div>
        <timesInput v-model="luckyDrawLimits" type="number"></timesInput>
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
        <timesSelect
          :optionObj="informOption"
          @select-option="selectInform"
          defaultValue="消息通知"
          placeholder="请选择通知方式"
        ></timesSelect>
      </div>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">开奖方式</div>
        <timesSelect
          :optionObj="prizeOption"
          @select-option="selectPrize"
          :defaultValue="prizeDict[lotteryType]"
          placeholder="请选择开奖方式"
        ></timesSelect>
      </div>

      <template v-if="lotteryType == 2">
        <div class="label-content">
          <div class="label-title">开奖时间</div>
          <a-date-picker @change="openPrize" />
        </div>
        <div class="label-content">
          <div class="label-title" style="margin: 0;">开奖人数</div>
          <timesInput v-model="drawLotteryNum" type="number"></timesInput>
        </div>
      </template>

      <div class="label-content">
        <div class="label-title" style="margin: 0;">活动方式</div>
        <timesSelect
          :optionObj="activityOption"
          @select-option="selectActivity"
          placeholder="请选择活动方式"
          :defaultValue="activityDict[activityType]"
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
              :default-file-list="fileBgList"
            >
              <template v-if="!activityBackgroundUrl && !fileBgList.length">
                <a-icon :type="picUploading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </template>
            </a-upload>
          </div>

          <div class="stair" v-if="activityType != 2">
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

          <div class="stair" v-if="activityType != 2">
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
        <a-button @click="verify" style="width: 150px;margin-left: 10px" type="primary">确定</a-button>
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
      fileBgList: [],
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
      drawLotteryTime: '', // 开奖时间
      drawLotteryNum: '', // 开奖人数

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
        { name: '九宫格', value: 3 }
      ],
      activityDict: {
        1: '幸运转盘',
        2: '砸金蛋',
        3: '九宫格'
      },
      prizeType: '', //开奖方式
      prizeOption: [
        { name: '立即开奖', value: 1 },
        { name: '非立即开奖', value: 2 }
      ],
      prizeDict: {
        1: '立即开奖',
        2: '非立即开奖'
      },
      loading: false,
      imageUrl: '',
      paramsPage: {}
    };
  },
  created() {
    this.paramsPage = this.$route.query;
    console.log('--------', this.paramsPage);
    this.gameTitle = this.paramsPage.gameTitle;
    this.availableFlage = this.paramsPage.availableFlage;
    this.partakeNum = this.paramsPage.partakeNum;
    this.luckyDrawLimits = this.paramsPage.luckyDrawLimits;
    this.activityDesc = this.paramsPage.activityDesc;
    this.noticeType = this.paramsPage.noticeType;
    this.lotteryType = this.paramsPage.lotteryType;
    this.activityType = this.paramsPage.activityType;
    this.fileBgList = [
      {
        uid: '-1',
        status: 'done',
        url: this.paramsPage.activityBackgroundUrl,
        thumbUrl: this.paramsPage.activityBackgroundUrl
      }
    ];
  },
  methods: {
    radioChange(e) {
      this.availableFlage = e.target.value;
    },
    // 开奖时间
    openPrize(val) {
      this.drawLotteryTime = getFormatDate(val._d, 'yyyy-mm-dd MM:mm:ss');
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
    handleImgRemoveBg() {
      this.fileBgList = [];
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
    verify() {
      let {
        gameTitle,
        validityStartTime, //活动开始时间
        validityEndTime, // 活动结束时间
        partakeNum, // 参与人数
        luckyDrawLimits, // 每人可参与次数
        activityDesc, //activityDesc
        noticeType, //通知方式
        lotteryType, //开奖方式
        activityType, // 活动方式
        activityBackgroundUrl, // 背景图片
        msgUrl, // 消息层背景
        gameUrl, //游戏层背景
        popFrameUrl, //弹框图片url
        drawLotteryTime, //开奖时间
        drawLotteryNum //开奖人数
      } = this;
      let messageText = '';
      let flag = false;
      if (!gameTitle) {
        messageText = '游戏主题不能为空';
        flag = true;
      } else if (!validityStartTime || !validityEndTime) {
        messageText = '请选择活动时间';
        flag = true;
      } else if (!partakeNum) {
        messageText = '请输入参与人数';
        flag = true;
      } else if (!luckyDrawLimits) {
        messageText = '请输入每人可参与次数';
        flag = true;
      } else if (!activityDesc) {
        messageText = '请输入活动说明';
        flag = true;
      } else if (!noticeType) {
        messageText = '请选择通知方式';
        flag = true;
      } else if (!lotteryType) {
        messageText = '请选择开奖方式';
        flag = true;
      } else if (!activityType) {
        flag = true;
        messageText = '请选择活动方式';
      } else if (lotteryType == 2) {
        if (!drawLotteryTime) {
          flag = true;
          messageText = '非立即开奖请选择开奖时间';
        } else if (!drawLotteryNum) {
          flag = true;
          messageText = '请选择开奖人数';
        }
      } else if (!activityBackgroundUrl) {
        messageText = '请上传背景图片';
        flag = true;
      } else if (this.activityType == 3 && !msgUrl) {
        flag = true;
        messageText = '请上传消息层背景';
      } else if (this.activityType == 1 && !gameUrl) {
        flag = true;
        messageText = '请上传游戏层背景';
      } else if (!popFrameUrl) {
        flag = true;
        messageText = '请上传弹框图片';
      }
      if (flag) {
        this.$message.error(messageText);
      } else {
        this.submit();
      }
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
      if (this.lotteryType == 2) {
        params.drawLotteryNum = this.drawLotteryNum;
        params.drawLotteryTime = this.drawLotteryTime;
      }
      if (this.paramsPage.update) {
        params.id = this.paramsPage.id;
      }
      console.log('>>>>>>>>>', params);
      GANE_SAVE_GAME(params).then(res => {
        if (res.code == 200) {
          console.log('res', res);
          this.$router.push({
            path: '/gameManage'
          });
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
