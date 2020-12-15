<template>
    <div class="taskManager">
        <div class="taskManager-header">任务管理</div>
        <div class="taskManager-main">
            <a-row type="flex" style="height:100%;flex-flow: row;">
                <a-col flex="auto" style="padding:20px 10px;height:100%;">
                    <FilterForm
                        ref="form"
                        rowCol="4"
                        :formList="formList"
                    />
                    <a-table
                        :style="{marginTop: '20px'}"
                        :columns="columns"
                        :data-source="dataList"
                        :pagination="false"
                        :loading="tableLoading"
                    >
                        <span slot="action" slot-scope="record">
                            <a @click="onCheck(text, record)">查看</a>
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
import FilterForm from '@/components/FormList/index.jsx'
import api from "@/api";
export default {
    name: "task-manager",
    data() {
        return {
            pageSize: 10,
            current: 1,
            total: null,
            tableLoading: false,
            formList: [
                {
                    label: "任务名称",
                    name: "name",
                    type: "input",
                    placeholder: "请输入",
                },
                {
                    label: "任务来源",
                    type: "select",
                    name: "source",
                    placeholder: "全部",
                    selectOptions: [],
                    rules: [],
                    initialValue: "全部",
                },
            ],
            columns: [
                {
                    dataIndex: 'id',
                    key: 'id',
                    title: '任务key',
                },
                {
                    title: '任务名称',
                    key: 'taskName',
                    dataIndex: 'taskName'
                },
                {
                    title: '任务有效期(天)',
                    key: 'taskTime',
                    dataIndex: 'taskTime'
                },
                {
                    title: '是否周期性',
                    key: 'isPeriodic',
                    dataIndex: 'isPeriodic',
                    customRender: (text) => text === 1 ? '是' : '否'
                },
                {
                    title: '对应行为',
                    key: 'behaviourId',
                    dataIndex: 'behaviourId'
                },
                {
                    title: '任务来源',
                    key: 'sourceName',
                    dataIndex: 'sourceName'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    dataIndex: 'createTime'
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                }
            ],
            dataList: []
        }
    },
    components: {
      FilterForm
    },
    created () {
        this.getTaskList()
    },
    methods: {
        onCheck(record) {
            console.log(record)
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
                pageSize: this.pageSize
            }
            api.getTaskList(args)
            .then( res => {
                this.tableLoading = false;
                this.dataList = res.data.records;
                this.total = res.data.total;
            })
            .finally( () => this.tableLoading = false)
        }
    }
}
</script>

<style lang="less" scoped>
    .taskManager{
        &-header{
            border-bottom: 1px solid #e8e8e8;
            line-height: 60px;
            padding-left: 40px;
        }
    }
</style>