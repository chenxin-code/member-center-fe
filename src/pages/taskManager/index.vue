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
                    >
                        <span slot="action" slot-scope="record">
                            <a @click="onCheck(text, record)">查看</a>
                        </span>
                    </a-table>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import FilterForm from '@/components/FormList/index.jsx'
export default {
    name: "task-manager",
    data() {
        return {
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
                    dataIndex: 'uuid',
                    key: 'uuid',
                    title: 'UUID',
                },
                {
                    title: '姓名',
                    key: 'name',
                    dataIndex: 'name'
                },
                {
                    title: '手机号',
                    key: 'phoneNum',
                    dataIndex: 'phoneNum'
                },
                {
                    title: '性别',
                    key: 'gender',
                    dataIndex: 'gender'
                },
                {
                    title: '创建来源',
                    key: 'source',
                    dataIndex: 'source'
                },
                {
                    title: '加入时间',
                    key: 'joinTime',
                    dataIndex: 'joinTime'
                },
                {
                    title: '邦豆值',
                    key: 'money',
                    dataIndex: 'money'
                },
                {
                    title: '时代邻里会员卡等级',
                    key: 'vip',
                    dataIndex: 'vip'
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                }
            ],
            dataList: [
                {
                    key: '1',
                    uuid: '00001212122',
                    name: '111',
                    phoneNum: '110',
                    gender: 'man',
                    source: 'test',
                    joinTime: 'today',
                    money: '100',
                    vip: '1',
                }
            ]
        }
    },
    components: {
      FilterForm
    },
    methods: {
        onCheck(record) {
            console.log(record)
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