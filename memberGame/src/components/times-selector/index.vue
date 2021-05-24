<template>
  <div class="main" @click="jumpChooseData">
    <div class="main-content">
      <van-swipe
        :loop="false"
        :width="88"
        :height="75"
        :show-indicators="false"
        class="swiper-cal"
      >
        <van-swipe-item v-for="(item, index) in arr" :key="index">
          <div class="swipe-item" @click="clickSwipe(index)" ref="swipeBox">
            <div class="dateMonth" :style="dateMonthStyle">
              {{ item.dateMonth }}
            </div>
            <div class="dateWeek">{{ item.dateWeek }}</div>
            <div class="price">{{ item.price }}</div>
          </div>
        </van-swipe-item>
        <van-swipe-item></van-swipe-item>
      </van-swipe>
      <div class="jump-con">
        <div class="jump-con-left"></div>
        <div class="jump-con-right">
          更多<br />
          日期
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "times-selector",
  components: {},
  props: {
    dateObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dateObj() {
      let listFeature = this.dateObj.proSkuFeatureValueList;
      let list = this.dateObj.proSkuList;
      let arrOther = [];
      let skuIdList = [];
      let skuList = [];

      listFeature.map((item, index) => {
        if(item.featureValue == '成人') {
          skuIdList.push(item.skuId); //拿到数据的skuId
        }
      });

      listFeature.map((item, index) => {
        if(item.featureId == "889" && skuIdList.includes(item.skuId)) {
          skuList.push({
            dateMonth: this.modityDate(item.featureValue),
            dateWeek: this.$util.exchangDateStyle(item.featureValue),
            skuId: item.skuId,
            time: item.featureValue,
          });
        }
      });
      skuList.map((item, index) => {
        list.map((items, indexs) => {
          if(item.skuId == items.skuId) {
            skuList[index]['price'] = "¥" + `${items.salePrice}`;
          }
        })
      });

      console.log(skuList);
      this.arr = skuList;
    }
  },
  data() {
    return {
      dateMonthStyle: "",
      arr: [],
    };
  },
  methods: {

    //修改月份日的日期方法
    modityDate(str) {
      let strNew = str.slice(0, 10).split("-");
      return strNew[1] + '/' + strNew[2];
    },

    jumpChooseData() {
      this.$util.storages().set('tourPageSendData', this.arr);
      this.$router.push({
        path: "/travel/tourDate"
      });
    },
    clickSwipe(e) {

      // this.$refs.swipeBox.map((item, index) => {
      //   this.$refs.swipeBox[index].style.borderColor = "#999999";
      //   this.$refs.swipeBox[index].children[0].style.backgroundColor =
      //     "#FFFFFF";
      //   this.$refs.swipeBox[index].children[0].style.color = "#333333";
      // });
      // this.$refs.swipeBox[e].style.borderColor = "#E8374A";
      // this.$refs.swipeBox[e].children[0].style.backgroundColor = "#E8374A";
      // this.$refs.swipeBox[e].children[0].style.color = "#FFFFFF";
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 10px;
  .main-content {
    width: 350px;
    margin-left: 12px;
    position: relative;
    .jump-con {
      border-left: 1px solid #FAFAFA;
      position: absolute;
      // opacity: 0.8;
      display: flex;
      z-index: 10;
      border-top: 1px soild #ffffff;
      top: -1px;
      right: 0;
      height: 75px;
      width: 50px;
      font-size: 13px;
      color: #666666;
      background-color: #ffffff;
      padding-top: 17px;
      .jump-con-left {
        flex: 0.2;
      }
      .jump-con-right {
        flex: 0.8;
      }
    }
    .swiper-cal {
      margin-top: 12px;
      padding-bottom: 5px;
      .swipe-item {
        text-align: center;
        width: 72px;
        height: 72px;
        border: 1px solid #999999;
        border-radius: 10px;
        .dateMonth {
          color: #333333;
          font-size: 14px;
          padding-top: 6px;
          border-radius: 7px 7px 0 0;
          background-color: #FAFAFA;
        }
        .dateWeek {
          font-size: 10px;
          color: #666666;
          margin-top: 6px;
          background-color: #ffffff;
        }
        .price {
          font-size: 13px;
          color: #e8374a;
          margin-top: 6px;
          background-color: #ffffff;
        }
      }
    }
  }
}
</style>
