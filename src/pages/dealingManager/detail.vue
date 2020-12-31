<template>
    <div class="detail">
        <div class="detail-header">
            <p class="detail-header-title">行为日志</p>
            <p class="detail-header-btn" @click="goBack()">返回</p>
        </div>
        <div class="detail-main">
            <div class="detail-main-base detail-main-items">
                <p class="detail-main-items-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />基本信息</p>
                <div class="detail-main-items-cont">
                    <div class="detail-main-items-cont-info">
                        <p class="detail-main-items-cont-info-box" v-for="item in baseList" :key="item.label">
                            <span class="detail-main-items-cont-info-box-label">{{item.label}}</span>
                            <span v-if="item.name === 'isUsing'" class="detail-main-items-cont-info-box-value">{{baseObj[item.name] === 0 ? '禁用' : '启用'}}</span>
                            <span v-else-if="item.name === 'type'" class="detail-main-items-cont-info-box-value">{{baseObj[item.name] === 1 ? '消费' : '其他'}}</span>
                            <span v-else-if="item.name === 'createTime'" class="detail-main-items-cont-info-box-value">{{moment(baseObj[item.name]).format('YYYY-MM-DD HH:mm')}}</span>
                            <span v-else class="detail-main-items-cont-info-box-value">{{baseObj[item.name] || ''}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="detail-main-lever detail-main-items">
                <p class="detail-main-items-title"><a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />行为日志</p>
                <div class="detail-main-items-cont">
                    <FilterForm
                        rowCol="3"
                        :formList="this.formList"
                        :onSubmit="this.onSearch"
                    />
                    <a-table
                        :style="{marginTop: '20px'}"
                        :columns="columns"
                        :data-source="logList"
                        :pagination="false"
                        :loading="tableLoading"
                    ></a-table>
                    <a-pagination
                        :total="total"
                        :show-total="total => `共 ${total} 条`"
                        show-quick-jumper
                        show-size-changer
                        v-model="current"
                        :default-current="current"
                        :page-size.sync="pageSize"
                        :pageSizeOptions="['10','20', '30', '40', '50','100']"
                        @change="onShowSizeChange"
                        @showSizeChange="onShowSizeChange"
                        style="margin-top:30px;width:100%;text-align: right;"
                    />
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import api from '@/api';
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
export default {
    name: 'dealing_detail',
    components: {
      FilterForm
    },
    data() {
        return {
            tableLoading: false,
            pageSize: 10,
            current: 1,
            total: null,
            baseList: [
                {
                    label: '行为类型：',
                    name: 'type'
                },
                {
                    label: '行为名称：',
                    name: 'name',
                },
                {
                    label: '行为来源：',
                    name: 'sourceName'
                },
                {
                    label: '创建时间：',
                    name: 'createTime',
                },
                {
                    label: '状态：',
                    name: 'isUsing'
                },
            ],
            columns: [
                {
                    title: '记录时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    customRender: text => moment(text).format('YYYY-MM-DD HH:mm')
                },
                {
                    title: '行为描述',
                    dataIndex: 'memo',
                    key: 'memo',
                },
                {
                    title: '会员昵称',
                    dataIndex: 'memberName',
                    key: 'memberName',
                },
                {
                    title: '会员唯一标识',
                    dataIndex: 'memberCode',
                    key: 'memberCode',
                },
                {
                    title: '会员手机号',
                    dataIndex: 'test',
                    key: 'test',
                    customRender: (text, record) => '+' + record.phoneAreaCode + record.phone
                },
            ],
            formList: [
                {
                    label: '记录时间：',
                    type: 'rangePicker',
                    name: 'rangeTime',
                },
                {
                    label: "唯一标识：",
                    name: "memberCode",
                    type: "input",
                    placeholder: "请输入",
                },
                {
                    label: "手机号：",
                    name: "phone",
                    type: "input",
                    placeholder: "请输入",
                },
            ],
            baseObj: {},
            logList: [],
            id: null,
            memberCode: '',
            phone: '',
            rangeTime: [],
        }
    },
    mounted () {
        this.id = this.$route.query.id;
        this.initData(this.$route.query.id);
        this.getLog()
    },
    methods: {
        moment,
        initData(id) {
            api.getDealingDetail({behaviourId: id})
            .then(res => {
                this.baseObj = res.data
            })
        },
        getLog() {
            this.tableLoading = true;
            var args = {
                behaviourId: this.id,
                pageIndex: this.current,
                pageSize: this.pageSize,
                memberCode: this.memberCode,
                phone: this.phone,
                createTimeStart: this.rangeTime.length ? moment(this.rangeTime[0]).format('YYYY-MM-DD') : null,
                createTimeEnd: this.rangeTime.length ? moment(this.rangeTime[1]).format('YYYY-MM-DD') : null,
            }
            api.getDealingLog(args)
            .then( res => {
                this.tableLoading = false;
                this.logList = res.data.records;
                this.total = res.data.total;
            })
            .finally( () => this.tableLoading = false)
        }, 
        onSearch(args) {
            const { memberCode, phone, rangeTime, } = args
            this.memberCode = memberCode || '';
            this.phone = phone || '';
            this.rangeTime = rangeTime || []
            this.getLog()
        },
        onShowSizeChange(current, pageSize) {
            this.current = current;
            this.pageSize = pageSize;
            this.getLog()
        },
        goBack() {
            this.$router.push({name: 'dealing'})
        },
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