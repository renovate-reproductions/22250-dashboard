import { ApiResponseProperty } from '@nestjs/swagger';
import { PolicyLibrary } from '@prisma/client';
import type { IAvailableLabelResponseData, IGetGroupResponseData } from '@exlint-dashboard/common';

import { ILanguage } from '@/interfaces/libraries-data';

import type { IGroupInlinePolicies, IGroupInlinePolicy } from '../interfaces/group-policies';
import type { IUserGroupGetAll, IUserGroupInlinePolicy } from '../interfaces/user-group';

class UserGroupInlinePolicyGetAll implements IUserGroupInlinePolicy {
	@ApiResponseProperty({
		type: String,
		example: '62e5362119bea07115434f4a',
	})
	public id!: string;

	@ApiResponseProperty({
		type: String,
		example: 'Yazif Policy',
	})
	public label!: string;

	@ApiResponseProperty({
		enum: PolicyLibrary,
	})
	public library!: PolicyLibrary;

	@ApiResponseProperty({
		type: Number,
		example: 5,
	})
	public rulesCount!: number;
}

class UserGroupGetAll implements IUserGroupGetAll {
	@ApiResponseProperty({
		type: String,
		example: '62e5362119bea07115434f4a',
	})
	public id!: string;

	@ApiResponseProperty({
		type: String,
		example: 'Yazif Group',
	})
	public label!: string;

	@ApiResponseProperty({
		type: [UserGroupInlinePolicyGetAll],
	})
	public librariesNames!: PolicyLibrary[];
}

class GroupInlinePolicy implements IGroupInlinePolicy {
	@ApiResponseProperty({
		type: String,
		example: '62e5362119bea07115434f4a',
	})
	public id!: string;

	@ApiResponseProperty({
		type: String,
		example: 'Yazif Policy',
	})
	public label!: string;

	@ApiResponseProperty({
		enum: PolicyLibrary,
	})
	public library!: PolicyLibrary;

	@ApiResponseProperty({
		type: String,
		example: 'JavaScript',
	})
	public language!: ILanguage;
}

export class CreateGroupResponse {
	@ApiResponseProperty({
		type: String,
		example: '62e5362119bea07115434f4a',
	})
	public groupId!: string;
}

export class GetAllGroupsResponse {
	@ApiResponseProperty({
		type: [UserGroupGetAll],
	})
	public groups!: IUserGroupGetAll[];
}

export class AvailableLabelResponse implements IAvailableLabelResponseData {
	@ApiResponseProperty({
		type: Boolean,
		example: true,
	})
	public isAvailable!: boolean;
}

export class GetGroupResponse implements IGetGroupResponseData {
	@ApiResponseProperty({
		type: String,
		example: 'Yazif Group',
	})
	public label!: string;
}

export class GetInlinePoliciesResponse implements IGroupInlinePolicies {
	@ApiResponseProperty({
		type: String,
		example: 'Yazif Group Description',
	})
	public description!: string | null;

	@ApiResponseProperty({
		type: Number,
		example: 10,
	})
	public count!: number;

	@ApiResponseProperty({
		type: [GroupInlinePolicy],
		example: 'Yazif Group Description',
	})
	public inlinePolicies!: IGroupInlinePolicy[];
}
