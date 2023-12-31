import { Socket } from "socket.io-client";

export namespace Chat {
	enum ContentType {
		"text" = 0,
		"image" = 1,
		"video" = 2
	}

	interface Message {
		fromId?: string;
		toId?: string;
		content: {
			text?: string;
			imageUrl?: string;
			[key: string]: any;
		};
		contentType: ContentType;
		[key: string]: any;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	interface Session {
		id: string;
		avatar: string;
		nickName: string;
		[key: string]: any;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	interface Provide {
		socket?: Socket;
		send(data: Message, isAppend?: boolean): void;
		append(data: Message): void;
		expand(boolean?: boolean): void;
		scrollToBottom(): void;
	}
}
