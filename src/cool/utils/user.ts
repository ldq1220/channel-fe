import { Role } from "../enum/user";
import storage from "./storage";

export default {
	isAdmin() {
		return (
			storage.get("userExtra").roleLabels.includes(Role.ADMIN) ||
			storage.get("userExtra").roleLabels.includes(Role.GEMEL_ADMIN)
		);
	},
	isChanAdmin() {
		return storage.get("userExtra").roleLabels.includes(Role.CHAN_ADMIN);
	},
	isChanFinancial() {
		return storage.get("userExtra").roleLabels.includes(Role.CHAN_FINANCIAL);
	},
	isChanSales() {
		return storage.get("userExtra").roleLabels.includes(Role.CHAN_SALES);
	},
	isGemelFinancial() {
		return storage.get("userExtra").roleLabels.includes(Role.GEMEL_FINANCIAL);
	},
	isManager() {
		return storage.get("userExtra").roleLabels.includes(Role.CHAN_MANAGER);
	},
	isGemelUser() {
		return storage.get("userInfo").userLabel === 0;
	},
	isChanUser() {
		return storage.get("userInfo").userLabel === 1;
	}
};
