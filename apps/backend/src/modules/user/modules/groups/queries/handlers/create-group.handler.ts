import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DBGroupService } from '@/modules/database/group.service';

import { CreateGroupContract } from '../contracts/create-group.contact';
import { CreateGroupMixpanelContract } from '../../events/contracts/create-group-mixpanel.contract';

@QueryHandler(CreateGroupContract)
export class CreateGroupHandler implements IQueryHandler<CreateGroupContract> {
	constructor(private readonly dbGroupService: DBGroupService, private readonly eventBus: EventBus) {}

	async execute(contract: CreateGroupContract) {
		const createdGroupId = await this.dbGroupService.createGroup(contract.userId);

		this.eventBus.publish(new CreateGroupMixpanelContract(contract.userId, contract.ip));

		return createdGroupId;
	}
}
