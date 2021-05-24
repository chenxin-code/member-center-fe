<template>
  <div class="game-turntable">
    <div class="game-container">
      <div class="game-cover">
        <img :src="activityGameClientRespVo.activityBackgroundUrl" />
      </div>
      <div class="game-layout">
        <div class="head-layout">
          <div class="head-lamp">
            <van-notice-bar
              color="#fff"
              scrollable
              :text="activityLotteryBroadcastVoList"
            />
          </div>
        </div>
        <div class="luck-layout">
          <div class="luck-container">
            <div class="luck-cover">
              <!-- <img src="~@assets/images/turntable/img_dizuo_default@2x.png" /> -->
              <img :src="activityGameClientRespVo.msgUrl" />
            </div>
            <div class="luck-point">
              <img src="~@assets/images/turntable/img_point_default@2x.png" />
            </div>
            <div class="luck-content">
              <LuckyWheel
                class="LuckyWheel"
                ref="LuckyWheel"
                width="6.5rem"
                height="6.5rem"
                :default-config="defaultConfig"
                :prizes="prizes"
                :default-style="defaultStyle"
                :blocks="blocks"
                :buttons="buttons"
                @start="startCallBack"
                @end="endCallBack"
              />
            </div>
            <div class="luck-chance">
              <div class="chance-txt">
                剩余抽奖次数 {{ memberPlayActivityNum }}次
              </div>
              <div class="chance-btn" @click="onCheckRecord">
                <img
                  src="~@assets/images/turntable/button_req_default@2x.png"
                />
                <span>我的中奖记录</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="game-notice">
        <div class="notice-content">
          <div class="notice-title">活动说明：</div>
          <div
            class="notice-dic"
            v-html="activityGameClientRespVo.activityDesc"
          ></div>
        </div>
      </div>
    </div>
    <!-- 中奖弹窗 -->
    <times-lucky-dialog
      :showQR="showQR"
      :closeQRDel="closeQRDel"
      @closeQR="closeQR"
    >
      <template v-slot:header>
        <img
          class="img-bg"
          :src="activityGameClientRespVo.popFrameUrl"
          alt=""
        />
      </template>
      <template v-slot:content>
        <div class="lucky-layout lucky-prize-layout">
          <div class="item-head">
            {{ memberPlayActivityInfo.prizeName }}
          </div>
          <div class="item-content">
            <div class="item-prize">
              <img :src="memberPlayActivityInfo.prizeUrl" alt="" />
            </div>
          </div>
          <div class="item-footer" @click="closeQR">
            <img
              src="~@/assets/images/turntable/button_req_default@2x.png"
              alt=""
            />
            <span>我知道了</span>
          </div>
        </div>
      </template>
    </times-lucky-dialog>
    <!-- 中奖列表弹窗 -->
    <times-lucky-dialog :showQR="showRecord" @closeQR="closeQRecord">
      <template v-slot:header>
        <img
          class="img-bg"
          :src="activityGameClientRespVo.popFrameUrl"
          alt=""
        />
      </template>
      <template v-slot:content>
        <div class="lucky-layout">
          <div class="item-head">
            我的中奖记录
          </div>
          <div class="item-content">
            <div class="record-content" v-if="activityLotteryVoList.length > 0">
              <div
                class="record-item"
                v-for="(item, index) in activityLotteryVoList"
                :key="index"
              >
                <div class="item-level">
                  {{ item.prizeName }}
                </div>
                <div class="item-desc">
                  <div class="title">
                    {{ item.prizeDesc }}
                  </div>
                  <div class="date">
                    {{ item.partakeTime }}
                  </div>
                </div>
              </div>
            </div>
            <timesNoData
              fontColor="#fff"
              describe="还没有记录哦～"
              :defaultLogo="noDefaultImg"
              v-else
            ></timesNoData>
          </div>
          <div class="item-footer" @click="closeQRecord">
            <img
              src="~@/assets/images/turntable/button_req_default@2x.png"
              alt=""
            />
            <span>我知道了</span>
          </div>
        </div>
      </template>
    </times-lucky-dialog>
  </div>
</template>

<script>
import game from "@/api/request/apiAddress/game";
import LuckyWheel from "../commponet/vue-luck-draw/LuckyWheel";
// import { loadImageList } from "./hooks";
export default {
  name: "turntable",
  components: {
    LuckyWheel
  },
  data() {
    return {
      //大转盘主要逻辑
      prizes: [],
      defaultStyle: {
        fontColor: "#d64737",
        fontSize: "14px",
        lengthLimit: "90%"
        // background: "rgba(255, 255, 255, 0)"
      },
      blocks: [],
      buttons: [
        {
          radius: "35px",
          background: "none",
          imgs: [
            {
              src: require("@/assets/images/turntable/time_rool_default@2x.png"),
              width: 390 / 4 + "px",
              top: "-50px"
            }
          ],
          fonts: [
            {
              text: "点击\n抽奖",
              top: "-20px",
              fontSize: "16px",
              fontColor: "#fff",
              lineHeight: "20px"
            }
          ]
        }
      ],
      defaultConfig: { offsetDegree: 22.5 },
      //游戏主要逻辑
      startGame: false,
      noDefaultImg: require("@/assets/images/turntable/img_none_default@2x.png"),
      showRecord: false,
      showQR: false,
      closeQRDel: false,
      gameForm: {
        gameId: "", //1392070460994383873
        memberPhone: "" //15010833926
      },
      gameInfo: {},
      activityPrizeClientRespVoList: [],
      activityGameClientRespVo: {},
      activityLotteryBroadcastVoList: "",
      memberPlayActivityNum: 0,
      memberPlayActivityGameInfo: {
        msg: "",
        positionIndex: 3,
        prizeName: "",
        prizeType: 7
      },
      memberPlayActivityInfo: {},
      activityLotteryVoList: []
    };
  },
  created() {
    // this.gameForm.gameId = this.$route.query.gameId;
    // this.gameForm.memberPhone = this.$route.query.phone;
    // await this.getActiveInfo();
    // this.getDrawLotterBroadcastList();
    // this.getMemberPlayActivityNum();
    this.initEvent();
  },
  activated() {},
  computed: {
    query() {
      return this.$store.state.communal.query || {};
    }
  },
  methods: {
    //初始化函数
    async initEvent() {
      this.gameForm.gameId = this.$route.query.gameId;
      this.gameForm.memberPhone = this.$route.query.phone;
      await this.getActiveInfo();
      this.getDrawLotterBroadcastList();
      this.getMemberPlayActivityNum();
    },
    //活动信息
    getActiveInfo() {
      return new Promise((resolve, reject) => {
        const params = this.gameForm;
        game.getActivityInfo(params).then(async res => {
          console.log("gameInfo------->", res);
          if (res.code == 200) {
            const data = res.data;
            this.activityPrizeClientRespVoList =
              data.activityPrizeClientRespVoList;
            this.activityGameClientRespVo = data.activityGameClientRespVo;
            this.activityGameClientRespVo.activityDesc = this.$util.formatRichText(
              this.activityGameClientRespVo.activityDesc
            );
            this.$util.setDomTitle(this.activityGameClientRespVo.gameTitle);
            this.getPrizesList();
            // await loadImageList([
            //   this.activityGameClientRespVo.activityBackgroundUrl,
            //   this.activityGameClientRespVo.gameUrl,
            //   this.activityGameClientRespVo.popFrameUrl,
            //   this.activityGameClientRespVo.msgUrl
            // ]);
            resolve();
          } else {
            this.$toast(res.message);
            reject();
          }
        });
      });
    },
    //获取会员玩游戏剩余的次数
    getMemberPlayActivityNum() {
      const params = this.gameForm;
      game.getMemberPlayActivityNum(params).then(res => {
        console.log("getMemberPlayActivityNum------->", res);
        if (res.code == 200) {
          const data = res.data;
          this.memberPlayActivityNum = Number(data);
        } else {
          this.$toast(res.message);
        }
      });
    },
    //中奖滚动播报
    getDrawLotterBroadcastList() {
      const params = {
        ...this.gameForm,
        pageNum: 1,
        pageSize: 10
      };
      game.getDrawLotterBroadcastList(params).then(res => {
        console.log("getDrawLotterBroadcastList------->", res);
        if (res.code == 200) {
          const data = res.data;
          const activityLotteryBroadcastVoList =
            data.activityLotteryBroadcastVoList || [];
          const activityLotteryBroadcastVo = String(
            activityLotteryBroadcastVoList.map(item => {
              return item.lotteryPrizeDesc;
            })
          );
          if (activityLotteryBroadcastVo) {
            this.activityLotteryBroadcastVoList = `活动播报：${activityLotteryBroadcastVo}`;
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    //参加活动
    memberPlayActivityGame() {
      return new Promise((resolve, reject) => {
        const params = this.gameForm;
        game.memberPlayActivityGame(params).then(res => {
          console.log("memberPlayActivityGame------->", res);
          if (res.code == 200) {
            const data = res.data;
            this.memberPlayActivityGameInfo = data;
            resolve();
          } else {
            this.$toast(res.message);
            reject();
          }
        });
      });
    },
    //会员中奖结果列表
    getMemberDrawLotterList() {
      return new Promise((resolve, reject) => {
        const params = this.gameForm;
        game.getMemberDrawLotterList(params).then(res => {
          console.log("getMemberDrawLotterList------->", res, params);
          if (res.code == 200) {
            const data = res.data;
            this.activityLotteryVoList = data.activityLotteryVoList;
            resolve();
          } else {
            this.$toast(res.message);
            reject();
          }
        });
      });
    },
    //获取奖品列表
    getPrizesList() {
      const prizes = [];
      this.activityPrizeClientRespVoList.forEach((item, index) => {
        prizes.push({
          title: item.prizeName,
          // background: "rgba(255, 255, 255, 0)",
          fonts: [{ text: item.prizeName, top: "10%" }],
          imgs: [
            {
              src: item.prizeUrl,
              width: "30%",
              top: "35%"
            }
          ]
        });
      });
      this.prizes = prizes;
      this.blocks = [
        { padding: "20px" },
        {
          padding: "20px",
          imgs: [
            {
              src: this.activityGameClientRespVo.gameUrl,
              width: "100%",
              rotate: true
            }
          ]
        }
      ];
    },
    //开始点击抽奖
    startCallBack() {
      this.$util.delayBounceAction(500, async () => {
        if (this.startGame) return;
        this.startGame = true;
        await this.memberPlayActivityGame();
        this.$refs.LuckyWheel.play();
        this.getMemberPlayActivityNum();
        const memberPlayActivityNum = this.memberPlayActivityNum;
        //判断是否还有抽奖机会
        if (memberPlayActivityNum == 0) {
          this.$toast("暂无抽奖机会");
          return;
        }
        const prizeType = this.memberPlayActivityGameInfo.prizeType;
        const positionIndex = this.activityPrizeClientRespVoList.findIndex(
          item => {
            return item.prizeType == prizeType;
          }
        );
        //获取哪个可以抽奖
        this.memberPlayActivityInfo = this.activityPrizeClientRespVoList[
          positionIndex
        ];
        if (prizeType == 7) {
          this.memberPlayActivityInfo = {
            ...this.memberPlayActivityInfo,
            prizeName: `哎呀！差一丢丢换个姿势再接再厉吧`,
            prizeUrl: this.noDefaultImg
          };
        } else {
          this.memberPlayActivityInfo = {
            ...this.memberPlayActivityInfo,
            prizeName: `恭喜您 获得 ${this.memberPlayActivityInfo.prizeName} 奖励`
          };
        }
        console.log("memberPlayActivityInfo--->", this.memberPlayActivityInfo);
        console.info("start");
        setTimeout(() => {
          console.log("抽奖索引--->", positionIndex);
          this.$refs.LuckyWheel.stop(positionIndex);
        }, 3000);
        setTimeout(() => {
          this.showQR = true;
          this.startGame = false;
        }, 6000);
      });
    },
    //结束抽奖
    endCallBack() {
      console.info("end>>>>>>>>>>>>>");
    },
    //打开抽奖记录
    async onCheckRecord() {
      await this.getMemberDrawLotterList();
      this.showRecord = true;
    },
    //关闭中奖弹窗
    closeQR() {
      this.showQR = false;
    },
    //关闭抽奖记录弹出
    closeQRecord() {
      this.showRecord = false;
    }
  }
};
</script>

<style lang="less" scoped>
.game-turntable {
  background-color: #ffac70;
  min-height: 100vh;
}
.game-container {
  position: relative;
  .game-cover {
    position: absolute;
    img {
      max-width: 100%;
      display: block;
      border: none;
    }
  }
  .game-layout {
    padding-top: 125px;
    padding-bottom: 60px;
    .head-layout {
      margin: 0 20px;
      .head-lamp > .van-notice-bar {
        border-radius: 20px;
        height: 67px/2;
        background-color: #692825;
      }
    }
  }
  .luck-layout {
    position: relative;
    margin-top: 15px;
    .luck-container {
      position: relative;
      .luck-point {
        position: absolute;
        top: -0.1rem;
        z-index: 2;
        margin: auto;
        left: 0;
        right: 0;
        width: 209px/2;
        img {
          display: block;
          width: 209px/2;
          height: 57px/2;
        }
      }
      .luck-cover {
        position: absolute;
        top: -0.6rem;
        img {
          width: 100%;
        }
      }
      .luck-chance {
        position: relative;
        text-align: center;
        .chance-txt {
          text-align: center;
          margin: auto;
          margin-top: 12px;
          font-size: 30px/2;
          font-family: PingFang SC;
          font-weight: 600;
          color: #f7494f;
          line-height: 28px/2;
        }
        .chance-btn {
          text-align: center;
          margin: auto;
          width: 308px/2;
          position: relative;
          margin-top: 15px;
          img {
            position: absolute;
            display: block;
            width: 308px/2;
            height: 85px/2;
          }
          span {
            display: block;
            height: 29px/2;
            font-size: 30px/2;
            font-family: PingFang SC;
            font-weight: 600;
            color: #8d2108;
            position: relative;
            line-height: 35px;
          }
        }
      }
    }
  }
  .luck-content {
    padding-top: 3px;
    .LuckyWheel {
      margin: auto;
    }
  }
  .game-notice {
    position: relative;
    .notice-content {
      margin: auto;
      padding: 12px;
      width: 658px/2;
      background: #ff757940;
      border-radius: 20px/2;
      .notice-title {
        margin-bottom: 12px;
      }
      .notice-dic {
        color: #fff;
      }
    }
  }
}
</style>

<style lang="less" scoped>
///弹窗样式
.lucky-layout {
  padding: 20px 12px;
  text-align: center;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item-head {
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #fffcee;
    line-height: 24px;
  }
  .item-content {
    .item-prize {
      margin-top: 12px;
      img {
        display: block;
        width: 145px;
        margin: auto;
      }
    }
  }
  .item-footer {
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 141px;
      height: 53px;
      margin: auto;
    }
    span {
      position: relative;
      line-height: 50px;
      font-weight: bold;
      color: #8d2108;
    }
  }
  //抽奖记录
  .record-content {
    position: relative;
    margin: 12px 5px;
    padding: 20px;
    height: 240px;
    box-sizing: border-box;
    border-radius: 3px;
    background-color: #fff;
    overflow: auto;
    .record-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .item-level {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #f7334d;
        line-height: 18px;
        margin-right: 21px;
      }
      .item-desc {
        text-align: left;
        .title {
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #121212;
          line-height: 18px;
        }
        .date {
          font-size: 10px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
