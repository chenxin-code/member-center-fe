<template>
  <div class="form-body">
    <a-form :form="formBasic" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="请选择任务">
            <a-input v-decorator="rules.taskName" @click="fn_selectTask"/>
        </a-form-item>
        <a-form-item label='派发范围'>
            <a-radio-group @change="changeRange" v-decorator="rules.range">
            <a-radio value="1">
                选择来源
            </a-radio>
            <a-radio value="2">
                指定会员
            </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="会员来源" v-if="range == 1">
            <a-checkbox-group :options="[`时代+`,`邻里PRO`]"  v-decorator="rules.source"/>
        </a-form-item>
        <a-form-item label="会员等级" v-if="range == 1">
            <a-checkbox-group :options="[`V1级会员`,`V2级会员`,`V3级会员`,`V4级会员`,`V5级会员`]"  v-decorator="rules.grade"/>
        </a-form-item>
        <a-form-item label="文件上传" v-if="range == 2" >
            <a-upload
                name="file"
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange"
                v-decorator="rules.file"
            >
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
            </a-upload>
            <a-tooltip>
                支持扩展名：.xlsx，支持批量上传会员手机号，重复会员计算一次
            </a-tooltip>
            <br>
            <a-button type="link"><a-icon type="download" />下载上传模板</a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right:10px">取消</a-button>
            <a-button type="primary" html-type="submit" @click="btnCreateTask">创建派发</a-button>
        </a-form-item>
    </a-form>
        <!-- 弹框队列开始 -->
    <a-modal title="选择任务" :visible="selectTask" @ok="fn_selectTaskOk" @cancel="fn_selectTaskHide" width="1300px">
      <task-modal ref="dataRows"></task-modal>
    </a-modal>
    <!-- 弹框队列结束 -->
  </div>
</template>
<script>
import taskModal from "./task";
export default {
  components: {
    taskModal
  },
  data() {
    return {
        selectTask:false,
        formBasic: this.$form.createForm(this, { name: "formBasic" }),
        range:1,
        rules: {
            taskName:[
                'taskName',{
                rules:[{ required: true, message: '请输入任务名称' }]
            }],
            range:[
                'range',{
                initialValue:'1',
                rules:[{ required: true, message: '请选择派发范围' }]
            }],
            source:[
                'source',{
                rules:[{ required: true, message: '请选择会员来源' }]
            }],
            grade:[
                'grade',{
                rules:[{ required: true, message: '请选择会员等级' }]
            }],
            file:[
                'file',{
                valuePropName: 'fileList', getValueFromEvent: this.normFile,
                rules:[{ required: true, message: '请上传文件', }]
            }],
        }
    }
  },
  created() {
    this.formBasic.resetFields();
    this.$nextTick(()=>{
      if(this.$route.query.id){
        //数据查询
        this.initData(this.$route.query.id);
      }
    })
  },
  methods: {
    fn_selectTask(e){
      e.currentTarget.blur()
      this.selectTask = true;
    },
    fn_selectTaskOk(e){
      if(this.$refs.dataRows.selectedRows){
        this.formBasic.setFieldsValue({
            taskName:this.$refs.dataRows.selectedRows[0].taskName
        });
      }
      this.selectTask = false;
    },
    fn_selectTaskHide() {     
      this.selectTask = false;
    },
    changeRange(e){
        this.range = e.target.value;
    },
    normFile(e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    /****************数据请求********************/
    initData(id){
      let this_ = this;
      api.getTaskDetail({ taskId: id }).then(res => {
        this_.formBasic.setFieldsValue({
          taskName:res.data.taskName,
          taskValidityDate:[moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss'),moment(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')],
          memo:res.data.memo
        });
        // this.resData = res.data
      });
    },
    btnCreateTask(e) {
      this.formBasic.validateFields((err, values) => {
        if (err) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped>
.form-body {
  padding: 20px 0px;
}
</style>