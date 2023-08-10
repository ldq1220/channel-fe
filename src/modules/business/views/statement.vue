<template>
	<cl-crud ref="Crud">
		<cl-row
			justify="space-between"
			style="height: 50px; font-size: var(--el-font-size-extra-small)"
		>
			<cl-col>
				<div style="width: 120px">
					<p>已冻结金额(10,000)</p>
					<span style="line-height: 25px">{{ frozenAmount }}</span>
				</div>
			</cl-col>

			<cl-col>
				<div style="width: 120px">
					<p>未结算</p>
					<span v-if="visibility1">{{ unsettledAmount }}</span>
					<span v-else>*****</span>
					<cl-svg
						:name="visibility1 ? 'eye-show' : 'eye-hide'"
						v-model="visibility1"
						size="25px"
						@click="toggleVisibility1"
					></cl-svg>
				</div>
			</cl-col>

			<cl-col>
				<div style="width: 120px; text-align: right">
					<p>结算中</p>
					<span v-if="visibility2">{{ settlePendingAmount }}</span>
					<span v-else>*****</span>
					<cl-svg
						:name="visibility2 ? 'eye-show' : 'eye-hide'"
						v-model="visibility2"
						size="25px"
						@click="toggleVisibility2"
					></cl-svg>
				</div>
			</cl-col>

			<cl-col>
				<div style="width: 120px; text-align: right">
					<p>已结算</p>
					<span v-if="visibility3">{{ settledAmount }}</span>
					<span v-else>*****</span>
					<cl-svg
						:name="visibility3 ? 'eye-show' : 'eye-hide'"
						v-model="visibility3"
						size="25px"
						@click="toggleVisibility3"
					></cl-svg>
				</div>
			</cl-col>
		</cl-row>

		<cl-row>
			<!-- 自定义表单 -->
			<el-button
				type="info"
				color="#4165D7"
				@click="handleAdd"
				v-show="user.isChanAdmin() || user.isChanFinancial()"
				>生成对账单</el-button
			>
		</cl-row>
		<!-- 选择 -->
		<cl-row>
			<cl-filter label="状态筛选">
				<cl-select :options="options.status" prop="status"></cl-select>
			</cl-filter>
			<cl-filter label="时间范围">
				<cl-select :options="options.times" />
			</cl-filter>
			<cl-flex1 />
			<!-- 选择搜索	 -->
			<cl-filter label="渠道经理" v-if="user.isAdmin()">
				<cl-select
					:options="options.channelManagerList"
					prop="channelId"
					@change="changeAdmin"
					@clear="clearAdmin"
				/>
			</cl-filter>
			<cl-filter label="渠道商" v-if="user.isAdmin()">
				<cl-select
					v-model="channelVlue"
					:options="options.channelListNew"
					prop="channelId"
				/>
			</cl-filter>

			<cl-flex1 />
			<!-- 选择搜索 -->
			<cl-search-key field="serialNo" :field-list="fieldList" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table">
				<template #column-invoiceNo="{ scope }">
					<span v-show="scope.row.invoiceNo">{{ scope.row.invoiceNo }}</span>
					<el-button
						type="warning"
						v-show="!scope.row.invoiceNo && flag"
						@click="open(scope.row.id)"
						text
						bg
					>
						填写</el-button
					>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

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
					label="所属子账号"
					align="center"
					key="salesUser.name"
					prop="salesUser.name"
				/>
				<el-table-column
					label="交易金额"
					align="center"
					key="totalAmount"
					prop="totalAmount"
				/>
				<el-table-column label="发票号" align="center" key="invoiceNo" prop="invoiceNo" />
				<el-table-column
					label="创建日期"
					align="center"
					key="createTime"
					prop="createTime"
				/>
			</el-table>
		</cl-dialog>

		<!-- 生成对账单 -->
		<cl-dialog
			class="statementDialog"
			center
			title="生成对账单"
			v-model="statementOpen"
			@close="handleCreateStatementDialogClose"
			:append-to-body="true"
			style="width: 1210px"
		>
			<el-row>
				<el-col :span="24">
					<el-steps :active="step" finish-status="success">
						<el-step title="选择订单" />
						<el-step title="确认对账单" />
						<el-step title="填写发票号" />
					</el-steps>
				</el-col>
				<el-col :span="24" v-show="step == 0">
					<div class="orderTableContainer">
						<el-row type="flex" justify="end">
							<el-table
								ref="statementOrderTableRef"
								v-loading="statementOrderTableLoading"
								border
								:data="statementOrderList.data"
								class="orderTable"
								row-key="id"
							>
								<el-table-column
									type="selection"
									width="40px"
									:reserve-selection="true"
								/>
								<el-table-column
									label="订单号"
									align="center"
									key="orderNo"
									prop="orderNo"
									width="190px"
								/>
								<el-table-column
									label="名称"
									align="center"
									key="name"
									prop="name"
									width="280px"
								/>
								<el-table-column
									label="手机"
									align="center"
									key="customerPhone"
									prop="customerPhone"
									width="120px"
								/>
								<el-table-column
									label="所属子账号"
									align="center"
									key="salesUser.name"
									prop="salesUser.name"
									width="100px"
								/>
								<el-table-column
									label="交易金额"
									align="center"
									key="totalAmount"
									prop="totalAmount"
									width="90px"
								/>
								<el-table-column
									label="渠道价"
									align="center"
									key="channelPrice"
									prop="channelPrice"
									width="80px"
								/>
								<el-table-column label="结算金额" align="center" width="90px">
									<template #default="scope">
										<span>{{
											scope.row.totalAmount - scope.row.channelPrice
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									label="创建日期"
									align="center"
									key="createTime"
									prop="createTime"
									width="200px"
								/>
							</el-table>
						</el-row>
						<el-row type="flex" justify="end">
							<el-pagination
								layout="total, prev, pager, next, sizes"
								:total="pagination.total"
								:page-size="pagination.size"
								:current-page="pagination.page"
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
								:page-sizes="pagination.sizes"
							>
							</el-pagination>
						</el-row>
					</div>
				</el-col>
				<el-col :span="24" v-show="step == 1">
					<div class="statementContainer">
						<el-row>
							<el-descriptions :column="2" size="large" border style="width: 100%">
								<el-descriptions-item
									label="公司名称"
									:span="2"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ statementInfo.companyName }}
								</el-descriptions-item>

								<el-descriptions-item
									label="结算总额"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ statementInfo.totalAmount }}
								</el-descriptions-item>

								<el-descriptions-item
									label="订单数"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ statementInfo.orderCount }}
								</el-descriptions-item>

								<el-descriptions-item
									label="收款账号"
									label-class-name="my-label"
									class-name="my-content"
								>
									<p>{{ statementInfo.cardNo }}</p>
									<p>{{ statementInfo.accountName }}</p>
									<p>{{ statementInfo.bankName }}</p>
								</el-descriptions-item>

								<el-descriptions-item
									label="申请日期"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ statementInfo.applyTime }}
								</el-descriptions-item>
							</el-descriptions>
						</el-row>
						<span
							style="display: block; color: rgb(240, 18, 18); margin: -10px 0 10px 0"
						>
							注意：请认真核对收款账号信息，如发现不正确请联系政元财务（钟小姐
							13538780677）进行更正后才提交对账单。</span
						>
						<el-row style>
							<el-table
								ref="statementOrderTableRef2"
								border
								:data="statementOrderList2"
								:max-height="160"
							>
								<el-table-column
									label="订单号"
									align="center"
									key="orderNo"
									prop="orderNo"
									width="200px"
								/>
								<el-table-column
									label="名称"
									align="center"
									key="name"
									prop="name"
									width="290px"
								/>
								<el-table-column
									label="手机"
									align="center"
									key="customerPhone"
									prop="customerPhone"
									width="130px"
								/>
								<el-table-column
									label="所属子账号"
									align="center"
									key="salesUser.name"
									prop="salesUser.name"
									width="100px"
								/>
								<el-table-column
									label="交易金额"
									align="center"
									key="totalAmount"
									prop="totalAmount"
									width="90px"
								/>
								<el-table-column
									label="渠道价"
									align="center"
									key="channelPrice"
									prop="channelPrice"
									width="80px"
								/>
								<el-table-column label="结算金额" align="center" width="90px">
									<template #default="scope">
										<span>{{
											scope.row.totalAmount - scope.row.channelPrice
										}}</span>
									</template>
								</el-table-column>
								<el-table-column
									label="创建日期"
									align="center"
									key="createTime"
									prop="createTime"
									width="200px"
								/>
							</el-table>
						</el-row>
					</div>
				</el-col>
				<el-col :span="24" v-show="step == 2">
					<div>
						<el-row>
							<el-descriptions :column="2" border>
								<el-descriptions-item
									label="发票抬头"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.invoiceTitle }}
								</el-descriptions-item>
								<el-descriptions-item
									label="纳税识别号"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.taxNo }}
								</el-descriptions-item>
								<el-descriptions-item
									label="地址"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.companyAddress }}
								</el-descriptions-item>
								<el-descriptions-item
									label="电话"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.companyPhone }}
								</el-descriptions-item>
								<el-descriptions-item
									label="开户行"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.bankName }}
								</el-descriptions-item>
								<el-descriptions-item
									label="账号"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.cardNo }}
								</el-descriptions-item>
								<el-descriptions-item
									label="发票寄送信息"
									label-align="center"
									align="left"
									label-class-name="my-label"
									class-name="my-content"
								>
									{{ gemelInvoiceInfo.shippingAddress }}
									<br />
									{{ gemelInvoiceInfo.shippingName }}
									<br />
									{{ gemelInvoiceInfo.shippingPhone }}
								</el-descriptions-item>
							</el-descriptions>
						</el-row>
						<el-row style="margin-top: 20px" justify="center">
							<el-form :model="invoiceForm" ref="invoiceFormRef">
								<el-form-item label="填写发票号：">
									<el-input
										v-model="invoiceForm.invoiceNo"
										placeholder="请输入开完的发票号"
									></el-input>
								</el-form-item>
							</el-form>
						</el-row>
					</div>
				</el-col>
			</el-row>
			<el-row type="flex" justify="end">
				<el-button @click="cancel" v-if="step == 0">取消</el-button>
				<el-button @click="cancel" v-else>上一步</el-button>
				<el-button type="success" @click="handleNext" v-if="step == 2">提交</el-button>
				<el-button type="success" @click="handleNext" v-else>下一步</el-button>
			</el-row>
		</cl-dialog>
		<!-- 新增、编辑 -->
		<!-- <cl-upsert ref="Upsert" /> -->

		<!-- 已打款 -->
		<div class="remit_dialog">
			<el-dialog
				title="确定打款"
				v-model="remitDialog"
				width="30%"
				align-center
				@close="closeRemitDialog"
			>
				<el-form :model="remitForm" ref="remitFormDom" :rules="rules" label-width="80px">
					<el-form-item label="金额" prop="money">
						<el-input v-model="remitForm.money"></el-input>
					</el-form-item>
				</el-form>
				<p class="remit_confirm_text">
					<el-icon>
						<question-filled />
					</el-icon>
					您确定已打款？
				</p>

				<template #footer>
					<span class="dialog-footer">
						<el-button @click="remitDialog = false">取消</el-button>
						<el-button type="primary" @click="remitConfirm"> 确定 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</cl-crud>
</template>

<script lang="ts" name="order-channel" setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import { storage, user } from "/@/cool/utils";
import { QuestionFilled } from "@element-plus/icons-vue";

// 渠道商 对账单
let flag = ref(storage.get("base.menuPerms").includes("channel:channel-sales:update"));
const open = (id: any) => {
	ElMessageBox.prompt("请填写发票号", "填写发票号", {
		confirmButtonText: "确定",
		cancelButtonText: "取消"
	})
		.then(({ value }) => {
			service.business.statement
				.updateInvoiceNo({
					statementId: id,
					invoiceNo: value
				})
				.then(() => {
					refresh();
				});

			ElMessage({
				type: "success",
				message: `Your email is:${value}`
			});
		})
		.catch(() => {});
};

const { service } = useCool();

// 已打款
const remitDialog = ref(false);
const remitForm = reactive({
	money: 0
});
const remitFormDom = ref();
const moneyFlag = ref(); // 用于判断是否改变金额
const statementId = ref();

const rules = reactive({
	money: [
		{ required: true, message: "请输入金额", trigger: "blur" },
		{
			pattern: /^(-?\d+|\d{1,3}(,\d{3})+)?(\.\d{1,2})?$/,
			message: "请输入正确的金额",
			trigger: "blur"
		}
	]
});

const openRemitDialog = (totalAmount: number, id: number) => {
	// 打开已打款对话框
	remitDialog.value = true;
	remitForm.money = totalAmount;
	moneyFlag.value = totalAmount;
	statementId.value = id;
};
const closeRemitDialog = () => {
	// 清除表单验证
	remitFormDom.value.clearValidate("money");
};

const remitConfirm = async () => {
	// 校验表单
	await remitFormDom.value.validate();
	let data: any = {
		statementId: statementId.value,
		totalAmount: undefined
	};
	// 有修改金额
	if (moneyFlag.value !== remitForm.money) data.totalAmount = remitForm.money;

	service.business.statement.setteldStatement(data).then(() => {
		remitDialog.value = false;
		ElMessage.success("确定打款成功");
		refresh();
	});
};

const step = ref(0);
const statementOpen = ref(false);
const statementOrderTableRef = ref();
const statementOrderTableLoading = ref(true);
const statementOrderList = reactive({
	data: []
});
const statementOrderIds = ref([]);
const statementOrderTableRef2 = ref();
const statementOrderList2 = ref([]);
const statementInfo = ref({});
const gemelInvoiceInfo = ref({});
const unsettledAmount = ref(0);
const frozenAmount = ref(0);
const settlePendingAmount = ref(0);
const settledAmount = ref(0);
// 是否可见
const visibility1 = ref(false);
const visibility2 = ref(false);
const visibility3 = ref(false);
onMounted(() => {
	service.business.order.settleStat().then((res) => {
		unsettledAmount.value = res.unsettledAmount;
		settlePendingAmount.value = res.settlePendingAmount;
		settledAmount.value = res.settledAmount;
		frozenAmount.value = res.frozenAmount;
	});
});
// 分页组件参数
const data = reactive({
	pagination: {
		page: 1,
		size: 5,
		total: 0,
		sizes: [5, 10, 20, 30, 50, 100]
	},
	invoiceForm: {
		invoiceNo: undefined
	}
});
const { pagination, invoiceForm } = toRefs(data);

// 选择搜索
const fieldList = reactive([
	{
		label: "编号",
		value: "serialNo"
	},
	{
		label: "发票号",
		value: "invoiceNo"
	}
]);

// 选项
const options: any = reactive({
	status: [
		{
			label: "已结算",
			value: 0
		},
		{
			label: "审批中",
			value: 1
		}
	],
	times: [
		{
			label: "一个月",
			value: 1
		},
		{
			label: "三个月",
			value: 2
		},
		{
			label: "一年",
			value: 3
		}
	],
	channelManagerList: [],
	channelList: [],
	channelListNew: []
});
const channelVlue = ref("");
const orderTableOpen = ref(false);
const orderTableTitle = ref("");
const orderTableLoading = ref(true);
const orderList = ref([]);
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
			prop: "serialNo",
			label: "编号",
			width: 200
		},
		{
			prop: "totalAmount",
			label: "金额",
			minWidth: 100
		},
		{
			prop: "channel.companyName",
			label: "渠道商",
			minWidth: 200
		},
		{
			prop: "cardNo",
			label: "收款账号",
			minWidth: 130
		},
		{
			prop: "invoiceNo",
			label: "发票号",
			minWidth: 150
		},
		{
			prop: "status",
			label: "状态",
			width: 100,
			dict: {
				options: [
					{
						label: "已结算",
						value: 2,
						type: "success",
						effect: "light",
						round: true
					},
					{
						label: "审批中",
						value: 1,
						type: "primary",
						effect: "light",
						round: true
					}
				]
			}
		},
		{
			prop: "createTime",
			label: "申请日期",
			width: 160
		},
		{
			prop: "settledTime",
			label: "结算日期",
			width: 160
		},
		{
			type: "op",
			align: "left",
			width: 200,
			buttons({ scope }) {
				return [
					{
						label: "已打款",
						type: "warning",
						hidden: user.isChanUser() || scope.row.status === 2,
						onClick() {
							openRemitDialog(scope.row.totalAmount, scope.row.id);
							// ElMessageBox.confirm("您确定已打款？", {
							// 	confirmButtonText: "确定",
							// 	cancelButtonText: "取消",
							// 	type: "warning",
							// 	icon: markRaw(QuestionFilled)
							// })
							// 	.then(() => {
							// 		service.business.statement
							// 			.setteldStatement({
							// 				statementId: scope.row.id
							// 			})
							// 			.then(() => {
							// 				refresh();
							// 			});
							// 	})
							// 	.catch(() => {});
						}
					},
					{
						label: "相关订单",
						onClick() {
							orderTableTitle.value = scope.row.serialNo + "相关订单";
							orderTableOpen.value = true;
							service.business.statement
								.statementOrderList({
									id: scope.row.id
								})
								.then((data) => {
									orderTableLoading.value = false;
									orderList.value = data;
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
		service: service.business.statement,
		onRefresh(param, { render }) {
			service.business.statement
				.pageStatementListWithChannel(param)
				.then(({ list, pagination }) => {
					render(list, pagination);
				});
		}
	},
	(app) => {
		app.refresh();
	}
);

/** 刷新 */
function refresh() {
	Crud.value?.refresh();
}

/** 切换可见 */
function toggleVisibility1() {
	visibility1.value ? (visibility1.value = false) : (visibility1.value = true);
}
function toggleVisibility2() {
	visibility2.value ? (visibility2.value = false) : (visibility2.value = true);
}
function toggleVisibility3() {
	visibility3.value ? (visibility3.value = false) : (visibility3.value = true);
}

function handleSizeChange(val: number) {
	pagination.value.size = val;
	getStatementOrderList();
}
function handleCurrentChange(val: number) {
	pagination.value.page = val;
	getStatementOrderList();
}

function handleAdd() {
	step.value = 0;
	getStatementOrderList();
	statementOpen.value = true;
}

function cancel() {
	if (step.value == 0) {
		statementOrderList2.value = [];
		statementOpen.value = false;
	} else {
		step.value--;
	}
}

function handleNext() {
	if (step.value == 0) {
		const selectionRows = statementOrderTableRef.value!.getSelectionRows();
		if (selectionRows == 0) {
			// 未选中订单
			ElMessage.error("请选择订单");
			return;
		}
		statementOrderIds.value = selectionRows.map(({ id }) => {
			return id;
		});
		statementOrderList2.value = selectionRows;
		step.value++;
		getStatementInfo();
	} else if (step.value == 1) {
		step.value++;
	} else if (step.value == 2) {
		service.business.statement
			.createStatement({
				orderIds: statementOrderIds.value,
				invoiceNo: invoiceForm.value.invoiceNo
			})
			.then(() => {
				ElMessage.success("生成对账单成功");
				statementOpen.value = false;
				refresh();
			})
			.catch(() => {
				refresh();
			});
	}
}

function handleCreateStatementDialogClose() {
	statementOrderList2.value = [];
	step.value = 0;
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
	console.log(options.channelListNew);
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
if (user.isAdmin()) {
	getChannalManagerList();
	getChannelList();
}

// 获取订单信息
function getStatementOrderList() {
	service.business.order
		.pageOrderListWithChannel({
			page: pagination.value.page,
			size: pagination.value.size,
			settleStatus: 0
		})
		.then((res) => {
			statementOrderTableLoading.value = false;
			statementOrderList.data = res.list;
			pagination.value.page = res.pagination.page;
			pagination.value.size = res.pagination.size;
			pagination.value.total = res.pagination.total;
		});
}

function getStatementInfo() {
	service.business.statement
		.createStatementPreview({
			orderIds: statementOrderIds.value
		})
		.then((res) => {
			statementInfo.value.companyName = res.companyName;
			statementInfo.value.totalAmount = res.totalAmount;
			statementInfo.value.orderCount = res.orderCount;
			statementInfo.value.cardNo = res.cardNo;
			statementInfo.value.accountName = res.accountName;
			statementInfo.value.bankName = res.bankName;
			statementInfo.value.applyTime = res.applyTime;
			gemelInvoiceInfo.value = res.gemelInvoiceInfo;
		});
}
</script>

<style lang="scss">
.oredr-all {
	height: 100px;
	line-height: 35px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.statementDialog {
	.el-row {
		margin-bottom: 20px;
	}

	.el-row:last-child {
		margin-bottom: 0px;
	}

	.el-col {
		margin-bottom: 10px;
	}

	.el-col:last-child {
		margin-bottom: 0px;
	}
}

.orderTableContainer {
	min-width: 1160px;

	.el-col {
		border-radius: 4px;
	}
}

.statementContainer {
	min-width: 1160px;
}

.my-label {
	width: 200px;
	background: var(--el-color-success-light-9);
}

.my-content {
	width: 400px;
}
// 已打款
.remit_confirm_text {
	display: flex;
	i {
		margin-right: 14px;
		font-size: 21px;
		color: #e6a23c;
	}
}
.remit_dialog {
	.el-dialog__body {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.el-form-item__content {
		position: relative;
		.error_text {
			position: absolute;
			top: 25px;
			left: 10px;
			font-size: 12px;
			color: red;
		}
	}
	.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before {
		position: relative;
	}
}
</style>
