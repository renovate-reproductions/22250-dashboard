import { Body, Controller, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RealIP } from 'nestjs-real-ip';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { BelongingGroupGuard } from '@/guards/belonging-group.guard';

import Routes from './inline-policies.routes';
import { CreateInlineDto } from './classes/create-inline.dto';
import { CreateInlineContract } from './queries/contracts/create-inline.contract';
import type { ICreateInlinePolicy } from './interfaces/responses';

@ApiTags('Inline Policies')
@Controller(Routes.CONTROLLER)
export class CreateInlineController {
	private readonly logger = new Logger(CreateInlineController.name);

	constructor(private readonly queryBus: QueryBus) {}

	@ApiOperation({ description: 'Create a new inline policy with label and chosen library' })
	@ApiBearerAuth('access-token')
	@UseGuards(BelongingGroupGuard)
	@Post(Routes.CREATE)
	@HttpCode(HttpStatus.CREATED)
	public async createInline(
		@CurrentUserId() userId: string,
		@Param('group_id') groupId: string,
		@Body() createInlineDto: CreateInlineDto,
		@RealIP() ip: string,
	): Promise<ICreateInlinePolicy> {
		this.logger.log(
			`Will try to create an inline policy for a user with an Id: "${userId}" and for group with Id: "${groupId}". Label is "${createInlineDto.label}"`,
		);

		const createdInlinePolicyId = await this.queryBus.execute<CreateInlineContract, string>(
			new CreateInlineContract(groupId, createInlineDto.label, createInlineDto.library, userId, ip),
		);

		this.logger.log(
			`Successfully created an inline policy for a user with an Id: "${userId}" and for group with Id: "${groupId}". Label is "${createInlineDto.label}"`,
		);

		return {
			policyId: createdInlinePolicyId,
		};
	}
}
