<template>
  <div>
    <div class="content-header">
      <span class="text-bold">装修申请详情</span> 
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>

    <div class="content-main" ref="contentMain">
      <a-row style="padding:20px;height:100%;box-sizing: border-box;">
        <a-tabs type="card" :activeKey='tabKey' @change="changeCurrent">
          <a-tab-pane class="tabs-body-content" key="1" tab="基本信息">
            <BasicInformation
              :data="appDetail"
              :list="decorateRecordList"
              @changeCurrent="changeCurrent"
            />
            <div class="content-footer">
              <a-button  v-if="hasRangeAuthorityWithoutProject(['button_decorate_review']) && appDetail.decorationStatus == '04'" type="primary" style="width: 100px;" :loading="btnLoading" @click="onPass">通过</a-button>
              <a-button  v-if="hasRangeAuthorityWithoutProject(['button_decorate_review']) && appDetail.decorationStatus == '04'" ghost  type="primary" style="width: 100px;margin-left: 20px;" :loading="btnLoading" @click="onRefuse">拒绝</a-button>
              <a-button  v-if="hasRangeAuthorityWithoutProject(['button_decorate_close']) &&  (appDetail.decorationStatus != '72' && appDetail.decorationStatus != '73' ) " ghost  type="primary" style="width: 100px;margin-left: 20px;" :loading="btnLoading" @click="onClosed">关闭</a-button>
            </div>
            <!-- 通过装修申请弹窗 -->
            <a-modal v-model="acceptApplyVisible" :centered="true" title="通过装修申请" :maskClosable="false" @cancel="acceptApplyCancel">
              <template slot="footer">
                <a-button key="back" @click="acceptApplyCancel">
                  取消
                </a-button>
                <a-button key="submit" type="primary" :loading="btnLoading" @click="acceptApply">
                  确定
                </a-button>
              </template>
              <a-form layout="inline">确认通过装修申请？
              </a-form>
            </a-modal>
            <!-- 拒绝装修申请弹窗 -->
            <a-modal v-model="refuseApplyVisible" :centered="true" title="拒绝装修申请" :maskClosable="false" @cancel="refuseApplyCancel">
              <template slot="footer">
                <a-button key="back" @click="refuseApplyCancel">
                  取消
                </a-button>
                <a-button key="submit" type="primary" :loading="btnLoading" @click="refuseApply">
                  确定
                </a-button>
              </template>
              <a-form layout="inline">
                <a-form-item label="拒绝原因">
                  <a-textarea placeholder="请输入" :rows="3"  :maxLength="200" style="width:300px;" v-model="refuseMessage"/>
                </a-form-item>
              </a-form>
            </a-modal>
            <!-- 关闭装修申请弹窗 -->
            <a-modal v-model="closeApplyVisible" :centered="true" title="关闭装修申请" :maskClosable="false" @cancel="closeApplyCancel">
              <template slot="footer">
                <a-button key="back" @click="closeApplyCancel">
                  取消
                </a-button>
                <a-button key="submit" type="primary" :loading="btnLoading" @click="closeApply">
                  确定
                </a-button>
              </template>
              <a-form layout="inline">
                <a-form-item label="关闭理由">
                  <a-textarea placeholder="请输入" :rows="3"  :maxLength="200" style="width:300px;"  v-model="closeMessage"/>
                </a-form-item>
              </a-form>
            </a-modal>
          </a-tab-pane>

          <a-tab-pane class="tabs-body-content" key="2" tab="详细信息">
            <DetailedInformation :data="appDetail" />
          </a-tab-pane>


          <!-- -----------------暂不开发--------------------- -->
          <a-tab-pane class="tabs-body-content" key="3" tab="装修许可证" v-if="appDetail.decorationStatus === '21'||appDetail.decorationStatus === '31'">
            <div>装修许可证</div>
          </a-tab-pane>

          <a-tab-pane class="tabs-body-content" key="4" tab="施工出入证" v-if="appDetail.decorationStatus === '21'||appDetail.decorationStatus === '31'">
            <div>
              <a-button type="primary">添加施工人员</a-button>
              <a-button type="primary" style="margin-left:10px;">办理纸质证</a-button>
              <!-- 施工人员表格 -->
              <a-table
                :columns="tableColumns"
                :row-key="(r,i) => i"
                :data-source="tableData"
                :scroll="{ x: 1550, y: scrollY }"
                :pagination="false"
                :loading="tableLoading"
                style="margin-top:8px;"
              >
                <template slot="operation" slot-scope="operation">
                  <div class="editable-row-operations">
                    <a @click="onEdit(operation)">编辑</a>
                    <a
                      @click="onChangeStatus(operation)"
                    >{{operation.status === 0 ? "禁用" : "启用" }}</a>
                    <a @click="onDelete(operation)">删除</a>
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
                style="margin-top:30px;width:100%;text-align: right;"
              />
              <a-divider orientation="left">缴费记录</a-divider>
              <!-- 缴费记录表格 -->
              <a-table
                :columns="tableColumns1"
                :row-key="(r,i) => i"
                :data-source="tableData"
                :scroll="{ x: 1550, y: scrollY }"
                :pagination="false"
                :loading="tableLoading"
                style="margin-top:8px;"
              >
                <template slot="operation" slot-scope="operation">
                  <div class="editable-row-operations">
                    <a @click="onEdit(operation)">编辑</a>
                    <a
                      @click="onChangeStatus(operation)"
                    >{{operation.status === 0 ? "禁用" : "启用" }}</a>
                    <a @click="onDelete(operation)">删除</a>
                  </div>
                </template>
              </a-table>
            </div>
          </a-tab-pane>

          <a-tab-pane class="tabs-body-content" key="5" tab="巡查" v-if="appDetail.decorationStatus === '21'||appDetail.decorationStatus === '31'">
            <div>
              <a-row style="padding:10px;height:100%;">
                <a-col flex:auto>
                  <FormList ref="form" rowCol="3" :formList="formList" />
                </a-col>
              </a-row>
              <!-- 巡查表格 -->
              <a-table
                :columns="tableColumns2"
                :row-key="(r,i) => i"
                :data-source="tableData"
                :scroll="{ x: 1550, y: scrollY }"
                :pagination="false"
                :loading="tableLoading"
                style="margin-top:8px;"
              >
                <template slot="operation" slot-scope="operation">
                  <div class="editable-row-operations">
                    <a @click="onEdit(operation)">编辑</a>
                    <a
                      @click="onChangeStatus(operation)"
                    >{{operation.status === 0 ? "禁用" : "启用" }}</a>
                    <a @click="onDelete(operation)">删除</a>
                  </div>
                </template>
              </a-table>
            </div>
          </a-tab-pane>

          <a-tab-pane class="tabs-body-content" key="6" tab="整改" v-if="appDetail.decorationStatus === '21'||appDetail.decorationStatus === '31'"> 
            <div>
              <!-- 整改表格 -->
              <a-table
                :columns="tableColumns3"
                :row-key="(r,i) => i"
                :data-source="tableData"
                :scroll="{ x: 1550, y: scrollY }"
                :pagination="false"
                :loading="tableLoading"
                style="margin-top:8px;"
              >
                <template slot="operation" slot-scope="operation">
                  <div class="editable-row-operations">
                    <a @click="onEdit(operation)">编辑</a>
                    <a
                      @click="onChangeStatus(operation)"
                    >{{operation.status === 0 ? "禁用" : "启用" }}</a>
                    <a @click="onDelete(operation)">删除</a>
                  </div>
                </template>
              </a-table>
            </div>
          </a-tab-pane>

          <a-tab-pane class="tabs-body-content" key="7" tab="出入记录" v-if="appDetail.decorationStatus === '21'||appDetail.decorationStatus === '31'">
            <div>
              <a-row style="padding:10px;height:100%;">
                <a-col flex:auto>
                  <FormList ref="form" rowCol="3" :formList="formList1" />
                </a-col>
              </a-row>
              <!-- 出入记录表格 -->
              <a-table
                :columns="tableColumns4"
                :row-key="(r,i) => i"
                :data-source="tableData"
                :scroll="{ x: 1550, y: scrollY }"
                :pagination="false"
                :loading="tableLoading"
                style="margin-top:8px;"
              >
                <template slot="operation" slot-scope="operation">
                  <div class="editable-row-operations">
                    <a @click="onEdit(operation)">编辑</a>
                    <a
                      @click="onChangeStatus(operation)"
                    >{{operation.status === 0 ? "禁用" : "启用" }}</a>
                    <a @click="onDelete(operation)">删除</a>
                  </div>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";
import FormList from "@/components/FormList/index.jsx";
import BasicInformation from "./components/BasicInformation";
import DetailedInformation from "./components/DetailedInformation";
import moment from "moment";
import {hasRangeAuthorityWithoutProject} from "@/utils/authority"

export default {
  components: {
    FormList,
    BasicInformation,
    DetailedInformation
  },
  data() {
    return {
      current: '1',
      tabKey:'1',
      appDetail: {}, //详情数据
      decorateRecordList: [], // 审批记录
      projectName: {
        0: "全部",
        1: "项目一"
      },
      previewImage: "",
      previewVisible: false,
      fileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        }
      ],
      picUploading: false,
      btnLoading: false,
      //分页
      total: 0,
      pageSize: 10,
      current: 1,
      limit: 10,
      total: 0,
      tableData: [], //表格数据
      tableLoading: false,
      //表格高度
      scrollY: 100,
      //表头数据
      tableColumns: [
        {
          title: "姓名",
          key: "projectName",
          width: 120,
          ellipsis: true
        },
        {
          title: "手机号",
          key: "spaceName",
          width: 120,
          ellipsis: true
        },
        {
          title: "职务",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        },
        {
          title: "照片",
          key: "decorationDateStart",
          width: 120,
          ellipsis: true
        },
        {
          title: "身份证",
          key: "decorationDateEnd",
          width: 120,
          ellipsis: true
        },
        {
          title: "相关证书",
          key: "applyTime",
          width: 120,
          ellipsis: true
        },
        {
          title: "添加时间",
          key: "process",
          width: 120,
          ellipsis: true
        },
        {
          title: "操作",
          key: "operation",
          scopedSlots: { customRender: "operation" },
          fixed: "right"
        }
      ],
      //缴费记录表头数据
      tableColumns1: [
        {
          title: "数量",
          key: "projectName",
          width: 120,
          ellipsis: true
        },
        {
          title: "缴费时间",
          key: "spaceName",
          width: 120,
          ellipsis: true
        },
        {
          title: "缴费金额",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ],
      //巡查表头数据
      tableColumns2: [
        {
          title: "巡查日期",
          key: "projectName",
          width: 120,
          ellipsis: true
        },
        {
          title: "完成时间",
          key: "spaceName",
          width: 120,
          ellipsis: true
        },
        {
          title: "巡查人",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        }
      ],
      //整改表头数据
      tableColumns3: [
        {
          title: "检查日期",
          key: "projectName",
          width: 120,
          ellipsis: true
        },
        {
          title: "检查人",
          key: "spaceName",
          width: 120,
          ellipsis: true
        },
        {
          title: "整改期限",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        },
        {
          title: "状态",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ],
      //整改表头数据
      tableColumns4: [
        {
          title: "姓名",
          key: "projectName",
          width: 120,
          ellipsis: true
        },
        {
          title: "手机号",
          key: "spaceName",
          width: 120,
          ellipsis: true
        },
        {
          title: "放行时间",
          key: "ownerInfo",
          width: 120,
          ellipsis: true
        }
      ],
      projectOption: [],
      spaceOption: [],
      decorationStatusOption: [],
      progressOption: [],

      formList: [
        {
          label: "巡查日期",
          type: "rangePicker",
          name: "decorationDateStart"
        },
        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      formList1: [
        {
          label: "日期",
          type: "datePicker",
          name: "decorationDateStart"
        },
        {
          label: "姓名",
          type: "input",
          name: "spaceName",
          placeholder: "请输入姓名"
        },
        {
          type: "button",
          buttonName: "查询",
          htmlType: "submit",
          align: "right",
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      //审核
      acceptApplyVisible:false,
      refuseApplyVisible:false,
      closeApplyVisible:false,
      closeMessage:'',
      refuseMessage:'',
      applicationId:'',
    
    };
  },
  //局部过滤器
  filters: {
    formatType(value) {
      let returnMsg = "未知";
      switch (value) {
        case 1:
          returnMsg = "原生";
          break;
        case 2:
          returnMsg = "uniapp";
          break;
        case 3:
          returnMsg = "微应用";
          break;
        case 4:
          returnMsg = "H5";
          break;
      }
      return returnMsg;
    }
  },
  created: function() {
    //this.getVersionsDataSource();
    //this.getResourcePackageDataSource();
    // this.getMicroDetail();
  },
  mounted() {
    setTimeout(() => {
      this.scrollY = this.$refs.contentMain.offsetHeight - 204 + "px";
    }, 100);
    if (!this.$route.params.id) {
      this.$message.error("applicationId异常");
      return;
    }
    this.applicationId = this.$route.params.id;
    this.getApplyDetail();
    this.getDecorateRecordList();
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    onChange(current) {
      console.log("onChange:", current);
      this.current = current;
    },
    hasRangeAuthorityWithoutProject(authKeys){
      return hasRangeAuthorityWithoutProject(authKeys)
    },
    /**
     * 获取详情
     * @author Chen Kuo
     * @date 2020-10-31
     * @returns {any}
     */
    getApplyDetail() {
      api
        .getDecorateApplyDetail({
          applicationId: this.$route.params.id
        })
        .then(res => {
          if (res.code === 200) {
            this.appDetail = {
              ...res.data,                
            };
          }
        });
    },
    /**
     * 获取审核记录
     * @author Chen Kuo
     * @date 2020-10-31
     * @returns {any}
     */
    getDecorateRecordList() {
      api
        .getDecorateRecordList({
          applicationId: this.$route.params.id
        })
        .then(res => {
          if (res.code === 200) {
            const newList = [];
            res.data.map(item => {
              newList.unshift(item);
            });
            this.decorateRecordList = newList;
          }
        });
    },
    /**
     * 切换tabbar
     * @author Chen Kuo
     * @date 2020-11-01
     * @returns {any}
     */
    changeCurrent(current) {
        this.tabKey =current
    },
    onPass(){
      this.acceptApplyVisible = true;
    },
    onRefuse(){

      this.refuseApplyVisible = true;
    },
    onClosed(){
      this.closeApplyVisible = true;
    },
    acceptApplyCancel(){
      this.acceptApplyVisible = false;
    },
    acceptApply(){
       
       api
        .auditPassAppManage({
          applicationId: this.$route.params.id
        })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("审核通过");
            this.acceptApplyVisible = false;
            this.getDecorateRecordList();
          }
          location.reload();
        });
    },
    refuseApplyCancel(){

      this.refuseApplyVisible = false;
    },
    refuseApply(){
        if(!this.refuseMessage){
            this.$message.warning('请填写拒绝原因');
            return;
        }
        const para = {
          applicationId: this.$route.params.id,
          message:this.refuseMessage,
        }
        api
        .auditRejectedAppManage(para)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("装修申请已拒绝!");
            this.refuseApplyVisible = false;
            this.getDecorateRecordList();
          }
          location.reload();
        });
    },
    closeApplyCancel(){
      this.closeApplyVisible = false;
    },
    closeApply(){
      if(!this.closeMessage){
            this.$message.warning('请填写关闭原因');
            return;
      }
      const para = {
          applicationId: this.$route.params.id,
          message:this.closeMessage,
        }
        api
        .closeDecorateAppManage(para)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("装修申请已关闭");
            this.closeApplyVisible = false;
            this.getDecorateRecordList();
          } else if (res.code == 50001) {
             this.$error({
                title: "关闭装修申请",
                content: "该申请"+this.appDetail.projectName+"-"+this.appDetail.spaceName+"已被其他用户取消或关闭，请刷新后查看。"
              });
          }
          location.reload();
        });
    },
    addPic({ fileList = [] } = {}) {
      if (this.fileList.length > 0) {
        const that = this;
        that.$confirm({
          title: "删除图片",
          content: "确定删除图片吗？",
          centered: true,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.fileList = [];
            that.form.setFieldsValue({
              imageUrl: ""
            });
          }
        });
      } else {
        debounce(() => {
          const isJpgOrPng =
            fileList[0].type === "image/jpeg" ||
            fileList[0].type === "image/png";
          if (!isJpgOrPng) {
            this.$message.error("图片格式错误，请重新上传");
          } else {
            const imgSize = fileList[0].size / 1024 / 1024 < 5;
            if (!imgSize) {
              this.$message.error("图片过大，请重新上传");
            } else {
              this.picUploading = true;
              const formData = new FormData();
              fileList.forEach((file, index) => {
                formData.append("file" + index, file.originFileObj);
              });
              api["uploadPropertyNoticePic"](formData)
                .then(res => {
                  if (res.code === 200) {
                    console.log(this.fileList);
                    this.fileList[0] = {
                      uid: "-1",
                      url: res.data ? res.data[0] : ""
                    };
                  }
                })
                .finally(() => {
                  this.picUploading = false;
                });
            }
          }
        });
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },

    //删除活动
    onDelete(e) {
      console.log(e);
      this.$confirm({
        title: "提示",
        content: "确定要删除？",
        onOk() {
          console.log("删除" + e.title);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
.text-bold{
  font-weight: bold;
}
.img-div {
  width: 335px;
  height: auto;
}
.ant-upload.ant-upload-select-picture-card {
  display: table;
  float: left;
  width: 335px;
  height: 115px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}
.ant-upload-list-picture-card-container {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
  /*text-align: center;*/
}
.ant-upload-list-picture-card .ant-upload-list-item {
  float: left;
  width: 335px;
  height: auto;
  margin: 0 8px 8px 0;
}
.ant-modal-close-x {
  display: block;
  width: 30px;
  height: 30px;
  font-size: 16px;
  font-style: normal;
  line-height: 30px;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
}
</style>
