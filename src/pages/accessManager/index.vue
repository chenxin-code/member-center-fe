<template>
    <div class="access">
        <div class="access-header">会员卡</div>
        <div class="access-main">
            <a-row type="flex" justify="start" align="middle">
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
                            <p class="access-main-boxs-footer-member">注册会员：<span>{{(item.memberCount / 10000) >= 1 ? item.memberCount / 10000 + 'w' : item.memberCount}}</span></p>
                            <a-divider type="vertical" style="height: 25px; color: #DEDEDE"/>
                            <p class="access-main-boxs-footer-btn" @click="onCheck(item.appCode)">查看</p>
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
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            api.getClientList()
            .then( res => {
                this.list = res.data
            })
        },
        onCheck(code) {
            // this.$router.push({name: 'access_detail', query: {code}})
        }
    }
}
</script>

<style lang="less" scoped>
    .access{
        height: 100%;
        &-header{
            border-bottom: 1px solid #e8e8e8;
            line-height: 60px;
            padding-left: 40px;
        }
        &-main{
            height: calc(100% - 90px);
            overflow: auto;
            color: #666;
        }
        &-main-boxs{
            width: 348px;
            height: 400px;
            background: #fff;
            border-radius: 2px;
            border: 1px solid rgba(233, 233, 233, 1);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            margin: 20px auto 0;
            font-size: 16px;
            &-top{
                padding: 10px 10px;
                &-img{
                    width: 328px;
                    height: 180px;
                    padding-bottom: 15px;
                }
                &-title, &-id{
                    padding: 0 10px;
                    margin: 0;
                }
                &-title{
                    font-size: 20px;
                    font-weight: bold;
                    color: #000;
                    padding-top: 5px;
                }
                &-id{
                    font-weight: bold;
                    padding-bottom: 5px;
                }
            }
            &-description{
                width: 300px;
                overflow-y: auto;
                margin: 0 auto;
                padding: 10px 5px;
                border-top: 1px solid #F0F0F0;
                height: 83px;
            }
            &-footer{
                background: #F1F5FE;
                line-height: 50px;
                &-btn{
                    cursor: pointer;
                    color: #4B7AFB;
                }
                &-member, &-btn{
                    margin: 0;
                    display: inline-block;
                    vertical-align: middle;
                    width: 47%;
                    text-align: center;
                }
                &-member{
                    span{
                        color: #4B7AFB;;
                    }
                }
            }
        }
    }
</style>
