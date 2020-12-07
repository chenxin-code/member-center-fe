<!-- 住户详情框架 -->
<template>
  <div id="residentDetail">
    <div class="main-left">
      <div class="content-header">住户详情 <span class="fallback" @click="FALLBACK">返回</span></div>
      <div class="content-main" ref="content-main">
        <a-row type="flex" style="padding:20px;flex-flow: row;">
          <a-col flex="186px" class="left_content">
            <a-list class="left-list">
              <a-list-item v-for="item of tabList" :key="item.name" :class="{active: currentIndex === item.name}" @click="tabChange(item.name)">{{item.label}}</a-list-item>
            </a-list>
          </a-col>
          <a-col flex="auto" style="padding:0 10px;height:100%;">
            <component :project="project" :is="curTab"></component>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="main-right">
      <div class="content-header">标签</div>
      <div class="content-main-left">
         <div class="right-tag">
            <component component :is="bindTag"></component>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import TabBseMes from "./tabBaseMes.vue";
import TabPetMes from "./tabPetMes"
import TabIdeMes from "./tabIdeMes";
import TabHomeMes from "./tabHomeMes";
import TabNeedMes from "./tabNeedMes";
import TabAddressMes from "./tabAddressMes";
import TabContactMes from "./tabContactMes";
import TabCarMes from "./tabCarMes";
import TabBankMes from "./tabBankMes";
import TabHouseMes from "./tabHouseMes";
import TabNoteMes from "./tabNoteMes";
import EditTag from "./editTag.vue";
import AListItem from "ant-design-vue/es/list/Item";
import { mapActions } from "vuex"

export default {
  mounted() {
    // console.log(this.$route.params.project);
    // console.log(this.project);
  },
  name: "ResidentDetail",
  props:{
    project:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  components: {
    AListItem,
    tabBase: TabBseMes,
    tabPet: TabPetMes,
    tabIde: TabIdeMes,
    tabHome: TabHomeMes,
    tabNeed: TabNeedMes,
    tabAddress: TabAddressMes,
    tabContact: TabContactMes,
    tabCar: TabCarMes ,
    tabBank: TabBankMes,
    tabHouse: TabHouseMes,
    tabNote: TabNoteMes,
    editTag: EditTag,
  },
  data() {
    return {
      curTab: "tabBase",
      tabList:[
        {name:"tabBase",label:"基本概况"},
        {name:"tabPet",label:"宠物信息"},
        {name: "tabIde",label:"证件信息"},
        {name: "tabHome",label:"家庭信息"},
        {name: "tabNeed",label:"增值需求服务"},
        {name: "tabAddress",label:"通讯信息"},
        {name: "tabContact",label:"联系方式"},
        {name: "tabCar",label:"车辆信息"},
        {name: "tabBank",label:"银行卡信息"},
        {name: "tabHouse",label:"房产信息"},
        {name: "tabNote",label:"备注"},
      ],
      editTag: [{name: "editTag",label:"标签"}],
      currentIndex: "tabBase",
      bindTag: "editTag"
    }
  },
  methods: {
    tabChange(tar){
      this.curTab = tar;
      this.currentIndex = tar;
    },
    ...mapActions([
        "FALLBACK"
      ]),
  },
}
</script>

<style lang="less" scoped>
.content-main {
  height: 100%;
  padding: 10px 0;
  overflow: scroll;
}
#residentDetail {
  height: 100%;
  overflow: hidden;
  background: #f0f2f5;
  // 左部
  .main-left{
    width: 75%;
    box-sizing: border-box;
    float: left;
    height: 100%;
    background: white;
    .content-header{
      .fallback{
        cursor: pointer;
      }
    }
  }
  .left_content{
    height: 100%;
    width: 100%;
    margin-bottom: 40px;
    background: #F7F8FC;
    .left-list{
      width: 100%;
      padding: 10px;
      li{
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        cursor: pointer;
      }
      li.active{
        background: #E2F3FF;
        border: 1px solid #4B7AFB;
        border-radius: 2px;
        color: #4B7AFB;
        font-family: PingFangSC-Semibold;
      }
    }
  }
  // 右部
  .main-right{
    width: 24%;
    box-sizing: border-box;
    float: right;
    height: 100%;
    background: white;
    .content-main-left{
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
