<template>
	<!-- <div class="view-home">
		<el-row :gutter="15">
			<el-col :lg="10" :xs="24" :xl="6" v-if="user.isChanUser()">
				<div class="card">
					<sales-info />
				</div>
			</el-col>
			<el-col :lg="10" :xs="24">
				<div class="card">
					<sales-data />
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" v-if="user.isAdmin()">
			<el-col :lg="14" :xs="24">
				<div class="card">
					<gemel-tab-chart />
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" v-if="user.isChanAdmin()">
			<el-col :lg="14" :xs="24">
				<div class="card">
					<chan-tab-chart />
				</div>
			</el-col>
		</el-row>
	</div> -->

	<div class="view-home">
		<el-row :gutter="15">
			<el-col :lg="6" :md="11" :xs="24" v-if="user.isChanUser()">
				<div class="card">
					<sales-info />
				</div>
			</el-col>
			<el-col :lg="6" :md="11" :xs="24">
				<div class="card">
					<sales-data />
				</div>
			</el-col>
		</el-row>
	
		<el-row :gutter="15" v-if="user.isAdmin()">
			<el-col :xl="12" :lg="12" :md="22" :sm="24" :xs="24">
				<div class="card">
					<gemel-tab-chart />
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15" v-if="user.isChanAdmin()">
			<el-col :xl="12" :lg="12" :md="22" :sm="24" :xs="24">
				<div class="card">
					<chan-tab-chart />
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" setup>
import SalesInfo from "./components/sales-info.vue";
import SalesData from "./components/sales-data.vue";
import ChanTabChart from "./components/chan-tabChart.vue";
import GemelTabChart from "./components/gemel-tabChart.vue";
import { user } from "/@/cool/utils";
</script>

<style lang="scss">
.view-home {
	.card {
		background-color: #fff;
		border-radius: 5px;
		margin-bottom: 15px;
		font-size: 12px;
		letter-spacing: 0.5px;
		color: #000;

		&__header {
			display: flex;
			align-items: center;
			height: 50px;
			padding: 0 20px;

			.label {
				font-size: 12px;
			}

			.value {
				font-size: 18px;
				font-weight: bold;
				margin-left: 10px;
			}
		}

		&__container {
			padding: 0 20px;
			height: 50px;
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			border-top: 1px solid #f7f7f7;
			font-size: 12px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;

			.label {
				margin-right: 10px;
			}

			.value {
				font-size: 13px;
			}
		}
	}
}
</style>
