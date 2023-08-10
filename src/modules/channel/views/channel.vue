<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 新增按钮 -->
			<cl-add-btn />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="channel-channel" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "600px"
	},
	items: [
		{
			prop: "mainUser.phone",
			label: "主账号手机",
			component: {
				name: "el-input",
				props: {
					maxlength: "11"
				}
			},
			rules: [
				{ required: true, message: "手机号不能为空", trigger: "blur" },
				{ pattern: /^\d{11}$/, message: "手机号格式不正确", trigger: "blur" }
			]
		},
		{
			prop: "mainUser.name",
			label: "主账号姓名",
			component: {
				name: "el-input"
			},
			required: true
		},
		{
			prop: "companyName",
			label: "公司名称",
			component: {
				name: "el-input"
			},
			required: true
		},
		{
			prop: "email",
			label: "邮箱",
			component: {
				name: "el-input"
			},
			rules: { type: "email", message: "邮箱格式不正确", trigger: "blur" }
		},
		{
			prop: "address",
			label: "地址",
			component: {
				name: "el-input"
			}
		},
		{
			prop: "filePath",
			label: "合同",
			component: {
				name: "cl-upload",
				props: {
					type: "file"
				}
			}
		},
		{
			prop: "managerUserId",
			label: "所属渠道经理",
			value: [],
			component: {
				name: "el-select",
				options: []
			}
		},
		{
			label: "开户名称",
			prop: "accountName",
			required: true,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入开户的公司名称"
				}
			}
		},
		{
			label: "开户行",
			prop: "bankName",
			required: true,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入公司对公银行"
				}
			}
		},
		{
			label: "账号",
			prop: "cardNo",
			required: true,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入对公银行账号"
				}
			}
		},
		{
			label: "已冻结金额",
			prop: "frozenAmount",
			// prop: "customerCount",
			required: true,
			component: {
				name: "el-input",
				props: {
					placeholder: "请输入已冻结金额"
				}
			}
		}
	],

	async onSubmit(data, { next }) {
		next({
			...data
		});
	},

	async onOpen() {
		// 设置权限列表
		service.base.sys.user
			.userListByRole({
				label: "chan-manager"
			})
			.then((res) => {
				const options: any[] = [{ label: "无", value: null }];
				res.forEach((e) => {
					options.push({
						label: e.name,
						value: e.id
					});
				});
				Upsert.value?.setOptions("managerUserId", options);
			});
	}
});

// cl-table
const Table = useTable({
	contextMenu: false,
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "mainUser.phone",
			label: "主账号手机",
			width: 150
		},
		{
			prop: "mainUser.name",
			label: "主账号姓名",
			width: 130
		},
		{
			prop: "companyName",
			label: "公司名称",
			minWidth: 200
		},
		{
			prop: "managerUser.name",
			label: "所属渠道经理",
			width: 130
		},
		{
			prop: "customerCount",
			label: "客户数",
			width: 100
		},
		{
			prop: "orderCount",
			label: "订单数",
			width: 100
		},
		{
			type: "op",
			align: "center",
			width: 80,
			buttons: ["edit"]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.channel.channel
	},
	(app) => {
		app.refresh();
	}
);
</script>

<style>
.cl-upload__item:not(.is-image) .cl-upload__size[data-v-28244cdf] {
	font-size: 0;
}
</style>
