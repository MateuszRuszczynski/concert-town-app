import type { EventDetails } from '../../types/events';

export const DEFAULT_EVENTS: EventDetails[] = [
  {
    id: 'evt-001',
    title: 'Frontend Summit 2026',
    description:
      'A full-day conference bringing together frontend engineers, designers, and product leaders to explore the future of the web. Talks cover performance, accessibility, design systems, and the latest framework advances, followed by hands-on breakout sessions and an evening networking reception.',
    category: 'conference',
    startsAt: '2026-09-12T09:00',
    endsAt: '2026-09-12T18:00',
    price: 299,
    location: { city: 'San Francisco, CA', venue: 'Moscone Center, West Hall' },
    registeredCount: 642,
    capacity: 800,
    relation: 'attending',
    host: 'Convene Studio'
  },
  {
    id: 'evt-002',
    title: 'Design Systems Workshop',
    description:
      "An intensive hands-on workshop where you'll build a scalable design system from scratch. Learn token architecture, component API design, and how to keep design and engineering in sync. Bring a laptop; all skill levels welcome.",
    category: 'workshop',
    startsAt: '2026-10-28T13:00',
    endsAt: '2026-10-28T17:00',
    location: { city: 'Austin, TX', venue: 'Capital Factory' },
    capacity: 40,
    price: 149,
    registeredCount: 38,
    host: 'Convene Studio',
    relation: 'organizing',
    participants: [
      {
        userId: '1',
        name: 'Oliver Bennett',
        email: 'oliver.bennett@example.com'
      },
      {
        userId: '2',
        name: 'Emily Carter',
        email: 'emily.carter@example.com'
      },
      {
        userId: '3',
        name: 'James Mitchell',
        email: 'james.mitchell@example.com'
      },
      {
        userId: '4',
        name: 'Sophia Anderson',
        email: 'sophia.anderson@example.com'
      },
      {
        userId: '5',
        name: 'William Turner',
        email: 'william.turner@example.com'
      },
      {
        userId: '6',
        name: 'Charlotte Collins',
        email: 'charlotte.collins@example.com'
      },
      {
        userId: '7',
        name: 'Henry Parker',
        email: 'henry.parker@example.com'
      },
      {
        userId: '8',
        name: 'Amelia Harrison',
        email: 'amelia.harrison@example.com'
      },
      {
        userId: '9',
        name: 'Jack Morgan',
        email: 'jack.morgan@example.com'
      },
      {
        userId: '10',
        name: 'Isla Cooper',
        email: 'isla.cooper@example.com'
      },
      {
        userId: '11',
        name: 'Thomas Richardson',
        email: 'thomas.richardson@example.com'
      },
      {
        userId: '12',
        name: 'Grace Foster',
        email: 'grace.foster@example.com'
      },
      {
        userId: '13',
        name: 'George Murphy',
        email: 'george.murphy@example.com'
      },
      {
        userId: '14',
        name: 'Mia Thompson',
        email: 'mia.thompson@example.com'
      },
      {
        userId: '15',
        name: 'Noah Watson',
        email: 'noah.watson@example.com'
      },
      {
        userId: '16',
        name: 'Lily Roberts',
        email: 'lily.roberts@example.com'
      },
      {
        userId: '17',
        name: 'Arthur Evans',
        email: 'arthur.evans@example.com'
      },
      {
        userId: '18',
        name: 'Ella Walker',
        email: 'ella.walker@example.com'
      },
      {
        userId: '19',
        name: 'Oscar Edwards',
        email: 'oscar.edwards@example.com'
      },
      {
        userId: '20',
        name: 'Freya Hughes',
        email: 'freya.hughes@example.com'
      },
      {
        userId: '21',
        name: 'Charlie Phillips',
        email: 'charlie.phillips@example.com'
      },
      {
        userId: '22',
        name: 'Ava Wilson',
        email: 'ava.wilson@example.com'
      },
      {
        userId: '23',
        name: 'Leo Morris',
        email: 'leo.morris@example.com'
      },
      {
        userId: '24',
        name: 'Isabella Cook',
        email: 'isabella.cook@example.com'
      },
      {
        userId: '25',
        name: 'Harry Bailey',
        email: 'harry.bailey@example.com'
      },
      {
        userId: '26',
        name: 'Poppy Bell',
        email: 'poppy.bell@example.com'
      },
      {
        userId: '27',
        name: 'Jack Stewart',
        email: 'jack.stewart@example.com'
      },
      {
        userId: '28',
        name: 'Evie Scott',
        email: 'evie.scott@example.com'
      },
      {
        userId: '29',
        name: 'Freddie Young',
        email: 'freddie.young@example.com'
      },
      {
        userId: '30',
        name: 'Sophie King',
        email: 'sophie.king@example.com'
      },
      {
        userId: '31',
        name: 'Archie Wright',
        email: 'archie.wright@example.com'
      },
      {
        userId: '32',
        name: 'Ruby Green',
        email: 'ruby.green@example.com'
      },
      {
        userId: '33',
        name: 'Finley Adams',
        email: 'finley.adams@example.com'
      },
      {
        userId: '34',
        name: 'Chloe Nelson',
        email: 'chloe.nelson@example.com'
      },
      {
        userId: '35',
        name: 'Theo Baker',
        email: 'theo.baker@example.com'
      },
      {
        userId: '36',
        name: 'Alice Hall',
        email: 'alice.hall@example.com'
      },
      {
        userId: '37',
        name: 'Arthur Clarke',
        email: 'arthur.clarke@example.com'
      },
      {
        userId: '38',
        name: 'Florence Wood',
        email: 'florence.wood@example.com'
      }
    ]
  },
  {
    id: 'evt-003',
    title: 'Sunset Sounds Festival',
    description:
      'An open-air music festival featuring indie, electronic, and live bands across two stages. Food trucks, local art vendors, and a golden-hour headline set make this the highlight of the summer.',
    category: 'music',
    startsAt: '2026-09-05T13:00',
    endsAt: '2026-09-06T11:00',
    location: { city: 'Portland, OR', venue: 'Waterfront Park' },
    price: 79,
    registeredCount: 3120,
    capacity: 5000,
    host: 'Riverside Live'
  },
  {
    id: 'evt-004',
    title: 'Founders & Funders Mixer',
    description:
      'A curated networking evening connecting early-stage founders with angel investors and operators. Structured intros, lightning pitches, and plenty of time to build genuine relationships over drinks.',
    category: 'networking',
    startsAt: '2026-11-20T18:30',
    endsAt: '2026-11-20T21:30',
    location: { city: 'New York, NY', venue: 'The Hudson Loft' },
    price: 0,
    registeredCount: 28,
    capacity: 120,
    host: 'Convene Studio',
    relation: 'organizing',
    participants: [
      {
        userId: '1',
        name: 'Oliver Bennett',
        email: 'oliver.bennett@example.com'
      },
      {
        userId: '2',
        name: 'Emily Carter',
        email: 'emily.carter@example.com'
      },
      {
        userId: '3',
        name: 'James Mitchell',
        email: 'james.mitchell@example.com'
      },
      {
        userId: '4',
        name: 'Sophia Anderson',
        email: 'sophia.anderson@example.com'
      },
      {
        userId: '5',
        name: 'William Turner',
        email: 'william.turner@example.com'
      },
      {
        userId: '6',
        name: 'Charlotte Collins',
        email: 'charlotte.collins@example.com'
      },
      {
        userId: '7',
        name: 'Henry Parker',
        email: 'henry.parker@example.com'
      },
      {
        userId: '8',
        name: 'Amelia Harrison',
        email: 'amelia.harrison@example.com'
      },
      {
        userId: '9',
        name: 'Jack Morgan',
        email: 'jack.morgan@example.com'
      },
      {
        userId: '10',
        name: 'Isla Cooper',
        email: 'isla.cooper@example.com'
      },
      {
        userId: '11',
        name: 'Thomas Richardson',
        email: 'thomas.richardson@example.com'
      },
      {
        userId: '12',
        name: 'Grace Foster',
        email: 'grace.foster@example.com'
      },
      {
        userId: '13',
        name: 'George Murphy',
        email: 'george.murphy@example.com'
      },
      {
        userId: '14',
        name: 'Mia Thompson',
        email: 'mia.thompson@example.com'
      },
      {
        userId: '15',
        name: 'Noah Watson',
        email: 'noah.watson@example.com'
      },
      {
        userId: '16',
        name: 'Lily Roberts',
        email: 'lily.roberts@example.com'
      },
      {
        userId: '17',
        name: 'Arthur Evans',
        email: 'arthur.evans@example.com'
      },
      {
        userId: '18',
        name: 'Ella Walker',
        email: 'ella.walker@example.com'
      },
      {
        userId: '19',
        name: 'Oscar Edwards',
        email: 'oscar.edwards@example.com'
      },
      {
        userId: '20',
        name: 'Freya Hughes',
        email: 'freya.hughes@example.com'
      },
      {
        userId: '21',
        name: 'Charlie Phillips',
        email: 'charlie.phillips@example.com'
      },
      {
        userId: '22',
        name: 'Ava Wilson',
        email: 'ava.wilson@example.com'
      },
      {
        userId: '23',
        name: 'Leo Morris',
        email: 'leo.morris@example.com'
      },
      {
        userId: '24',
        name: 'Isabella Cook',
        email: 'isabella.cook@example.com'
      },
      {
        userId: '25',
        name: 'Harry Bailey',
        email: 'harry.bailey@example.com'
      },
      {
        userId: '26',
        name: 'Poppy Bell',
        email: 'poppy.bell@example.com'
      },
      {
        userId: '27',
        name: 'Jack Stewart',
        email: 'jack.stewart@example.com'
      },
      {
        userId: '28',
        name: 'Evie Scott',
        email: 'evie.scott@example.com'
      }
    ]
  },
  {
    id: 'evt-005',
    description:
      'A live webinar walking through real-world patterns for scaling Node.js services: caching layers, queue-backed workloads, observability, and graceful degradation. Includes a live Q&A.',
    title: 'Scaling Node.js in Production',
    category: 'webinar',
    startsAt: '2026-12-20T11:00',
    endsAt: '2026-12-20T12:30',
    price: 0,
    location: 'online',
    registeredCount: 574,
    capacity: 1000,
    host: 'Convene Studio',
    relation: 'attending'
  },
  {
    id: 'evt-006',
    title: 'Community Rooftop Social',
    description:
      'Wind down the week with our community rooftop social. Casual conversation, city views, and a chance to meet others in the local tech and creative scene.',
    category: 'social',
    startsAt: '2026-12-18T19:00',
    endsAt: '2026-12-18T22:30',
    price: 0,
    location: { city: 'Chicago, IL', venue: 'Skyline Terrace' },
    registeredCount: 45,
    capacity: 90,
    host: 'Convene Studio'
  }
];
