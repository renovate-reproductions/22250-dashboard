import React, { Suspense } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';

interface Props {
	isAuthenticated: boolean;
}

const Auth = React.lazy(() => import('./pages/Auth'));
const ExternalAuthRedirect = React.lazy(() => import('./pages/ExternalAuthRedirect'));
const CliAuth = React.lazy(() => import('./pages/CliAuth'));
const CliAuthenticated = React.lazy(() => import('./pages/CliAuthenticated'));

const AppView: React.FC<Props> = (props: React.PropsWithChildren<Props>) => (
	<BrowserRouter>
		<Suspense fallback={null}>
			<Routes>
				{!props.isAuthenticated && (
					<>
						<Route path="/auth" element={<Auth />} />
						<Route path="/external-auth-redirect" element={<ExternalAuthRedirect />} />
						<Route path="*" element={<Navigate replace to="/auth" />} />
					</>
				)}
				<Route path="/cli-auth" element={<CliAuth />} />
				<Route path="/cli-authenticated" element={<CliAuthenticated />} />
			</Routes>
		</Suspense>
	</BrowserRouter>
);

AppView.displayName = 'AppView';
AppView.defaultProps = {};

export default React.memo(AppView);
