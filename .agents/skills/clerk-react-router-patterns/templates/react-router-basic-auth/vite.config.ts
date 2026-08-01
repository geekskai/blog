import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [reactRouter()],
	// React Router v8 dev SSR externalizes @clerk/react-router, which then resolves
	// react-router's production build while the app uses the development build —
	// two Router contexts, and useNavigate() throws inside ClerkProvider.
	// See https://github.com/remix-run/react-router/issues/15232
	ssr: {
		noExternal: ["@clerk/react-router"],
	},
})
