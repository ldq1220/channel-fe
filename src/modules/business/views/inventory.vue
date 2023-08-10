<template>
	<cl-crud ref="Crud">
		<cl-row class="inventory_box">
			<el-card shadow="hover" class="inventory">
				<p>1年</p>
				<p class="center">
					<span class="inventory_num">39</span>
					套
				</p>
				<p>当前库存</p>
			</el-card>
			<el-card shadow="hover" class="inventory">
				<p>2年</p>
				<p class="center">
					<span class="inventory_num">8</span>
					套
				</p>
				<p>当前库存</p>
			</el-card>
		</cl-row>

		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 进货 -->
			<el-button type="primary" @click="router.push('/business/stock')">去进货</el-button>
			<!-- 新增按钮 -->
			<!-- <cl-add-btn /> -->
			<!-- 删除按钮 -->
			<!-- <cl-multi-delete-btn /> -->
			<!-- <cl-flex1 /> -->
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

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />

		<cl-dialog title="库存记录详情" v-model="inventoryDialog" width="40%">
			<!-- <p>少年，我看你骨骼精奇，是万中无一的武学奇才，维护世界和平就靠你了</p> -->
			<div class="inventory_dialog dialog_content" v-if="false">
				<div class="content_item">
					<div class="item_label">进货单号</div>
					<div class="item_value order">TC20230804171438560</div>
				</div>
				<div class="content_item">
					<div class="item_label">采购方</div>
					<div class="item_value">广州金万两科技有限公司</div>
				</div>
				<div class="content_item">
					<div class="item_label">套餐名</div>
					<div class="item_value">5折10套1年套餐包</div>
				</div>
				<div class="content_item">
					<div class="item_label">规格</div>
					<div class="item_value">1年</div>
				</div>
				<div class="content_item">
					<div class="item_label">套数</div>
					<div class="item_value">6/10</div>
				</div>
				<div class="content_item">
					<div class="item_label">折扣</div>
					<div class="item_value">3折</div>
				</div>
				<div class="content_item">
					<div class="item_label">单价</div>
					<div class="item_value">￥6400</div>
				</div>
				<div class="content_item">
					<div class="item_label">总价</div>
					<div class="item_value">￥64000</div>
				</div>
				<div class="content_item">
					<div class="item_label">被采购时间</div>
					<div class="item_value">2023-3-14 20:00</div>
				</div>
			</div>
			<div class="sales_dialog dialog_content" v-if="false">
				<div class="content_item">
					<div class="item_label">订单号</div>
					<div class="item_value order">TC20230804171438560</div>
				</div>
				<div class="content_item">
					<div class="item_label">名称</div>
					<div class="item_value">跨境易直播-12个月时长的会员资格(一年)</div>
				</div>
				<div class="content_item">
					<div class="item_label">客户公司名</div>
					<div class="item_value">深圳菲仕特科技</div>
				</div>
				<div class="content_item">
					<div class="item_label">手机</div>
					<div class="item_value">18678985687</div>
				</div>
				<div class="content_item">
					<div class="item_label">金额</div>
					<div class="item_value">￥6400</div>
				</div>
				<div class="content_item">
					<div class="item_label">创建时间</div>
					<div class="item_value">2023-3-14 20:00</div>
				</div>
			</div>
			<div class="be_purchased_dialog dialog_content">
				<div class="content_item">
					<div class="item_label">进货单号</div>
					<div class="item_value order">TC20230804171438560</div>
				</div>
				<div class="content_item">
					<div class="item_label">采购方</div>
					<div class="item_value">广州金万两科技有限公司</div>
				</div>
				<div class="content_item">
					<div class="item_label">套餐名</div>
					<div class="item_value">5折10套1年套餐包</div>
				</div>
				<div class="content_item">
					<div class="item_label">规格</div>
					<div class="item_value">1年</div>
				</div>
				<div class="content_item">
					<div class="item_label">套数</div>
					<div class="item_value">6/10</div>
				</div>
				<div class="content_item">
					<div class="item_label">折扣</div>
					<div class="item_value">3折</div>
				</div>
				<div class="content_item">
					<div class="item_label">单价</div>
					<div class="item_value">￥6400</div>
				</div>
				<div class="content_item">
					<div class="item_label">总价</div>
					<div class="item_value">￥64000</div>
				</div>
				<div class="content_item">
					<div class="item_label">被采购时间</div>
					<div class="item_value">2023-3-14 20:00</div>
				</div>
			</div>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" name="菜单名称" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useRouter } from "vue-router";
import { ref } from "vue";

const { service } = useCool();
const router = useRouter();

// 详情对话框
const inventoryDialog = ref(false);

// cl-upsert
const Upsert = useUpsert({
	items: []
});

// cl-table
const Table = useTable({
	columns: [
		{
			prop: "",
			label: "手机"
		},
		{
			prop: "",
			label: "类型"
		},
		{
			prop: "",
			label: "套数"
		},
		{
			prop: "",
			label: "对象"
		},
		{
			prop: "",
			label: "规格"
		},
		{
			prop: "",
			label: "日期"
		},
		{
			type: "op",
			align: "left",
			width: 80,
			buttons({ scope }) {
				return [
					{
						label: "详情",
						onClick() {
							// console.log(scope.row);
							inventoryDialog.value = true;
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
		service: service.business.customer
	},
	(app) => {
		app.refresh();
	}
);
</script>

<style scoped lang="scss">
.inventory_box {
	display: flex;
	justify-content: center;
}
.inventory {
	cursor: pointer;
	width: 120px;
	height: 140px;
	margin: 10px 60px 20px 0 !important;
	// border: rgba(166, 166, 166, 1) solid 1px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size: 14px;
	color: rgba(80, 80, 80, 1);
	.inventory_num {
		font-size: 30px;
		font-weight: bold;
	}
	.center {
		margin: 10px 0;
	}
}

.dialog_content {
	.content_item {
		padding: 12px 20px;
		display: flex;
		align-items: center;
		.item_label {
			min-width: 100px;
			color: rgb(26, 25, 25);
		}
		.item_value.order {
			font-size: 20px;
		}
	}
}
</style>
