<template>
  <div
    class="sudoku-main"
    :style="{ backgroundImage: `url(${activityBackgroundUrl})` }"
  >
    <div class="sudoku-message" :style="{ backgroundImage: `url(${msgUrl})` }">
      <div class="sudoku-header-flex">
        <div class="sudoku-header-notice">
          <van-notice-bar
            style="height: 34px;line-height: 34px;"
            color="#ffffff"
            background="#4e1293"
            text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
          />
        </div>
      </div>
      <div
        class="sudoku-content-border"
        :style="{ backgroundImage: `url(${gameUrl})` }"
      >
        <div class="sudoku-content-game">
          <LuckyGrid
            ref="LuckDraw"
            width="300px"
            height="300px"
            :prizes="prizes"
            :buttons="buttons"
            :blocks="blocks"
            :default-config="defaultConfig"
            :default-style="defaultStyle"
            :active-style="activeStyle"
            @start="startCallBack"
            @end="endCallBack"
          />
        </div>
      </div>
      <div class="prize-history" @click="onCheckRecord">
        我的中奖记录
      </div>
    </div>

    <div class="sudoku-game-notice">
      <div class="sudoku-notice-content">
        <div class="sudoku-notice-title">活动说明：</div>
        <div class="sudoku-notice-text">
          <div class="text">
            {{ gameInfo.activityGameClientRespVo.activityDesc }}
          </div>
        </div>
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <times-lucky-dialog
      :showQR="showPrizeDialog"
      @closeQR="showPrizeDialog = false"
    >
      <template v-slot:header>
        <img class="img-bg" :src="popFrameUrl" alt="" />
      </template>
      <!-- memberPlayActivityGameInfo.prizeType == 7 当状态为7的时候，谢谢惠顾 -->
      <template v-slot:content>
        <div
          class="sudoku-popFrame"
          v-if="memberPlayActivityGameInfo.prizeType == 7"
        >
          <div class="text">哎呀！差一丢丢 换个姿势再接再厉吧</div>
          <img src="../../assets/images/record/nodata.png" />
          <div class="sudoku-popFrame-bottom" @click="showPrizeDialog = false">
            我知道了
          </div>
        </div>

        <div
          class="sudoku-popFrame"
          v-if="memberPlayActivityGameInfo.prizeType != 7"
        >
          <div class="text">
            恭喜您 获得 {{ memberPlayActivityGameInfo.prizeName }} 奖励
          </div>
          <img :src="memberPlayActivityGameInfo.prizeUrl" />
          <div class="sudoku-popFrame-bottom" @click="showPrizeDialog = false">
            我知道了
          </div>
        </div>
      </template>
    </times-lucky-dialog>

    <!-- 我的中奖记录 -->
    <times-lucky-dialog :showQR="showRecord" @closeQR="closeQRecord">
      <template v-slot:header>
        <img class="img-bg" :src="popFrameUrl" alt="" />
      </template>
      <template v-slot:content>
        <div class="lucky-layout">
          <div class="item-head">
            我的中奖记录
          </div>
          <div class="item-content">
            <div class="record-content">
              <div class="record-item">
                <div class="item-level">
                  一等奖
                </div>
                <div class="item-desc">
                  <div class="title">
                    奖品名称
                  </div>
                  <div class="date">
                    2020-20-20 19:20
                  </div>
                </div>
              </div>
            </div>
            <!-- <timesNoData></timesNoData> -->
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
import LuckyGrid from "../commponet/vue-luck-draw/LuckyGrid";
import game from "@/api/request/apiAddress/game";

export default {
  components: {
    LuckyGrid
  },
  data() {
    return {
      // dialog 弹框
      showRecord: false,
      showQR: false,
      closeQRDel: false,
      showPrizeDialog: false, // 奖品弹框

      gameForm: {
        gameId: "1394942967537999874",
        memberPhone: "13636363636"
      },
      memberPlayActivityGameInfo: {}, // 获奖信息
      times: 0, // 剩余游戏次数
      gameInfo: {},
      prizeListData: [],
      activityBackgroundUrl: "",
      msgUrl: "",
      gameUrl: "",
      popFrameUrl: "",
      luckyNum: 0, // 抽奖次数
      prizes: [], // 奖品类型
      blocks: [
        { padding: "0px", background: "#5d2b96", borderRadius: 28 },
        { padding: "4px", background: "#5d2b96", borderRadius: 23 },
        { padding: "4px", background: "#5d2b96", borderRadius: 20 }
      ],
      defaultConfig: {
        gutter: 5
      },
      defaultStyle: {
        borderRadius: 15,
        fontColor: "#6C4EC2",
        fontSize: "14px",
        textAlign: "center",
        background: "#fff",
        shadow: "0 0 1 #5d2b96"
      },
      activeStyle: {
        background: "linear-gradient(270deg, #FFDCB8, #FDC689)",
        shadow: ""
      }
    };
  },
  created() {
    this.getActiveInfo();
  },
  computed: {
    buttons() {
      return [
        {
          x: 1,
          y: 1,
          background: "#FD932C",
          fonts: [
            {
              text: "立即抽奖",
              fontColor: "#fff",
              top: "10%",
              fontSize: "30px"
            }
          ],
          imgs: [
            {
              width: "65%",
              top: "13%"
            }
          ]
        }
      ];
    }
  },
  mounted() {
    this.getPrizeList();
  },
  methods: {
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
    },
    // 中奖滚动播报
    getPrizelist() {
      game.getDrawLotterBroadcastList();
    },
    // 游戏活动详情
    getActiveInfo() {
      const params = this.gameForm;
      game.getActivityInfo(params).then(({ code, data, message }) => {
        console.log("gameInfo------->", data);
        if (code == 200) {
          this.gameInfo = data;
          this.activityBackgroundUrl =
            data.activityGameClientRespVo.activityBackgroundUrl;
          this.msgUrl = data.activityGameClientRespVo.msgUrl;
          this.gameUrl = data.activityGameClientRespVo.gameUrl;
          this.popFrameUrl = data.activityGameClientRespVo.popFrameUrl;
          this.gameInfo.activityPrizeClientRespVoList.forEach(item => {
            this.prizeListData.push({
              img: item.prizeUrl,
              name: item.prizeName
            });
          });
          const prizes = [];
          this.luckyNum = 1;
          let axis = [
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
            [2, 2],
            [1, 2],
            [0, 2],
            [0, 1]
          ];
          for (let i = 0; i < 8; i++) {
            let item = this.prizeListData[i];
            prizes.push({
              index: i,
              x: axis[i][0],
              y: axis[i][1],
              fonts: [{ text: item.name, top: "60%" }],
              imgs: [{ src: item.img, width: "55%", top: "8%" }],
              shadow: "0 10 1 #D2C2FF"
            });
          }
          this.prizes = prizes;
        } else {
          this.$toast(message);
        }
      });
    },
    getPrizeList() {
      // 模拟接口请求奖品列表
      setTimeout(() => {
        const prizes = [];
        this.luckyNum = 1;
        let axis = [
          [0, 0],
          [1, 0],
          [2, 0],
          [2, 1],
          [2, 2],
          [1, 2],
          [0, 2],
          [0, 1]
        ];
        for (let i = 0; i < 8; i++) {
          let item = this.prizeListData[i];
          prizes.push({
            index: i,
            x: axis[i][0],
            y: axis[i][1],
            fonts: [{ text: item.name, top: "70%" }],
            imgs: [{ src: item.img, width: "55%", top: "8%" }]
          });
        }
        this.prizes = prizes;
      }, 0);
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
    async startCallBack() {
      const activityNumRes = await game.getMemberPlayActivityNum(this.gameForm);
      this.times = activityNumRes.data;
      console.log("activityNumRes", activityNumRes);
      if (activityNumRes.data > 0) {
        await this.memberPlayActivityGame();
        this.$refs.LuckDraw.play();
        setTimeout(() => {
          this.$refs.LuckDraw.stop(
            this.memberPlayActivityGameInfo.positionIndex
          );
          // this.showPrizeDialog = true;
        }, 2000);
      }
    },
    endCallBack() {
      this.showPrizeDialog = true;
    }
  }
};
</script>

<style lang="less" scoped>
.sudoku-popFrame {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;

  height: 100%;
  img {
    width: 88px;
    height: 88px;
  }
  .text {
    width: 143px;
    height: 40px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #fff1c1;
  }
  .sudoku-popFrame-bottom {
    width: 132px;
    height: 43px;
    background: linear-gradient(0deg, #ffac1b 0%, #ffdc50 100%);
    box-shadow: 0px -3px 18px 0px rgba(255, 218, 78, 0.68);
    border-radius: 43px;
    text-align: center;
    line-height: 43px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #8d2108;
  }
}
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
.sudoku-main {
  width: 375px;
  height: 800px;
  background-size: 375px 100vh;
  display: flex;
  flex-direction: column;
  .sudoku-message {
    width: 351px;
    height: 462px;
    margin: 124px 0 0 12px;
    background-size: 351px 462px;
    .sudoku-header-flex {
      display: flex;
      justify-content: center;
      .sudoku-header-notice {
        position: absolute;
        width: 237px;
        height: 34px;
        background: #4e1293;
        border-radius: 17px;
        margin-top: 15px;
        .van-notice-bar {
          border-radius: 20px;
          height: 34px;
        }
      }
    }
  }
  .sudoku-game-notice {
    width: 350px;
    background: #efe9ff;
    border-radius: 10px;
    margin: auto;
    .sudoku-notice-content {
      padding: 15px 0;
      .sudoku-notice-title {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #5a1ca1;
        padding: 0 18px;
      }
      .sudoku-notice-text {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #5610a6;
        margin-left: 15px;
        .text {
          margin-top: 5px;
        }
      }
    }
  }
  .sudoku-content-border {
    width: 330px;
    height: 342px;
    margin: 60px 10px;
    background-size: 330px 342px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .sudoku-content-game {
    }
  }
  .prize-history {
    width: 153px;
    height: 38px;
    background: #5610a6;
    border: px solid #8237d7;
    border-radius: 14px;
    line-height: 38px;
    text-align: center;
    color: #ffffff;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    top: -50px;
    cursor: pointer;
  }
}
</style>
