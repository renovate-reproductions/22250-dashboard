import type { InlinePolicy, Rule } from '@prisma/client';

export type IGetGroupResponseData = (Pick<
	InlinePolicy,
	| 'library'
	| 'formConfiguration'
	| 'codeConfiguration'
	| 'isFormConfiguration'
	| 'codeType'
	| 'lintedList'
	| 'ignoredList'
> & { readonly rules: Pick<Rule, 'name' | 'configuration'>[] })[];
