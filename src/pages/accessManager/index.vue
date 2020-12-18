<template>
    <div class="access">
        <div class="access-header">会员卡</div>
        <div class="access-main">
            <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8" v-for="item in list" :key="item.title">
                    <div class="access-main-boxs">
                        <div class="access-main-boxs-top">
                            <img class="access-main-boxs-top-img" :src="require('@/assets/img/card/card-bg.png')" alt="card">
                            <p class="access-main-boxs-top-title">{{item.appName}}</p>
                            <p class="access-main-boxs-top-id">KEY: {{item.appCode}}</p>
                        </div>
                        <div class="access-main-boxs-description">
                            {{item.appDescribe}}
                        </div>
                        <div class="access-main-boxs-footer">
                            <p class="access-main-boxs-footer-member">注册会员：<span>{{item.memberCount}}w</span></p>
                            <a-divider type="vertical" />
                            <p class="access-main-boxs-footer-btn">查看</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import api from '@/api'
export default {
    name: 'access',
    data() {
        return {
            list: []
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            api.getClientList()
            .then( res => {
                console.log(res)
                this.list = res.data
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .access{
        &-header{
            border-bottom: 1px solid #e8e8e8;
            line-height: 60px;
            padding-left: 40px;
        }
        &-main-boxs{
            width: 346px;
            height: 412px;  
            background: #fff;
            border-radius: 2px;
            border: 1px solid rgba(233, 233, 233, 1);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            margin: 20px auto 0;
            &-top{
                padding: 12px 9px;
                font-size: 12px;
                &-img{
                    width: 328px;
                    height: 208px;
                    padding-bottom: 5px;
                }
                &-title, &-id{
                    padding: 0 20px;
                    margin: 5px 0 0 0;
                }
                &-title{
                    font-size: 16px;
                    font-weight: bold;
                }
                &-id{
                    color: #808080;
                    font-weight: bold;
                }
            }
            &-description{
                width: 300px;
                overflow-y: auto;
                margin: 0 auto;
                padding: 10px 5px;
                border-top: 1px solid #ccc;
                height: 77px;
                color: #a0a0a0;
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