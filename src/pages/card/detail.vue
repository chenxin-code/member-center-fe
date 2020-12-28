<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">会员卡详情</p>
            <p class="detail-header-btn" @click="goEdit()">编辑</p>
        </div>
        <div class="detail-main">
            <div class="detail-main-base detail-main-items">
                <p class="detail-main-items-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />基本信息</p>
                <div class="detail-main-items-cont">
                    <img :src="dataObj.memberCardImage" class="detail-main-items-cont-img" alt="">
                    <div class="detail-main-items-cont-info">
                        <p class="detail-main-items-cont-info-box" v-for="item in dataList" :key="item.label">
                            <span class="detail-main-items-cont-info-box-label">{{item.label}}</span>
                            <span class="detail-main-items-cont-info-box-value">{{dataObj[item.name] || ''}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <!-- <div class="detail-main-lever detail-main-items">
                <p class="detail-main-items-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />等级信息</p>
                <div class="detail-main-items-cont">
                    <a-table
                        :columns="columns"
                        :data-source="dataObj.levelList"
                        :pagination="false"
                    ></a-table>
                </div>
            </div> -->

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
            ],
            columns: [
                {
                    title: '层级卡面',
                    dataIndex: 'levelImage',
                    key: 'levelImage',
                    customRender: text => <img src={text} style="width: 99px; height: 54px" />
                },
                {
                    title: '层级图标',
                    dataIndex: 'levelIcon',
                    key: 'levelIcon',
                    customRender: text => <img src={text} style="width: 60px; height: 31px"/>
                },
                {
                    title: '层级名称',
                    dataIndex: 'levelName',
                    key: 'levelName',
                },
                {
                    title: '成长值',
                    dataIndex: 'ranges',
                    key: 'ranges',
                    customRender: (text, record) => <span>{`${record.rangeBegin}-${record.rangeEnd}`}</span>
                },
                {
                    title: '层级权益',
                    dataIndex: 'test',
                    key: 'test',
                    customRender: (text) => '敬请期待'
                },
                {
                    title: '层级有效期',
                    dataIndex: 'validity',
                    key: 'validity',
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
            // this.$router.push({name: 'card_edited', query: {cardId: this.cardId}})
        }
    }
}
</script>

<style lang="less" scoped>
    .detail{
        height: 100%;
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
            height: calc(100% - 58px);
            overflow: auto;
            border-top: 0px solid;
            padding: 0 20px;
            &-base{
                border-bottom: 1px dashed #E9E9E9;
            }
            &-items{
                color: #666;
                &-title{
                    font-size: 16px;
                    margin: 0;
                    padding-top: 20px;
                }
                &-cont{
                    padding: 20px 10px;
                    &-img{
                        width: 300px;
                        height: 179px;
                        vertical-align: middle;
                    }
                    &-info{
                        display: inline-block;
                        vertical-align: middle;
                        &-box{
                            &-label{
                                width: 120px;
                                display: inline-block;
                                text-align: right;
                                color: #333;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
