import {
	IconCirclesRelation,
	IconMessage2,
	IconTag,
	IconUsers,
} from '@tabler/icons-react';

export const profileTabs = [
	{ id: 1, value: 'threads', label: 'Threads', Icon: IconMessage2 },
	{ id: 2, value: 'replies', label: 'Replies', Icon: IconUsers },
	{ id: 3, value: 'tagged', label: 'Tagged', Icon: IconTag },
];

export const communityTabs = [
	{ id: 1, value: 'threads', label: 'Threads', Icon: IconMessage2 },
	{ id: 2, value: 'members', label: 'Members', Icon: IconUsers },
	{ id: 3, value: 'requests', label: 'Requests', Icon: IconCirclesRelation },
];
