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
                            <a-divider type="vertical" />
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
                &-btn{
                    cursor: pointer;
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
                        color: rgba(0, 0, 255, 0.5);
                    }
                }
            }
        }
    }
</style>