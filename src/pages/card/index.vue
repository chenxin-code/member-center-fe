<template>
    <div class="card">
        <div class="card-header">会员卡</div>
        <div class="card-main">
            <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                    <div class="card-main-boxs">
                        <div class="card-main-boxs-top">
                            <img class="card-main-boxs-top-img" :src="require('@/assets/img/card/card-bg.png')" alt="card">
                            <p class="card-main-boxs-top-title">时代邻里会员卡</p>
                            <p class="card-main-boxs-top-id">ID: 3aaf-11eb-b400-0a80</p>
                        </div>
                        <div class="card-main-boxs-description">
                            描述
                        </div>
                        <div class="card-main-boxs-footer">
                            <p class="card-main-boxs-footer-member">持卡会员：<span>99999</span></p>
                            <a-divider type="vertical" />
                            <p class="card-main-boxs-footer-btn">查看</p>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="card-main-boxs">
                        <div class="card-main-boxs-top">
                            <img class="card-main-boxs-top-img" :src="require('@/assets/img/card/card-bg.png')" alt="card">
                            <p class="card-main-boxs-top-title">时代邻里会员卡</p>
                            <p class="card-main-boxs-top-id">ID: 3aaf-11eb-b400-0a80</p>
                        </div>
                        <div class="card-main-boxs-description">
                            描述
                        </div>
                        <div class="card-main-boxs-footer">
                            <p class="card-main-boxs-footer-member">持卡会员：<span>99999</span></p>
                            <a-divider type="vertical" />
                            <p class="card-main-boxs-footer-btn">查看</p>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="card-main-boxs">
                        <div class="card-main-boxs-top">
                            <img class="card-main-boxs-top-img" :src="require('@/assets/img/card/card-bg.png')" alt="card">
                            <p class="card-main-boxs-top-title">时代邻里会员卡</p>
                            <p class="card-main-boxs-top-id">ID: 3aaf-11eb-b400-0a80</p>
                        </div>
                        <div class="card-main-boxs-description">
                            描述
                        </div>
                        <div class="card-main-boxs-footer">
                            <p class="card-main-boxs-footer-member">持卡会员：<span>99999</span></p>
                            <a-divider type="vertical" />
                            <p class="card-main-boxs-footer-btn">查看</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'card',
    data() {
        return {

        }
    }
}
</script>

<style lang="less" scoped>
    .card{
        &-header{
            border-bottom: 1px solid #e8e8e8;
            line-height: 60px;
            padding-left: 40px;
        }
        &-main-boxs{
            width: 309px;
            height: 412px;  
            background: #fff;
            border-radius: 2px;
            border: 1px solid rgba(233, 233, 233, 1);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            margin: 20px auto 0;
            &-top{
                padding: 12px 24px;
                border-bottom: 1px dashed #cccccc;
                font-size: 12px;
                &-img{
                    width: 260px;
                    height: 170px;
                    padding-bottom: 5px;
                }
                &-title, &-id{
                    padding: 0;
                    margin: 5px 0 0 0;
                }
                &-title{
                    font-size: 14px;
                    font-weight: bold;
                }
                &-id{
                    color: #a0a0a0;
                }
            }
            &-description{
                height: 117px;
                overflow-y: auto;
                padding: 5px 24px;
            }
            &-footer{
                color: #a0a0a0;
                background: rgba(247, 249, 250, 1);
                line-height: 48px;
                &-member, &-btn{
                    margin: 0;
                    display: inline-block;
                    vertical-align: middle;
                    width: 47%;
                    text-align: center;
                }
                &-member{
                    span{
                        color: rgba(0, 0, 255, 0.5);
                    }
                }
            }
        }
    }
</style>