<template>
	<cl-crud ref="Crud">
		<cl-row style="align-items: center">
			<el-button type="info" color="#4165D7" @click="handleAdd" v-show="user.isChanUser()">
				报备
			</el-button>
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-filter label="状态">
				<cl-select :options="options.type" prop="type"></cl-select>
			</cl-filter>
			<cl-filter label="渠道经理" v-show="user.isAdmin()">
				<cl-select
					:options="options.channelManagerList"
					prop="channelId"
					@change="changeAdmin"
					@clear="clearAdmin"
				></cl-select>
			</cl-filter>
			<cl-filter label="渠道商" v-show="user.isAdmin()">
				<cl-select
					:options="options.channelListNew"
					v-model="channelVlue"
					prop="channelId"
				></cl-select>
			</cl-filter>
			<cl-filter label="归属" v-show="user.isChanAdmin()">
				<cl-select :options="options.salesUserList" prop="salesUserId"></cl-select>
			</cl-filter>
			<cl-flex1 />

			<!-- 关键字搜索 -->
			<cl-search-key
				v-model="searchKey"
				field="customerPhone"
				:field-list="options.fieldList"
				@field-change="changeField"
			/>
			<el-button @click="duplicateChecking" style="z-index: 999">查重</el-button>

			<el-tooltip content="该搜索支持检索客户是否被报备或已购买" placement="top">
				<cl-svg name="icon-question"></cl-svg>
			</el-tooltip>
			<!-- 高级搜索按钮 -->
			<!-- <cl-adv-btn /> -->
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
		<!-- 高级搜索 -->
		<cl-adv-search ref="AdvSearch" />
		<el-dialog :title="title" v-model="open" width="600px" :append-to-body="true">
			<el-form
				:model="form"
				:rules="rules"
				ref="customerRef"
				:label-width="80"
				label-position="left"
			>
				<el-form-item label="客户姓名" prop="customerName">
					<el-input v-model="form.customerName" placeholder="请输入客户姓名" />
				</el-form-item>
				<el-form-item label="手机号" prop="customerPhone">
					<el-input
						v-model="form.customerPhone"
						placeholder="请输入客户手机号"
						maxlength="11"
					/>
				</el-form-item>
				<el-form-item label="公司名称" prop="companyName">
					<el-input v-model="form.companyName" placeholder="请输入公司名称" />
				</el-form-item>
				<el-form-item label="国际站ID" prop="aliInternationalId">
					<el-input v-model="form.aliInternationalId" placeholder="请输入国际站ID" />
				</el-form-item>
			</el-form>
			<el-divider content-position="left">注意</el-divider>
			<span>报备的客户如果一个月内没达成购买，则会自动释放清除。</span>
			<br />
			<span>一个账号只能报备100个客户。</span>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<cl-dialog
			:title="orderTableTitle"
			center
			v-model="orderTableOpen"
			:append-to-body="true"
			style="width: 1000px"
		>
			<el-table v-loading="orderTableLoading" border :data="orderList">
				<el-table-column label="订单号" align="center" key="orderNo" prop="orderNo" />
				<el-table-column label="名称" align="center" key="name" prop="name" />
				<el-table-column
					label="手机"
					align="center"
					key="customerPhone"
					prop="customerPhone"
				/>
				<el-table-column
					label="渠道商"
					align="center"
					key="channel.companyName"
					prop="channel.companyName"
				/>
				<el-table-column label="金额" align="center" key="totalAmount" prop="totalAmount" />
				<el-table-column label="发票号" align="center" key="invoiceNo" prop="invoiceNo" />
				<el-table-column
					label="创建日期"
					align="center"
					key="createTime"
					prop="createTime"
				/>
			</el-table>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" name="price-customer" setup>
import { useAdvSearch, useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { getCurrentInstance, h, reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { user } from "/@/cool/utils";
const { service } = useCool();
const { proxy } = getCurrentInstance();

const open = ref(false);
const title = ref("");
const orderTableOpen = ref(false);
const orderTableTitle = ref("");
const orderTableLoading = ref(true);
const orderList = ref([]);

const data = reactive({
	form: {},
	rules: {
		customerPhone: [
			{ required: true, message: "手机号码不能为空", trigger: "blur" },
			{ pattern: /^\d{11}$/, message: "请输入正确的手机号", trigger: "blur" }
		],
		companyName: [{ required: true, message: "公司名称不能为空", trigger: "blur" }]
	}
});

const { form, rules } = toRefs(data);

// 选项
const options: any = reactive({
	type: [
		{
			label: "保护",
			value: 1
		},
		{
			label: "购买",
			value: 2
		}
	],
	fieldList: [
		{
			label: "手机号",
			value: "customerPhone"
		},
		{
			label: "阿里国际站ID",
			value: "aliInternationalId"
		},
		{
			label: "公司名称",
			value: "keyWord"
		}
	],
	channelManagerList: [],
	channelList: [],
	channelListNew: [],
	salesUserList: []
});
const channelVlue = ref("");

// cl-table
const Table = useTable({
	contextMenu: false,
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "id",
			hidden: true
		},
		{
			prop: "customerPhone",
			label: "手机",
			width: 150
		},
		{
			prop: "salesUser.name",
			label: "所属子账号",
			// hidden: user.isChanAdmin() || user.isChanFinancial(),
			width: 130
		},
		{
			prop: "channel.companyName",
			label: "渠道商",
			hidden: user.isAdmin() || user.isManager(),
			minWidth: 200
		},
		{
			prop: "companyName",
			label: "公司名称",
			minWidth: 200
		},
		{
			prop: "aliInternationalId",
			label: "国际站ID",
			minWidth: 150
		},
		{
			prop: "type",
			label: "状态",
			width: 100,
			dict: {
				options: [
					{
						label: "保护",
						value: 1,
						type: "success",
						effect: "light",
						round: true
					},
					{
						label: "购买",
						value: 2,
						type: "primary",
						effect: "light",
						round: true
					}
				]
			}
		},
		{
			prop: "createTime",
			label: "创建日期",
			width: 160
		},
		{
			type: "op",
			align: "left",
			width: 170,
			buttons({ scope }) {
				return [
					{
						label: "订单",
						hidden: scope.row.type === 1,
						onClick({ scope }) {
							if (scope.row.type == 1) {
								ElMessage.error("保护状态的客户无法进行该操作");
								return;
							}
							orderTableTitle.value = "客户" + scope.row.customerPhone + "的相关订单";
							service.business.order
								.pageOrderListWithChannel({
									customerPhone: scope.row.customerPhone
								})
								.then((res) => {
									if (res.list.length == 0) {
										ElMessage.info("无订单");
										return;
									}
									orderTableOpen.value = true;
									orderTableLoading.value = false;
									orderList.value = res.list;
								});
						}
					},
					{
						label: "删除",
						type: "danger",
						hidden: scope.row.type === 2 && user.isChanUser(),
						onClick({ scope }) {
							if (scope.row.type === 2) {
								return ElMessage.error("不可删除已购买的客户");
							}
							deleteRow([scope.row.id]);
						}
					},
					{
						label: "查看使用",
						hidden: true
					}
				];
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.business.customer,
		onRefresh(param, { render }) {
			service.business.customer
				.pageCustomerListWithChannel(param)
				.then(({ list, pagination }) => {
					render(list, pagination);
				});
		}
	},
	(app) => {
		app.refresh();
	}
);
const change = (value) => {
	console.log(value);
};

const searchKey = ref();
const key = ref("customerPhone");
const changeField = (field: any) => {
	key.value = field;
};
const duplicateChecking = () => {
	let obj = {};
	obj[key.value] = searchKey.value;

	service.business.customer.checkRepeatCustomer(obj);
	Crud.value.params[key.value] = undefined;
	refresh();
};

// 高级搜索
const AdvSearch = useAdvSearch({
	items: [
		{
			label: "手机号",
			prop: "customerPhone",
			component: {
				name: "el-input",
				props: {
					maxlength: 11
				}
			}
		},
		{
			label: "所属子账号",
			prop: "salesUser.name",
			component: {
				name: "el-input"
			}
		},
		{
			label: "公司名称",
			prop: "companyName",
			component: {
				name: "el-input"
			}
		},
		{
			label: "国际站ID",
			prop: "aliInternationalId",
			component: {
				name: "el-input"
			}
		}
	]
});

/**
 * 刷新
 */
function refresh() {
	Crud.value?.refresh();
}

/** 取消按钮 */
function cancel() {
	open.value = false;
	reset();
}

/** 重置表单 */
function reset() {
	form.value = {
		id: undefined,
		customerName: undefined,
		customerPhone: undefined,
		companyName: undefined,
		aliInternationalId: undefined
	};
}

/** 报备按钮操作 */
function handleAdd() {
	reset();
	open.value = true;
	title.value = "添加报备客户";
}

function submitForm() {
	proxy.$refs["customerRef"].validate((valid) => {
		if (valid) {
			service.business.customer.add(form.value).then(() => {
				ElMessage.success("报备成功");
				open.value = false;
				refresh();
			});
		}
	});
}

/**
 * 获取渠道经理
 */
function getChannalManagerList() {
	service.channel.channel.channelManagerList().then((res) => {
		// console.log("res->", res);
		res.forEach((item: { name: any; channelIds: any }) => {
			// console.log("item->", item);
			options.channelManagerList.push({
				label: item.name,
				value: item.channelIds
			});
		});
	});
}

// 选择渠道经理  对应渠道商进行变化
const changeAdmin = async (value: any) => {
	channelVlue.value = "";
	options.channelListNew = [];
	options.channelList.forEach((item: any) => {
		for (const key in value) {
			if (item.value == value[key]) {
				options.channelListNew.push(item);
			}
		}
	});
};
// 清空渠道经理 下拉框
const clearAdmin = () => {
	getChannelList();
};

/**
 * 获取渠道商
 */
function getChannelList() {
	options.channelList = [];
	service.channel.channel.channelList().then((res) => {
		res.forEach((item: any) => {
			options.channelList.push({
				label: item.companyName,
				value: item.id
			});
		});
		options.channelListNew = options.channelList;
	});
}

/**
 * 获取子账号信息
 */
function getSalesUserList() {
	service.channel.channelSales.salesUserList().then((res) => {
		res.forEach(({ salesUser }) => {
			options.salesUserList.push({
				label: salesUser.name,
				value: salesUser.id
			});
		}).catch((err) => {
			ElMessage.error(err);
		});
	});
}

function deleteRow(ids: number[]) {
	ElMessageBox.confirm("此操作将删除客户，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			service.business.customer
				.delete({
					ids
				})
				.then(() => {
					refresh();
				});
		})
		.catch(() => null);
}

if (user.isAdmin()) {
	getChannalManagerList();
	getChannelList();
}

if (user.isChanAdmin()) {
	getSalesUserList();
}
</script>
