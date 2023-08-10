<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<el-button color="#4165D7" @click="handleAdd" v-show="user.isChanAdmin()"
				>申请优惠</el-button
			>

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status"></cl-select>
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
					v-model="channelVlue"
					:options="options.channelListNew"
					prop="channelId"
				></cl-select>
			</cl-filter>
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table"> </cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-dialog title="申请优惠" v-model="open" width="600px">
			<el-form ref="promotionRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="选择规格">
					<el-select
						v-model="form.goodsId"
						placeholder="请选择"
						@change="renderGoodsInfo"
						style="width: 500px"
					>
						<el-option
							v-for="item in goodsList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="描述">
					{{ form.desc }}
				</el-form-item>
				<el-form-item label="渠道价">
					{{ form.channelPrice }}
				</el-form-item>
				<el-form-item label="市场价">
					{{ form.marketPrice }}
				</el-form-item>
				<el-form-item label="最低售价">
					{{ form.minSalePrice }}
				</el-form-item>
				<el-form-item label="申请优惠价" :required="true" prop="promoPrice">
					<el-input
						v-model="form.promoPrice"
						:placeholder="form.minSalePriceTitle"
						style="width: 500px"
					></el-input>
				</el-form-item>

				<el-form-item label="生效日期" :required="true" class="effective_date">
					<el-date-picker
						v-model="form.beginTime"
						type="datetime"
						placeholder="开始日期"
						:default-value="new Date()"
						:disabledDate="beginDisabledDate"
					/>
					<span class="date_fenge">-</span>
					<el-date-picker
						v-model="form.overTime"
						type="datetime"
						placeholder="结束日期"
						:disabled="!form.beginTime"
						:default-time="defaultTime"
						:disabledDate="overDisabledDate"
					/>
				</el-form-item>

				<el-form-item label="数量" prop="totalNum" :required="true">
					<el-input v-model="form.totalNum"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input
						v-model="form.remark"
						:rows="8"
						type="textarea"
						placeholder="请输入备注"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submitForm">确 定</el-button>
				</div>
			</template>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" name="business-promotion" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { reactive, ref, toRefs, getCurrentInstance, h, watch } from "vue";
import { user } from "/@/cool/utils";
import { ElMessage, dayjs } from "element-plus";
import elTooltip from "./elTooltip.vue";
const { service } = useCool();
const { proxy } = getCurrentInstance();

const open = ref(false);
const goodsList = ref([]);
const data: any = reactive({
	form: {
		goodsId: undefined,
		desc: undefined,
		channelPrice: undefined,
		marketPrice: undefined,
		salePrice: undefined,
		minSalePrice: undefined,
		minSalePriceTitle: undefined,
		promoPrice: undefined,
		totalNum: undefined,
		remark: undefined,
		beginTime: undefined,
		overTime: undefined
	},
	rules: {
		promoPrice: [{ require: true, message: "优惠价不能为空", trigger: "blur" }],
		totalNum: [{ require: true, message: "数量不能为空或0", trigger: "blur" }]
	}
});
const { form, rules } = toRefs(data);

const beginDisabledDate = (time: any) => {
	// 默认只能选择今天以及今天之后的日期
	return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000;
};
// 选择日期后的默认时间值
const defaultTime = new Date("2023-06-05T23:59:59");
// 监听开始日期的变化
watch(
	() => form.value.beginTime,
	() => {
		form.value.overTime = "";
	},
	{ immediate: true }
);
// 结束日期的 禁用判断
const overDisabledDate = (time: any) => {
	if (form.value.beginTime) {
		return (
			time.getTime() > dayjs(form.value.beginTime).add(1, "month").valueOf() ||
			time.getTime() < form.value.beginTime.getTime()
		);
	}
	return true;
};

const options: any = reactive({
	status: [
		{
			label: "申请中",
			value: 0
		},
		{
			label: "已拒绝",
			value: 1
		},
		{
			label: "未开始",
			value: 2
		},
		{
			label: "进行中",
			value: 3
		},
		{
			label: "已结束",
			value: 4
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
			width: 50
		},
		{
			label: "id",
			prop: "id",
			hidden: true
		},
		{
			label: "名称",
			prop: "goodsName"
		},
		{
			label: "描述",
			prop: "desc"
		},
		{
			label: "时长(月)",
			prop: "monthNum",
			width: 80
		},
		{
			label: "备注",
			prop: "remark"
		},
		{
			label: "附加码",
			prop: "promoCode",
			width: 100,
			renderHeader() {
				return h("p", [h("span", "附加码"), h(elTooltip)]);
			}
		},
		{
			label: "优惠价",
			prop: "promoPrice",
			width: 100
		},
		{
			label: "数量",
			prop: "totalNum",
			width: 80
		},
		{
			label: "剩余",
			prop: "leftNum",
			width: 80
		},
		{
			label: "渠道商",
			prop: "channel.companyName",
			minWidth: 150
		},
		{
			label: "状态",
			prop: "status",
			dict: {
				options: [
					{
						label: "申请中",
						value: 0,
						type: "primary",
						effect: "light",
						round: true
					},
					{
						label: "已拒绝",
						value: 1,
						type: "danger",
						effect: "light",
						round: true
					},
					{
						label: "未开始",
						value: 2,
						type: "waring",
						effect: "light",
						round: true
					},
					{
						label: "进行中",
						value: 3,
						type: "success",
						effect: "light",
						round: true
					},
					{
						label: "已结束",
						value: 4,
						type: "info",
						effect: "light",
						round: true
					}
				]
			},
			width: 100
		},
		{
			label: "开始日期",
			prop: "startTime",
			width: 160
		},
		{
			label: "结束日期",
			prop: "endTime",
			width: 160
		},
		{
			label: "申请日期",
			prop: "createTime",
			width: 160
		},
		{
			type: "op",
			align: "left",
			label: "操作",
			buttons: ({ scope }) => [
				{
					label: "同意",
					type: "success",
					hidden: scope.row.status !== 0 || !user.isAdmin(),
					onClick: ({ scope }) => {
						console.log(scope.column);
						if (scope.row.status == 0) {
							service.business.promotion
								.auditApplyingPromotion({
									id: scope.row.id,
									status: 3
								})
								.then(() => {
									ElMessage.success("已同意申请");
									refresh();
								});
						} else {
							ElMessage.error("无法操作");
						}
					}
				},
				{
					label: "拒绝",
					type: "danger",
					hidden: scope.row.status !== 0 || !user.isAdmin(),
					onClick: ({ scope }) => {
						if (scope.row.status == 0) {
							service.business.promotion
								.auditApplyingPromotion({
									id: scope.row.id,
									status: 1
								})
								.then(() => {
									ElMessage.info("已拒绝申请");
									refresh();
								});
						} else {
							ElMessage.error("无法操作");
						}
					}
				},
				{
					label: "结束",
					type: "danger",
					hidden: user.isAdmin() || ![0, 2, 3].includes(scope.row.status),
					onClick: ({ scope }) => {
						if (
							scope.row.status == 0 ||
							scope.row.status == 2 ||
							scope.row.status == 3
						) {
							service.business.promotion
								.auditApplyingPromotion({
									id: scope.row.id,
									status: 4
								})
								.then(() => {
									ElMessage.info("已结束申请");
									refresh();
								});
						} else {
							ElMessage.error("无法操作");
						}
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.business.promotion,
		onRefresh(params, { render }) {
			service.business.promotion.pagePromotionListWithChannel(params).then((res) => {
				render(res.list, res.pagination);
			});
		}
	},
	(app) => {
		app.refresh();
	}
);

/** 重置操作表单 */
function reset() {
	form.value = {
		goodsId: undefined,
		time: undefined,
		desc: undefined,
		channelPrice: undefined,
		marketPrice: undefined,
		salePrice: undefined,
		minSalePriceTitle: undefined,
		promoPrice: undefined,
		totalNum: undefined,
		remark: undefined
	};
	// proxy.resetForm("promotionRef");
}

function handleAdd() {
	reset();
	open.value = true;
	getGoodsList();
}

function renderGoodsInfo() {
	const goodsInfo = goodsList.value.find((goods) => goods.id === form.value.goodsId);
	form.value.desc = goodsInfo.desc;
	form.value.channelPrice = goodsInfo.channelPrice;
	form.value.marketPrice = goodsInfo.marketPrice;
	form.value.salePrice = goodsInfo.salePrice;
	form.value.minSalePrice = goodsInfo.minSalePrice;
	form.value.minSalePriceTitle = "最低售卖价不能低于" + goodsInfo.minSalePrice;
}

/**
 * 刷新
 */
function refresh() {
	Crud.value?.refresh();
}

/** 取消按钮 */
function cancel() {
	open.value = false;
}

function submitForm() {
	proxy.$refs["promotionRef"].validate((valid: any) => {
		if (valid) {
			service.business.promotion
				.applyPromotion({
					goodsId: form.value.goodsId,
					promoPrice: form.value.promoPrice,
					totalNum: form.value.totalNum,
					startTime: dayjs(new Date(form.value.beginTime)).format("YYYY-MM-DD HH:mm:ss"),
					endTime: dayjs(new Date(form.value.overTime)).format("YYYY-MM-DD HH:mm:ss"),
					remark: form.value.remark
				})
				.then(() => {
					ElMessage.success("申请成功，等待申请结果");
					open.value = false;
					Crud.value?.refresh();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	});
}

// 获取渠道经理
function getChannalManagerList() {
	service.channel.channel.channelManagerList().then((res) => {
		res.forEach((item: any) => {
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

function getGoodsList() {
	service.business.chan.goods.goodsList().then((data) => {
		goodsList.value = data;
	});
}

if (user.isAdmin()) {
	getChannalManagerList();
	getChannelList();
}
</script>

<style lang="scss">
.effective_date {
	.el-form-item__content {
		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap !important;
		.el-input__prefix-inner,
		.el-input__prefix {
			margin: 0;
		}
	}
	.date_fenge {
		margin: 0 10px;
	}
}
</style>
