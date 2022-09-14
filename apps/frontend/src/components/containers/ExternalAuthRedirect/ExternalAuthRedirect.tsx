import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import type { PayloadAction } from '@reduxjs/toolkit';

import { backendApi, cliBackendApi, temporaryCliServerApi } from '@/utils/http';
import type { IAutoAuthResponseData, ICliAuthResponseData } from '@/interfaces/responses';
import { authActions } from '@/store/reducers/auth';
import type { IAuthPayload } from '@/store/interfaces/auth';

import ExternalAuthRedirectView from './ExternalAuthRedirect.view';

interface PropsFromDispatch {
	readonly auth: (loginPayload: IAuthPayload) => PayloadAction<IAuthPayload>;
}

interface IProps extends PropsFromDispatch {}

const ExternalAuthRedirect: React.FC<IProps> = (props: React.PropsWithChildren<IProps>) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const refreshToken = searchParams.get('refreshToken');
		const port = searchParams.get('port');

		if (refreshToken) {
			localStorage.setItem('token', refreshToken);

			const fetchResults = async () => {
				let autoAuthResponseData: IAutoAuthResponseData;

				try {
					const autoAuthResponse = await backendApi.get<IAutoAuthResponseData>('/user/auth');

					autoAuthResponseData = autoAuthResponse.data;

					sessionStorage.setItem('token', autoAuthResponseData.accessToken);
				} catch {
					localStorage.clear();

					let navigateUrl = '/auth';

					if (port) {
						navigateUrl += `?port=${port}`;
					}

					navigate(navigateUrl);

					return;
				}

				if (port) {
					let cliToken: string;
					let email: string;

					try {
						const response = await cliBackendApi.get<ICliAuthResponseData>(
							`/user/auth/auth?port=${port}`,
						);

						cliToken = response.data.cliToken;
						email = response.data.email;
					} catch {
						navigate(`/cli-auth?port=${port}`);

						return;
					}

					try {
						await temporaryCliServerApi.get(`http://localhost:${port}/${cliToken}/${email}`);

						navigate('/cli-authenticated');
					} catch {
						navigate(`/cli-auth?port=${port}`);

						return;
					}
				}

				props.auth({
					id: autoAuthResponseData.id,
					name: autoAuthResponseData.name,
					createdAt: autoAuthResponseData.createdAt,
				});
			};

			fetchResults();
		} else {
			let navigateUrl = '/auth';

			if (port) {
				navigateUrl += `?port=${port}`;
			}

			navigate(navigateUrl);
		}
	}, [searchParams]);

	return <ExternalAuthRedirectView />;
};

ExternalAuthRedirect.displayName = 'ExternalAuthRedirect';
ExternalAuthRedirect.defaultProps = {};

export default connect(null, { auth: authActions.auth })(React.memo(ExternalAuthRedirect));
