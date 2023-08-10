<template>
	<div class="tab-chart">
		<div class="tab-chart__header">
			<ul class="tab-chart__tab">
				<li class="active">渠道商销售额排名</li>
			</ul>
		</div>
		<div class="tab-chart__filter">
			<ul>
				<li
					v-for="(item, index) in options.type"
					:key="index"
					:class="{
						active: item.value == type
					}"
					@click="changeDate(item.value)"
				>
					{{ item.label }}
				</li>
			</ul>
			<div class="time-quantum">
				<el-date-picker
					v-model="date"
					type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@change="changedateSection"
					size="small"
				/>
			</div>
		</div>
		<div class="tab-chart__container">
			<div id="gemelChart" class="echarts" :option="chart" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import * as echarts from "echarts";
import { service } from "/@/cool";
import { onMounted, reactive, ref } from "vue";

var chart: echarts.ECharts;
var barWidth = 40;
onMounted(() => {
	const chartDom = document.getElementById("gemelChart")!;
	chart = echarts.init(chartDom);
	initChart(chart);
	getData(dayjs().startOf("day").toISOString());
});

function initChart(chart: echarts.ECharts) {
	chart.setOption({
		grid: {
			top: "20px",
			bottom: "30px",
			right: "10px",
			containLabel: true
		},
		xAxis: {
			type: "category",
			offset: 5,
			datasetIndex: 0,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: { interval: 0, rotate: 50 }
		},
		yAxis: {
			type: "value",
			offset: 20,
			splitLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			}
		},
		tooltip: {
			trigger: "axis",
			formatter: (comp: any) => {
				const [serie] = comp;
				return `${serie.value[2]}：${serie.value[1]}`;
			},
			axisPointer: {
				show: true,
				status: "shadow",
				z: -1,
				shadowStyle: {
					color: "#ffffff"
				},
				type: "shadow"
			},
			extraCssText: "width:120px; white-space:pre-wrap"
		},
		series: {
			barWidth,
			name: "销售额",
			type: "bar",
			datasetIndex: 1,
			label: {
				show: true,
				position: "top"
			},
			itemStyle: {
				color: "#4165d7"
			}
		}
	});
}

// 选项
const options = reactive({
	type: [
		{
			label: "今日",
			value: "day"
		},
		{
			label: "本周",
			value: "week"
		},
		{
			label: "本月",
			value: "month"
		},
		{
			label: "全年",
			value: "year"
		}
	]
});

function getData(startDate: string, endDate?: string) {
	service.base.sys.workspace
		.gemelTabChartData({
			startDate,
			endDate
		})
		.then((res) => {
			chart.setOption({
				dataset: [
					{
						dimensions: ["name", "totalAmount"],
						source: res.map((e: any) => {
							return [
								`${e.name.length >= 5 ? `${e.name.slice(0, 5)}...` : `${e.name}`}`,
								e.totalAmount,
								e.name
							];
						})
					},
					{
						transform: {
							type: "sort",
							config: { dimension: "totalAmount", order: "desc" }
						}
					}
				]
			});
		});
}

// 日期
const date = ref();

// 类型
const type = ref("day");

function changeDate(value: string) {
	type.value = value;
	date.value = "";
	let startDate = undefined;
	if (value === "day") {
		getData(dayjs().startOf("day").toISOString());
	} else if (value === "week") {
		startDate = dayjs().startOf("week").toISOString();
		getData(startDate);
	} else if (value === "month") {
		startDate = dayjs().startOf("month").toISOString();
		getData(startDate);
	} else if (value === "year") {
		startDate = dayjs().startOf("year").toISOString();
		getData(startDate);
	}
}

function changedateSection(val: string) {
	type.value = "";
	const startDate = dayjs(val[0]).toISOString();
	const endDate = dayjs(val[1]).toISOString();
	getData(startDate, endDate);
}
</script>

<style lang="scss" scoped>
// 时间控件
.time-quantum {
	width: 180px;
	padding-right: 20px;
}

.tab-chart {
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		padding: 0 20px;

		ul {
			li {
				list-style: none;
				float: left;
				margin-right: 20px;
				font-size: 15px;
				color: #dbdbdb;
				cursor: pointer;

				&.active {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}

	&__filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		padding: 0 20px;

		ul {
			display: flex;
			align-items: center;
			margin-right: 20px;
			flex: 1;
			max-width: 220px;

			li {
				list-style: none;
				font-size: 14px;
				cursor: pointer;
				color: #d8d8d8;
				white-space: nowrap;
				margin-right: 10px;
				flex: 1;

				&.active {
					color: #000;
				}

				&:not(.active):hover {
					color: #999;
				}
			}
		}

		:deep(.el-date-editor) {
			width: 150px;
		}
	}

	&__container {
		height: 300px;
		padding: 0 15px;

		.echarts {
			width: 100%;
			height: 100%;
		}
	}
}
</style>

<style>
.tab-chart__filter[data-v-692e75fd] .el-date-editor {
	width: 100%;
	cursor: pointer;
}
</style>
