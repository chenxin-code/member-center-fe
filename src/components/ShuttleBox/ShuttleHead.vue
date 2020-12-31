<template>
    <div class="search-wrap">
        <div class="search-item-4">
            <div class="name">标准代码</div>
            <div class="val">
            <a-input v-model="StandFrom.standardCode" allowClear placeholder="请输入名称"/>
            </div>
        </div>
        <div class="search-item-4">
            <div class="name">业态</div>
            <div class="val">
                <a-select placeholder="请选择业态" v-model="StandFrom.businessFormatId" allowClear class="select-class">
                    <a-select-option v-for="(item, key) in businessFormatArr" :key="key" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="search-item-4">
            <div class="name">专业线</div>
            <div class="val">
                <a-select placeholder="请选择专业线" v-model="StandFrom.specialLineId" allowClear class="select-class">
                    <a-select-option v-for="(item, key) in specialLineArr" :key="key" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="search-item-4">
            <div class="name">类别</div>
            <div class="val">
                <a-select placeholder="请选择类别" v-model="StandFrom.standardTypeId" allowClear class="select-class">
                    <a-select-option v-for="(item, key) in standardTypeArr" :key="key" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="search-item-4">
            <div class="name">标准年份</div>
            <div class="val">
                <a-select placeholder="请选择年份" v-model="StandFrom.standardYear" allowClear class="select-class">
                    <a-select-option v-for="(item, key) in getObjYears" :key="key" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
            </div>
        </div>
        <a-button type="primary" @click="searchHandle">查询</a-button>
    </div>
</template>

<script>
import { getObjYears } from "@/utils/util";
import api from "@/api";

export default {
    name: "ShuttleHead",
    props: {

    },
    watch: {

    },
    data() {
        return {
            getObjYears: getObjYears(),
            specialLineArr: [],
            businessFormatArr: [],
            standardTypeArr: [],
            StandFrom:{
                standardCode:"",
                businessFormatId:"",
                specialLineId:"",
                standardTypeId:"",
                standardYear:"",
            }
        };
    },

    mounted() {
        this.getSpecialLineOption()
        this.getBusinessFormatList()
        this.getStandardTypeOption()
    },

    methods: {

        //专业线
        getSpecialLineOption(){
            api.getQuCommonCodeList({
                parentId: 12
            }).then(res => {
                if (res.code === 200) {
                    const newArr = res.data.list.map(item => ({
                        id: item.codeId,
                        name: item.name,
                    }));
                    this.specialLineArr = [{id:"", name:"全部"}, ...newArr]
                }
            })
        },
        //获取业态
        getBusinessFormatList() {
            api.getQuCommonCodeList({
                parentId: 10
            }).then(res => {
                console.log(res)
                if (res.code === 200) {
                    const newArr = res.data.list.map(item => ({
                        id: item.codeId,
                        name: item.name,
                    }));
                    this.businessFormatArr = [{id:"", name:"全部"}, ...newArr]
                }
            })
        },
        //类别
        getStandardTypeOption(){
            api.getQuCommonCodeList({
                parentId: 14
            }).then(res => {
                if (res.code === 200) {
                    const newArr = res.data.list.map(item => ({
                        id: item.codeId,
                        name: item.name,
                    }));
                    this.standardTypeArr = [{id:"", name:"全部"}, ...newArr]
                }
            })
        },

        //点击搜索
        searchHandle(){
            this.$emit("search",this.StandFrom)
        }
    },
};
</script>

<style scoped lang="less">
    .select-class{
        width: 100% !important;
    }
</style>