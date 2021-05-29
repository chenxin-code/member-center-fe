<template>
  <div class="game-add">
    <div class="game-add-title">
      <div style="margin-left: 30px">新建游戏</div>
      <div class="page-back" @click="pageBack">返回</div>
    </div>
    <div class="game-add-content">
      <a-form :form="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" @submit="verify">
        <a-form-item label="游戏主题">
          <a-input
            v-decorator="[
              'gameTitle',
              { initialValue: gameTitle, rules: [{ required: true, message: '请输入游戏名称' }] }
            ]"
            @change="gameNameInput"
          />
        </a-form-item>

        <a-form-item label="是否启用">
          <a-radio-group v-model="availableFlage" @change="radioChange" default-value="1">
            <a-radio :value="1">
              启用
            </a-radio>
            <a-radio :value="0">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="有效期">
          <a-range-picker
            v-decorator="[
              'rangeDate',
              {
                initialValue: rangeDate,
                rules: [{ type: 'array', required: true, message: '活动有效期不能为空, 请选择日期!' }]
              }
            ]"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            @change="changeDate"
            :disabled-date="disabledDate"
          />
        </a-form-item>
        <a-form-item label="参与人数">
          <a-input-number
            style="width: 400px"
            :min="1"
            v-decorator="[
              'partakeNum',
              {
                initialValue: partakeNum,
                rules: [{ required: true, message: '请输入参与人数' }]
              }
            ]"
            @change="takePartInput"
          />
        </a-form-item>
        <a-form-item label="每人可参与次数">
          <a-input-number
            style="width: 400px"
            :min="1"
            v-decorator="[
              'luckyDrawLimits',
              { initialValue: luckyDrawLimits, rules: [{ required: true, message: '请输入每人可参与次数' }] }
            ]"
            @change="luckyDrawLimitsInput"
          />
        </a-form-item>

        <a-form-item label="活动说明">
          <!-- <a-textarea
            v-model="activityDesc"
            placeholder="请输入内容"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            style="width: 400px;"
          /> -->
          <editorComponent
            :contenteditable="true"
            :value="activityDesc"
            :index="0"
            :is-show-num="true"
            content-height="200px"
            editor-width="100%"
            :max-num="2000"
            :filter-text="true"
            @changeValue="changeValue"
            @isBeyond="isBeyond"
          ></editorComponent>
        </a-form-item>

        <a-form-item label="通知方式">
          <a-select default-value="1">
            <a-select-option value="1">
              短信推送
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开奖方式">
          <a-select :default-value="prizeDict[lotteryType]" @change="selectPrize">
            <a-select-option :value="item.value" v-for="(item, index) in prizeOption" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="活动方式" v-if="lotteryType == 1">
          <a-select :default-value="activityDict[activityType]" @change="selectActivity">
            <a-select-option :value="item.value" v-for="(item, index) in activityOption" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开奖时间" v-if="lotteryType == 2">
          <a-date-picker
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            @change="openPrize"
            :disabled-date="disabledDate"
            v-decorator="[
              'drawLotteryTime',
              {
                initialValue: drawLotteryTime
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="开奖人数" v-if="lotteryType == 2">
          <a-input-number
            :min="1"
            v-decorator="[
              'drawLotteryNum',
              { initialValue: drawLotteryNum, rules: [{ required: true, message: '请输入开奖人数' }] }
            ]"
            @change="drawLotteryNumInput"
          />
        </a-form-item>

        <a-form-item label="上传抽奖素材">
          <a-input
            v-decorator="[
              'vaildUploadImg',
              { initialValue: vaildUploadImg, rules: [{ required: true, message: '请上传抽奖素材' }] }
            ]"
            type="hidden"
            placeholder="Please input your name"
          />
          <div class="label-content" v-if="lotteryType == 1">
            <!-- <div class="label-title" style="margin: 0;">
              <span style="color: red">*</span>
              上传抽奖素材
            </div> -->
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
                  :defaultFileList="fileBgList"
                >
                  <template v-if="!activityBackgroundUrl && !fileBgList.length">
                    <a-icon :type="bgLoading ? 'loading' : 'plus'" />
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
                  :defaultFileList="fileMessageList"
                >
                  <template v-if="!msgUrl && !fileMessageList.length">
                    <a-icon :type="msgLoading ? 'loading' : 'plus'" />
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
                  :defaultFileList="fileGameList"
                >
                  <template v-if="!gameUrl && !fileGameList.length">
                    <a-icon :type="gameLoading ? 'loading' : 'plus'" />
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
                  :defaultFileList="fileAlertList"
                >
                  <template v-if="!popFrameUrl && !fileAlertList.length">
                    <a-icon :type="popLoading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </template>
                </a-upload>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-form>

      <div class="game-button">
        <a-button @click="cancel" style="width: 150px;margin-left: 20px;">取消</a-button>
        <a-button @click="verify" style="width: 150px;margin-left: 10px" type="primary">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { GANE_SAVE_GAME } from '@/api/game';
import { updateImage } from '@/api/member';
import editorComponent from '@/components/editor';
// import timesInput from './component/form-input';
// import timesSelect from './component/form-select';
export default {
  components: {
    editorComponent
    // timesInput
    // timesSelect
  },
  data() {
    return {
      addForm: this.$form.createForm(this),
      fileBgList: [],
      fileAlertList: [],
      fileMessageList: [],
      fileGameList: [],

      picUploading: false,
      activityCover: '',
      rangeDate: '',

      bgLoading: false,
      msgLoading: false,
      gameLoading: false,
      popLoading: false,

      gameTitle: '',
      availableFlage: 0,
      validityStartTime: '', // 活动结束时间
      validityEndTime: '', //活动开始时间
      partakeNum: '', // 参与人数
      luckyDrawLimits: '', //每人可参与次数
      activityDesc: '', //活动说明
      noticeType: '', // 通知方式
      lotteryType: 1, // 开奖方式
      activityType: 1, // 活动方式

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
      paramsPage: {},
      isBeyondStatus: '',
      vaildUploadImg: false
    };
  },
  created() {
    this.paramsPage = this.$route.query;
    if (this.paramsPage.activityType) {
      console.log('--------', this.paramsPage);
      this.gameTitle = this.paramsPage.gameTitle;
      this.availableFlage = this.paramsPage.availableFlage * 1;
      this.partakeNum = this.paramsPage.partakeNum;
      this.luckyDrawLimits = this.paramsPage.luckyDrawLimits;
      this.activityDesc = this.paramsPage.activityDesc;
      this.noticeType = this.paramsPage.noticeType;
      this.lotteryType = this.paramsPage.lotteryType;
      this.activityType = this.paramsPage.activityType;
      this.drawLotteryTime = this.paramsPage.drawLotteryTime;
      this.drawLotteryNum = this.paramsPage.drawLotteryNum;
      this.msgUrl = this.paramsPage.msgUrl;
      this.activityBackgroundUrl = this.paramsPage.activityBackgroundUrl;
      this.gameUrl = this.paramsPage.gameUrl;
      this.popFrameUrl = this.paramsPage.popFrameUrl;

      this.fileBgList = [
        {
          uid: '-1',
          status: 'done',
          url: this.paramsPage.activityBackgroundUrl,
          thumbUrl: this.paramsPage.activityBackgroundUrl
        }
      ];
      this.fileAlertList = [
        {
          uid: '-1',
          status: 'done',
          url: this.paramsPage.popFrameUrl,
          thumbUrl: this.paramsPage.popFrameUrl
        }
      ];
      this.fileMessageList = [
        {
          uid: '-1',
          status: 'done',
          url: this.paramsPage.msgUrl,
          thumbUrl: this.paramsPage.msgUrl
        }
      ];
      this.fileGameList = [
        {
          uid: '-1',
          status: 'done',
          url: this.paramsPage.gameUrl,
          thumbUrl: this.paramsPage.gameUrl
        }
      ];
    }

    this.rangeDate = [this.paramsPage.validityStartTime, this.paramsPage.validityEndTime];
    this.changeDate(this.rangeDate);
  },
  methods: {
    isBeyond(v) {
      this.isBeyondStatus = v;
    },
    changeValue(value) {
      this.activityDesc = value.content;
    },
    pageBack() {
      this.$router.go(-1);
    },
    ////////// 新建活动:end ///////////
    disabledDate(currentParam) {
      return currentParam && currentParam < Date.now() - 86400000;
    },
    gameNameInput(e) {
      this.gameTitle = e.target.value;
    },
    takePartInput(value) {
      this.partakeNum = value;
    },
    drawLotteryNumInput(value) {
      this.drawLotteryNum = value;
    },
    luckyDrawLimitsInput(value) {
      this.luckyDrawLimits = value;
    },
    handlePrizeType(val) {},

    radioChange(e) {
      this.availableFlage = e.target.value;
    },
    // 开奖时间
    openPrize(val) {
      this.drawLotteryTime = val;
      //this.drawLotteryTime = getFormatDate(val._d, 'yyyy-mm-dd MM:mm:ss');
    },
    // 日期选择
    changeDate(val) {
      this.validityStartTime = val[0];
      this.validityEndTime = val[1];
      console.log('this.validityEndTime', this.validityEndTime);
      // this.validityStartTime = getFormatDate(val[0]._d, 'yyyy-mm-dd MM:mm:ss');
      // this.validityEndTime = getFormatDate(val[1]._d, 'yyyy-mm-dd MM:mm:ss');
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
      this.fileMessageList = [];
      this.msgUrl = '';
    },
    handleImgRemoveGame() {
      this.fileGameList = [];
      this.gameUrl = '';
    },
    handleImgRemoveAlert() {
      this.fileAlertList = [];
      this.popFrameUrl = '';
    },
    // 上传背景图片
    uploadBg({ fileList = [] } = {}) {
      this.addPic(fileList, 'activityBackgroundUrl', 'bgLoading');
    },
    // 上传消息背景图片
    uploadMessage({ fileList = [] } = {}) {
      this.addPic(fileList, 'msgUrl', 'msgLoading');
    },
    // 上传游戏层背景图片
    uploadGame({ fileList = [] } = {}) {
      this.addPic(fileList, 'gameUrl', 'gameLoading');
    },
    // 上传弹框背景图片
    uploadAlert({ fileList = [] } = {}) {
      this.addPic(fileList, 'popFrameUrl', 'popLoading');
    },
    addPic(fileList, flag, target) {
      if (fileList.length > 0) {
        const isJpgOrPng = fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('图片格式错误，请重新上传');
        } else {
          this[target] = true;
          const formData = new FormData();
          fileList.forEach(file => {
            formData.append('file', file.originFileObj);
          });
          formData.append('programCode', 'sys-member-center');
          updateImage(formData)
            .finally(() => {
              this[target] = false;
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
    // 校验图片是否有上传
    verifyPic() {},
    // 校验表单数据
    verify() {
      this.addForm.validateFields((err, values) => {
        console.log('------lotteryType--------', this.lotteryType);
        if (!err) {
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
          } else if (!lotteryType) {
            messageText = '请选择开奖方式';
            flag = true;
          }
          //  else if (this.lotteryType == 1) {
          //   if (!activityType) {
          //     flag = true;
          //     messageText = '请选择活动方式';
          //   }
          // }
          else if (lotteryType == 2) {
            if (!drawLotteryTime) {
              flag = true;
              messageText = '非立即开奖请选择开奖时间';
            } else if (!drawLotteryNum) {
              flag = true;
              messageText = '请选择开奖人数';
            }
          } else if (this.lotteryType == 1) {
            if (!activityBackgroundUrl) {
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
          }
          if (flag) {
            this.$message.error(messageText);
            if (this.lotteryType == 1) {
              this.vaildUploadImg = false;
            }
          } else {
            this.vaildUploadImg = true;
            this.submit();
          }
        }
      });
    },
    submit() {
      // 提交
      // 业务规则1，当游戏选择幸运转盘，显示4层背景上传
      // 2，当游戏选择大转盘，隐藏游戏层背景
      // 3，当游戏选择砸金蛋，隐藏消息层和游戏层背景上传。
      // 4，当开奖方式为非实时开奖，则隐藏活动方式和活动素材区域，显示开奖时间和开奖人数
      // 5，当开奖方式为实时开奖，则展示活动方式和活动素材区域，隐藏开奖时间和开奖人数
      let params = {
        gameTitle: this.gameTitle,
        availableFlage: this.availableFlage,
        validityStartTime: this.validityStartTime,
        validityEndTime: this.validityEndTime.substr(0, 10) + ' 23:59:59',
        partakeNum: this.partakeNum,
        luckyDrawLimits: this.luckyDrawLimits,
        activityDesc: this.activityDesc,
        noticeType: 1,
        lotteryType: this.lotteryType,
        activityType: this.activityType,
        activityBackgroundUrl: this.activityBackgroundUrl,
        popFrameUrl: this.popFrameUrl,
        gameUrl: this.gameUrl,
        msgUrl: this.msgUrl
      };
      // 当开奖方式为非实时开奖，则隐藏活动方式和活动素材区域，显示开奖时间和开奖人数，并上送参数值
      if (this.lotteryType == 2) {
        params.drawLotteryNum = this.drawLotteryNum;
        params.drawLotteryTime = this.drawLotteryTime;
      } else {
        // 当开奖方式为实时开奖，则展示活动方式和活动素材区域，隐藏开奖时间和开奖人数
        params.gameUrl = this.gameUrl;
        params.msgUrl = this.msgUrl;
        params.popFrameUrl = this.popFrameUrl;
        params.activityBackgroundUrl = this.activityBackgroundUrl;
        params.activityType = this.activityType;
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
    height: 80px;
    text-align: center;
    line-height: 80px;
    display: flex;
    justify-content: space-between;
    .page-back {
      margin-right: 30px;
      color: #4b7afb;
      cursor: pointer;
    }
  }
  .game-add-content {
    .label-content {
      display: flex;
      // margin-top: 20px;
      // margin-left: 300px;
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
