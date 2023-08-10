<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<!-- <cl-refresh-btn /> -->
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="price-price" setup>
import { ElMessage } from "element-plus";
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { user } from "/@/cool/utils";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	items: [
		{
			prop: "seq",
			label: "排序号",
			component: {
				name: "el-input-number",
				props: {
					placeholder: "请填写排序号",
					min: 0,
					max: 99,
					"controls-position": "right"
				}
			}
		},
		{ prop: "name", label: "名称", required: true, component: { name: "el-input" } },
		{ prop: "desc", label: "描述", component: { name: "el-input" }, required: true },
		{
			prop: "monthNum",
			label: "时长(月)",
			width: 300,
			required: true,
			component: {
				name: "el-input-number",
				props: {
					min: 1,
					precision: 0,
					controlsPosition: "right"
				}
			}
		},
		{
			prop: "marketPrice",
			label: "市场价",
			hook: { bind: ["number"] },
			component: {
				name: "el-input-number",
				props: {
					min: 0,
					precision: 2
				}
			},
			required: true
		},
		{
			prop: "channelPrice",
			label: "渠道进价",
			hook: { bind: ["number"] },
			component: {
				name: "el-input-number",
				props: {
					min: 0,
					precision: 2
				}
			},
			required: true
		},
		{
			prop: "minSalePrice",
			label: "最低售价",
			hook: { bind: ["number"] },
			component: {
				name: "el-input-number",
				props: {
					min: 0,
					precision: 2
				}
			},
			required: true
		},
		{
			prop: "salePrice",
			label: "渠道售价",
			hook: { bind: ["number"] },
			component: {
				name: "el-input-number",
				props: {
					min: 0.0,
					precision: 2
				}
			},
			required: true
		}
	]
});
// cl-table
const Table = useTable({
	contextMenu: false,
	columns: [
		{
			type: "selection",
			width: 60,
			hidden: user.isChanUser()
		},
		{
			prop: "id",
			hidden: true
		},
		{
			prop: "seq",
			label: "排序",
			hidden: user.isChanUser(),
			width: 60
		},
		{
			prop: "name",
			label: "名称",
			width: 100
		},
		{
			prop: "desc",
			label: "描述"
		},
		{
			prop: "monthNum",
			label: "时长(月)",
			width: 100
		},
		{
			prop: "marketPrice",
			label: "市场价",
			width: 100
		},
		{
			prop: "channelPrice",
			label: "渠道进价",
			width: 100
		},
		{
			prop: "minSalePrice",
			label: "渠道最低售卖价",
			width: 130
		},
		{
			prop: "salePrice",
			label: "渠道售价",
			width: 100
		},
		{
			prop: "status",
			label: "状态",
			hidden: user.isChanUser(),
			width: 100,
			dict: {
				options: [
					{
						label: "已开启",
						value: 1,
						type: "success",
						effect: "light",
						round: true
					},
					{
						label: "已禁用",
						value: 0,
						type: "info",
						effect: "light",
						round: true
					}
				]
			}
		},
		{
			type: "op",
			align: "left",
			hidden: user.isChanUser(),
			width: 230,
			buttons({ scope }) {
				return [
					"edit",
					{
						label: "开启",
						hidden: !user.isAdmin() || scope.row.status == 1,
						onClick() {
							service.business.goods
								.update({
									id: scope.row.id,
									status: 1,
									user: {
										id: scope.row.userId
									}
								})
								.then(() => {
									ElMessage.success("开启成功");
									refresh();
								});
						}
					},
					{
						label: "禁用",
						hidden: !user.isAdmin() || scope.row.status == 0,
						onClick() {
							service.business.goods
								.update({
									id: scope.row.id,
									status: 0,
									user: {
										id: scope.row.userId
									}
								})
								.then(() => {
									ElMessage.success("禁用成功");
									refresh();
								});
						}
					}
				];
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.business.goods,
		onRefresh(_, { render }) {
			if (user.isAdmin()) {
				service.business.goods.list().then((res) => {
					render(res);
				});
			} else {
				service.business.chan.goods.goodsList().then((res) => {
					render(res);
				});
			}
		}
	},
	(app) => {
		app.refresh();
	}
);

function refresh() {
	Crud.value?.refresh();
}
</script>
