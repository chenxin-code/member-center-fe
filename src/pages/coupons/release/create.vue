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
                    <a-select 
                        placeholder="请选择"
                    ></a-select>
                </a-form-item>
                <a-form-item label="卡券有效期：">
                    <a-input disabled/>
                </a-form-item>
                <p class="create-main-title">
                    <a-divider type="vertical" style="width: 3px; backgroundColor: #4c7afb" />
                    卡券发放信息
                </p>
                <a-form-item label="领取条件设置：">
                    <a-select placeholder="请选择" :defaultValue="1" v-model="requirement">
                        <a-select-option 
                            v-for="item in receiveList" 
                            :key="item.value" 
                            :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item 
                    v-show="requirement !== 2"
                    v-for="item in issueForm"
                    :key="item.label"
                    :label="item.label">
                    <a-input :placeholder="item.placehold"/>
                </a-form-item>
                <div v-show="requirement == 2">
                    <a-form-item label="发放范围">
                        <a-select :defaultValue="0" v-model="dataSourse.issueRange">
                            <a-select-option v-for="item in issueRange" :key="item.label" :value="item.value">{{item.label}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="上传指定会员" v-show="dataSourse.issueRange == 1">
                        <a-upload>
                            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                            <p class="create-main-uploadTip">支持扩展名：.txt，支持批量上传会员手机号或会员UUID，重复会员计算一次</p>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="接入系统"  v-show="dataSourse.issueRange == 2">
                        <a-checkbox-group>
                            <a-checkbox v-for="item in systemList" :key="item.label" :value="item.value">{{item.label}}</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="指定会员卡"  v-show="dataSourse.issueRange == 3">
                        <a-select>
                            <a-select-option value="card">邻里会员卡</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="会员等级"  v-show="dataSourse.issueRange == 3">
                        <a-form-item
                            :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
                        >
                            <a-select style="width: 100%" >
                                <a-select-option v-for="item in levelList" :key="item.label" :value="item.value">{{item.label}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                            -
                        </span>
                        <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                            <a-select style="width: 100%" >
                                <a-select-option v-for="item in levelList" :key="item.label" :value="item.value">{{item.label}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form-item>
                </div>
                <a-form-item class="create-main-button">
                    <a-button type="primary" class="create-main-button-items">发放</a-button>
                    <a-button class="create-main-button-items">取消</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script>
import {couponsCenterList, bangdouList, cardList, level} from './createForms';

export default {
    name: 'release_create',
    data () {
        return {
            formBasic: this.$form.createForm(this, { name: 'formBasic' }),
            levelList: level,
            receiveList: [
                { label: '领券中心', value: 1 },
                { label: '直接发放', value: 2 },
                { label: '邦豆兑换', value: 3 },
                { label: '卡密兑换', value: 4 },
            ],
            systemList: [
                { label: '邻里邦Pro', value: 1 },
                { label: '企业邦', value: 2 },
                { label: '时代+', value: 3 },
            ],
            requirement: 1,
            issueRange: [
                { label: '全部会员', value: 0 },
                { label: '指定会员', value: 1 },
                { label: '指定接入系统', value: 2 },
                { label: '指定会员卡', value: 3 },
            ],
            issueForm: couponsCenterList,
            dataSourse: {
                issueRange: 0
            }
        }
    },
    watch: {
        requirement: function (newVal, oldVal) {
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
        }
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
        }
    }
</style>