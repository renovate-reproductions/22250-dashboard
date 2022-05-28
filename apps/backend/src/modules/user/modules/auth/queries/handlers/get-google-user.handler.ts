import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DBUserService } from '@/modules/database/user.service';

import { GetGoogleUserContract } from '../contracts/get-google-user.contract';

@QueryHandler(GetGoogleUserContract)
export class GetGoogleUserHandler implements IQueryHandler<GetGoogleUserContract> {
	constructor(private readonly dbUserService: DBUserService) {}

	async execute(contract: GetGoogleUserContract) {
		const userData = await this.dbUserService.findByEmail(contract.email, {
			id: true,
			authType: true,
		});

		return userData;
	}
}
