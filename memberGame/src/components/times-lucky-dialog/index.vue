<template>
  <div class="qrshowBox" v-show="showQR">
    <van-dialog
      class="van-luck-dialog"
      v-model="showQR"
      :show-confirm-button="false"
    >
      <div class="van-luck">
        <div class="van-bg">
          <slot name="header"> </slot>
        </div>
        <div class="van-content">
          <slot name="content"> </slot>
        </div>
      </div>
    </van-dialog>
    <div class="footer" v-if="closeQRDel">
      <span class="delImg" @click="close()"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showQR: {
      type: Boolean,
      default: false
    },
    closeQRDel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("closeQR");
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes myfirst {
  0% {
    transform: scale(0);
    transform-origin: center -300px;
  }
  10% {
    transform: scale(0.6);
    transform: translateY(-100px);
  }
  100% {
    transform: scale(1);
  }
}
.qrshowBox {
  position: relative;
  /deep/.van-dialog.van-luck-dialog {
    width: 627px/2 !important;
    height: 732px/2;
    overflow: auto;
    top: 320px;
    border-radius: 20px/2;
    text-align: center;
    z-index: 2047/2;
    background: none !important;
    padding: 0 !important;
    .van-dialog__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      .van-luck {
        position: relative;
        width: 627px/2;
        height: 732px/2;
        .van-bg {
          position: absolute;
          img {
            display: block;
            max-width: 100%;
            flex-shrink: 0;
          }
        }
        .van-content {
          position: relative;
          height: 100%;
        }
      }
      .btn {
        width: 100%;
        height: 102px/2;
        background: linear-gradient(180deg, #68aaff 0%, #3771ff 100%);
        border-radius: 0px 0px 20px/2 20px/2;
        border: none;
        font-size: 32px/2;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400/2;
        color: #ffffff;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 200px;
    width: 100%;
    display: flex;
    z-index: 9999;
    flex-direction: column;
    align-items: center;
    .dash {
      display: block;
      margin: 0 auto;
      border-left: 1px dashed #ffffff;
      height: 114px/2;
    }
    .delImg {
      background-image: url("~@/assets/images/turntable/btn_close@2x.png");
      width: 66px/2;
      height: 66px/2;
      display: block;
      background-size: 100% 100%;
    }
  }
}
</style>
