<template>
    <div class="taskManager">
        <div class="taskManager-header">行为管理</div>
        <div class="taskManager-main" ref="contentMain">
            <a-row type="flex" style="height:100%;flex-flow: row;">
                <a-col flex="auto" style="padding:20px 10px;height:100%;">
                    <FilterForm
                        ref="form"
                        rowCol="3"
                        :formList="this.formList"
                        :onSubmit="this.onSearch"
                    />
                    <a-table
                        :style="{marginTop: '20px'}"
                        :columns="columns"
                        :data-source="dataList"
                        :pagination="false"
                        :loading="tableLoading"
                        :scroll="{y: scrollY}"
                    >
                        <span slot="action" slot-scope="record">
                            <a @click="onCheck(record)">查看</a>
                        </span>
                    </a-table>
                    <a-pagination
                        :total="total"
                        :show-total="total => `共 ${total} 条`"
                        show-quick-jumper
                        show-size-changer
                        v-model="current"
                        :default-current="current"
                        :page-size.sync="pageSize"
                        :pageSizeOptions="['10','20','50','100']"
                        @change="onShowSizeChange"
                        @showSizeChange="onShowSizeChange"
                        style="margin-top:30px;width:100%;text-align: right;"
                    />
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import api from "@/api";
export default {
    name: 'dealing',
    data() {
        return {
            pageSize: 10,
            current: 1,
            total: null,
            tableLoading: false,
            formList: [
                {
                    label: '行为类型',
                    type: 'select',
                    placeholder: "全部",
                    name: 'type',
                    selectOptions: [
                        {id: '', name: '全部'},
                        {id: '1', name: '消费'},
                        {id: '2', name: '其他'}
                    ]
                },
                {
                    label: '行为名称',
                    type: "input",
                    placeholder: "请输入",
                    name: 'name'
                },
                {
                    label: '创建时间',
                    type: 'rangePicker',
                    name: 'createTime',
                }
            ],
            columns: [
                {
                    dataIndex: 'type',
                    key: 'type',
                    title: '行为类型',
                    customRender: text => text === 1 ? '消费' : '其他'
                },
                {
                    title: '行为名称',
                    key: 'name',
                    dataIndex: 'name'
                },
                {
                    title: '行为来源',
                    key: 'sourceName',
                    dataIndex: 'sourceName'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    dataIndex: 'createTime',
                    customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                }
            ],
            dataList: [],
            rangeTime: [], 
            name: '', 
            type: '', 
            scrollY: 100,
        }
    },
    components: {
      FilterForm
    },
    mounted () {
        this.getTaskList()
        setTimeout( () => {
            this.scrollY = this.$refs.contentMain.offsetHeight - 290 + 'px';
        }, 0)
        
    },
    methods: {
        onSearch(args) {
            const { type, name, createTime } = args
            this.name = name || null,
            this.type = type || null,
            this.rangeTime = createTime || [],
            this.getTaskList()
        },

        onCheck(record) {
            this.$router.push({name: 'dealing_detail', query: {id: record.id}});
        },

        onShowSizeChange(current, pageSize) {
            this.current = current;
            this.pageSize = pageSize;
            this.getTaskList()
        },

        getTaskList() {
            this.tableLoading = true;
            let args = {
                pageIndex: this.current,
                pageSize: this.pageSize,
                createTimeStart: this.rangeTime.length > 0 ? moment(this.rangeTime[0]).format('YYYY-MM-DD') : null,
                createTimeEnd: this.rangeTime.length > 0 ? moment(this.rangeTime[1]).format('YYYY-MM-DD') : null,
                type: this.type,
                name: this.name,
            }
            api.getDealingList(args)
            .then( res => {
                this.tableLoading = false;
                this.dataList = res.data.records.map((item, index) => {
                    return {
                        ...item,
                        key: index
                    }
                });
                this.total = res.data.total;
            })
            .finally( () => this.tableLoading = false)
        },
        beforeRouteEnter(to, from, next) {
            if (from.name === 'dealing_detail') {
                to.meta.keepAlive = true;
            } else {
                to.meta.keepAlive = false;
            }
            next();
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'dealing_detail') {
                to.meta.keepAlive = true;
            } else {
                to.meta.keepAlive = false;
            }

            next();
        },
    }
}
</script>
<style lang="less" scoped>
    .taskManager{
        height: 100%;
        &-header{
            border-bottom: 1px solid #e8e8e8;
            line-height: 60px;
            padding-left: 40px;
        }
        &-main{
            height: 100%;
        }
    }
</style>