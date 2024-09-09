import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	assetsInclude: ['**/*.md'],
	server: {
		proxy: {
			'/graphql': 'http://localhost:3000/graphql',
			'/api': 'http://localhost:3000/',
		}
	}
})
