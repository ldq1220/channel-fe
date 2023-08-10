import { defineStore } from "pinia";
import { ref } from "vue";
import { storage } from "/@/cool/utils";
import { service, config, router } from "/@/cool";
import { useProcessStore } from "./process";

// 本地缓存
const data = storage.info();

export const useUserStore = defineStore("user", function () {
	// 标识
	const token = ref<string>(config.test.token || data.token);
	const process = useProcessStore();

	// 设置标识
	function setToken(data: {
		token: string;
		expire: number;
		refreshToken: string;
		refreshExpire: number;
	}) {
		// 请求的唯一标识
		token.value = data.token;
		storage.set("token", data.token, data.expire);
		// 刷新 token 的唯一标识
		storage.set("refreshToken", data.refreshToken, data.refreshExpire);
		const strs = data.token.split(".");
		const tokenInfo = JSON.parse(
			decodeURIComponent(escape(window.atob(strs[1].replace(/-/g, "+").replace(/_/g, "/"))))
		);
		storage.set("userExtra", tokenInfo);
	}

	// 刷新标识
	async function refreshToken(): Promise<string> {
		return new Promise((resolve, reject) => {
			service.base.open
				.refreshToken({
					refreshToken: storage.get("refreshToken")
				})
				.then((res) => {
					setToken(res);
					resolve(res.token);
				})
				.catch((err) => {
					logout();
					reject(err);
				});
		});
	}

	// 用户信息
	const info:any = ref<Eps.BaseSysUserEntity | null>(data.userInfo);

	// 设置用户信息
	function set(value: any) {
		info.value = value;
		storage.set("userInfo", value);
	}

	// 清除用户
	function clear() {
		storage.set("debugToken", token);
		storage.remove("userInfo");
		storage.remove("token");
		token.value = "";
		info.value = null;
	}

	// 退出
	async function logout() {
		clear();
		router.clear();
		process.clear();
		router.push("/login");
	}

	// 获取用户信息
	async function get() {
		return service.base.comm.person().then((res) => {
			set(res);
			return res;
		});
	}

	return {
		token,
		info,
		get,
		set,
		logout,
		clear,
		setToken,
		refreshToken
	};
});
