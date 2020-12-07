<template>
  <div id="activity">
    <div class="content-header">标准管理</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FromSecond
            ref="form"
            rowCol="3"
            :formList="formList"
            :onSubmit="onCheck"
          />
          <a-button type="primary" @click="onAdd" icon="plus">新建</a-button>
          <a-button type="primary" @click="onDownLoad" icon="download" style="margin-left:20px;">导 入</a-button>
          <a-button type="primary" @click="onUpload" icon="to-top" style="margin-left:20px;" :loading="btnLoading">导出</a-button>
          <a-checkbox @change="onChange" style="margin-left:20px;"> 显示已禁用标准</a-checkbox>

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
                <a @click="downloadExcel">品质系统标准导入模板.xlsx</a>
              </div>
            </div>

            <template slot="footer">
              <a-button key="cancel" @click="close_dialog">
                取消
              </a-button>
              <a-button key="ok"  type="primary" @click="confirm_dialog" :loading="btnLoading">
                确认
              </a-button>
            </template>
          </a-modal>

          <!-- 表格 -->
          <a-table
            :columns="tableColumns"
            :row-key="(r,i) => i"
            :data-source="tableData"
            :scroll="{ x: 1580, y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top:8px;"
          >
            <template slot="totalScore" slot-scope="scope">
              {{scope ? scope.toFixed(2) : '0.00'}}
            </template>
            <template slot="weight" slot-scope="scope">
              {{scope ? scope.toFixed(2) : '0.00'}}
            </template>

		        <template slot="status" slot-scope="operation">
              <div class="editable-row-operations">
                {{operation.status === '0' ? "已禁用" : "已启用" }}
              </div>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a  @click="onChangeStatus(operation)">{{operation.status === '0' ? "启用" : "禁用" }}</a>
			          <a  @click="onEdit(operation)" style="margin-left:20px;">编辑</a>
                <a  @click="onDelete(operation)" style="margin-left:20px;">删除</a>
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

    <!-- 错误原因 -->
    <a-modal v-model="errVisible" title="上传错误原因">
      <template v-for="(item,index) in errArr">
        <span :key="index" style="margin-bottom:5px">{{index + 1}}. {{item}}</span><br/>
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
import {getFiveYears,getObjYears,formatDateTime} from '@/utils/util.js'
import url from '@/api/urlConfig.js'
import axios from 'axios'
import request from '@/utils/ajax.js'

export default {
  name: "standard",
  data() {
    return {
		btnLoading:false,
      formList: [
        {
          label: "标准代码",
          type: "input",
          name: "standardCode",
          placeholder: "请输入",
          initialValue:""
		  	},
			 {
          label: "业态",
          type: "select",
          name: "businessFormatId",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:""
			},
			{
          label: "服务模式",
          type: "select",
          name: "serviceModeId",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:""
			},
			{
          label: "专业线",
          type: "select",
          name: "specialLineId",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:""
      },
			{
          label: "指标属性",
          type: "select",
          name: "dataAttributesId",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:""
      },      
 			{
          label: "类别",
          type: "select",
          name: "standardTypeId",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:"",
          showSearch: true,
           onChange: this.onChangeType
      }, 
      {
          label: "类别描述",
          type: "select",
          name: "typeDescription",
          placeholder: "全部",
          selectOptions: [{id:"", name:"全部"}],
          initialValue:"",
          showSearch: true
        }, 
       {
          label: "标准年份",
          type: "select",
          name: "standardYear",
          placeholder: "",
          selectOptions: getObjYears(),
          initialValue: getObjYears()[1].id
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
      businessFormatData:[],//业态
      serviceModeData:[],//服务模式
      specialLineData:[],//专业线
      dataAttributesData:[],//服务指标
      standardTypeData:[],//标准类别
      //表格高度
      scrollY: 100,
      //列表数据(表格)
      tableData: [],
      tableLoading: false,
      //表头数据
      tableColumns: [
        {
          title: "标准代码",
          key: "standardCode",
          dataIndex: "standardCode",
        },
        {
          title: "业态",
          dataIndex: "businessFormatName",
          key: "businessFormatName",
        },
        {
          title: "服务模式",
          dataIndex: "serviceModeName",
          key: "serviceModeName",
        },
        {
          title: "专业线",
          key: "specialLineName",
          dataIndex: "specialLineName",
        },
        {
          title: "指标属性",
          key: "dataAttributesName",
          dataIndex: "dataAttributesName",
        },
        {
          title: "总分值",
          key: "totalScore",
          dataIndex: "totalScore",
          scopedSlots: { customRender: "totalScore" },
        },
        {
          title: "细项权重",
          key: "weight",
          dataIndex: "weight",
          scopedSlots: { customRender: "weight" },
        },
        {
          title: "类别",
          key: "standardTypeName",
          dataIndex: "standardTypeName",
        },        
        {
          title: "类别描述",
          key: "typeDescriptionName",
          dataIndex: "typeDescriptionName",
          ellipsis: true,
        }, 
        {
          title: "整改期限",
          key: "rectificateLimit",
          dataIndex: "rectificateLimit",
        },
        {
          title: "标准年份",
          key: "standardYear",
          dataIndex: "standardYear",
        },
        {
          title: "状态",
          key: "status",
          fixed: "right",
          width: 100,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          width: 200,
          scopedSlots: { customRender: "operation" },
        },
      ],
      importExcelVisible: false,
      downloadFiles:[],
      file:null,
      status: "",
      errVisible:false,
      errArr:[]
    };
  },
  components: {
      FromSecond
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.content_main.offsetHeight - 320 + "px";
    }, 100);
    this.form = this.$form.createForm(this, { name: 'formList' });
    this.getBusinessFormatList();//业态
    this.getServiceModeOption();//服务模式
    this.getSpecialLineOption();//专业线
    this.getDataAttributesOption();//指标属性
    this.getStandardTypeOption();//类别
    //标准年份
	this.status='1';
    this.getTableData();
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
           'https://times-dev-backend.oss-cn-shenzhen.aliyuncs.com/decorate-servcie/%E5%93%81%E8%B4%A8%E7%B3%BB%E7%BB%9F%E6%A0%87%E5%87%86%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
       )
    },
      
    confirm_dialog(){
      if(!this.file){ 
        this.$message.error("请先选择文件")
        return  
      }
      this.saveFile(this.file)
    },

     // 重写a-upload的文件上传处理方式
    downloadFilesCustomRequest (data) {  
      if(this.downloadFiles.length){
        this.$message.error("只能上传一个文件")
        return
      }
      this.file = data
      this.downloadFiles.push( data.file)
    },  
    // 上传并保存文件
    saveFile (data){  
      console.log(data)
        const formData = new FormData()  
        formData.append('file', data.file)  
		this.btnLoading = true;
        api.uploadEx2(formData).then(res => {
          console.log(res)
		  this.btnLoading = false;
          if(res.code == 200){
            this.close_dialog()
            this.$message.success('上传成功');
			this.getTableData();
          }else if(res.code == 501){
            this.errArr = res.data || []
            this.errVisible = true
			this.close_dialog();
          }else{
            this.$message.error('上传失败');
			this.close_dialog();
          }
        }).catch((err) => {
          console.log(err)
			this.btnLoading = false;
            this.$message.error('请求失败');
			this.close_dialog();
        });
    },

    // 没错，删除某个已上传的文件的时候，就是调用的这里
    handleDownloadFileRemove (file) {  
        const index = this.downloadFiles.indexOf(file)  
        const newFileList = this.downloadFiles.slice()  
        newFileList.splice(index, 1)  
        this.downloadFiles = newFileList  
        this.file = null
    },

    onChange(e){
      console.log(e);
	    if (e.target.checked) {
		    this.status = '0';
      } else {
        this.status = '1';
      }
    },
        //
    onChangeType(e){
      let obj = {};
      console.log(e);
      obj = this.standardTypeData.find(item => {
        //这里的select01就是上面遍历的数据源
        return item.codeId === e; //筛选出匹配数据
      });
      console.log(obj);
       const para = {
		      parentId: obj.id
	      };
        api.getQuCommonCodeList(para).then(res => {
          if (res.code === 200) {            
            const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
            }));
            this.typeDescriptionData = res.data.list;
            this.formList[6].selectOptions = this.formList[6].selectOptions.concat(newArr);
          }
      })
    },
    //查询按钮
    onCheck() {
      this.current = 1;
      this.getTableData();
    },
    //删除活动
    onDelete(e) {
      console.log(e);
      const that = this;
      this.$confirm({
        title: "提示",
        // content: `确定要删除 ${e.standardCode}？`,
        content: `确认删除该标准？`,
        onOk() {
          that.tableLoading = true;
          api.deleteStandard({
            id: e.id
          }).then(res => {
            if (res.code === 200) {
              if(res.data){
                that.$error({
                  title: "删除标准",
                  content: res.data
                });
                that.tableLoading = false;
              }else{
                that.$message.success("删除成功");
                that.getTableData();
              }
            } else {
              that.$error({
                title: "删除标准",
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
    //编辑活动
    onEdit(e) {
      this.$router.push({
          name: "standardEdit",
          params: {
            id: {...e}
          }
      })
	   },
    //启用禁用
    onChangeStatus(e) {
      console.log(e);
      let status = e.status
      this.$confirm({
        title: "提示",
        content: status == 0 ? '确认启用该标准？' : '确认禁用该标准？',
        onOk:() => {
          this.tableLoading = true;
          const para = {
            id: e.id,
            status: status == 1 ? 0 : 1
          };
          api.updateStandardStatus(para).then(res => {
            this.tableLoading = false;
            if (res.code === 200) {
              this.getTableData();
            } else {
              this.$success({
                title: "更改状态标准",
                content: res.message
              })
            }
          }).catch(() => {
            this.tableLoading = false;
          })
        },
      });
    },
    //新建
    onAdd() {
      this.$router.push({path: "/qualityManagement/standard/add"});
    },
    onDownLoad() {
      this.importExcelVisible = true
    },
    onUpload() {
      if(this.tableData.length == 0){
        this.$message.warn('没有可导出的数据。')
        return
      }

      this.btnLoading = true

      request.downLoad(url.GET_ZIPTWO,{
        ...this.$refs.form.getFieldsValue()
      }).then(res => {
        console.log(res)
        this.btnLoading = false
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `标准_${formatDateTime()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })

    //   const { 
    //     standardCode, 
    //     businessFormatId ,
    //     serviceModeId,
    //     specialLineId,
    //     dataAttributesId,
    //     standardTypeId,
    //     typeDescription,
    //     standardYear,
		// status
    //   } = this.$refs.form.getFieldsValue();
    //   const para = {
    //       standardCode,
    //       businessFormatId,
    //       serviceModeId,
    //       specialLineId,
    //       dataAttributesId,
    //       standardTypeId,
    //       typeDescription,
    //       standardYear,
		//   status: this.status
    //     };
    //   api.getStandardZip(para).then(res => {
    //       console.log(res);
    //     }).finally(()=>{
    //     });
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
        const { standardCode, 
              businessFormatId ,
              serviceModeId,
              specialLineId,
              dataAttributesId,
              standardTypeId,
              typeDescription,
              standardYear,
			  status} = this.$refs.form.getFieldsValue();
        const para = {
          pageIndex: this.current,
          pageSize: this.pageSize,
          standardCode,
          businessFormatId,
          serviceModeId,
          specialLineId,
          dataAttributesId,
          standardTypeId,
          typeDescription,
          standardYear,
		  status: this.status
        };
        console.log(para);
        api.getStandardList(para).then(res => {
          console.log(res);
          this.total = res.data.totalCount;
          this.tableData = res.data.datalist;
          this.tableLoading = false;
        }).finally(()=>{
          this.tableLoading = false;
        });
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
          this.businessFormatData = res.data.list;
          this.formList[1].selectOptions = this.formList[1].selectOptions.concat(newArr)
        }
      })
    },

    //服务模式
    getServiceModeOption(){
        api.getQuCommonCodeList({
          parentId: 11
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
            }));
            this.serviceModeData = res.data.list;
            this.formList[2].selectOptions = this.formList[2].selectOptions.concat(newArr)
          }
        })
    },

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
            this.specialLineData = res.data.list;         
            this.formList[3].selectOptions = this.formList[3].selectOptions.concat(newArr)
          }
        })
    },

    //指标属性
    getDataAttributesOption(){
        api.getQuCommonCodeList({
          parentId: 13
        }).then(res => {
          if (res.code === 200) {
            const newArr = res.data.list.map(item => ({
              id: item.codeId,
              name: item.name,
            }));
            this.dataAttributesData = res.data.list;
            this.formList[4].selectOptions = this.formList[4].selectOptions.concat(newArr)
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
            this.standardTypeData = res.data.list;
            this.formList[5].selectOptions = this.formList[5].selectOptions.concat(newArr)
          }
        })
    },

    },
  }
</script>

<style lang="less" scoped>
#activity {
  height: 100%;
  overflow: hidden;
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
  // /deep/ .ant-upload-list.ant-upload-list-text {
  //   color: red !important;
  // }
}
</style>
