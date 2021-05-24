<template>
  <div class="container">
    <div class="game-cover">
      <img :src="backgroundImg" />
    </div>
      <div class="tips">
        你还有
        <span class="count">{{ num }}</span>
        <!-- <span class="count">5</span> -->
        次砸蛋机会
      </div>
    <div class="navBar">
      <van-notice-bar
        class="navBarNotice"
        background="#8F0300"
        color="#FFF"
        scrollable
        :text="broadCastList"
      />
    </div>

    <div class="banner"></div>
    <div class="hammer" ref="hammer"></div>
    <div class="eggBox" ref="eggBox" @click="clickEgg">
      <div class="egg-first">
        <div class="top-one">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="top1"
            ref="top1"
          />
        </div>
        <div class="top-two">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="top2"
            ref="top2"
          />
        </div>
        <div class="top-three">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="top3"
            ref="top3"
          />
        </div>
      </div>

      <div class="egg-first">
        <div class="top-one">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="center1"
            ref="center1"
          />
        </div>
        <div class="top-two">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="center2"
            ref="center2"
          />
        </div>
        <div class="top-three">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="center3"
            ref="center3"
          />
        </div>
      </div>

      <div class="egg-first">
        <div class="top-one">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="bottom1"
            ref="bottom1"
          />
        </div>
        <div class="top-two">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="bottom2"
            ref="bottom2"
          />
        </div>
        <div class="top-three">
          <img
            src="~@assets/images/egg/egg.png"
            class="gold-egg"
            id="bottom3"
            ref="bottom3"
          />
        </div>
      </div>
    </div>

    <div class="eggBtn">
      <div class="getBtn" @click="closeQRecord">
        我的中奖记录
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <times-lucky-dialog
      :showQR="showDialog"
      :closeQRDel="closeQRDel"
      @closeQR="closeQR"
    >
      <template v-slot:header>
        <img class="img-bg" :src="tanchuangImg" alt="" />
      </template>
      <template v-slot:content>
        <div class="lucky-layout lucky-prize-layout">
          <div class="item-head" v-if="memberPlayActivityInfo.prizeType == 7">
            {{ memberPlayActivityInfo.thanksName }}
          </div>
          <div class="item-head" v-else>
            {{ memberPlayActivityInfo.prizeName }}
          </div>
          <div class="item-content">
            <div class="item-prize">
              <img
                v-if="memberPlayActivityInfo.prizeType == 7"
                :src="memberPlayActivityInfo.thanksUrl"
                alt=""
              />
              <img v-else :src="memberPlayActivityInfo.prizeUrl" alt="" />
            </div>
          </div>
          <div class="item-footer" @click="closeQR">
            <img src="~@/assets/images/egg/btnbg.png" alt="" />
            <span>我知道了</span>
          </div>
        </div>
      </template>
    </times-lucky-dialog>

    <!-- 中将记录弹窗 -->
    <times-lucky-dialog :showQR="showRecord" @closeQR="closeQRecord">
      <template v-slot:header>
        <img class="img-bg" :src="tanchuangImg" alt="" />
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
            <img src="~@/assets/images/egg/btnbg.png" alt="" />
            <span>我知道了</span>
          </div>
        </div>
      </template>
    </times-lucky-dialog>
    <div class="wordTip">
      <span>—&nbsp;活动说明&nbsp;—</span>
      <div>
        {{ activityDesc }}
        <!-- 1. 活动说明，发生了会如何，不发生又会如何。
        一般来讲，我们都必须务必慎重的考虑考虑。 <br />
        2. 那么， 我们不得不面对一个非常尴尬的事实，那就是，
        克劳斯·莫瑟爵士在不经意间这样说过。 -->
      </div>
    </div>
  </div>
</template>

<script>
import game from "@/api/request/apiAddress/game";

export default {
  components: {},
  props: {},
  data() {
    return {
      // broadCastList: "滚动播报：xxxxxxxx中一等奖，xxxxxx中二等奖",

      broadCastList: "",
      activityDesc: "",
      gameForm: {
        gameId: "1395294804834213890",
        memberPhone: ""
      },
      backgroundImg: require("@assets/images/egg/egg-bg.png"),
      tanchuangImg: require("@/assets/images/egg/egg-tanchuang.png"),
      closeQRDel: false,
      showDialog: false,
      showRecord: false,
      memberPlayActivityInfo: {
        prizeName: "",
        thanksName: "哎呀！差一丢丢换个姿势再接再厉吧",
        prizeUrl: "",
        thanksUrl: require("@/assets/images/turntable/img_none_default@2x.png"),
        prizeType: ""
      },
      num: "",
      wordInfo: "xxx中了一等奖！！",
      hitStyle: "",
      imgUrl: require("@assets/images/egg/breakEgg.png"),
      noDefaultImg: require("@/assets/images/turntable/img_none_default@2x.png"),
      breakEggList: [],
      activityLotteryVoList: [],
      eggIndex: {
        top1: {
          top: "3.4rem",
          left: "1rem"
        },
        top2: {
          top: "3.4rem",
          left: "3.1rem"
        },
        top3: {
          top: "3.4rem",
          left: "5.3rem"
        },
        center1: {
          top: "6rem",
          left: "1rem"
        },
        center2: {
          top: "6rem",
          left: "3.1rem"
        },
        center3: {
          top: "6rem",
          left: "5.3rem"
        },
        bottom1: {
          top: "8.6rem",
          left: "1rem"
        },
        bottom2: {
          top: "8.6rem",
          left: "3.1rem"
        },
        bottom3: {
          top: "8.6rem",
          left: "5.3rem"
        }
      }
    };
  },
  methods: {
    //活动信息
    getActiveInfo() {
      return new Promise((resolve, reject) => {
        const params = this.gameForm;
        game.getActivityInfo(params).then(async res => {
          console.log("gameInfo------->", res);
          if (res.code == 200) {
            this.backgroundImg =
              res.data.activityGameClientRespVo.activityBackgroundUrl;
            this.tanchuangImg = res.data.activityGameClientRespVo.popFrameUrl;
            this.activityDesc = res.data.activityGameClientRespVo.activityDesc;
            // const data = res.data;
            // this.activityPrizeClientRespVoList =
            //   data.activityPrizeClientRespVoList;
            // this.activityGameClientRespVo = data.activityGameClientRespVo;
            // this.activityGameClientRespVo.activityDesc = this.$util.formatRichText(
            //   this.activityGameClientRespVo.activityDesc
            // );
            // this.$util.setDomTitle(this.activityGameClientRespVo.gameTitle);
            // this.getPrizesList();
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
          let arr = res.data.activityLotteryBroadcastVoList;
          if (arr) {
            arr.map(item => {
              this.broadCastList += item.lotteryPrizeDesc + "，";
            });
          }
        } else {
          this.$toast(res.message);
        }
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

    //获取会员玩游戏剩余的次数
    getMemberPlayActivityNum() {
      const params = this.gameForm;
      game.getMemberPlayActivityNum(params).then(res => {
        console.log("getMemberPlayActivityNum------->", res);
        if (res.code == 200) {
          const data = res.data;
          this.num = Number(data);
        } else {
          this.$toast(res.message);
        }
      });
    },

    //点击参加活动
    memberPlayActivityGame() {
      return new Promise((resolve, reject) => {
        const params = this.gameForm;
        game.memberPlayActivityGame(params).then(res => {
          console.log("memberPlayActivityGame------->", res);
          if (res.code == 200) {
            const data = res.data;
            this.memberPlayActivityInfo.prizeName = `恭喜您 获得 ${data.prizeName} 奖励`;
            this.memberPlayActivityInfo.prizeType = data.prizeType;
            this.memberPlayActivityInfo.prizeUrl = data.prizeUrl
              ? data.prizeUrl
              : "https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1990989690.jpg";
            resolve();
          } else {
            this.$toast(res.message);
            reject();
          }
        });
      });
    },

    //打开抽奖记录
    async onCheckRecord() {
      await this.getMemberDrawLotterList();
      this.showRecord = true;
    },

    closeQRecord() {
      this.showRecord = this.showRecord ? false : true;
      if (this.showRecord == true) {
        this.onCheckRecord();
      }
    },

    closeQR() {
      this.showDialog = this.showDialog ? false : true;
      this.memberPlayActivityInfo.prizeType = "";
      this.memberPlayActivityInfo.prizeName = "";
      this.memberPlayActivityInfo.prizeUrl = "";

      // if (this.showDialog == false) {
      //   this.memberPlayActivityInfo.prizeName = "";
      //   this.memberPlayActivityInfo.prizeUrl = "";
      // }
    },

    clickEgg(e) {
      if (this.num == 0) {
        this.$toast("您的砸蛋次数已经用完啦！");
        return;
      }
      if (!this.breakedEgg(e.target.id)) {
        return;
      }
      this.changeImg(e.target);
      let hamerStyle = this.$refs.hammer.style;
      let eggIndex = this.eggIndex;
      this.getResult(e.target.id);
      switch (e.target.id) {
        case "top1":
          hamerStyle.top = eggIndex.top1.top;
          hamerStyle.left = eggIndex.top1.left;
          break;

        case "top2":
          hamerStyle.top = eggIndex.top2.top;
          hamerStyle.left = eggIndex.top2.left;
          break;

        case "top3":
          hamerStyle.top = eggIndex.top3.top;
          hamerStyle.left = eggIndex.top3.left;
          break;

        case "center1":
          hamerStyle.top = eggIndex.center1.top;
          hamerStyle.left = eggIndex.center1.left;
          break;

        case "center2":
          hamerStyle.top = eggIndex.center2.top;
          hamerStyle.left = eggIndex.center2.left;
          break;

        case "center3":
          hamerStyle.top = eggIndex.center3.top;
          hamerStyle.left = eggIndex.center3.left;
          break;

        case "bottom1":
          hamerStyle.top = eggIndex.bottom1.top;
          hamerStyle.left = eggIndex.bottom1.left;
          break;

        case "bottom2":
          hamerStyle.top = eggIndex.bottom2.top;
          hamerStyle.left = eggIndex.bottom2.left;
          break;

        case "bottom3":
          hamerStyle.top = eggIndex.bottom3.top;
          hamerStyle.left = eggIndex.bottom3.left;
          break;
      }
      this.$refs.hammer.classList.add("hit");
      let classList = this.$refs.hammer.classList;
      let that = this;
      setTimeout(function() {
        that.memberPlayActivityGame();
        classList.remove("hit");
        hamerStyle.display = "none";
        hamerStyle.left = "800px";
        that.showDialog = true;
        setTimeout(function() {
          hamerStyle.display = "block";
        }, 100);
      }, 2000);
    },

    changeImg(e) {
      //蛋蛋被砸后变为破蛋图片
      setTimeout(() => {
        this.num--;
        e.setAttribute("src", this.imgUrl);
      }, 1500);
    },

    breakedEgg(id) {
      // 判断这个蛋蛋是否被砸过
      if (!this.breakEggList.includes(id)) {
        this.breakEggList.push(id);
        return true;
      } else {
        this.$toast("这个蛋已经被你干碎了，换个蛋吧");
        return false;
      }
    },

    //砸蛋后提示中将还是谢谢惠顾弹窗数据
    getResult(id) {
      // if (id !== "center2") {
      //   this.memberPlayActivityInfo = {
      //     prizeName: `哎呀！差一丢丢换个姿势再接再厉吧`,
      //     prizeUrl: require("@/assets/images/turntable/img_none_default@2x.png")
      //   };
      // } else {
      //   this.memberPlayActivityInfo = {
      //     prizeName: `恭喜中奖！！！`,
      //     prizeUrl: require("@/assets/images/turntable/img_none_default@2x.png")
      //   };
      // }
    }
  },
  async created() {
    this.gameForm.gameId = this.$route.query.gameId;
    this.gameForm.memberPhone = this.$route.query.phone;
    this.getActiveInfo();
    this.getDrawLotterBroadcastList();
    this.getMemberPlayActivityNum();
  },
  computed: {
    query() {
      return this.$store.state.communal.query || {};
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes egg-move {
  50% {
    padding-top: 2px;
  }
  100% {
    padding-top: 0px;
  }
}

@-webkit-keyframes egg-move {
  50% {
    padding-top: 2px;
  }
  100% {
    padding-top: 0px;
  }
}

@keyframes hammer-move {
  100% {
    transform: rotate(-10deg);
  }
}

@-webkit-keyframes hammer-hit {
  50% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(-25deg);
  }
}
@-webkit-keyframes hammer-move {
  100% {
    transform: rotate(-10deg);
  }
}

@keyframes hammer-hit {
  50% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(-25deg);
  }
}

.container {
  position: relative;
  .hammer {
    position: absolute;
    left: 700px;
    top: 0;
    z-index: 5;
    width: 70px;
    height: 80px;
    background: url(~@assets/images/egg/hammer.png) no-repeat center;
    background-size: contain;
    transform-origin: right bottom;
    transition: 1s ease-in-out;
    &.hit {
      animation: hammer-hit 0.2s 1s alternate;
    }
  }
  .dialog {
    z-index: 9999;
  }
  .wordTip {
    text-align: center;
    font-size: 14px;
    color: #ffbb8d;
    position: absolute;
    width: 100%;
    margin-top: 75px;
    span {
      display: inline-block;
      width: 100px;
    }
    div {
      text-align: left;
      width: 310px;
      margin-top: 20px;
      margin-left: auto;
      margin-right: auto;
      font-size: 12px;
      color: #ffffff;
    }
  }
  .img-bg {
    height: 375px;
  }
  .eggBtn {
    height: 55px;
    width: 100%;
    // background-color: yellow;
    position: absolute;
    text-align: center;
    padding-top: 10px;
    .getBtn {
      display: inline-block;
      width: 180px;
      height: 52px;
      background: url(~@assets/images/egg/btnbg.png) no-repeat center;
      color: #8d2108;
      text-align: center;
      line-height: 45px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .navBar {
    position: absolute;
    top: 134px;
    width: 100%;
    left: 0;
    right: 0;
    height: 30px;
    text-align: center;
    opacity: 0.5;
    .navBarNotice {
      height: 20px;
      width: 240px;
      border-radius: 30px;
      margin: 0 auto;
    }
  }

    .tips {
      position: absolute;
      // left: 113px;
      width: 100%;
      text-align: center;
      top: 90px;
      margin-left: auto;
      margin-right: auto;
      font-size: 16px;
      color: #ffe1e1;
      .count {
        font-size: 28px;
        color: #ffcf28;
      }
    }

  .word-info {
    position: absolute;
    font-size: 12px;
    color: #ffffff;
  }
  .banner {
    height: 175px;
  }
  .game-cover {
    position: absolute;
    img {
      width: 100vw;
      display: block;
      border: none;
      //   margin-bottom: 200px;
    }
  }
  .eggBox {
    height: 365px;
    .egg-first {
      display: flex;
      width: 90%;
      margin: 0 auto;
      .top-one {
        position: relative;
        text-align: center;
        width: 33%;
        animation: egg-move 1.5s infinite;
        .gold-egg {
          width: 90%;
          display: block;
          margin: 0 auto;
        }
      }
      .top-two {
        position: relative;
        text-align: center;
        width: 33%;
        animation: egg-move 1.5s infinite alternate;
        .gold-egg {
          width: 90%;
          display: block;
          margin: 0 auto;
        }
      }
      .top-three {
        position: relative;
        text-align: center;
        width: 33%;
        animation: egg-move 1.5s infinite;
        .gold-egg {
          width: 90%;
          display: block;
          margin: 0 auto;
        }
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
    overflow-y: auto;
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
        // margin-right: 21px;
        width: 70px;
        text-align: left;
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
