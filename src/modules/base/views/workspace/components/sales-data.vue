<template>
	<div class="sales-data">
		<el-card class="card" style="height: 250px">
			<div class="sales-data__header">
				<div class="label">总销售额</div>
				<div class="value">{{ salesData.totalSalesAmount }}</div>
			</div>
			<div class="sales-data__container">
				<ul>
					<li>
						<div class="label">待结算</div>
						<div class="value">{{ salesData.unsettledAmout }}</div>
					</li>
					<li>
						<div class="label">总客户数</div>
						<div class="value">{{ salesData.customerCount }}</div>
					</li>
					<li>
						<div class="label">子账号数</div>
						<div class="value">{{ salesData.salesUserCount }}</div>
					</li>
					<li>
						<div class="label">总订单数</div>
						<div class="value">{{ salesData.orderCount }}</div>
					</li>
				</ul>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";
import { onMounted, reactive, toRefs } from "vue";

const { service } = useCool();

const data = reactive({
	salesData: {
		totalSalesAmount: undefined,
		unsettledAmout: undefined,
		customerCount: undefined,
		salesUserCount: undefined,
		orderCount: undefined
	}
});

const { salesData } = toRefs(data);

function getData() {
	service.base.sys.workspace
		.channelTotalData()
		.then((res) => {
			salesData.value.totalSalesAmount = res.totalSalesAmount;
			salesData.value.unsettledAmout = res.unsettledAmout;
			salesData.value.customerCount = res.customerCount;
			salesData.value.salesUserCount = res.salesUserCount;
			salesData.value.orderCount = res.orderCount;
		})
		.catch((err) => {
			ElMessage.error(err);
		});
}

onMounted(() => {
	getData();
});
</script>

<style lang="scss">
.sales-data {
	.value {
		font-size: 20px;
		font-weight: bold;
		margin-top: 10px;
	}
	&__header {
		margin-bottom: 20px;
		.value {
			color: #fc872d;
		}
	}
	&__container {
		ul {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			li {
				width: 40%;
				list-style: none;
				margin-bottom: 20px;
			}
		}
	}
}
</style>
