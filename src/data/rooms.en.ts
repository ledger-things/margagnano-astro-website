export const roomsPageEn = {
	intro:
		'The private spaces of Margagnano follow the same philosophy as the masseria: to respect the architecture, to honour the material and to let the light in.',
	heroImageAlt: 'Courtyard of the masseria with stone arches and Apulian sky',
	overview: {
		paragraphs: [
			'The rooms differ in size and arrangement, yet they share a language of stone, lime, wood, natural textiles and essential details. Some spaces are more intimate, others more open and articulated. Together they form a house meant to be lived in its entirety.',
			'The masseria can host up to [GUEST NUMBER TO BE CONFIRMED] people, distributed across the rooms and suites, with shared spaces conceived to bring guests together through the day.',
		],
	},
	wholeMasseria: {
		text: 'The rooms are parts of a larger house, in which private spaces live alongside halls, courtyards, terraces and shared rooms. At Margagnano, the masseria is lived in its entirety.',
		imageAlt: 'Courtyard of the masseria with stone arches and Apulian sky',
	},
} as const;

export type RoomEn = {
	excerpt: string;
	headline?: string;
	description: string[];
	specs: Record<string, { label: string; details?: string[] }>;
};

export const roomsEn: Record<string, RoomEn> = {
	'the-suite': {
		excerpt: 'A wider private world, where rooms follow one another and complete each other.',
		headline: 'More than a room.',
		description: [
			'The Suite gathers a wider private dimension in a single sequence of rooms that follow and complete one another. The principal bedroom is linked to two walk-in closets and two bathrooms, creating a generous and well-ordered private area.',
			'An independent sitting room extends the suite further, with two fireplaces that give character to the spaces. Outside, the large private terrace holds a hydromassage pool and a solarium, a dimension given entirely to the suite.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			living: { label: 'Living room', details: ['Independent sitting room', 'Fireplace'] },
			bathrooms: { label: 'Bathrooms', details: ['2 bathrooms', 'Bath and shower'] },
			closets: { label: 'Walk-in closets', details: ['2 walk-in closets'] },
			terrace: { label: 'Private terrace', details: ['Hydromassage pool', 'Solarium'] },
			amenities: { label: 'Amenities', details: ['2 fireplaces', 'TV', 'Minibar', 'Desks'] },
		},
	},
	curry: {
		excerpt: 'An independent suite, organised around living and rest.',
		headline: 'Private Suite.',
		description: [
			'Curry is an independent suite organised around a living area and a bedroom. The rooms gather rest and staying into a single space, with a minibar set into the living area.',
			'The bathroom, particularly generous, completes the suite with a shower and a hydromassage bath. Outside, a private terrace extends the suite into the open.',
		],
		specs: {
			suite: { label: 'Suite', details: ['Living area and bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Shower', 'Hydromassage bath'] },
			terrace: { label: 'Private terrace' },
			amenities: { label: 'Amenities', details: ['Minibar'] },
		},
	},
	paprika: {
		excerpt: 'An intimate room, where the character of the masseria is revealed in the details.',
		description: [
			'Paprika keeps one of the most distinctive elements of the old dwellings of the masseria: the fireplace. A detail that gives presence to the room and accompanies its atmosphere in the more intimate hours of the day.',
			'The space keeps a gathered scale, with a room for rest and a private bathroom.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			amenities: { label: 'Amenities', details: ['Fireplace', 'TV', 'Minibar', 'Desk'] },
		},
	},
	timo: {
		excerpt: 'An intimate dimension, built around the simplicity of the material.',
		description: [
			'Timo is a room conceived around simplicity. What is needed for a stay finds its place without weighing on the space, leaving proportion and material to define the room.',
			'A gathered solution, part of the sequence of rooms that make up the private area of the masseria.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			amenities: { label: 'Amenities', details: ['TV', 'Minibar', 'Desk'] },
		},
	},
	zafferano: {
		excerpt: 'A gathered, intimate space, made for the slower rhythm of the days.',
		description: [
			'Zafferano has a gathered, intimate scale. The room develops in an essential way, leaving space for quiet and the simplicity of the interiors.',
			'A small private space within the masseria, conceived to follow the slower rhythm of the days at Margagnano.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			amenities: { label: 'Amenities', details: ['TV', 'Minibar', 'Desk'] },
		},
	},
	cannella: {
		excerpt: 'The warmth of a fireplace meets the essential architecture.',
		description: [
			'In Cannella, the fireplace becomes the point around which the room gathers. An element of the building’s history that still finds a place in the daily life of the masseria.',
			'The space keeps an intimate scale, with the private bathroom opening directly from the bedroom.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			amenities: { label: 'Amenities', details: ['Fireplace', 'TV', 'Minibar', 'Desk'] },
		},
	},
	ginepro: {
		excerpt: 'An arrangement meant to be lived together, without giving up a private dimension.',
		description: [
			'Ginepro is conceived for a different arrangement: two single beds and a direct connection with Salvia allow the two rooms to be lived as part of the same private space.',
			'A particularly versatile solution within the masseria, able to adapt to the composition of guests without giving up the distinction of the rooms.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Twin room', '2 single beds'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			connecting: { label: 'Connecting', details: ['Connecting with Salvia'] },
			outdoor: { label: 'Outdoor space', details: ['Outdoor lounge / passage'] },
			amenities: { label: 'Amenities', details: ['TV', 'Minibar', 'Desk'] },
		},
	},
	salvia: {
		excerpt: 'Two distinct rooms that meet, to be discovered together.',
		description: [
			'Salvia completes the arrangement conceived together with Ginepro. The two connecting rooms make it possible to create a wider private area, while keeping two distinct spaces.',
			'A solution that offers greater freedom in how guests are arranged, and in daily life within the masseria.',
		],
		specs: {
			camera: { label: 'Bedroom', details: ['Double bedroom'] },
			bathroom: { label: 'Bathroom', details: ['Private bathroom'] },
			connecting: { label: 'Connecting', details: ['Connecting with Ginepro'] },
			outdoor: {
				label: 'Outdoor space',
				details: ['Outdoor lounge / passage', 'Shared with Ginepro'],
			},
			amenities: { label: 'Amenities', details: ['TV', 'Minibar', 'Desk'] },
		},
	},
};
