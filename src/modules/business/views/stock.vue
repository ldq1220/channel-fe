<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 进货 -->
			<span class="stock_btn">
				<el-button type="primary" @click="isShowStockDialog = true">进货</el-button>
			</span>
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<cl-dialog title="进货" v-model="isShowStockDialog" align-center>
			<div class="set_meal">
				<p>
					<span>*</span>
					选择套餐
				</p>
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="date" label="套餐名" />
					<el-table-column prop="name" label="规格" />
					<el-table-column prop="address" label="套数" />
					<el-table-column prop="address" label="折扣" />
					<el-table-column prop="address" label="单价" />
					<el-table-column prop="address" label="总价" />
				</el-table>

				<div class="stock_dialog_btns">
					<el-button @click="isShowStockDialog = false">取消</el-button>
					<el-button type="primary" @click="isShowStockDialog = false">进货</el-button>
				</div>
			</div>

			<div class="pay_meal">
				<p class="tooltipText">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 48 48"
						fill="rgba(181, 52, 52, 1)"
					>
						<path fill="none" d="M0 0h48v48H0V0z"></path>
						<path
							d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
						></path>
					</svg>
					请根据进货选择的套餐包总价扫码支付或汇款到政元软件对公账号
					财务会确认收款后提交入库
				</p>
				<p class="select_payment">请选择以下任一支付方式：</p>
				<div class="payment">
					<div class="transfer">
						<span class="transfer_text">1、微信支付</span>
						<div class="look">
							<a
								href="http://cdn.yingxiaoli.top/files/lQDPJw-lQ0XuITzNA9LNAtCwHNCQSXQafqkEyArQNMCpAA_720_978.jpg"
								target="_blank"
							>
								点击查看
							</a>
							<svg
								t="1691628525139"
								class="icon"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="4935"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								width="20"
								height="20"
							>
								<path
									d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
									fill="#28C445"
									p-id="4936"
								></path>
								<path
									d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
									fill="#28C445"
									p-id="4937"
								></path>
							</svg>
						</div>
					</div>
					<div class="transfer">
						<span class="transfer_text">2、支付宝</span>
						<div class="look">
							<a
								href="http://cdn.yingxiaoli.top/files/lQDPJyDFBvm_YTzNBpDNBDiwDQm5yPkIhREEyArQNYCaAA_1080_1680.jpg"
								target="_blank"
							>
								点击查看
							</a>
							<svg
								t="1691629021563"
								class="icon"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="5911"
								width="20"
								height="20"
								xmlns:xlink="http://www.w3.org/1999/xlink"
							>
								<path
									d="M230.771014 576.556522c-12.614493 9.646377-25.228986 23.744928-28.93913 42.295652-5.194203 24.486957-0.742029 55.652174 22.26087 80.13913 28.93913 28.93913 72.718841 37.101449 92.011594 38.585508 51.2 3.710145 106.110145-22.26087 147.663768-50.457971 16.324638-11.130435 43.77971-34.133333 70.492754-69.750725-59.362319-30.423188-133.565217-64.556522-212.22029-61.588406-41.553623 1.484058-70.492754 9.646377-91.269566 20.776812zM983.188406 712.347826c25.971014-61.588406 40.811594-129.113043 40.811594-200.347826 0-281.971014-230.028986-512-512-512S0 230.028986 0 512s230.028986 512 512 512c170.666667 0 321.298551-83.849275 414.794203-212.22029C838.492754 768.742029 693.797101 696.023188 604.011594 652.985507c-42.295652 48.973913-105.368116 97.205797-176.602898 117.982609-44.521739 13.356522-85.333333 18.550725-126.886957 9.646377-42.295652-8.904348-72.718841-28.197101-90.527536-47.489855-8.904348-10.388406-19.292754-22.26087-27.455073-37.843479 0.742029 0.742029 0.742029 2.226087 0.742029 2.968116 0 0-4.452174-7.42029-7.420289-19.292753-1.484058-5.936232-2.968116-11.872464-3.710145-17.808696-0.742029-4.452174-0.742029-8.904348 0-12.614493-0.742029-7.42029 0-15.582609 1.484058-23.744927 4.452174-20.776812 12.614493-43.77971 35.617391-65.298551 48.973913-48.231884 115.014493-50.457971 149.147826-50.457971 50.457971 0.742029 138.017391 22.26087 212.22029 48.973913 20.776812-43.77971 34.133333-89.785507 42.295652-121.692754H304.973913v-33.391304h158.052174v-66.782609H272.324638v-34.133333h190.701449v-66.782609c0-8.904348 2.226087-16.324638 16.324638-16.324637h74.944927v83.107246h207.026087v33.391304H554.295652v66.782609H719.768116S702.701449 494.933333 651.501449 586.202899c115.014493 40.811594 277.518841 104.626087 331.686957 126.144927z m0 0"
									fill="#06B4FD"
									p-id="5912"
								></path>
							</svg>
						</div>
					</div>
					<div class="transfer">
						<span class="transfer_text">3、对公账号打款</span>
						<div class="look">
							<a
								href="http://cdn.yingxiaoli.top/files/%E6%B7%B1%E5%9C%B3%E6%94%BF%E5%85%83%E6%94%B6%E6%AC%BE%E8%B4%A6%E6%88%B7%E5%BC%80%E6%88%B7%E8%A1%8C%E7%89%88%E6%9C%AC.pdf"
								target="_blank"
							>
								点击查看
							</a>
							<svg
								t="1691629088522"
								class="icon"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="8955"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								width="20"
								height="20"
							>
								<path
									d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
									fill="#FF8F41"
									p-id="8956"
								></path>
								<path
									d="M244.227592 307.279813m71.831644 0l391.881528 0q71.831645 0 71.831644 71.831645l0 265.777084q0 71.831645-71.831644 71.831645l-391.881528 0q-71.831645 0-71.831644-71.831645l0-265.777084q0-71.831645 71.831644-71.831645Z"
									fill="#FFFFFF"
									p-id="8957"
								></path>
								<path
									d="M244.227592 394.275916h535.544816v78.216679H244.227592z"
									fill="#FF7730"
									fill-opacity=".3"
									p-id="8958"
								></path>
								<path
									d="M695.659947 577.047545H609.250469a10.375682 10.375682 0 0 0-9.626238 6.503956l-16.049584 39.906469c-2.741574 6.818419 2.277861 14.247408 9.626238 14.247408h88.346538a10.375682 10.375682 0 0 0 9.782672-6.916589l14.111726-39.906469c2.388003-6.751376-2.620259-13.834775-9.781874-13.834775z"
									fill="#FF7730"
									p-id="8959"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</cl-dialog>
	</cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ref } from "vue";

const { service } = useCool();
const isShowStockDialog = ref(false); // 控制 进货对话框 显示与隐藏

// cl-crud
const Crud = useCrud(
	{
		service: service.business.customer
	},
	(app) => {
		app.refresh();
	}
);

const Table = useTable({
	contextMenu: false,
	columns: [
		{
			prop: "customerPhone",
			label: "手机",
			width: 150
		}
	]
});

const tableData = ref([]);
</script>

<style scoped lang="scss">
.set_meal {
	// border-bottom: 1px solid red;
	p {
		margin: 0 0 20px 0;
		span {
			color: red;
		}
	}
}
.stock_dialog_btns {
	margin: 20px 0;
	text-align: right;
}
.pay_meal {
	.tooltipText {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(181, 52, 52, 1);
	}
	.select_payment {
		text-align: center;
		font-weight: bold;
	}
	.payment {
		.transfer {
			width: 230px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 10px auto;
			.transfer_text {
				min-width: 110px;
			}
			.look {
				display: flex;
				align-items: center;
				a {
					cursor: pointer;
					margin: 0 8px 0 14px;
					color: rgba(235, 94, 40, 1);
				}
				a:hover {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
