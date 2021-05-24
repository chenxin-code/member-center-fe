<template>
  <div class="record-main">
    <div class="record-cover">
      <img src="../../assets/images/record/recoreBg.png" alt="" />
    </div>
    <div class="record-header-flex">
      <div class="record-header-notice">
        <van-notice-bar
          style="height: 36px;line-height: 36px;"
          color="#ffffff"
          background="#A81C1F"
          :text="activityLotteryBroadcastVoList"
        >
          <div slot="left-icon" style="display: flex;">
            <img
              src="../../assets/images/record/trumpet.png"
              style="width: 20px;height:18px;"
            /></div
        ></van-notice-bar>
      </div>
    </div>
    <div class="record-content">
      <div class="content-list" v-if="activityLotteryVoList.length > 0">
        <div
          class="item-content"
          v-for="(item, index) in activityLotteryVoList"
          :key="index"
        >
          <div class="item">
            <div class="leval">{{ item.prizeName }}</div>
            <div class="name">{{ item.prizeDesc }}</div>
            <div class="time">{{ item.partakeTime }}</div>
          </div>
          <div class="divLine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import game from "@/api/request/apiAddress/game";
export default {
  data() {
    return {
      gameForm: {},
      activityLotteryBroadcastVoList: "",
      activityLotteryVoList: [],
      prizeList: [
        {
          label: "一等奖",
          value: "one",
          name: "奖品名称",
          time: "time"
        },
        {
          label: "一等奖",
          value: "one",
          name: "奖品名称",
          time: "time"
        },
        {
          label: "一等奖",
          value: "one",
          name: "奖品名称",
          time: "time"
        },
        {
          label: "一等奖",
          value: "one",
          name: "奖品名称",
          time: "time"
        }
      ]
    };
  },
  created() {
    this.gameForm.gameId = this.$route.query.gameId;
    this.gameForm.memberPhone = this.$route.query.phone;
    this.getDrawLotterBroadcastList();
    this.getMemberDrawLotterList();
  },
  methods: {
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
    }
  }
};
</script>

<style lang="less" scoped>
.divLine {
  width: 323px;
  height: 1px;
  background: #f0f0f0;
}
.record-main {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  position: relative;
  min-height: 100vh;
  .record-cover {
    position: absolute;
    img {
      width: 100%;
      display: block;
    }
  }
  .record-header-flex {
    position: relative;
    margin-top: 35px;
    // display: flex;
    // justify-content: center;
    width: 344px;
    height: 36px;
    .record-header-notice {
      width: 344px;
      height: 36px;
      background: #a81c1f;
      border-radius: 17px;
      margin-top: 15px;
      .van-notice-bar {
        border-radius: 20px;
        height: 36px;
      }
    }
  }
  .record-content {
    position: relative;
    width: 345px;
    height: 416px;
    background-image: url("../../assets/images/record/recordContent.png");
    background-size: 345px 416px;
    margin-top: 100px;
    .content-list {
      padding: 20px 15px;
      height: 386px;
      overflow: auto;
      .item {
        display: flex;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        .leval {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #ec0008;
        }
        .name {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #121212;
          // margin-right: 100px;
        }
        .time {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
  }
}
</style>
