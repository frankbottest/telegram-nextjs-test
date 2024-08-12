export {}

declare global {
	interface Window {
		Telegram: {
			WebApp: {
				initDataUnsafe: any
				ready: () => void
				close: () => void
				expand: () => void
				// Добавьте любые другие методы или свойства, которые вы используете
			}
		}
	}
}
