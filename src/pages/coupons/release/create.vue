<template>
    <div class="create">
        <div class="create-header">
            <div class="create-header-title">卡券派发</div>
            <span class="create-header-fallback" @click="$store.dispatch('FALLBACK')">
                返回
            </span>
        </div>
        <div class="create-main">
            <a-form :form="formBasic" :label-col="{ span: 4 }" :wrapper-col="{ span: 9 }">
                <p class="create-main-title">
                    <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                    卡券信息
                </p>
                <a-form-item label="选择卡券：">
                    <div :class="`create-main-couponSelect ${showRedBorder && 'border-red'}`" @click="handleSelectCoupon">{{couponName}}</div>
                    <p v-show="showRedBorder" class="create-main-couponSelectTip">请选择卡券！</p>
                </a-form-item>
                <a-form-item label="卡券有效期：">
                    <a-input :placeholder="couponValid" disabled />
                </a-form-item>
                <p class="create-main-title">
                    <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                    卡券发放信息
                </p>
                <a-form-item label="领取条件设置：">
                    <a-select
                        @change="(val) => condition = val"
                        placeholder="请选择"
                        v-decorator="[
                            'condition',
                            {
                                initialValue: 1,
                                rules: [{ required: true, message: '请设置领取条件!' }]
                            }
                        ]"
                    >
                        <a-select-option
                            v-for="item in receiveList"
                            :key="item.value"
                            :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-item>
                <div v-if="condition !== 2">
                    <a-form-item

                        v-for="item in issueForm"
                        :key="item.label"
                        :label="item.label">
                        <a-input-number
                            style="width: 100%"
                            :placeholder="item.placehold"
                            v-decorator="[
                                `${item.name}`,
                                {rules: item.rules}
                            ]"/>
                    </a-form-item>
                </div>
                <div v-if="condition == 2">
                    <a-form-item label="发放范围">
                        <a-select
                            v-decorator="[
                                'issuedRang',
                                {
                                    initialValue: 1,
                                    rules: [{ required: true, message: '请设置发放范围!' }]
                                }
                            ]"
                            @change="val => issuedRang = val"
                        >
                            <a-select-option v-for="item in issueRange" :key="item.label" :value="item.value">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="上传指定会员" v-if="issuedRang == 2">
                        <a-upload
                            v-decorator="[
                                'file',
                                {rules: [{ required: true, message: '请选择文件上传!' }] }
                            ]"
                            :file-list="fileList"
                            name='file'
                            accept=".xlsx"
                            :showUploadList="false"
                            :before-upload="uploadBefor"
                        >
                            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                            <p class="create-main-uploadTip">支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次</p>
                        </a-upload>
                        <p><a href="https://hystxt-oss.oss-cn-shenzhen.aliyuncs.com/oss-frontend/sys-member-center/0821501581161_%E6%8C%87%E5%AE%9A%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF.xls">下载模板文件</a></p>
                    </a-form-item>
                    <a-form-item label="接入系统"  v-if="issuedRang == 3">
                        <a-checkbox-group
                            v-decorator="[
                                'clientId',
                                {rules: [{ required: true, message: '请选择接入系统!' }] }
                            ]"
                        >
                            <a-checkbox v-for="item in systemList" :key="item.label" :value="item.appCode">{{item.appName}}</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="指定会员卡" v-if="issuedRang == 4">
                        <a-select @change="changeMemberCard"
                            v-decorator="[
                                'memberCardId',
                                {rules: [{ required: true, message: '请选择会员卡!' }]}
                            ]"
                        >
                            <a-select-option v-for="item in cardList" :key="item.id" :value="item.id">{{item.memberCardName}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="会员等级"  v-if="issuedRang == 4">
                        <a-form-item
                            :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
                        >
                            <a-select style="width: 100%"
                                v-decorator="[
                                    'startLevelId',
                                    {rules: [{required: true, message: '请选择会员等级'}]}
                                ]"
                            >
                                <a-select-option v-for="item in levelList" :key="item.id" :value="item.id">{{item.levelName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                            -
                        </span>
                        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                            <a-select style="width: 100%"
                                v-decorator="[
                                    'endLevelId',
                                    {rules: [{required: true, message: '请选择会员等级'}]}
                                ]"
                            >
                                <a-select-option v-for="item in levelList" :key="item.id" :value="item.id">{{item.levelName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form-item>
                </div>
                <a-form-item class="create-main-button">
                    <a-button type="primary" class="create-main-button-items" @click="couponDistribute">发放</a-button>
                    <a-button class="create-main-button-items" @click="$router.push({name: 'release'})">取消</a-button>
                </a-form-item>
            </a-form>
        </div>
        <a-modal title="卡券选择"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            width="1300px">
            <FilterForm
                ref="form"
                rowCol="3"
                :formList="this.formList"
                :onSubmit="this.onSearch"
            />
            <a-table
                :style="{marginTop: '20px'}"
                :columns="columns"
                :data-source="tableDataList"
                :pagination="false"
                :loading="tableLoading"
                :scroll="{y: scrollY}"
                :row-selection="rowSelection"
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
        </a-modal>
    </div>
</template>
<script>
import {couponsCenterList, bangdouList, cardList, level, typeList, activityList} from './createForms';
import FilterForm from '@/components/FilterGroup/index.jsx';
import moment from 'moment';
import api from "@/api";
import { debounce } from '@/utils/util';

export default {
    name: 'release_create',
    components: {
        FilterForm
    },
    data () {
        return {
            showRedBorder: false,
            cardList: [],
            couponName: '请选择',
            couponValid: '',
            selectedRows: [],
            scrollY: 300,
            pageSize: 10,
            current: 1,
            total: null,
            tableLoading: false,
            tableDataList: [],
            visible: false,
            formBasic: this.$form.createForm(this, { name: 'formBasic' }),
            levelList: [],
            receiveList: [
                { label: '领券中心', value: 1 },
                { label: '直接发放', value: 2 },
                { label: '邦豆兑换', value: 3 },
                { label: '卡密兑换', value: 4 },
            ],
            systemList: [],
            issueRange: [
                { label: '全部会员', value: 1 },
                { label: '指定会员', value: 2 },
                { label: '指定接入系统', value: 3 },
                { label: '指定会员卡', value: 4 },
            ],
            issueForm: couponsCenterList,
            formList: [
                {
                    label: "卡券类型",
                    name: "type",
                    type: "select",
                    placeholder: "全部",
                    selectOptions: typeList
                },
                {
                    label: '卡券标题',
                    type: "input",
                    placeholder: "请输入",
                    name: 'title'
                },
                {
                    label: '卡券业务类型',
                    type: 'select',
                    placeholder: "全部",
                    name: 'activity',
                    selectOptions: activityList,
                    labelCol: { span: 9 },
                    wrapperCol: { span: 15 }
                },
            ],
            columns: [
                {
                    dataIndex: 'id',
                    key: 'id',
                    title: '卡券ID',
                },
                {
                    title: '卡券标题',
                    key: 'couponTitle',
                    dataIndex: 'couponTitle'
                },
                // {
                //     title: '卡券副标题',
                //     key: 'couponSubhead',
                //     dataIndex: 'couponSubhead'
                // },
                {
                    title: '卡券类型',
                    key: 'couponType',
                    dataIndex: 'couponType',
                    customRender: text => typeList.filter(item => item.id == text)[0].name || ''
                },
                {
                    title: '卡券业务类',
                    key: 'activity',
                    dataIndex: 'activity',
                    customRender: text => activityList.filter(item => item.id == text)[0].name || ''
                },
                {
                    title: '卡券面值金额',
                    key: 'faceAmount',
                    dataIndex: 'faceAmount',
                },
                {
                    title: '操作人员',
                    key: 'operator',
                    dataIndex: 'operator'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    dataIndex: 'createTime',
                    customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
                },
            ],
            activity: null,
            title: '',
            type: null,
            condition: 1,   // 领取类型
            issuedRang: 1, // 发放范围
            couTypeCode: '', // 卡券类型编号
            dataSourse: {
                memberCardName: '', // 会员卡名称
                file: '', //会员文件
            },
            fileList: [],
            id: null,
        }
    },
    created() {
        this.getCouponList();
        this.getCardList();
        this.getSystemList();
    },
    methods: {
        uploadBefor(file) {
            this.dataSourse.file = file
            console.log('file', file)
            return false
        },
        changeMemberCard(val, option) {
            const activityArr = this.cardList.filter(item => item.id == val);
            this.dataSourse.memberCardName = activityArr[0].memberCardName
            api.getMemberLevelList({cardId: val})
            .then( res => this.levelList = res.data)
        },
        // 关闭弹窗
        handleCancel(e) {
            this.visible = false;
        },
        // 点击弹窗确定
        handleOk(e) {
            this.confirmLoading = true;
            if(this.selectedRows.length > 0) {
                this.visible = false;
                this.couponName = this.selectedRows[0].couponTitle;
                this.couTypeCode = this.selectedRows[0].couTypeCode;
                this.showRedBorder = false;
                this.id = this.selectedRows[0].id;
                console.log('=======', this.selectedRows)
                if (this.selectedRows[0].validityType == 1) {
                    this.couponValid = `${this.selectedRows[0].validityStartTime} - ${this.selectedRows[0].validityEndTime}`
                } else {
                    this.couponValid = `有效天数: ${this.selectedRows[0].validityDayNums}天，${this.selectedRows[0].takeEffectDayNums}天后生效`
                }
            } else {
                this.$message.error('必须选择一个卡券!')
            }
            this.confirmLoading = false;
        },
        // 查询卡券列表
        onSearch(args) {
            console.log(args)
            const { activity, title, type } = args
            this.activity = activity || null;
            this.title = title || null;
            this.type = type || null;
            this.current = 1;
            this.getCouponList()
        },
        // 切换卡券列表分页
        onShowSizeChange(current, pageSize) {
            this.current = current;
            this.pageSize = pageSize;
            this.getCouponList()
        },
        // 获取卡券列表
        getCouponList() {
            this.tableLoading = true;
            let args = {
                pageIndex: this.current,
                pageSize: this.pageSize,
                activity: this.activity,
                type: this.type,
                title: this.title,
                status: 1
            }
            api.getCouponList(args)
            .then( res => {
                console.log(res)
                this.tableLoading = false;
                this.tableDataList = res.data.records.map((item, index) => {
                    return {
                        ...item,
                        key: index
                    }
                });
                this.total = res.data.total;
            })
            .finally( () => this.tableLoading = false)
        },
        // 打开弹窗
        handleSelectCoupon() {
            this.visible = true;
        },
        // 获取会员卡列表
        getCardList() {
            api.getCardList({})
            .then( res => {
                this.cardList = res.data
            })
        },
        // 获取系统列表
        getSystemList() {
            api.getClientList()
            .then( res => {
                this.systemList = res.data
            })
        },
        // 开始派发
        couponDistribute() {
            console.log('111111111')
            if (!this.couTypeCode) {
                this.showRedBorder = true
            }
            let args = {
                couTypeCode: this.couTypeCode,
                id: this.id
            }
            this.formBasic.validateFields((err, values) => {
                console.log(values)
                if (!err) {
                    if (values.file) {
                        Object.assign(args, values, {file: this.dataSourse.file})
                    } else if (values.clientId) {
                        Object.assign(args, values, {clientId: values.clientId.join(',')})
                    } else if(values.condition == 2 && values.issueRange == 4) {
                        Object.assign(args, values, { memberCardName: this.dataSourse.memberCardName })
                    } else {
                        Object.assign(args, values)
                    }
                    debounce(
                        () => api.couponDistribute(Object.keys(args).reduce((pre, key) => {
                            pre.append([key], args[key]);
                            return pre;
                        }, new FormData()))
                        .then(
                            res => res.code == 200 && this.$router.push({name: 'release_status'})
                        ),
                    1000)
                }
            }); 
        },
    },
    watch: {
        condition: function (newVal, oldVal) {
            switch(newVal) {
                case 1:
                    this.issueForm = couponsCenterList;
                    break;
                case 4:
                    this.issueForm = cardList;
                    break;
                case 3:
                    this.issueForm = bangdouList;
                    break;
                default:
                    this.issueForm = [];
                    break
            }
        },
        visible: function (newVal, oldVal) {
            if (newVal) {
                this.getCouponList()
            }
        }
    },
    computed: {
        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    this.selectedRows = selectedRows;
                },
                type: 'radio'
            };
        },
    }
}
</script>
<style lang="less" scoped>
    .create{
        background-color: #fff;
        &-header{
            padding: 16px 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e9e9e9;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            &-title {
                font-weight: 600;
                color: #666666;
            }
            &-fallback {
                cursor: pointer;
                font-weight: 400;
                color: #374fc7;
            }
        }
        &-main{
            &-title{
                font-size: 16px;
                color: #7f7f7f;
                padding-left: 40px;
                line-height: 50px;
                margin: 0;

                .ant-divider,
                .ant-divider-vertical {
                    margin: 0 8px 0 0;
                }
            }
            &-uploadTip{
                font-size: 12px;
                color: #c1c1c1;
            }
            &-button{
                text-align: right;
                padding-top: 40px;
                &-items{
                    margin: 0 10px;
                }
            }
            &-couponSelect{
                width: 100%;
                line-height: 32px;
                height: 32px;
                border: 1px solid #bfbfbf;
                color: #bfbfbf;
                padding-left: 10px;
                border-radius: 3px;
            }
            &-couponSelectTip{
                color: #f5222d;
                margin: 0;
                line-height: 1.5;
                padding-top: 3px;
            }
        }
    }
    .border-red{
        border-color: #f5222d;
    }
</style>
