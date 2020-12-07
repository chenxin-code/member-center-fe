<template>
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

		<slot name="createdAt"></slot>
	</a-table>
</template>

<script>
export default {
	name: "vtables",
	props: ["tableColumns","tableData","tableLoading"],
	data() {
		return {
			scrollY: 100,
		}
	},
}
</script>

<style scoped>

</style>