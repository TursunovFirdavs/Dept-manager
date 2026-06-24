import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
	return (
		<div>
			<h2>Qarz Manager</h2>

			<Outlet />
		</div>
	)
}

export default DashboardLayout
