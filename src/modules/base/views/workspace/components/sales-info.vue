<template>
	<div class="sales-info">
		<el-card class="card" style="height: 250px">
			<div id="salesInfo" name="salesInfo">
				<div class="card__header">
					<span class="value">{{ salesInfo.companyName }}</span>
				</div>
				<div class="card__container" style="height: 150px">
					<div v-if="!user.isChanFinancial()" style="margin-top: 10px">
						<div style="margin-bottom: 15px">
							<span class="label">购买链接</span>
							<span class="value">
								&nbsp;&nbsp;{{ salesInfo.buyLink }}&nbsp;&nbsp;
								<el-button
									size="small"
									@click="copy(salesInfo.buyLink)"
									style="margin-left: 5px"
									>复制</el-button
								></span
							>
						</div>
						<div>
							<span class="label">优惠码</span>
							<span class="value">
								&nbsp;&nbsp;{{ salesInfo.promoCode }}&nbsp;&nbsp;
								<el-button
									size="small"
									@click="copy(salesInfo.promoCode)"
									style="margin-left: 5px"
									>复制</el-button
								></span
							>
						</div>
					</div>
					<ul class="sales-info__cop">
						<li v-if="user.isChanAdmin() || user.isChanFinancial()">
							<span><el-button @click="download()">查看合同</el-button></span>
						</li>
						<li v-if="user.isChanAdmin()">
							<span>
								<el-button
									v-if="
										salesInfo.financialUserId == '' ||
										salesInfo.financialUserId == null
									"
									@click="addFinancialUser()"
									>添加财务联系人账号</el-button
								>
								<el-button
									v-if="
										salesInfo.financialUserId != null &&
										salesInfo.financialUserId != ''
									"
									@click="updateFinancialUser()"
									>修改财务联系人账号</el-button
								>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</el-card>

		<el-dialog v-model="open" :title="title" width="600px" append-to-body>
			<el-form
				ref="financialUserRef"
				:model="salesInfo.financialUser"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="手机号" prop="phone">
					<el-input
						v-model="salesInfo.financialUser.phone"
						placeholder="请输入手机号"
						maxlength="11"
					/>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="salesInfo.financialUser.name" placeholder="请输入姓名" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";
import { user } from "/@/cool/utils";

const { service } = useCool();
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");

const data = reactive({
	salesInfo: {
		id: undefined,
		companyName: undefined,
		filePath: undefined,
		financialUserId: undefined,
		buyLink: undefined,
		promoCode: undefined,
		financialUser: {
			id: undefined,
			phone: undefined,
			name: undefined
		}
	},
	rules: {
		phone: [
			{ required: true, message: "手机号码不能为空", trigger: "blur" },
			{ pattern: /^\d{11}$/, message: "请输入正确的手机号", trigger: "blur" }
		],
		name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
	}
});

const { salesInfo, rules } = toRefs(data);

function getInfo() {
	service.base.sys.workspace.channelOverview().then((res) => {
		salesInfo.value.id = res.id;
		salesInfo.value.companyName = res.companyName;
		salesInfo.value.filePath = res.filePath;
		salesInfo.value.financialUserId = res.financialUserId;
		salesInfo.value.buyLink = res.buyLink;
		salesInfo.value.promoCode = res.promoCode;
	});
}

function copy(data: any) {
	let url = data;
	let oInput = document.createElement("input");
	oInput.value = url;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	ElMessage.success("复制成功");
}

function download() {
	if (salesInfo.value.filePath != null && salesInfo.value.filePath != "") {
		window.open(salesInfo.value.filePath);
	} else {
		ElMessageBox.alert("没有添加合同，请联系系统管理员添加合同");
	}
}

function reset() {
	salesInfo.value.financialUser = {
		id: undefined,
		phone: undefined,
		name: undefined
	};
}

function cancel() {
	open.value = false;
	reset();
}

function addFinancialUser() {
	reset();
	open.value = true;
	title.value = "添加财务联系人账号";
}

function updateFinancialUser() {
	reset();
	const userId = salesInfo.value.financialUserId;
	service.base.sys.user.info({ id: userId }).then((res) => {
		salesInfo.value.financialUser.id = res.id;
		salesInfo.value.financialUser.name = res.name;
		salesInfo.value.financialUser.phone = res.phone;
		open.value = true;
		title.value = "修改财务联系人账号";
	});
}

function submitForm() {
	proxy.$refs["financialUserRef"].validate((valid) => {
		if (valid) {
			if (salesInfo.value.financialUserId != undefined) {
				service.base.sys.user.update(salesInfo.value.financialUser).then(() => {
					ElMessage.success("修改成功");
					open.value = false;
				});
			} else {
				service.base.sys.user.addFinancialUser(salesInfo.value.financialUser).then(() => {
					ElMessage.success("新增成功");
					open.value = false;
					getInfo();
				});
			}
		}
	});
}

onMounted(() => {
	getInfo();
});
</script>

<style lang="scss">
.sales-info {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;

		li {
			display: flex;
			list-style: none;
			flex: 1;
			color: #d8d8d8;

			.fall,
			.rise {
				display: flex;
				align-items: center;
				margin-left: 10px;
			}

			.fall {
				color: #13ae7c;
			}

			.rise {
				color: #f21e37;
			}
		}
	}
}
</style>
