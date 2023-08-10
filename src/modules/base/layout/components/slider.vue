<template>
	<div class="app-slider">
		<div class="app-slider__logo" @click="toHome">
			<img src="/logo.png" />
			<span v-if="!app.isFold || browser.isMini">{{ app.info.name }}</span>
		</div>

		<div class="app-slider__container">
			<b-menu />
			<div class="demonstration" v-if="!appStore.isFold">
				<a
					href="https://support.qq.com/product/531100/faqs-more"
					class="FAQ"
					target="_blank"
				>
					<el-icon><question-filled /></el-icon>销售 FAQ</a
				>
				<a href="https://live.yingxiaoli.com" target="_blank">
					<el-icon><star-filled /></el-icon>立即演示</a
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts" name="app-slider" setup>
import { useBase } from "/$/base";
import { useBrowser } from "/@/cool";
import BMenu from "./bmenu";
import { useAppStore } from "../../store/app";
import { StarFilled, QuestionFilled } from "@element-plus/icons-vue";
const appStore = useAppStore();

const { browser } = useBrowser();
const { app } = useBase();

function toHome() {
	location.href = "/";
}
</script>

<style lang="scss">
.app-slider {
	height: 100%;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	background-color: #2f3447;

	&__logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		cursor: pointer;

		img {
			height: 35px;
			width: 35px;
		}

		span {
			color: #fff;
			font-weight: bold;
			font-size: 15px;
			margin-left: 10px;
			white-space: nowrap;
		}
	}

	&__container {
		height: calc(100% - 50px);
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}

	&__menu {
		&.el-popper {
			&.is-light {
				border: 0;
			}
		}

		.el-menu {
			border-right: 0;
			background-color: transparent;

			&--popup {
				.cl-svg,
				span {
					color: #000;
				}
			}

			.el-sub-menu__title,
			&-item {
				&.is-active,
				&:hover {
					background-color: var(--color-primary) !important;

					.cl-svg,
					span {
						color: #fff;
					}
				}
			}

			.el-sub-menu__title,
			&-item,
			&__title {
				color: #eee;
				letter-spacing: 0.5px;
				height: 50px;
				line-height: 50px;

				.wrap {
					width: 100%;
				}

				.cl-svg {
					font-size: 16px;
				}

				span {
					display: inline-block;
					font-size: 12px;
					letter-spacing: 1px;
					margin-left: 10px;
					user-select: none;
				}
			}

			&--collapse {
				.wrap {
					text-align: center;
				}

				.el-sub-menu__title {
					padding: 0;
				}
			}
		}
	}
	.demonstration {
		.el-icon {
			color: #fff;
			font-size: 20px;
			vertical-align: middle;
			transform: translateY(-2px);
			margin-right: 7px;
		}

		a {
			display: inline-block;
			width: 100%;
			cursor: pointer;
			padding: 0 18px;
			line-height: 50px;
			height: 50px;
			font-size: 12px;
			color: #fff;
		}
		a:hover {
			background-color: #4165d7;
		}
		.FAQ i {
			font-size: 16px;
			margin: 0 10px 0 2px;
		}
	}
}
</style>
