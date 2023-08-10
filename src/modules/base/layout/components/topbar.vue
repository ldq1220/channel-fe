<template>
	<a-menu v-if="app.info.menu.isGroup" />

	<div class="app-topbar">
		<div
			class="app-topbar__collapse"
			:class="{
				unfold: !app.isFold
			}"
			@click="app.fold()"
		>
			<i class="cl-iconfont cl-icon-fold"></i>
		</div>

		<!-- 路由导航 -->
		<route-nav />

		<div class="flex1"></div>

		<!-- 工具栏 -->
		<ul class="app-topbar__tools">
			<!-- <auto-menu-btn /> -->

			<li>
				<cl-theme />
			</li>
		</ul>

		<!-- 用户信息 -->
		<div class="app-topbar__user avatar-container">
			<el-dropdown trigger="click" hide-on-click @command="onCommand">
				<div class="avatar-wrapper el-dropdown-link">
					<img src="https://audio.yingxiaoli.com/cat.jpg" class="user-avatar" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<!-- <el-dropdown-item command="my">
							<i class="cl-iconfont cl-icon-user"></i>
							<span>个人中心</span>
						</el-dropdown-item> -->
						<el-dropdown-item command="exit">
							<i class="cl-iconfont cl-icon-exit"></i>
							<span>退出</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<div class="user-info">
			<div class="user-name">
				<span>{{ user.info.name }}</span>
			</div>
			<!-- 用户身份 -->
			<div class="userRole el-tag el-tag--small el-tag--dark">
				<span class="el-tag__content"> {{ roleName }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" name="app-topbar" setup>
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import storage from "/@/cool/utils/storage";
import RouteNav from "./route-nav.vue";
import AMenu from "./amenu.vue";

const { router, service } = useCool();
const { user, app } = useBase();

async function onCommand(name: string) {
	switch (name) {
		case "my":
			router.push("/my/info");
			break;
		case "exit":
			await service.base.comm.logout();
			user.logout();
			break;
	}
}
function getRoleName() {
	let name = storage.get("userExtra").roleLabels[0];
	switch (name) {
		case "admin":
			return "超管 ( 开发者 )";
		case "gemel-admin":
			return "政元-管理员";
		case "gemel-financial":
			return "政元财务人员";
		case "chan-admin":
			return "渠道主账号";
		case "chan-manager":
			return "渠道经理";
		case "chan-sales":
			return "渠道子账号";
		case "chan-financial":
			return "渠道财务人员";
	}
}
let roleName = getRoleName();
</script>

<style lang="scss" scoped>
.app-topbar {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	background-color: #fff;
	margin-bottom: 10px;

	&__collapse {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		cursor: pointer;
		transform: rotateY(180deg);

		&.unfold {
			transform: rotateY(0);
		}

		i {
			font-size: 20px;
		}
	}

	.flex1 {
		flex: 1;
	}

	&__tools {
		display: flex;
		margin-right: 20px;

		& > li {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			height: 45px;
			min-width: 45px;
			border-radius: 3px;
			cursor: pointer;
			margin-left: 10px;
		}
	}

	&__user {
		margin-right: 10px;
		cursor: pointer;

		.el-dropdown-link {
			display: flex;
			align-items: center;
		}

		.name {
			white-space: nowrap;
			margin-right: 15px;
		}

		.el-icon-arrow-down {
			margin-left: 10px;
		}
	}
}

.avatar-container {
	margin-right: 10px;

	.avatar-wrapper {
		position: relative;

		.user-avatar {
			cursor: pointer;
			width: 35px;
			height: 35px;
			border-radius: 25%;
		}

		i {
			cursor: pointer;
			position: absolute;
			right: -20px;
			top: 20px;
			font-size: 12px;
		}
	}
}

.user-info {
	.user-name {
		font-size: 14px;
	}
}
</style>
