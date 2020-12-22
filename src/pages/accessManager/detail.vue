<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">接入平台详情</p>
        </div>
        <div class="detail-main">
            <p class="detail-main-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />基础信息</p>
            <div class="detail-main-items" v-for="item in dataList" :key="item.label">
                <span class="detail-main-items-label">{{item.label}}</span>
                <span v-if="item.name === 'createTime'" class="detail-main-items-value">{{moment(dataObj[item.name]).format('YYYY-MM-DD HH:MM:SS') || ''}}</span>
                <span v-else class="detail-main-items-value">{{dataObj[item.name] || ''}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'
import moment from 'moment'
export default {
    name: 'access_detail',
    data() {
        return {
            dataList: [
                {
                    label: '接入系统key：',
                    name: 'appCode'
                },
                {
                    label: '接入系统名称：',
                    name: 'appName',
                },
                {
                    label: '注册用户：',
                    name: 'memberCount'
                },
                {
                    label: '接入系统简介：',
                    name: 'appDescribe',
                },
                {
                    label: '接入时间：',
                    name: 'createTime'
                },
            ],
            dataObj: {}
        }
    },
    mounted () {
        this.initData(this.$route.query.code)
    },
    methods: {
        moment,
        initData(code) {
            api.getClientDetail({appCode: code})
            .then(res => {
                this.dataObj = res.data
            })
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
