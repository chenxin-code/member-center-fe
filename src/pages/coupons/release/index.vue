<template>
    <div class="release">
        <div class="release-header">卡券派发</div>
        <div class="release-main" ref="contentMain">
            <a-row type="flex" style="height:100%;flex-flow: row;">
                <a-col flex="auto" style="padding:20px 10px;height:100%;">
                    <FilterForm
                        ref="form"
                        rowCol="3"
                        :formList="this.formList"
                        :onSubmit="this.onSearch"
                        :doubleBtn="true"
                        :doubleBtnText="'新建派发'"
                        :doubleBtnEvent="() => this.$router.push({name: 'release_create'})"
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
                        :pageSizeOptions="['10','20', '30', '40', '50','100']"
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
    name: "release",
    data() {
        return {
            scrollY: 100,
            pageSize: 10,
            current: 1,
            total: null,
            tableLoading: false,
            formList: [
                {
                    label: "卡券类型",
                    name: "taskName",
                    type: "select",
                    placeholder: "全部",
                    selectOptions: [
                        {id: '', name: '全部'},
                        {id: '0', name: '已推送'},
                        {id: '1', name: '定时推送'}
                    ]
                },
                {
                    label: '卡券标题',
                    type: "input",
                    placeholder: "请输入",
                    name: 'taskKey'
                },
                {
                    label: '卡券业务类型',
                    type: 'select',
                    placeholder: "全部",
                    name: 'status',
                    selectOptions: [
                        {id: '', name: '全部'},
                        {id: '0', name: '已推送'},
                        {id: '1', name: '定时推送'}
                    ]
                },
                {
                    label: "派发类型",
                    type: "select",
                    name: "taskSource",
                    placeholder: "全部",
                    selectOptions: [
                        {id: '', name: '全部'},
                        {id: '0', name: '已推送'},
                        {id: '1', name: '定时推送'}
                    ],
                    initialValue: "全部",
                },
                {
                    label: '派发时间',
                    type: 'rangePicker',
                    name: 'taskDate',
                }
            ],
            columns: [
                {
                    dataIndex: 'taskKey',
                    key: 'id',
                    title: '卡券ID',
                },
                {
                    title: '卡券标题',
                    key: 'taskName',
                    dataIndex: 'taskName'
                },
                {
                    title: '卡券类型',
                    key: 'validity',
                    dataIndex: 'validity'
                },
                {
                    title: '卡券业务类',
                    key: 'isPeriodic',
                    dataIndex: 'isPeriodic',
                },
                {
                    title: '卡券面值金额',
                    key: 'status',
                    dataIndex: 'status',
                },
                {
                    title: '卡券有效期',
                    key: 'behaviourName',
                    dataIndex: 'behaviourName'
                },
                {
                    title: '派发类型',
                    key: 'sourceName',
                    dataIndex: 'sourceName'
                },
                {
                    title: '操作人员',
                    key: 'sys',
                    dataIndex: 'sys'
                },
                {
                    title: '派发时间',
                    key: 'createTime',
                    dataIndex: 'createTime',
                    customRender: text => moment(text).format('YYYY-MM-DD HH:mm')
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                }
            ],
            dataList: [],
            taskKey: '',
            taskDate: [],
            taskName: '',
            taskSource: '',
            status: null
        }
    },
    components: {
      FilterForm
    },
    mounted () {
        this.getTaskSource()
        this.getTaskList()
        setTimeout( () => {
            this.scrollY = this.$refs.contentMain.offsetHeight - 340 + 'px';
        }, 0)
    },
    methods: {
        onSearch(args) {
            const { taskKey, taskDate, taskName, taskSource, status } = args
            this.taskKey = taskKey || null;
            this.taskName = taskName || null;
            this.taskSource = taskSource || null;
            this.status = status || null;
            this.taskDate = taskDate || [];
            this.current = 1;
            this.getTaskList()
        },

        onCheck(record) {
            this.$router.push({name: 'release_detail', query: {id: record.id}});
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
                createTimeStart: this.taskDate.length ? moment(this.taskDate[0]).format('YYYY-MM-DD') : null,
                createTimeEnd: this.taskDate.length ? moment(this.taskDate[1]).format('YYYY-MM-DD') : null,
                status: this.status,
                taskKey: this.taskKey,
                taskName: this.taskName,
                taskSource: this.taskSource,
            }
            api.getTaskList(args)
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

        getTaskSource() {
            let sourceList = []
            api.getTaskSource()
            .then( res =>
                sourceList = res.data.map(item => {
                    return {id: item.appCode, name: item.appName}
                })
            )
            .then( () => {
                this.formList = this.formList.map( item => {
                    if (item.name === 'taskSource') {
                        return {
                            ...item,
                            selectOptions: [].concat({id: '', name: '全部'}, sourceList)
                        }
                    } else {
                        return item
                    }
                })
            })
        }
    },
    activated() {
        // isUseCache为false时才重新刷新获取数据
        // 通过这个控制刷新
        if (!this.$route.meta.isUseCache) {
            //重置data
            this.total = 0;
            this.current = 1;
            this.pageSize = 10;
            this.taskKey = '';
            this.taskDate = [];
            this.taskName = '';
            this.taskSource = '';
            this.status = null;
            //初始化加载数据
            this.$refs.form.form.resetFields();
            this.getTaskList();
        }

        //重置
        this.$route.meta.isUseCache = false;
    },

    beforeRouteEnter(to, from, next) {
        if (from.name === 'task_detail') {
            to.meta.isUseCache = true;
        } else {
            to.meta.isUseCache = false;
        }

        next();
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'task_detail') {
            to.meta.isUseCache = true;
        } else {
            to.meta.isUseCache = false;
        }

        next();
    },
}
</script>

<style lang="less" scoped>
    .release{
        height: 100%;
        overflow: hide;
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
