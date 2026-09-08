import roomsJson from './rooms.json';

export type RoomCategory = 'suite' | 'room';

export type RoomSpec = {
	key: string;
	label: string;
	area?: string;
	details?: string[];
};

export type RoomHighlight = {
	value: string;
	label: string;
};

export type Room = {
	slug: string;
	name: string;
	tagline: string;
	category: RoomCategory;
	bedType: string;
	highlightImage: string;
	excerpt: string;
	headline?: string;
	highlights?: RoomHighlight[];
	connecting?: string;
	description: string[];
	specs: RoomSpec[];
	image?: string;
};

export type RoomsOverview = {
	title: string;
	paragraphs: string[];
	guestCount: string;
};

export type RoomsCarouselCopy = {
	eyebrow: string;
	title: string;
};

export type SuitesSectionCopy = {
	eyebrow: string;
};

export type WholeMasseriaCopy = {
	eyebrow: string;
	title: string;
	text: string;
	image: string;
	imageAlt: string;
};

export type RoomsPage = {
	eyebrow: string;
	title: string;
	subtitle: string;
	intro: string;
	heroImage: string;
	heroImageAlt: string;
	overview: RoomsOverview;
	roomsCarousel: RoomsCarouselCopy;
	suitesSection: SuitesSectionCopy;
	wholeMasseria: WholeMasseriaCopy;
};

export type RoomsData = {
	page: RoomsPage;
	rooms: Room[];
};

export const roomsData = roomsJson as RoomsData;
export const roomsPage = roomsData.page;
export const rooms = roomsData.rooms;
export const guestRooms = rooms.filter((room) => room.category === 'room');
export const suites = rooms.filter((room) => room.category === 'suite');

export function getRoomBySlug(slug: string) {
	return rooms.find((room) => room.slug === slug);
}

export function formatSpecArea(area: string) {
	const simple = area.match(/^(\d+(?:[.,]\d+)?)\s*m²$/i);
	if (!simple) return area;
	const value = Number.parseFloat(simple[1].replace(',', '.'));
	return Number.isFinite(value) ? `${Math.round(value)} m²` : area;
}

export function formatRoomSpecValue(spec: RoomSpec) {
	const parts: string[] = [];
	if (spec.area) parts.push(formatSpecArea(spec.area));
	if (spec.details?.length) parts.push(...spec.details);
	return parts.join(' · ');
}

export function adjacentRooms(room: Room) {
	const index = rooms.findIndex((item) => item.slug === room.slug);
	if (index < 0) return { prev: rooms[rooms.length - 1], next: rooms[0] };
	const prev = rooms[(index - 1 + rooms.length) % rooms.length];
	const next = rooms[(index + 1) % rooms.length];
	return { prev, next };
}

export function roomAreaLabel(room: Room) {
	const spec = room.specs.find((item) => item.key === 'camera') ?? room.specs[0];
	if (!spec?.area) return '';
	return formatSpecArea(spec.area);
}

export function roomCardMeta(room: Room) {
	return {
		slug: room.slug,
		name: room.name,
		highlightImage: room.highlightImage,
		excerpt: room.excerpt,
		meta: `${roomAreaLabel(room)} - ${room.bedType}`,
	};
}
