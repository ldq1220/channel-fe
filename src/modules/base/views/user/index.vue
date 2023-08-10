<template>
	<cl-view-group ref="ViewGroup" class="views-user">
		<template #left>
			<!-- 部门列表 -->
			<dept-list @refresh="refresh" @user-add="onUserAdd" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<!-- <cl-refresh-btn /> -->
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 批量删除按钮 -->
					<cl-multi-delete-btn />
					<!-- 用户转移 -->
					<!-- <el-button
						v-permission="service.base.sys.user.permission.move"
						type="success"
						:disabled="Table?.selection.length == 0"
						@click="toMove()"
						>转移</el-button
					> -->
					<cl-flex1 />
					<cl-search-key placeholder="搜索用户名、姓名" />
				</cl-row>

				<cl-row>
					<cl-table ref="Table">
						<!-- 权限 -->
						<template #column-roleName="{ scope }">
							<template v-if="scope.row.roleName">
								<el-tag
									v-for="(item, index) in scope.row.roleName.split(',')"
									:key="index"
									disable-transitions
									size="small"
									effect="dark"
									style="margin: 2px"
									>{{ item }}
								</el-tag>
							</template>
						</template>

						<!-- 单个转移 -->
						<!-- <template #slot-btn="{ scope }">
							<el-button
								v-permission="service.base.sys.user.permission.move"
								text
								bg
								@click="toMove(scope.row)"
								>转移</el-button
							>
						</template> -->
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert" />

				<!-- 移动 -->
				<user-move :ref="setRefs('userMove')" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="sys-user" setup>
import { ElMessage } from "element-plus";
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useViewGroup } from "../../hooks";
import DeptList from "./components/dept-list.vue";
import UserMove from "./components/user-move.vue";
import { storage } from "/@/cool/utils";

const { service, setRefs } = useCool();

const { ViewGroup } = useViewGroup({
	title: "用户列表",
	leftWidth: "0px"
});

// cl-crud
const Crud = useCrud({
	service: service.base.sys.user
});

// cl-table
const Table = useTable({
	contextMenu: false,
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			prop: "phone",
			label: "手机号码",
			minWidth: 150
		},
		{
			prop: "name",
			label: "姓名",
			minWidth: 150
		},
		{
			prop: "roleName",
			label: "角色",
			headerAlign: "center",
			minWidth: 120
		},
		{
			prop: "status",
			label: "状态",
			width: 100,
			hidden: !storage.get("base.menuPerms").includes("business:goods:update"),
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
			prop: "createTime",
			label: "创建时间",
			sortable: "desc",
			minWidth: 160
		},
		{
			type: "op",
			align: "left",
			width: 230,
			buttons({ scope }) {
				return [
					"edit",
					"delete",
					{
						label: "开启",
						hidden:
							scope.row.status == 1 || storage.get("userInfo").id == scope.row.userId,
						onClick() {
							service.base.sys.user
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
								})
								.catch((err) => {
									ElMessage.error(err);
								});
						}
					},
					{
						label: "禁用",
						hidden:
							scope.row.status == 0 || storage.get("userInfo").id == scope.row.userId,
						onClick() {
							service.base.sys.user
								.update({
									id: scope.row.id,
									status: 0
								})
								.then(() => {
									ElMessage.success("禁用成功");
									refresh();
								})
								.catch((err) => {
									ElMessage.error(err);
								});
						}
					}
				];
			}
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "500px"
	},
	items: [
		{
			prop: "name",
			label: "姓名",
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "phone",
			label: "手机号码",
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "roleIdList",
			label: "角色",
			value: [],
			required: true,
			component: {
				name: "el-select",
				options: [],
				props: {
					multiple: true,
					"multiple-limit": 3
				}
			}
		}
	],

	onSubmit(data, { next }) {
		next({
			...data,
			departmentId: ViewGroup.value?.selected?.id
		});
	},

	async onOpen() {
		// 设置权限列表
		service.base.sys.role.list().then((res) => {
			Upsert.value?.setOptions(
				"roleIdList",
				res.map((e) => {
					return {
						label: e.name || "",
						value: e.id
					};
				})
			);
		});
	}
});

// 刷新列表
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 新增成员
function onUserAdd({ id }: Eps.BaseSysDepartmentEntity) {
	Crud.value?.rowAppend({
		departmentId: id
	});
}
</script>

<style>
.cl-view-group__right .head[data-v-02ce6f54] {
	height: 0;
}
.views-user .icon .el-icon svg {
	font-size: 0;
}
.views-user .head .title {
	font-size: 0;
}
.views-user .cl-view-group__right .head .icon[data-v-02ce6f54] {
	cursor: auto;
}
</style>
