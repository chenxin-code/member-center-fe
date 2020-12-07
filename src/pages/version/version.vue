<template>
	<div id="microApplication">
		<div class="content-header">App版本列表</div>
		<div class="content-main" ref="content_main" style="padding: 20px;">
			<a-button type="primary" @click="onAdd">+  创建版本</a-button>
			<!-- 表格 -->
			<a-table
				:columns="tableColumns"
				:data-source="tableData"
				:pagination="false"
				:scroll="{ y: scrollY }"
				:rowKey="(r,i) => i"
				style="width:100%;margin-top:8px;"
				:selectable="false"
				:loading="tableLoading"
			>
				<template slot="status" slot-scope="operation">
					<div class="editable-row-operations">
						<span v-if="operation.forceUpdate === 0">否</span>
						<span v-if="operation.forceUpdate === 1">是</span>
					</div>
				</template>
				<template slot="os" slot-scope="operation">
					<div class="editable-row-operations">
						<span v-if="operation.os === 1">安卓</span>
						<span v-if="operation.os === 2">IOS</span>
					</div>
				</template>
			</a-table>

			<a-pagination
				:total="total"
				:show-total="total => `共 ${total} 条`"
				show-quick-jumper
				show-size-changer
				:default-current="current"
				:page-size.sync="pageSize"
				@change="onShowSizeChange"
				@showSizeChange="onShowSizeChange"
				style="margin-top:30px;width:100%;text-align: right;"
			/>
		</div>
	</div>
</template>

<script>
	import api from "@/api";
	import moment from "moment"
	export default {
		name: "microApplication",
		data() {
			return {
				//表格高度
				scrollY: 100,
				//表头数据
				tableColumns: [
					{
						title: "版本号",
						dataIndex: "appVersion",
						key: "appVersion",
					},
					{
						title: "版本名称",
						dataIndex: "name",
						key: "name"
					},
					{
						title: "平台",
						dataIndex: "appCode",
						key: "appCode",
					},
					{
						title: "是否强制更新",
						key: "status",
						scopedSlots: { customRender: "status" }
					},
					{
						title: "系统",
						key: "os",
						scopedSlots: { customRender: "os" }
					},
					{
						title: "更新日志",
						dataIndex: "memo",
						key: "memo",
					},
				],
				tableData: [],
				tableLoading: false,
				//分页
				total: 0,
				current: 1,
				pageSize: 10,
			};
		},
		components: {

		},
		mounted() {
			this.getVersionList();
			setTimeout(() => {
				this.scrollY = this.$refs.content_main.offsetHeight - 195 + "px";
			}, 100);
		},
		created() {

		},
		methods: {
			moment,
			onAdd() {
				this.$router.push({path: "/version/addVersion"})
			},
			// 分页
			onShowSizeChange(current, pageSize) {
				this.current = current;
				this.pageSize = pageSize;
				this.getVersionList();
			},
			//获取表格数据
			getVersionList() {
				this.tableLoading = true;
				const para = {
					appCode: "",
					pageIndex: this.current,
					pageSize: this.pageSize,
				};
				api.getVersionList(para).then(res => {
					if (res.code === 200) {
						this.total = res.data.total;
						this.tableData = res.data.records;
					}
				}).finally(() => {
					this.tableLoading = false;
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	#microApplication {
		height: 100%;
		overflow: hidden;
	}
	.content_main {
		height: 100%;
		padding: 10px;
	}
</style>
