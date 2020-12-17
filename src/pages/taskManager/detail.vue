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
                    name: 'memberCardName',
                },
                {
                    label: '任务有效期(天)：',
                    name: 'memberCount'
                },
                {
                    label: '是否周期性：',
                    name: 'memo',
                },
                {
                    label: '状态：',
                    name: 'memberCardSourceName'
                },
                {
                    label: '对应行为：',
                    name: 'memberCardImage'
                },
                {
                    label: '触发条件：',
                    name: 'memberCardImage'
                },
                {
                    label: '创建时间：',
                    name: 'memberCardImage'
                },
            ],
            dataObj: {}
        }
    },
    created() {

    },
    methods: {
        initData() {

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