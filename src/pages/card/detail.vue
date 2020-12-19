<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">会员卡详情</p>
            <p class="detail-header-btn" @click="goEdit()">编辑</p>
        </div>
        <div class="detail-main">
            <p class="detail-main-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />基础信息</p>
            <div class="detail-main-items" v-for="item in dataList" :key="item.label">
                <span class="detail-main-items-label">{{item.label}}</span>
                <span class="detail-main-items-value">{{dataObj[item.name] || ''}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'
export default {
    name: 'card_detail',
    data() {
        return {
            dataList: [
                {
                    label: '会员卡ID：',
                    name: 'id'
                },
                {
                    label: '会员卡名称：',
                    name: 'memberCardName',
                },
                {
                    label: '持卡会员：',
                    name: 'memberCount'
                },
                {
                    label: '会员卡简介：',
                    name: 'memo',
                },
                {
                    label: '所属系统：',
                    name: 'memberCardSourceName'
                },
                {
                    label: '卡片封面：',
                    name: 'memberCardImage'
                },
            ],
            dataObj: {},
            cardId: null,
        }
    },
    mounted () {
        this.initData(this.$route.query.cardId);
        this.cardId = this.$route.query.cardId;
    },
    methods: {
        initData(id) {
            api.getCardDetail({cardId: id})
            .then(res => {
                this.dataObj = res.data
            })
        },
        goEdit() {
            this.$router.push({name: 'card_edited', query: {cardId: this.cardId}})
        }
    }
}
</script>

<style lang="less" scoped>
    .detail{
        &-header{
            display: flex;
            justify-content: space-between;
            line-height: 56px;
            border-bottom: 2px solid #dadada;
            &-title, &-btn{
                margin: 0;
                padding: 0 40px;
            }
            &-btn{
                color: #4c79fa;
                cursor: pointer;
            }
        }
        &-main{
            &-title{
                font-size: 16px;
                color: #7f7f7f;
                padding-left: 35px;
                line-height: 50px;
                margin: 0;
            }
            &-items{
                color: #686868;
                margin-bottom: 20px;
                &-label{
                    display: inline-block;
                    width: 120px;
                    text-align: right;
                }
            }
        }
    }
</style>