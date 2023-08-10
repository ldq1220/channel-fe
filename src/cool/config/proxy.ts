export const proxy = {
	"/dev/": {
		target: "http://127.0.0.1:8001",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, "")
	},

	"/lsf/": {
		target: "http://192.168.11.185:8001",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/lsf/, "")
	},

	"/heibai/": {
		target: "http://192.168.11.111:8001",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/heibai/, "")
	},

	"/test/": {
		target: "http://channel.yingxiaoli.top",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/test/, "/api")
	},

	"/prod/": {
		target: "https://channel.yingxiaoli.com",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, "/api")
	}
};
