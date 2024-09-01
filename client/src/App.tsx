// Import and use global css
import './App.css'

// React Router
import { Routes, Route, HashRouter } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import ScrollToTop from './components/common/ScrollTopTop'

// Pages
import Home from './pages/Home.tsx'
import Page from './pages/Page/Page.tsx'
import PageEditor from './pages/PageEditor/PageEditor.tsx'
import PageCreator from './pages/PageCreator/PageCreator.tsx'
import Login from './pages/Login'
import Signup from './pages/Signup'
import HistoricalPage from './pages/HistoricalPage.tsx'
import { UserContextProvider } from './contexts/UserContext'
import { ToastContextProvider } from './contexts/ToastContext'
import PageHistory from './pages/PageHistory'
import { ThemeContextProvider } from './contexts/ThemeContext.tsx'
import Settings from './pages/Settings'
import ChangePassword from './pages/ChangePassword.tsx'
import ChangeUsername from './pages/ChangeUsername.tsx'
import WikiHome from './pages/WikiHome.tsx'
import Landing from './pages/Landing'
import WikiCreator from './pages/WikiCreator.tsx'
import WikiSettings from './pages/WikiSettings'

export default function App() {
	return (
		<HashRouter>
			<UserContextProvider>
				<ThemeContextProvider>
					<ToastContextProvider>
						<ScrollToTop />
						<Routes>
							<Route path='/' element={<Landing/>}/>
							<Route path='/wiki/create' element={<WikiCreator/>}/>

							<Route path='/settings' element={<Settings />}/>
							<Route path='wiki/:wikiname/settings' element={<WikiSettings />}/>
							<Route path='settings/changePassword' element={<ChangePassword/>}/>
							<Route path='settings/changeUsername' element={<ChangeUsername/>}/>

							<Route element={<Navbar/>}>
								<Route path='/home' element={<Home/>}/>
								<Route path='/wiki/:wikiname' element={<WikiHome/>}/>

								<Route path='/wiki/:wikiname/page/:id' element={<Page/>}/>
								<Route path='/wiki/:wikiname/page/:id/edit' element={<PageEditor/>}/>
								<Route path='/wiki/:wikiname/page/create' element={<PageCreator/>}/>
								<Route path="/wiki/:wikiname/page/:id/history" element={<PageHistory />} />
								<Route path="/wiki/:wikiname/page/:id/history/:version" element={<HistoricalPage />} />
							</Route>
							<Route index path='/login' element={<Login/>}/>
							<Route path='/signup' element={<Signup/>}/>
						</Routes>
					</ToastContextProvider>
				</ThemeContextProvider>
			</UserContextProvider>
		</HashRouter>
	)
}
