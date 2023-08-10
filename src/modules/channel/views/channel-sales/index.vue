<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-filter
				label="渠道商"
				v-permission="service.channel.channel.permission.channelList"
				:ref="channelListRef"
			>
				<cl-select
					:modelValue="options.channelList[0]"
					:options="options.channelList"
					prop="channelId"
				></cl-select>
			</cl-filter>
			<cl-flex1 />
		</cl-row>
		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" row-key="id">
				<template #column-buylink="{ scope }">
					<span>{{ scope.row.buylink }}</span>
					<el-button
						size="small"
						@click="copy(scope.row.buylink)"
						style="margin-left: 5px"
						>复制</el-button
					>
				</template>
			</cl-table>
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

<script lang="ts" name="chan-user-sub-account" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { storage, user } from "/@/cool/utils";
import { reactive, ref } from "vue";
import { checkPerm } from "/$/base";

const { service } = useCool();

const channelListRef = ref();

const options = reactive({
	channelList: []
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "500px"
	},
	items: [
		{ prop: "phone", label: "子账号手机号", required: true, component: { name: "el-input" } },
		{ prop: "name", label: "姓名", required: true, component: { name: "el-input" } }
	],

	onSubmit(data, { close }) {
		if (data.id == null || data.id == undefined) {
			service.channel.channelSales
				.addSaleAndUser(data)
				.then(() => {
					ElMessage.success("新增子账号成功!");
					close();
					Crud.value?.refresh();
				})
				.catch(() => {
					close();
				});
		} else {
			service.base.sys.user
				.update(data)
				.then(() => {
					ElMessage.success("修改成功!");
					close();
					Crud.value?.refresh();
				})
				.catch(() => {
					close();
				});
		}
	}
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "userId",
			hidden: true
		},
		{
			prop: "user.phone",
			label: "手机号",
			width: 150
		},
		{
			prop: "user.name",
			label: "姓名",
			width: 100
		},
		{
			prop: "createTime",
			label: "创建时间",
			width: 160
		},
		{
			// type: "op",
			prop: "buylink",
			label: "购买链接",
			minWidth: 410
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
			prop: "totalSaleAmount",
			label: "总销售额",
			width: 140
		},
		{
			prop: "status",
			label: "状态",
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
			width: 230,
			hidden:
				!storage.get("base.menuPerms").includes("channel:channel-sales:update") &&
				!storage.get("base.menuPerms").includes("channel:channel-sales:delete"),
			buttons({ scope }) {
				return [
					"edit",
					"delete",
					{
						label: "开启",
						hidden:
							!storage
								.get("base.menuPerms")
								.includes("channel:channel-sales:update") || scope.row.status === 1,
						onClick() {
							service.channel.channelSales
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
						hidden:
							!storage
								.get("base.menuPerms")
								.includes("channel:channel-sales:update") ||
							scope.row.status === 0 ||
							scope.row.userId === storage.get("userInfo").id,
						onClick() {
							service.channel.channelSales
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
	],
	contextMenu: false
});

// todoRefresh
// cl-crud
const Crud = useCrud(
	{
		service: service.channel.channelSales,
		onRefresh(params, { next }) {
			if (checkPerm(service.channel.channel.permission.channelList) && !params.channelId) {
				getChannelList().then(() => {
					params.channelId = options.channelList[0].value;
					next({ ...params });
				});
			} else {
				next({ ...params });
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

function copy(data: any) {
	let url = data;
	let oInput = document.createElement("input");
	oInput.value = url;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	ElMessage.success("复制成功");
}

function getChannelList() {
	return service.channel.channel.channelList().then((res) => {
		res = res.map((e: any) => {
			return { label: e.companyName, value: e.id };
		});
		options.channelList = res;
	});
}
</script>
