<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-content="{ scope }">
				<div>
					<el-radio-group :model-value="tab.value" @change="onTabChange">
						<el-radio
							v-for="(item, index) in tab.list"
							:key="index"
							:label="item.value"
							>{{ item.label }}</el-radio
						>
					</el-radio-group>

					<cl-editor :name="tab.value" v-model="scope.data" v-if="tab.value" />
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="sys-param" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessageBox } from "element-plus";
import { reactive } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

const tab = reactive({
	value: "",
	list: [
		{
			label: "代码编辑器",
			value: "cl-editor-monaco"
		},
		{
			label: "富文本编辑器",
			value: "cl-editor-wang"
		}
	]
});

// cl-crud
const Crud = useCrud({ service: service.base.sys.param }, (app) => {
	app.refresh();
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "名称",
			prop: "name",
			minWidth: 150
		},
		{
			label: "描述",
			prop: "desc",
			minWidth: 150
		},
		{
			label: "市场价",
			prop: "marketValue",
			minWidth: 150
		},
		{
			label: "售卖价格",
			prop: "sellingPrice",
			minWidth: 150
		},
		{
			label: "毛利",
			prop: "grossProfit",
			minWidth: 150
		},
		{
			label: "操作",
			type: "op",
			align: "left",
			buttons: ["edit"]
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "1000px"
	},

	items: [
		{
			prop: "name",
			label: "名称",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		},
		{
			prop: "desc",
			label: "描述",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		},
		{
			prop: "channelPrice",
			label: "渠道价",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		},
		{
			prop: "marketValue",
			label: "市场价",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		},
		{
			prop: "guidePrice",
			label: "指导价",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		},
		{
			prop: "sellingPrice",
			label: "售卖价格",
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "grossProfit",
			label: "毛利",
			component: {
				name: "el-input",
				props: {
					disabled: "true"
				}
			}
		}
	],

	onOpened(data) {
		tab.value = /<*>/g.test(data.data) ? tab.list[1].value : tab.list[0].value;
	}
});

// 切换编辑器
function onTabChange(name: any) {
	ElMessageBox.confirm("切换编辑器会清空输入内容，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			tab.value = name;
			Upsert.value?.setForm("data", "");
		})
		.catch(() => null);
}
</script>
