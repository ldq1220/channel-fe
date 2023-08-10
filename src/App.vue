<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
</script>

<style>
/* 隐藏cl-upload 文件大小 */
.cl-upload__item:not(.is-image) .cl-upload__size {
	display: none;
}
</style>
