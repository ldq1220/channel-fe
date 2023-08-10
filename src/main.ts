import { createApp } from "vue";
import App from "./App.vue";
import { bootstrap, router, storage } from "./cool";

const app = createApp(App);

// 启动
bootstrap(app)
	.then(() => {
		app.mount("#app");
		app.config.errorHandler = (err) => {
			// storage.remove("userInfo");
			// storage.remove("token");
			// router.clear();
			// router.push("/login");
			// console.error(err);
		};
	})
	.catch((err) => {
		console.error("COOL-ADMIN 启动失败", err);
	});
