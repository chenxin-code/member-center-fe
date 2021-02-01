<template>
    <div class="release-status">
        <div class="release-status-main">
            <img class="release-status-main-icon" :src="require('@/assets/img/micro/Icon_enable.png')" alt="">
            <h1 class="release-status-main-title">优惠券发放成功</h1>
            <p class="release-status-main-tip">请前往卡券记录查看卡券领取情况</p>
            <a-button class="release-status-main-btn" @click="goList">返回</a-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'release_status',
    data() {
        return {

        }
    },
    methods: {
        goList() {
            this.$router.push({name: 'release'})
        }
    }
}
</script>
<style lang="less" scoped>
    .release-status{
        text-align: center;
        &-main{
            display: inline-block;
            width: 400px;
            margin-top: 10%;
            &-icon{
                width: 80px;
                margin-bottom: 20px;
            }
            &-title{
                font-size: 30px;
                margin-bottom: 30px;
            }
            &-tip{
                color: #bfbfbf;
                font-size: 14px;
            }
        }
    }
</style>