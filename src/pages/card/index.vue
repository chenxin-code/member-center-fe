<template>
    <div class="card">
        <div class="card-header">会员卡</div>
        <div class="card-main">
            <a-row type="flex" justify="start" align="middle">
                <a-col :span="8" v-for="item in dataList" :key="item.id">
                    <div class="card-main-boxs">
                        <div class="card-main-boxs-top">
                            <img class="card-main-boxs-top-img" :src="item.memberCardImage" alt="card">
                            <p class="card-main-boxs-top-title">{{item.memberCardName}}</p>
                            <p class="card-main-boxs-top-id">ID: {{item.id}}</p>
                        </div>
                        <div class="card-main-boxs-description">
                            {{item.memo}}
                        </div>
                        <div class="card-main-boxs-footer">
                            <p class="card-main-boxs-footer-member">持卡会员：<span>{{item.memberCount}}</span></p>
                            <a-divider type="vertical" style="height: 25px; color: #DEDEDE"/>
                            <p class="card-main-boxs-footer-btn" 
                                @click="goDetail(item.id)"
                            >查看</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import api from "@/api";
export default {
    name: 'card',
    data() {
        return {
            dataList: []
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            api.getCardList({})
            .then( res => {
                this.dataList = res.data
            })
        },
        goDetail(id) {
            this.$router.push({name: 'card_detail', query: {cardId: id}})
        }
    }
}
</script>

<style lang="less" scoped>
    .card{
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
            height: 420px;  
            background: #fff;
            border-radius: 2px;
            border: 1px solid rgba(233, 233, 233, 1);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            margin: 20px auto 0;
            font-size: 16px;
            &-top{
                padding: 10px 10px;
                border-bottom: 1px dashed #F0F0F0;
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
                }
                &-id{
                    padding-bottom: 5px;
                }
            }
            &-description{
                height: 106px;
                overflow-y: auto;
                padding: 15px 20px;
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
                        color: #4B7AFB;
                    }
                }
            }
        }
    }
</style>