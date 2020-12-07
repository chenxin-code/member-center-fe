<template>
  <div id="activity">
    <div class="content-header" style="font-weight:bold">巡检点管理</div>

    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd" icon="plus">新 建</a-button>
          <a-button type="primary" @click="importExcel" icon="download" style="margin-left:20px;">导 入</a-button>
          <a-button type="primary" @click="onUpload" icon="to-top" style="margin-left:20px;" :loading="btnLoading">导出二维码</a-button>

          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="qrCode" slot-scope="operation">
              <div class="editable-row-operations">
                <a  @click="onDownLoad(operation)">下载</a>
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <!-- <a  @click="onChangeStatus(operation)">{{operation.status === 0 ? "启用" : "禁用" }}</a> -->
			          <a  @click="onEdit(operation)" >编辑</a>
                <a-divider type="vertical" />
                <a  @click="onDelete(operation)" >删除</a>
              </div>
            </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :default-current="current"
            :page-size.sync="pageSize"
            :pageSizeOptions="['10','20','30','50','100']"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            style="margin-top:10px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>

    <!-- 二维码弹框 -->
      <div id="imgCanvas" ref="imgCanvas">
        <div id="qr-img" style="display: flex;justify-content: center;"></div>
        <div class="img-text">{{items.name}}</div>
      </div>

    <!--导入Excel弹框 -->
    <a-modal v-model="importExcelVisible" title="导入EXCEL">
      <div class="up-form-item">
        <div class="wrap-txt">选择文件：</div>
        <div class="wrap-text" >
          <a-upload
            :multiple="true"
            :fileList="downloadFiles"
            :remove="handleDownloadFileRemove"
            :customRequest="downloadFilesCustomRequest"
            style="display:flex"
          >
            <a-button><a-icon type="cloud-upload" />上传文件</a-button>
          </a-upload>
        </div>
      </div>
      <div class="up-form-item">
        <div class="wrap-txt">下载模版：</div>
        <div class="wrap-text">
          <a-icon type="link" />
          <a @click="downloadExcel">品质系统巡检点导入模板</a>
        </div>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="close_dialog">取消</a-button>
        <a-button key="ok"  type="primary" @click="confirm_dialog" :loading="btnLoading">确认</a-button>
      </template>
    </a-modal>

    <!-- 错误原因 -->
    <a-modal v-model="errVisible" title="上传错误原因">
      <template v-for="(item,index) in errArr">
        <span :key="index" style="margin-bottom:5px">{{index + 1}}. {{item}} </span><br/>
      </template>
      <template slot="footer">
        <a-button key="ok" type="primary" @click="errVisible = false">确认</a-button>
      </template>
    </a-modal>

  </div>
</template>

<script>
import api from '@/api';
import FromSecond from '@/components/FromSecond/FromSecond.jsx'
import moment from "moment"
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
import url from '@/api/urlConfig.js'
import request from '@/utils/ajax.js'
import {formatDateTime} from '@/utils/util.js'

export default {
  name: "standard",
  data() {
    return {
      file:null,
      qrImg:"",
      qrcode:null,
      importExcelVisible:false,
      downloadFiles:[],
      visible: false,
      projectList:[{id:"",name:"全部"}],
      areaList:[{id:"",name:"全部"}],
      inspectionUnitList:[{id:"",name:"全部"}],
      form: this.$form.createForm(this, { name: "form" }),
	  btnLoading:false,
      formList: [
        {
          label: "所属项目",
          type: "select",
          name: "projectId",
          placeholder: "请选择项目",
          selectOptions: [],
          selectOptionsCode: "",
          disabled: false,
          onChange: this.onProjectChange,
          initialValue: ""
			  },
	      { 
          label: "所在区域",
          type: "select",
          name: "areaId",
          placeholder: "全部",
          selectOptions: [{id:"",name:"全部"}],
          initialValue: "",
          disabled: true
        },
        {
          label: "巡检单元",
          type: "select",
          name: "inspectionUnitId",
          placeholder: "全部",
          selectOptions: [{id:"",name:"全部"}],
          initialValue: ""
        },
        {
        type: "button",
        buttonName: "查询",
        htmlType: "submit",
        align: "right",
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
        }	
			],
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      //表格高度
      scrollY: 100,
      //列表数据(表格)
      tableData: [],
      tableLoading: false,
      //表头数据
      //表头数据
      tableColumns: [
        {
          title: "巡检点",
          key: "name",
          dataIndex: "name",
        },
        {
          title: "所属项目",
          dataIndex: "projectName",
          key: "projectName",
        },
        {
          title: "所在区域",
          dataIndex: "areaName",
          key: "areaName",
        },
        {
          title: "巡检单元",
          key: "inspectionUnitName",
          dataIndex: "inspectionUnitName",
        },
        {
          title: "地址描述",
          key: "position",
          dataIndex: "position",
        },
        {
          title: "二维码",
          key: "qrCode",
          width: 80,
          scopedSlots: { customRender: "qrCode" },
        },
        {
          title: "操作",
          key: "operation",
          width: 180,
          scopedSlots: { customRender: "operation" },
        },
      ],
      projectId:'',
      project: {},
      projectData:[],
      areaData:[],
      inspectionUnitData:[],
      items:{},
      canvasImageUrl:"",
      errVisible: false,
      errArr:[]
    };
  },
  components: {
      FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 220 + "px";
    }, 100);
    this.getProjectList();//获取工程列表
    // this.getAreaList();//获取区域列表
    this.getInspectionUnitList();//获取巡检单元列表
  },
  created() {
    //this.total = 100;
  },
  methods: {

    close_dialog(){
      this.importExcelVisible = false
      this.downloadFiles = []
      this.file = null
    },
    downloadExcel(){
       window.open(
           'https://times-dev-backend.oss-cn-shenzhen.aliyuncs.com/decorate-servcie/%E5%93%81%E8%B4%A8%E7%B3%BB%E7%BB%9F%E5%B7%A1%E6%A3%80%E7%82%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
       )

    },
     // 重写a-upload的文件上传处理方式
    downloadFilesCustomRequest (data) {
        // this.saveFile(data)  
        console.log(data)
        if(this.downloadFiles.length){
          this.$message.error("只能上传一个文件")
          return
        }
        this.file = data
        this.downloadFiles.push( data.file)
    },  
    confirm_dialog(){
      if(!this.file){ 
        this.$message.error("请先选择文件")
        return  
      }
      this.saveFile(this.file)
    },
    // 上传并保存文件
    saveFile (data){  
      console.log(data)
        const formData = new FormData()  
        formData.append('file', data.file)  
		this.btnLoading = true;
        api.uploadEx(formData).then(res => {
          console.log(res)
		  this.btnLoading = false;
          if(res.code == 200){
            this.close_dialog()
            this.$message.success('上传成功');
			this.getTableData();
          }else if(res.code == 501){
            this.errArr = res.data || []
            this.importExcelVisible = false
            this.errVisible = true
			this.close_dialog();
          }else{
            this.$message.error('上传失败')
			this.close_dialog();
          }
        }).catch((err) => {
          console.log(err)
		  this.btnLoading = false;
          this.$message.error('请求失败')
		  this.close_dialog();
        });
    },
    // 对上传成功返回的数据进行格式化处理，格式化a-upload能显示在已上传列表中的格式（这个格式官方文档有给出的）
    fileFormatter(data) {  
        let file = {  
            uid: data.uuid,    // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突  
            name: data.name,   // 文件名  
            status: 'done', // 状态有：uploading done error removed  
            response: '{"status": "success"}', // 服务端响应内容  
        }  
        return file  
    },
    // 没错，删除某个已上传的文件的时候，就是调用的这里
    handleDownloadFileRemove (file) {  
        const index = this.downloadFiles.indexOf(file)  
        const newFileList = this.downloadFiles.slice()  
        newFileList.splice(index, 1)  
        this.downloadFiles = newFileList  
        this.file = null
    },

    onProjectChange(e, { data }) {
      this.$refs.form.setFieldsValue({ projectId: e });
      this.$refs.form.setFieldsValue({ areaId: "" });
      this.project = {
        id: e,
        name: data.attrs["data-title"]
      };
      if(e){ // 如果有值 查询区域列表
        this.formList[1].disabled = false
        this.getAreaList(e);
      }else{ // 没有 禁用区域选择
        this.formList[1].disabled = true
      }
    },

    //新建
    onAdd() {
      this.$router.push({
          name: "inspectionPointAdd",
          params: {
            project: this.project
          }
      });
   },

   //编辑活动
    onEdit(e) {
      console.log(e,121)
      this.$router.push({
          name: "inspectionPointEdit",
          params: {
            id: {...e},
            project: {id: e.projectId, name: e.projectName}
          }
      })
	  },

    //查询按钮
    handleSubmit() {
      this.current = 1;
      this.getTableData();
    },

    onCheck(){
      this.current = 1;
      this.getTableData();
    },
    //启用禁用
    onChangeStatus(e) {
      console.log(e);
      let value = "0";
      let content = "确定要禁用？";
      if(e.status = "0"){
        value = "1"; 
        content = "确定要启用？";
      }
      const that = this;
      this.$confirm({
        title: "提示",
        content: content,
        onOk() {
          that.tableLoading = true;
          const para = {
            id: e.id,
            status: value
          };
          api.updateStandardStatus(para).then(res => {
            if (res.code === 200) {
              that.getTableData();
            } else {
              that.$success({
                title: "更改状态标准",
                content: res.message
              });
                that.tableLoading = false;
              }
            }).catch(() => {
              that.tableLoading = false;
          });
        },
      });
    },
    //删除活动
    onDelete(e) {
      console.log(e);
      const that = this;
      this.$confirm({
        title: "提示",
        content: `确认删除该巡检点？`,
        onOk() {
          that.tableLoading = true;
            const para = {
              id: e.id
          };
          api.deleteInspectionPoint(para).then(res => {
            if (res.code === 200) {
                if(res.data){
                  that.$error({
                    title: "删除巡检点",
                    content: res.data
                  });
                  that.tableLoading = false;
                }else{
                  that.$message.success("删除成功");
                  that.getTableData();
                }
              }else{
                that.$error({
                  title: "删除巡检点",
                  content: res.message
                });
                that.tableLoading = false;
                }
            }).catch(() => {
              that.tableLoading = false;
          });

          console.log("删除" + e.title);
        },
      });
    },

    onDownLoad(data){
      console.log(data)
      
      document.getElementById("qr-img").innerHTML = ""
      this.qrcode = null

      this.items = data
      this.visible = true
      
      this.$nextTick(() => {
        this.qrcode = new QRCode('qr-img', {  
          width: 200,  // 设置宽度 
          height: 200, // 设置高度
          text: `msg://${data.inspectionPointQrCode}`
        })
        this.downs()
      })
    },

     downs(){
       html2canvas(this.$refs.imgCanvas).then(canvas => {
        let saveUrl = canvas.toDataURL('image/png')
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(saveUrl)
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)
        aLink.download = `${this.items.name}.jpg`
        aLink.href = URL.createObjectURL(blob)
        aLink.click()
      })
    },
    //base64转blob
    base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
    },

    onUpload(){
      if(this.tableData.length == 0){
        this.$message.warn('没有可导出的数据。')
        return
      }
      this.btnLoading = true
      request.downLoad(url.GET_ZIP,{
        ...this.$refs.form.getFieldsValue()
      }).then(res => {
        console.log(res)
        this.btnLoading = false
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `${this.project.name}_巡检点_${formatDateTime()}.zip`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })

      // window.open(`${url.GET_ZIP}?projectId=${projectId}&areaId=${areaId}&inspectionUnitId=${inspectionUnitId}`)
    },

    importExcel(){
       this.importExcelVisible = true;
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.current = current;
      this.pageSize = pageSize;
      this.getTableData();
    },

    //获取表格数据
    getTableData() {
        this.tableLoading = true;
        const { projectId, areaId ,inspectionUnitId} = this.$refs.form.getFieldsValue();
        const para = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          projectId,
          areaId,
          inspectionUnitId,
        };
        console.log(para);
        api.getInspectionPointList(para).then(res => {
          console.log(res);
          this.total = res.data.totalCount;
          this.tableData = res.data.datalist;
          this.tableLoading = false;
        }).finally(()=>{
          this.tableLoading = false;
        });
      },

      //获取工程列表
      getProjectList() {
        //api.decorationProject().then(res => {
        api.qualityPersonProject().then(res => {
          console.log(res)
          if (res.code === 200 && res.data.length) {
            // this.projectList = this.projectList.concat(res.data)
            this.formList[0].selectOptions = this.formList[0].selectOptions.concat(res.data)
            this.$refs.form.setFieldsValue({ projectId: res.data[0].id });
            this.project = {
              id: res.data[0].id,
              name: res.data[0].name
            };
            this.formList[1].disabled = false
            this.getAreaList(res.data[0].id)
            this.getTableData()
          }
        })
      },
    
      //获取区域列表
      getAreaList(e){
        // areaList
        api.getQualityAreaList({
          projectId:e
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            const newArr = res.data.map(item => ({
              id: item.id,
              name: item.areaName,
              projectId: item.projectId,
            }));
            // this.areaList = this.areaList.concat(newArr);
            this.formList[1].selectOptions = [{id:"",name:"全部"}]
            this.formList[1].selectOptions = this.formList[1].selectOptions.concat(newArr)
            // this.total = this.formList[1].selectOptions.length;
          }
        })
      },

      //获取巡检列表
      getInspectionUnitList(){
        api.getQuCommonCodeList({
          parentId: 8
        }).then(res => {
            if (res.code === 200) {
            const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
            }));
              // this.inspectionUnitList = this.inspectionUnitList.concat(res.data.list)
            this.formList[2].selectOptions = this.formList[2].selectOptions.concat(newArr)
			    }
		    })
      }
    },
  }
</script>

<style lang="less" scoped>
#activity {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.content_main {
  height: 100%;
  padding: 10px;
}
.up-form-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  .ant-upload-list.ant-upload-list-text {
    color: red !important;
  }
}

#imgCanvas{
  width: 220px;
  text-align: center;
  margin: auto;
  padding: 2px;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  // border: 1px solid #eee;
  #qr-img{
    img{
      margin-top: 10px;
    }
  }
  .img-text{
    margin: 10px 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
</style>
