<template>
	<div id="activitySetFirest">
		<div class="content-header">
			<span>基本信息</span>
			<span class="fallback" @click="getBack" v-if="visibleButton" style="cursor:pointer">返回</span>
		</div>

		<div class="module-genre" style="margin-top: 16px;margin-bottom: 50px;">

			<!-- 表单模块 -->
			<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" autoComplete="off">
				<!-- 类型 -->
				<a-form-item label="类型">
					<a-select
					:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
					v-decorator="['type',{ initialValue: '链接',rules:[{required: true}]}]" placeholder="请选择类型" @change="changeType">
						<a-select-option v-for="(item, key) in typeContent" :key="item" :value="key">{{item}}</a-select-option>
					</a-select>
				</a-form-item>

				<!-- 跳转链接 -->
				<a-form-item v-if="typeState == 0" label="跳转链接">
				  <a-input
						:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
				    v-decorator="['jumpLink', { rules: [
					  { required: true,message: '跳转链接不能为空' },
					  {whitespace: true,message: '跳转链接不能为空'}] }]" placeholder="请输入跳转链接"  />
				</a-form-item>

				<!-- 项目 -->
				<a-form-item label="项目">
				  <a-checkbox :checked="checkAll" @change="onProjectChange"
				     v-decorator="['gendes', { rules: [{ required: true, message: '请选择项目' }] } ]">
				    全部项目
				  </a-checkbox>
				  <a @click="chooseProject" style="margin-left:38px;">{{targetKeys.length === 0 ? "选择项目" : "已选" + targetKeys.length + "个项目"}}</a>
				</a-form-item>

				<!-- 活动标题 -->
				<a-form-item label="活动标题">
					<div style="position: relative;">
						<a-input
						v-decorator="['activeTitle', {rules: [
						{ required: true,message: '活动标题不能为空' },
						{ message: '活动标题最长50个字',max: 50 },
						{whitespace: true,message: '活动标题不能为空'}] }]" placeholder="请输入活动标题" />
						<!-- 热门活动 -->
						<a-form-item style="position: absolute;top: 0;left: 110%;">
							<a-checkbox :checked="checkedPopular" @click="alterPopular" v-decorator="['popularActivities']" >热门活动</a-checkbox>
						</a-form-item>
					</div>
				</a-form-item>

				<!-- 热门权重 -->
				<a-form-item v-if="hotWeight == true" label="热门权重" style="margin-top:16px;">
				  <a-input-number :min="1" :max="999" v-decorator="['priority', { rules: [{ required: true, message: '热门权重不能为空' }] } ]" style="width:88px"/>
				  <span style="margin-left:10px;color:#999999;font-size:12px;">取值范围1-999，数值越大优先级越高</span>
				</a-form-item>

				<!-- 活动时间 -->
				<a-form-item label="活动时间">
					<a-range-picker
						:disabled-date="disabledDate"
						:disabled-time="disabledRangeTime"
						:show-time="{
							hideDisabledOptions: true,
							defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
						}"
						format="YYYY-MM-DD HH:mm:ss"
						v-decorator="['activityTime', { rules: [{ required: true , message: '请选择活动时间'}] }]"/>
				</a-form-item>

				<!-- 活动分类 -->
				<a-form-item label="活动分类">
				  <a-select
					:getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
				  v-decorator="['Classification',{ initialValue: '分类1',rules:[{required: true}]}]" placeholder="请选择活动分类">
				    <a-select-option value="分类1">分类1</a-select-option>
				    <a-select-option value="分类2">分类2</a-select-option>
				  </a-select>
				</a-form-item>

				<!-- 活动地点 -->
				<a-form-item label="活动地点">
				  <a-input
				  v-decorator="['siteActivity', { rules: [
					  { required: true , message: '活动地点不能为空'},
					  { message: '活动地点最长50个字',max: 50 },
					  {whitespace: true,message: '活动地点不能为空'}] }]" placeholder="请输入活动地点" />
				</a-form-item>

				<!-- 活动海报 -->
				<a-form-item label="活动海报" style="margin-bottom: 0;">
					<a-spin class="img-div" :spinning="picUploading">
					  <a-upload
					    name="avatar"
					    accept="image/jpeg,image/jpg,image/png"
					    list-type="picture-card"
					    :file-list="fileList"
					    v-decorator="['imageUrl', { rules: [{ required: true, message: '请上传活动海报' }] } ]"
					    :before-upload="() => false"
					    @preview="handlePreview"
					    @change="addPic">
					    <div v-if="fileList.length < 1">
					      <a-icon type="plus" />
					      <div class="ant-upload-text">
					        上传图片
					      </div>
					    </div>
					  </a-upload>
					  <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
					    <img class="img" alt="example" style="width: 100%" :src="previewImage" />
					  </a-modal>
					</a-spin>
					<span style="color:#999999;font-size:12px;">建议上传尺寸为：230*460，格式为jpg、png，大小不超过1MB。</span>
				</a-form-item>

				<!-- 是否报名-->
				<a-form-item v-if="typeState == 1" label="是否报名" style="margin-bottom: 0;">
				  <a-radio-group
				  v-decorator="['whetherSign', { rules: [{ required: true , message: '请选择是否报名' }] }]" @change="isApply">
						<a-radio :value="1">
							是
						</a-radio>
						<a-radio :value="2">
							否
						</a-radio>
					</a-radio-group>
				</a-form-item>

				<!-- 支持报名角色 -->
				<a-form-item v-if="typeState == 1 && whetherApply == 1" label="支持报名角色" class="push-object">
					<!-- 全选按钮 -->
					<a-checkbox :indeterminate="indeterminateApply" :checked="allApplyRole" @change="changeApplyRole"
						v-decorator="['applyRole', { rules: [{ required: true, message: '推送对象不能为空' }] } ]">
						全部
					</a-checkbox>
					<!-- 单选按钮 -->
					<a-checkbox-group v-model="applyRoleList" @change="checkboxApplyRole">
						<a-checkbox v-for="(item,index) in applyRoleData" :key="index" :value="item.id">{{item.name}}</a-checkbox>
					</a-checkbox-group>
				</a-form-item>

				<!-- 报名人数限制 -->
				<a-form-item v-if="typeState == 1" label="报名人数限制">
				  <a-input
				  v-decorator="['applyNumberLimit', { rules: [
					  { required: true , message: '报名人数限制不能为空'},
					  { message: '报名人数限制最长50个字',max: 50 },
					  { whitespace: true,message: '报名人数限制不能为空'}] }]" placeholder="请输入报名人数限制" />
				</a-form-item>

				<!-- 联系方式 -->
				<a-form-item v-if="typeState == 1" label="联系方式">
				  <a-input
				  v-decorator="['contactWay', { rules: [
					  { required: true , message: '联系方式不能为空'},
					  { message: '联系方式最长50个字',max: 50 },
					  { whitespace: true,message: '联系方式不能为空'}] }]" placeholder="请输入联系方式" />
				</a-form-item>

				<!-- 是否APP推送-->
				<a-form-item label="是否APP推送" style="margin-bottom: 0;">
				  <a-radio-group
				  v-decorator="['whetherPush', {rules: [{ required: true , message: '请选择是否APP推送' }] }]" @change="changeWhetherPush">
						<a-radio :value="1" :checked="true">
							是
						</a-radio>
						<a-radio :value="2">
							否
						</a-radio>
					</a-radio-group>
				</a-form-item>
				
				<!-- 推送对象 -->
				<a-form-item v-if="whetherPushState == 1" label="推送对象" class="push-object">
					<!-- 全选按钮 -->
					<a-checkbox :indeterminate="indeterminateIdentity" :checked="checkAllIdentity" @change="onCheckAllChange"
						v-decorator="['pushObject', { rules: [{ required: true, message: '推送对象不能为空' }] } ]" >
						全部
					</a-checkbox>
					<!-- 单选按钮 -->
					<a-checkbox-group  v-model="identityList" @change="onChange" style="margin-left: 18px;">
						<a-checkbox v-for="(item,index) in identityData" :key="index" :value="item.id">{{item.name}}</a-checkbox>
					</a-checkbox-group>
				</a-form-item>

				<!-- 详细内容 -->
				<a-form-item label="详细内容" v-if="typeState == 1" class="detail-box">
				  <richTextLike
				    v-decorator="['richText', { rules: [ { required: true, message: '请填写详细内容' }] }]"
				    :urls="{
				      picUpload: 'uploadPropertyNoticePic',
				      previewQRCode: 'app_notice'
				    }"
				  />
				</a-form-item>

				<!-- 显示标题 -->
				<a-form-item  v-if="typeState == 1" label="显示标题" style="margin-bottom: 0;">
				  <a-radio-group
				  v-decorator="['isShowTitle', { rules: [{ required: true , message: '请选择显示标题' }] }]">
						<a-radio :value="1">
							显示
						</a-radio>
						<a-radio :value="2">
							不显示
						</a-radio>
					</a-radio-group>
				</a-form-item>

				<!-- 底部按钮 -->
				<div class="content-footer bottom-button">
					<a-button type="primary" size="large" @click="issue" style="margin-right: 12px;">保存</a-button>
					<a-button type="primary" size="large" @click="saveIssue" style="margin-right: 20px;">保存并发布</a-button>
				</div>
			</a-form>

		</div>

		<!-- 选择项目 穿梭框 -->
		<a-modal v-model="visibleObject" :centered="true" :maskClosable="false" title="选择项目"  width="856px" @cancel="onCancel">
		  <template slot="footer">
		    <a-button key="back" @click="onCancel">
		      取消
		    </a-button>
		    <a-button key="submit" type="primary" @click="onConfirm">
		      确定
		    </a-button>
		  </template>
		  <a-form layout="inline">
		    <a-form-item>
		      <div style="width:796px;height:480px;">
		        <vTransfer v-model="targetKeys" :mockData="mockData" :leftColumns="leftColumns" :rightColumns="rightColumns"/>
		      </div>
		    </a-form-item>
		  </a-form>
		</a-modal>
		
		<!-- 更改内容 -->
		<a-modal v-model="showAlterContent" title="请输入更改内容（推送消息给C端用户）">
			<div style="position: relative;">
				<a-textarea placeholder="请输入" :maxLength="50" v-model="alterContent" @change="changeAlterContent" style="height: 153px;resize: none;"/>
				<div class="textareaNumber">{{changeImport}}/50</div>
			</div>
		</a-modal>
		
	</div>
</template>

<script>
	import api from "@/api";
	import moment from "moment"
	import { debounce } from "@/utils/util";
	import vTransfer from "@/components/transfer";
	import richTextLike from "@/components/richTextLike";
	export default {
		name: "activitySetFirst",
		components: {vTransfer,richTextLike},
		data() {
			return {
				form: this.$form.createForm(this, { name: "coordinated" }),
				typeContent: {0: "链接",1: "自定义"},
				typeState: 0,
				hotWeight: false,
        checkAll: false,
				mockData: [],
				targetKeys: [],
				leftColumns: [
				  {
				    dataIndex: "title",
				    title: "项目",
				  },
				  {
				    dataIndex: "orgName",
				    title: "城市公司",
				  },
				],
				rightColumns: [
				  {
				    dataIndex: "title",
				    title: "项目",
				  },
				  {
				    dataIndex: "orgName",
				    title: "城市公司",
				  },
				],
				visibleObject: false,
				visibleButton: true,
				imageUrl: "",
				previewVisible: false,
				previewImage: "",
				picUploading: false,
				fileList: [],
				checkedPopular: false,
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
				selectedApplyRole: [],
				indeterminate: true,
				allApplyRole: false,
				whetherPushState: 0,
				whetherApply: 0,
				checkAllIdentity: false,
				indeterminateIdentity: false,
				identityList: [],
				applyRoleData: [
					{
						id: 1,
						name: "业主"
					},
					{
						id: 2,
						name: "家人"
					},
					{
						id: 3,
						name: "租户"
					},
					{
						id: 4,
						name: "朋友"
					}
				],
				indeterminateApply: false,
				allApplyRole: false,
				applyRoleList: [],
				showAlterContent: false,
				alterContent: '',
				changeImport: 0,
			}
		},
		mounted() {
			this.getProjectList();
			
		},
		methods: {
			moment,
			// 切换 类型
			changeType(k) {
				this.typeState = k;
			},
			// {{{ 选择项目
			chooseProject() {
			  debounce(()=>{
			    this.visibleObject = true;
			  })
			},
			// 全部项目
			onProjectChange(e) {
			  Object.assign(this, {
			    checkAll: e.target.checked,
			  });
			  if (this.checkAll === true) {
			    this.targetKeys = [];
			    this.mockData.forEach((item)=>{
			      this.targetKeys.push(item.key);
			    });
			    this.oriTargetKeys = this.targetKeys;
			    this.indeterminate = !!this.targetKeys.length && this.targetKeys.length < this.total;
			    this.checkAll = this.targetKeys.length === this.total;
			  } else {
			    this.targetKeys = [];
			    this.oriTargetKeys = this.targetKeys;
			  }
			},
			//选择项目 > 确定按钮
			onConfirm() {
				this.visibleObject = false;
			},
			//选择项目 > 取消按钮
			onCancel() {
				this.visibleObject = false;
			},
			//获取项目列表
			getProjectList() {
			  api.advertiseProject().then(res => {
			    if (res.code === 200) {
			      const newArr = res.data.map(item => ({
			        key: item.id,
			        title: item.name,
			        orgId: item.orgId,
			        orgName: item.orgName,
			      }));
			      this.mockData = newArr;
			      this.total = res.data.length;
			    }
			  })
			},
			// }}}
			//{{{ 活动时间 选择时间
		    range(start, end) {
			  const result = [];
			  for (let i = start; i < end; i++) {
				result.push(i);
			  }
			  return result;
			},
			disabledDate(current) {
			  // Can not select days before today and today
			  return current && current < moment().endOf("day");
			},
			disabledDateTime() {
			  return {
				disabledHours: () => this.range(0, 24).splice(4, 20),
				disabledMinutes: () => this.range(30, 60),
				disabledSeconds: () => [55, 56],
			  };
			},
			disabledRangeTime(_, type) {
			  if (type === "start") {
				return {
				  disabledHours: () => this.range(0, 60).splice(4, 20),
				  disabledMinutes: () => this.range(30, 60),
				  disabledSeconds: () => [55, 56],
				};
			  }
			  return {
				disabledHours: () => this.range(0, 60).splice(20, 4),
				disabledMinutes: () => this.range(0, 31),
				disabledSeconds: () => [55, 56],
			  };
			},
			//  }}}

			//{{{ 活动海报 图片上传
			handleCancel() {
			  debounce(()=>{
			    this.previewVisible = false;
			  })
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
			addPic({ fileList = [] } = {}) {
			  if (this.fileList.length>0) {
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
			      },
			    });
			  } else {
			    debounce(() => {
			      const isJpgOrPng = fileList[0].type === "image/jpeg" || fileList[0].type === "image/png";
			      if (!isJpgOrPng) {
			        this.$message.error("图片格式错误，请重新上传");
			      } else {
			        const imgSize = fileList[0].size / 1024 / 1024 < 1;
			        if (!imgSize) {
			          this.$message.error("图片过大，请重新上传");
			        } else {
			          this.picUploading = true;
			          const formData = new FormData();
			          fileList.forEach((file) => {
			            formData.append("file", file.originFileObj);
			          });
			          formData.append("programCode","app_advertising" );
			          api.updateImage(formData).then(res => {
			            if (res.code === 200) {
			              this.fileList[0]={ uid: "-1", url: res.data ? res.data : "" };
			            }
			          }).finally(() => {
			            this.picUploading = false;
			          });
			        }
			      }
			    });
			  }
			},
			// }}}
			//热门活动
			alterPopular() {
				this.checkedPopular = !this.checkedPopular
				if (this.checkedPopular) {
					this.hotWeight = true;
				} else {
					this.hotWeight = false;
				}
			},
			// {{{ 是否报名
			isApply(e) {
				this.whetherApply = e.target.value;
			},
			// 支持报名角色 全选按钮
			changeApplyRole(e) {
			  Object.assign(this, {
			  	allApplyRole: e.target.checked,
			  });
				if (this.allApplyRole === true) {
					this.applyRoleList = [];
					this.applyRoleData.forEach((item)=>{
						this.applyRoleList.push(item.id)
					});
					this.indeterminateApply = !!this.applyRoleList.length && this.applyRoleList.length < this.applyRoleData.length;
					this.allApplyRole = this.applyRoleList.length === this.applyRoleData.length;
				}else{
					this.applyRoleList = [];
				}
			},
			// 支持报名角色 单选按钮
			checkboxApplyRole(checkedList) {
				this.applyRoleList = checkedList
			  this.indeterminateApply = !!this.applyRoleList.length && this.applyRoleList.length < this.applyRoleData.length;
			  this.allApplyRole = this.applyRoleList.length === this.applyRoleData.length;
				if(this.applyRoleList.length > 0) {
					this.form.setFieldsValue({	
						applyRole: this.applyRoleList
					});
				} else {
					this.form.setFieldsValue({
						applyRole: this.applyRoleList
					});
				}
			},
			//}}}
			// 是否APP推送
			changeWhetherPush(e) {
				this.whetherPushState = e.target.value;
				if(e.target.value == 1){
					this.$confirm({
						icon: ' ',
					  content: "是否推送给已报名用户？",
					  centered: true,
					  okText: "是",
					  cancelText: "否",
					  onOk() {
					    console.log("是");
					  },
						onCancel() {
							console.log("否");
						}
					});
				}
			},
			// 推送对象 全选按钮
			onCheckAllChange(e) {
				Object.assign(this, {
					checkAllIdentity: e.target.checked,
				});
				if (this.checkAllIdentity === true) {
					this.identityList = [];
					this.identityData.forEach((item)=>{
						this.identityList.push(item.id)
					});
					this.indeterminateIdentity = !!this.identityList.length && this.identityList.length < this.identityData.length;
					this.checkAllIdentity = this.identityList.length === this.identityData.length;
				}else{
					this.identityList = [];
				}
			},
			// 推送对象 单选按钮
			onChange(checkedList) {
				this.identityList = checkedList;
				this.indeterminateIdentity = !!this.identityList.length && this.identityList.length < this.identityData.length;
				this.checkAllIdentity = this.identityList.length === this.identityData.length;
				if(this.identityList.length > 0) {
					this.form.setFieldsValue({
						pushObject: this.identityList
					});
				} else {
					this.form.setFieldsValue({
						pushObject: this.identityList
					});
				}
			},
			// }}}
			//更改内容
			changeAlterContent(e) {
				this.changeImport = e.target.value.length;
			},
			// 发布 按钮
			issue() {
				// 推送对象 提示
				if(this.form.getFieldsValue().pushObject === false) {
					this.form.setFieldsValue({
						pushObject: undefined
					});
				}
				// 支持报名角色 提示
				if(this.form.getFieldsValue().applyRole === false) {
					this.form.setFieldsValue({
						applyRole: undefined
					});
				}
				// 获取 赋值 表单内容
				this.form.validateFields((err,values) =>{
					values = {
						type: values.type,			//类型
						jumpLink: values.jumpLink ? values.jumpLink : "",		//跳转链接
						gendes: this.mockData,			//项目列表
						activeTitle: values.activeTitle,			//活动标题
						popularActivities: values.popularActivities	,//热门活动
						priority: values.priority,		//热门权重
						startValidTime: moment(values.activityTime[0]).format("YYYY-MM-DD"),	//活动开始时间
						endValidTime: moment(values.activityTime[1]).format("YYYY-MM-DD"),	//活动结束时间
						Classification: values.Classification,		//活动分类
						siteActivity: values.siteActivity,		//活动地点
						imageUrl: this.fileList[0].url, 			//活动海报
						whetherSign: values.whetherSign ? values.whetherSign : ""		,//是否报名
						ApplyRole: this.selectedApplyRole ? this.selectedApplyRole : "",     		//支持报名角色
						applyNumberLimit: values.applyNumberLimit ? values.applyNumberLimit : "",     		//报名人数限制
						contactWay: values.contactWay ? values.contactWay : "",     		//联系方式
						whetherPush: values.whetherPush,			//是否APP推送
						pushObject: this.identityList			,//推送对象
						richText: values.richText ? values.richText : "",				//详细内容
						isShowTitle: values.isShowTitle ? values.isShowTitle : "",				//详细内容
					}
					console.log(values);
				})
			},
			// 保存并发布
			saveIssue() {
				this.issue();
			},
			// 返回按钮
			getBack() {}
		}
	}
</script>

<style lang="less">
#activitySetFirest{
	.ant-select-selection--single , .ant-form-item-control-wrapper{
		width: 408px;
	}
	.ant-col-5{
		width: 14%;
	}
	.ant-upload.ant-upload-select-picture-card{
		width: 350px;
		height: 115px;
	}
	.ant-col-8{
		width: auto;
		margin-right: 30px;
		margin-top: 10px;
	}
	.bottom-button{
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.push-object > .ant-form-item-control-wrapper{
		width: 80%;
	}
	.img-div{
		width: 335px;
		height: auto;
	}
	.ant-upload.ant-upload-select-picture-card{
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
	.ant-upload-list-picture-card-container{
	  float: left;
	  width: 335px;
	  height: auto;
	  margin: 0 8px 8px 0;
	}
	.ant-upload-list-picture-card .ant-upload-list-item{
	  float: left;
	  width: 335px;
	  height: auto;
	  margin: 0 8px 8px 0;
	}
	.choice-checked > .ant-checkbox-wrapper{
		margin-left: 26px;
	}
	.ant-upload-picture-card-wrapper{
		display: inline;
	}
	.detail-box{
		margin-bottom: 0;
	}
	.detail-box > .ant-form-item-control-wrapper{
		width: 50%;
	}
	.textareaNumber{
		position: absolute;
		bottom: 2px;
		right: 4px;
		font-size: 12px;
		color: #999999;
	}
} 
</style>
