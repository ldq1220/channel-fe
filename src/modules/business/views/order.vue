<template>
	<cl-crud ref="Crud">
		<cl-row justify="space-between" style="height: 50px; font-size: var(--el-font-size-small)">
			<cl-col :span="12">
				<div style="width: 100px">
					<p>总金额</p>
					<span v-if="visibility1">{{ totalAmount }}</span>
					<span v-else>*****</span>
					<cl-svg
						:name="visibility1 ? 'eye-show' : 'eye-hide'"
						v-model="visibility1"
						size="25px"
						@click="toggleVisibility1"
					></cl-svg>
				</div>
			</cl-col>
			<cl-col :span="12">
				<div style="width: 100px; text-align: right">
					<p>总订单数</p>
					<span v-if="visibility2">{{ orderCount }}</span>
					<span v-else>*****</span>
					<cl-svg
						:name="visibility2 ? 'eye-show' : 'eye-hide'"
						v-model="visibility2"
						size="25px"
						@click="toggleVisibility2"
					></cl-svg>
				</div>
			</cl-col>
		</cl-row>

		<cl-row>
			<cl-filter label="归属" v-show="user.isChanAdmin()">
				<cl-select :options="options.salesUserList" prop="salesUserId"></cl-select>
			</cl-filter>
			<cl-filter label="是否已结算">
				<cl-select :options="options.settleStatus" prop="settleStatus"></cl-select>
			</cl-filter>
			<cl-filter label="时间范围">
				<cl-select :options="options.startDate" prop="startDate"></cl-select>
			</cl-filter>
			<cl-filter label="渠道经理" v-show="user.isAdmin()">
				<cl-select
					:options="options.channelManagerList"
					prop="channelId"
					@change="changeAdmin"
					@clear="clearAdmin"
				></cl-select>
			</cl-filter>
			<cl-filter label="渠道商" v-show="user.isAdmin() || user.isManager()">
				<cl-select
					v-model="channelVlue"
					:options="options.channelListNew"
					prop="channelId"
				></cl-select>
			</cl-filter>
			<cl-flex1 />
			<!-- 选择搜索 -->
			<cl-search-key field="orderNo" :field-list="options.fieldList" />
			<!-- 关键字搜索 -->
			<!-- <cl-search-key /> -->
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

		<cl-row>
			<cl-flex1 />
			<p style="font-size: var(--el-font-size-extra-small)">
				金额合计：{{ pageOrderAmount }}
			</p>
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />

		<cl-dialog
			:title="orderTableTitle"
			center
			v-model="orderTableOpen"
			:append-to-body="true"
			style="width: 800px"
		>
			<el-row>
				<div class="orderNo">订单号: {{ invoiceMessage.orderNo }}</div>
				<el-descriptions
					:column="2"
					border
					style="width: 100%; margin-bottom: 20px"
					label-width="100px"
				>
					<el-descriptions-item
						label="发票抬头"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttCompanyName }}
					</el-descriptions-item>
					<el-descriptions-item
						label="纳税识别号"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttTaxpayerIdentifier }}
					</el-descriptions-item>
					<el-descriptions-item
						label="地址"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttCompanyAddress }}
					</el-descriptions-item>
					<el-descriptions-item
						label="开票类型"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.invoiceType }}
					</el-descriptions-item>
					<el-descriptions-item
						label="发票接收邮箱"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.receiveEmail }}
					</el-descriptions-item>
					<el-descriptions-item
						label="电话"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttCompanyMobile }}
					</el-descriptions-item>
					<el-descriptions-item
						label="开户行"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttBank }}
					</el-descriptions-item>
					<el-descriptions-item
						label="账号"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttBankAccount }}
					</el-descriptions-item>
					<el-descriptions-item
						label="发票寄送信息"
						label-align="center"
						align="left"
						label-class-name="my-label"
						class-name="my-content"
					>
						{{ invoiceMessage.ttExpressAddress }}
						<br />
						{{ invoiceMessage.ttExpressFullName }}
						<br />
						{{ invoiceMessage.ttExpressMobile }}
					</el-descriptions-item>
				</el-descriptions>

				<el-form :model="ruleForm" :rules="rules" style="width: 100%">
					<el-form-item label="发票号" prop="invoiceNumber">
						<el-input v-model="ruleForm.invoiceNumber" />
					</el-form-item>
					<el-form-item label="上传电子发票" prop="file">
						<cl-upload text="选择文件" type="file" v-model="ruleForm.file" />
					</el-form-item>
					<el-form-item label="快递单号" prop="oddNumbers">
						<el-input v-model="ruleForm.oddNumbers" />
					</el-form-item>
					<el-row justify="end">
						<el-button @click="close()">取消</el-button>
						<el-button type="success" @click="save()">保存</el-button>
					</el-row>

					<!-- <el-form-item prop="invoiceNumber" class="required">
            <span class="required-star">*</span>
            <span>发票号</span>
            <el-input placeholder="请填写发票号"></el-input>
          </el-form-item>
          <el-form-item prop="name" class="required">
            <span>上传电子发票</span>
            <cl-upload text="选择文件" type="image" />
          </el-form-item>
          <el-form-item prop="name" class="required">
            <span>快递单号</span>
            <el-input placeholder="请填写快递单号"></el-input>
          </el-form-item> -->
				</el-form>
			</el-row>
		</cl-dialog>

		<cl-dialog v-model="open" width="800px" @close="() => (orderInfo = {})">
			<el-descriptions :column="1">
				<el-descriptions-item
					label="金额"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{ orderInfo.totalAmount }}
				</el-descriptions-item>
				<el-descriptions-item
					label="支付时间"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{ orderInfo.paidTime }}
				</el-descriptions-item>
				<el-descriptions-item
					label="名称"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{ orderInfo.name }}
				</el-descriptions-item>
				<!-- <el-descriptions-item label="商户全称" label-class-name="orderInfo_label" class-name="orderInfo_content"
					label-align="left" width="300px">{{ }}</el-descriptions-item> -->
				<el-descriptions-item
					label="支付平台"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{
						orderInfo.payment == 1
							? "微信支付"
							: orderInfo.payment == 2
							? "支付宝"
							: "线下"
					}}
				</el-descriptions-item>
				<!-- <el-descriptions-item label="支付方式" label-class-name="orderInfo_label" class-name="orderInfo_content"
					label-align="left" width="300px">{{ }}</el-descriptions-item> -->
				<el-descriptions-item
					label="交易单号"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{ orderInfo.transactionNo }}
				</el-descriptions-item>
				<el-descriptions-item
					label="订单号"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{ orderInfo.orderNo }}
				</el-descriptions-item>
				<el-descriptions-item
					label="结算状态"
					label-class-name="orderInfo_label"
					class-name="orderInfo_content"
					label-align="left"
					width="300px"
				>
					{{
						orderInfo.settleStatus == 0
							? "未结算"
							: orderInfo.settleStatus == 1
							? "结算中"
							: "已结算"
					}}
				</el-descriptions-item>
			</el-descriptions>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" name="order-channel" setup>
import { ref, reactive, onMounted } from "vue";
import { useCrud, useTable } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import dayjs from "dayjs";
import { storage, user } from "/@/cool/utils";
import { clear } from "console";
const { service } = useCool();

// console.log('---------',dayjs(new Date()).subtract(1, 'month').format('YYYY-MM-DD hh:mm:ss'));
// 填写发票号数据
const ruleForm = reactive({
	invoiceNumber: "",
	file: "",
	oddNumbers: ""
});

// 填写发票号表单验证
const rules = reactive({
	invoiceNumber: [{ required: true, message: "请填写发票号", trigger: "blur" }]
});

// 填写发票号表单信息
let invoiceMessage: any = reactive({
	ttCompanyName: "",
	ttTaxpayerIdentifier: "",
	ttCompanyAddress: "",
	invoiceType: "",
	receiveEmail: "",
	ttCompanyMobile: "",
	ttBank: "",
	ttBankAccount: "",
	ttExpressAddress: "",
	ttExpressFullName: "",
	ttExpressMobile: "",
	orderNo: ""
});

//总金额
const totalAmount = ref(0);
const orderCount = ref(0);
const pageOrderAmount = ref(0);
const visibility1 = ref(false);
const visibility2 = ref(false);

onMounted(() => {
	service.business.order.orderStat().then((res) => {
		orderCount.value = res.orderCount;
		totalAmount.value = res.totalAmount;
	});
	service.business.order.pageOrderAmount().then((res) => {
		pageOrderAmount.value = res.totalAmount;
	});
});
const open = ref(false);
const orderInfo = ref({});
const orderTableOpen = ref(false);
const orderTableTitle = ref("填写发票号及快递单号");
function getInfo(id: number) {
	service.business.order.info({ id }).then((res) => {
		orderInfo.value = res;
		console.log(res);
	});
}

// 选项
const options: any = reactive({
	fieldList: [
		{
			label: "订单号",
			value: "orderNo"
		},
		{
			label: "客户手机号",
			value: "customerPhone"
		}
	],
	salesUserList: [],
	settleStatus: [
		{
			label: "未结算",
			value: 0
		},
		{
			label: "结算中",
			value: 1
		},
		{
			label: "已结算",
			value: 2
		}
	],
	startDate: [
		{
			label: "一个月",
			value: dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00")
		},
		{
			label: "三个月",
			value: dayjs(new Date()).subtract(3, "month").format("YYYY-MM-DD 00:00:00")
		},
		{
			label: "一年",
			value: dayjs(new Date()).subtract(1, "year").format("YYYY-MM-DD 00:00:00")
		}
	],
	channelManagerList: [],
	channelList: [],
	channelListNew: []
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
			prop: "orderNo",
			label: "订单号",
			width: 200
		},
		{
			prop: "name",
			label: "名称",
			minWidth: 200
		},
		{
			prop: "customer.companyName",
			label: "客户公司名",
			hidden: user.isManager(),
			width: 200
		},
		{
			prop: "customerPhone",
			label: "手机",
			hidden: user.isManager(),
			width: 150
		},
		{
			prop: "salesUser.name",
			label: "所属子账号",
			width: 100
		},
		{
			prop: "channel.companyName",
			label: "渠道商",
			minWidth: 200
		},
		{
			prop: "totalAmount",
			label: "金额",
			width: 130
		},
		{
			label: "发票",
			prop: "invoiceNo",
			align: "center",
			width: 100
		},
		{
			prop: "settleStatus",
			label: "结算",
			width: 100,
			dict: {
				options: [
					{
						label: "未结算",
						value: 0,
						type: "warning",
						effect: "light",
						round: true
					},
					{
						label: "结算中",
						value: 1,
						type: "primary",
						effect: "light",
						round: true
					},
					{
						label: "已结算",
						value: 2,
						type: "success",
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
			align: "center",
			width: 270,
			hidden: user.isManager(),
			buttons({ scope }) {
				return [
					{
						label: "填发票",
						type: "primary",
						hidden:
							!storage
								.get("base.menuPerms")
								.includes("business:chan:order:updOrderInvoice") ||
							!scope.row.ttTaxpayerIdentifier,
						onClick() {
							orderTableOpen.value = true;
							service.business.chan.order
								.getOrderInvoice({
									id: scope.row.id
								})
								.then((res) => {
									invoiceMessage = Object.assign(invoiceMessage, res);
									let text = "";
									switch (invoiceMessage.invoiceType) {
										case 0:
											text = "普通发票（电子票)";
											break;
										case 1:
											text = "增值税专票（纸质票)";
											break;
										default:
											break;
									}
									invoiceMessage.invoiceType = text;
									orderTableOpen.value = true;
									ruleForm.invoiceNumber = res.invoiceNo;
									ruleForm.file = res.ttInvoiceUrl;
									ruleForm.oddNumbers = res.ttPackageNo;
								})
								.catch((error) => {
									console.log(error);
								});
						}
					},
					{
						label: "详情",
						type: "info",
						onClick() {
							getInfo(scope.row.id);
							open.value = true;
						}
					},
					{
						label: "使用情况",
						type: "primary",
						onClick() {
							window.open(scope.row.liveUsageUrl, "_blank");
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
		service: service.business.order,
		onRefresh(param, { render }) {
			service.business.order.pageOrderListWithChannel(param).then(({ list, pagination }) => {
				render(list, pagination);
			});
		}
	},
	(app) => {
		app.refresh();
	}
);

/** 切换可见 */
function toggleVisibility1() {
	visibility1.value ? (visibility1.value = false) : (visibility1.value = true);
}
function toggleVisibility2() {
	visibility2.value ? (visibility2.value = false) : (visibility2.value = true);
}

/**
 *  获取时间
 */
function getOrderTimes() {
	service.business.order
		.pageOrderListWithChannel({
			startDate: new Date(),
			endDate: 2
		})
		.then((res) => {
			console.log(res);
		});
}
getOrderTimes();

/**
 * 获取渠道经理
 */
function getChannalManagerList() {
	service.channel.channel.channelManagerList().then((res) => {
		res.forEach((item) => {
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
		});
	});
}

if (user.isAdmin() || user.isManager()) {
	getChannalManagerList();
	getChannelList();
}

if (user.isChanAdmin()) {
	getSalesUserList();
}

// 保存
async function save() {
	await service.business.chan.order
		.updOrderInvoice({
			orderNo: invoiceMessage.orderNo,
			invoiceNo: ruleForm.invoiceNumber,
			ttInvoiceUrl: ruleForm.file,
			ttPackageNo: ruleForm.oddNumbers
		})
		.then(() => {
			ElMessage.success("保存成功");
			refresh();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
	orderTableOpen.value = false;
}

/** 重置表单 */
function reset() {
	ruleForm.invoiceNumber = "";
	ruleForm.file = "";
	ruleForm.oddNumbers = "";
}

// 关闭
function close() {
	orderTableOpen.value = false;
	reset();
}

/** 刷新 */
function refresh() {
	Crud.value?.refresh();
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

.cl-filter .el-select {
	width: 50px;
}

.cl-search-key .el-select {
	width: 85px;
}

.orderInfo_label {
	width: 100px;
	font-size: 16px;
	margin-left: 30px;
	height: 40px;
	line-height: 150%;
	display: inline-block;
}

.el-descriptions__body .my-label {
	width: 120px;
}

.el-form-item__label {
	width: 120px;
	padding-left: 20px;
	justify-content: flex-start;
}

.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk).asterisk-left
	> .el-form-item__label-wrap
	> .el-form-item__label:before {
	position: absolute;
	left: 0;
}

.orderNo {
	margin-bottom: 20px;
}
</style>
