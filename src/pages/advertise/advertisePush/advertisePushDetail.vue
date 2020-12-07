<template>
  <div id="advertisePushDetail">
    <div class="content-header">
      查看广告推送
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main">
      <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" style="padding:30px 10px;">
        <a-form-model-item label="标题">
          {{data.title}}
        </a-form-model-item>
        <a-form-model-item label="推送时间">
          {{ data.pushTime ? moment(data.pushTime).format("YYYY-MM-DD HH:mm:ss") : "" }}
        </a-form-model-item>
        <a-form-model-item label="创建人">
          {{data.createUserName}}
        </a-form-model-item>
        <a-form-model-item label="适用项目">
          <span v-for='(item,index) in showProjectList' :key="index">{{item + ' '}}</span>
          <span v-if=" projectList.length > 5 && showProjectAll == false ">...</span>
          <span @click="showProjectAll = !showProjectAll" style="color: #4B7AFB;margin-left:10px;" v-if=" projectList.length > 5 ">{{projectWord}}</span>
        </a-form-model-item>
        <a-form-model-item label="推送用户">
          <div v-if="data.pushType === 0">
            <span v-for='(item,index) in showIdentityList' :key="index">{{item.name + ' '}}</span>
            <span v-if=" identity.length > 5 && showUserAll == false ">...</span>
            <span @click="showUserAll = !showUserAll" style="color: #4B7AFB;margin-left:10px;" v-if=" identity.length > 5 ">{{identityWord}}</span>
          </div>
          <div v-if="data.pushType === 1">
            <span v-for='(item,index) in showLabelList' :key="index">{{item + ' '}}</span>
            <span v-if=" labelList.length > 5 && showLabelAll == false ">...</span>
            <span @click="showLabelAll = !showLabelAll" style="color: #4B7AFB;margin-left:10px;" v-if=" labelList.length > 5 ">{{labelWord}}</span>
          </div>
        </a-form-model-item>
        <a-form-model-item label="类型">
          {{ data.type === 0 ? "链接" : data.type === 1 ? "自定义" : data.type === 2 ? "模块" : ""}}
        </a-form-model-item>
        <a-form-model-item label="跳转链接" v-if="data.type === 0">
          {{data.url}}
        </a-form-model-item>
        <a-form-model-item label="跳转模块" v-if="data.type === 2">
          {{data.model}}
        </a-form-model-item>
        <a-form-model-item label="详细内容" v-if="data.type === 1">
          <div v-for="(item, index) in data.details" :key="index">
            <p v-if="item.type==='text'" style="color:#666666;font-size:12px;">{{item.content}}</p>
            <img v-else :src="item.content" style="max-width: 100%;width:150px;height:auto;margin-top:10px;" />
          </div>
        </a-form-model-item>
<!--        <a-form-model-item label="点击次数">-->
<!--          {{form.link}}-->
<!--        </a-form-model-item>-->
<!--        <a-form-model-item label="点击人数">-->
<!--          {{form.link}}-->
<!--        </a-form-model-item>-->
      </a-form-model>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapActions } from "vuex"
  import moment from "moment"
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
  export default {
    name: "advertisePushDetail",
    props: {
      id: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        data: {},
        projectData: [],
        labelData: [],
        labelList: [],
        projectList: [],
        showProjectAll: false,
        showLabelAll: false,
        showUserAll: false,
        identityData: [
          {
            id: 1,
            name: "业主"
          },
          {
            id: 2,
            name: "租户"
          },
          {
            id: 3,
            name: "商户"
          },
          {
            id: 4,
            name: "前期管理费单位"
          },
          {
            id: 5,
            name: "家人"
          },
          {
            id: 6,
            name: "朋友"
          },
        ],
        identity: []
      }
    },
    components: {
      AFormModelItem
    },
    computed:{
      showProjectList:function() {
        if(this.showProjectAll == false){
          var showProjectList = [];　　　　　　　　　　　　　　
          if(this.projectList.length > 5){　　　　　
            for(var i=0;i<5;i++){
              showProjectList.push(this.projectList[i])
            }
          }else{
            showProjectList = this.projectList
          }
          return showProjectList;　　　　　　　　　　　　　　　
        }else{
          return this.projectList;
        }
      },
      showLabelList:function() {
        if(this.showLabelAll == false){
          var showLabelList = [];　　　　　　　　　　　　　　
          if(this.labelList.length > 5){　　
            for(var i=0;i<5;i++){
              showLabelList.push(this.labelList[i])
            }
          }else{
            showLabelList = this.labelList
          }
          return showLabelList;　　　　　　　　　　　　　　　　
        }else{
          return this.labelList;
        }
      },
      showIdentityList:function() {
        if(this.showUserAll == false){
          var showIdentityList = [];
          if(this.identity.length > 5){
            for(var i=0;i<5;i++){
              showIdentityList.push(this.identity[i])
            }
          }else{
            showIdentityList = this.identity
          }
          return showIdentityList;
        }else{
          return this.identity;
        }
      },
      projectWord:function(){
        if(this.showProjectAll == false){　　　　　　　　　　
          return "展开全部"
        }else{
          return "收起"
        }
      },
      labelWord:function(){
        if(this.showLabelAll == false){　　　　　　　　　　　
          return "展开全部"
        }else{
          return "收起"
        }
      },
      identityWord:function(){
        if(this.showUserAll == false){
          return "展开全部"
        }else{
          return "收起"
        }
      }
    },
    created () {
      this.getNoticeDetail();
    },
    methods: {
      moment,
      ...mapActions([
        "FALLBACK"
      ]),
      handleProjectData(data, ids, project=[]) {
        data.forEach(item => {
          ids.forEach((id)=>{
            if (item.id === id) {
              project.push(item.name)
            }
          });
        });
        return project;
      },
      //获取项目列表
      getProjectList() {
        api.advertiseProject().then(res => {
          if (res.code === 200) {
            this.projectData = res.data;
            this.projectList = this.handleProjectData(this.projectData,this.data.projectIds)
          }
        })
      },
      //获取用户标签
      getUserLabel() {
        api.advertiseUserLabel().then(res => {
          if (res.code === 200) {
            // console.log(res.data);
            this.labelData = res.data;
            this.labelList = this.handleProjectData(this.labelData,this.data.labels)
          }
        })
      },
      //获取详情
      getNoticeDetail() {
        const para = {
          advertId: this.id.id
        };
        api.getAdvertiseDetail(para).then((res) => {
          if (res.code === 200) {
            this.data = res.data;
            if(res.data.identities) {
              this.identityData.forEach((item)=>{
                res.data.identities.forEach((id)=>{
                  if(item.id === id) {
                    this.identity.push(item)
                  }
                })
              });
            }
            this.getProjectList();
            this.getUserLabel()
          }
        });
      },
    },
  }
</script>

<style lang="less" scoped>
  #advertisePushDetail{
    height: 100%;
    /*overflow: hidden;*/
  }
</style>
