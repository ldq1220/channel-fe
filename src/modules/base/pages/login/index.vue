<template>
	<div class="page-login">
		<div class="box">
			<div class="logo-box">
				<div class="logo">
					<img src="/logo.png" alt="Logo" />
				</div>
				<p class="desc">跨境易直播渠道系统</p>
			</div>

			<el-form label-position="top" class="form" :disabled="saving">
				<el-form-item label="手机号">
					<input
						v-model="form.phone"
						placeholder="请输入手机号"
						maxlength="11"
						autocomplete="on"
					/>
				</el-form-item>

				<el-form-item label="验证码">
					<div class="row">
						<input
							v-model="form.code"
							placeholder="验证码"
							maxlength="4"
							@keyup.enter="toLogin"
						/>
						<el-button
							type="warning"
							:loading="checkCodeBtn.loading"
							:disabled="checkCodeBtn.disabled"
							@click="getCode()"
							style="margin-left: 5px"
						>
							{{ checkCodeBtn.text }}
						</el-button>
					</div>
				</el-form-item>

				<div class="op">
					<el-button round :loading="saving" @click="toLogin">登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" name="login" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";

var checkCodeBtn = reactive<any>({
	text: "获取验证码",
	loading: false,
	disabled: false,
	duration: 59,
	timer: null
});
let flag = ref(false);

// 根据用户名获取验证码

const { refs, router, service } = useCool();
const { user, app } = useBase();

// 状态1
const saving = ref(false);

// 表单数据
var form = reactive({
	phone: "",
	code: ""
});

async function disableCodeBtn() {
	if (flag.value) {
		return;
	}
	flag.value = true;

	// 倒计时期间按钮不能单击
	checkCodeBtn.disabled = true;
	checkCodeBtn.text = "60秒";
	// 清除掉定时器
	checkCodeBtn.timer && clearInterval(checkCodeBtn.timer);
	// 开启定时器
	checkCodeBtn.timer = setInterval(() => {
		const tmp = checkCodeBtn.duration--;
		checkCodeBtn.text = `${tmp}秒`;
		if (tmp <= 0) {
			// 清除掉定时器
			clearInterval(checkCodeBtn.timer);
			checkCodeBtn.duration = 59;
			checkCodeBtn.text = "重新获取";
			// 设置按钮可以单击
			checkCodeBtn.disabled = false;
			flag.value = false;
		}
	}, 1000);
}

async function getCode() {
	if (!form.phone) {
		return ElMessage.error("请输入手机号");
	} else {
		var reg_tel =
			/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; //11位手机号码正则
		if (!reg_tel.test(form.phone)) {
			return ElMessage.error("请正确填写您的手机号码"); // 点击获取验证码 判断用户输入手机号格式
		}
		await disableCodeBtn().then(async () => {
			await service.base.open.smsCode({
				phone: form.phone
			});
		});
	}
}

// 登录
async function toLogin() {
	if (!form.phone) {
		return ElMessage.error("手机号不能为空");
	}
	if (!form.code) {
		return ElMessage.error("验证码不能为空");
	}
	saving.value = true;
	try {
		// 登录
		await service.base.open.loginBySmscode(form).then((res) => {
			user.setToken(res);
		});
		// token 事件
		await Promise.all(app.events.hasToken.map((e) => e()));
		// 跳转
		router.push("/");
	} catch (err: any) {}
	saving.value = false;
}
</script>

<style lang="scss" scoped>
.page-login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	position: relative;
	background-color: #ffffff;

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		.logo-box {
			display: inline-block;

			.logo {
				width: 60px;
				margin: 0 auto 5px;
				display: flex;
				align-items: center;

				img {
					width: 60px;
				}
			}

			.desc {
				color: #505050;
				font-size: 22px;
				font-weight: bold;
				margin-bottom: 50px;
			}
		}

		.el-form {
			width: 200px;

			:deep(.el-form-item) {
				margin-bottom: 15px;

				.el-form-item__label {
					color: #ccc;
				}
			}

			input {
				background-color: transparent;
				color: #a6a6a6;
				border: 0;
				height: 30px;
				width: calc(100% - 4px);
				margin: 0 2px;
				padding: 0 5px;
				box-sizing: border-box;
				-webkit-text-fill-color: #a6a6a6;
				font-size: 15px;
				border: rgba(153, 153, 153, 1) solid 1px;
				border-radius: 2px;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px transparent inset !important;
					transition: background-color 50000s ease-in-out 0s;
				}

				&::-webkit-input-placeholder {
					font-size: 12px;
				}
			}

			.row {
				display: flex;
				align-items: center;
				width: 100%;
				position: relative;

				.captcha {
					position: absolute;
					right: -160px;
					bottom: 1px;
					background: #ff7641;
				}
			}
		}

		.op {
			display: flex;

			:deep(.el-button) {
				width: 170px;
				height: 35px;
				color: rgba(255, 255, 255, 1);
				background-color: rgba(255, 141, 26, 1);
				font-size: 14px;
				line-height: 35px;
				text-align: center;
				border-radius: 0;
			}
		}
	}
}
</style>
