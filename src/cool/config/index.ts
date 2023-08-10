import { Config } from "../types";
import dev from "./dev";
import prod from "./prod";
import test from "./test";

// 是否开发模式
const env = import.meta.env.MODE;
export const isDev = import.meta.env.MODE === "development";

// 配置
export const config: Config = {
	// 项目信息
	app: {
		name: "跨境易直播渠道系统",

		// 菜单
		menu: {
			// 是否分组显示
			isGroup: false,
			// 自定义菜单列表
			list: []
		},

		// 路由
		router: {
			// 模式
			mode: "history",
			// 转场动画
			transition: "slide",
			// 首页组件
			home: () => import("/$/demo/views/home/index.vue"),

			home2: () => import("/$/base/views/workspace/index.vue")
		},

		// 字体图标库
		iconfont: []
	},

	// 忽略规则
	ignore: {
		// 不显示请求进度条
		NProgress: ["/", "/base/open/eps", "/base/comm/upload", "/base/comm/uploadMode"],
		// 页面不需要登录验证
		token: ["/login", "/internal-login", "/401", "/403", "/404", "/500", "/502"]
	},

	// 调试
	test: {
		token: "",
		mock: false,
		eps: true
	},

	// 当前环境
	...(env === "development" ? dev : env === "test" ? test : prod)
};

export * from "./proxy";
