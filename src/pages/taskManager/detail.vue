<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">任务详情</p>
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
import moment from 'moment'
export default {
    name: 'task_detail',
    data() {
        return {
            dataList: [
                {
                    label: '任务key：',
                    name: 'id'
                },
                {
                    label: '任务名称：',
                    name: 'taskName',
                },
                {
                    label: '任务有效期(天)：',
                    name: 'validity'
                },
                {
                    label: '是否周期性：',
                    name: 'isPeriodic',
                },
                {
                    label: '状态：',
                    name: 'status'
                },
                {
                    label: '对应行为：',
                    name: 'behaviourName'
                },
                {
                    label: '触发条件：',
                    name: 'taskCondition'
                },
                {
                    label: '创建时间：',
                    name: 'createTime'
                },
            ],
            dataObj: {}
        }
    },
    mounted() {
        this.initData(this.$route.query.id)
    },
    methods: {
        initData(id) {
            api.getTaskDetail({taskId: id})
            .then( res => {
                console.log(res)
                this.dataObj = Object.assign(
                    res.data,
                    {createTime: moment(res.data.createTime).format('YYYY-MM-DD')},
                    {isPeriodic: res.data.isPeriodic === 0 ? '否' : '是'},
                    {status: res.data.status === 0 ? '禁用' : '启用'},
                )
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