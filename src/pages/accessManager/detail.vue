<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">接入平台详情</p>
        </div>
        <div class="detail-main">
            <p class="detail-main-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />基础信息</p>
            <div class="detail-main-items" v-for="item in basisList" :key="item.label">
                <span class="detail-main-items-label">{{item.label}}</span>
                <span v-if="item.name === 'createTime'" class="detail-main-items-value">{{moment(dataObj[item.name]).format('YYYY-MM-DD HH:MM:SS') || ''}}</span>
                <span v-else class="detail-main-items-value">{{dataObj[item.name] || ''}}</span>
            </div>
        </div>
        <div class="detail-main">
            <p class="detail-main-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />会员信息</p>
            <div class="detail-main-items" v-for="item in memberList" :key="item.label">
                <span class="detail-main-items-label">{{item.label}}</span>
                <span class="detail-main-items-value">{{dataObj[item.name] || ''}}</span>
            </div>
        </div>
        <div class="detail-main">
            <p class="detail-main-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />会员来源</p>
            <!-- <a-table
                :style="{marginTop: '20px'}"
                :columns="columns"
                :data-source="tableList"
                :pagination="false"
                :loading="tableLoading"
            > -->
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
            basisList: [
                {
                    label: '接入系统名称：',
                    name: 'appCode'
                },
                {
                    label: 'AppKey：',
                    name: 'appName',
                },
                {
                    label: 'AppSecret：',
                    name: 'memberCount'
                },
                {
                    label: '接入系统简介：',
                    name: 'appDescribe',
                },
                {
                    label: '创建时间：',
                    name: 'createTime'
                },
            ],
            memberList: [
                {
                    label: '注册会员：',
                    name: 'register'
                },
                {
                    label: '创建来源会员：',
                    name: 'create'
                }
            ],
            tableList: [],
            columns: [
                {
                    dataIndex: 'name',
                    key: 'name',
                    title: '来源名称',
                },
                {
                    dataIndex: 'mark',
                    key: 'mark',
                    title: '来源标识',
                },
                {
                    dataIndex: 'status',
                    key: 'status',
                    title: '状态',
                },
                {
                    dataIndex: 'registerNum',
                    key: 'registerNum',
                    title: '注册会员数',
                },
                {
                    dataIndex: 'sourceNum',
                    key: 'sourceNum',
                    title: '创建来源会员数',
                },
            ],
            tableLoading: false,
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
