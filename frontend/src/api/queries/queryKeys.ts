export const queryKeys = {
  categories: ['categories'] as const,
  events: {
    all: ['events'] as const,
    list: (params: object) => ['events', 'list', params] as const,
    everything: ['events', 'everything'] as const,
    detail: (id: number | string) => ['events', 'detail', String(id)] as const,
    my: (status: 'all' | 'active' | 'inactive', page = 1) =>
      ['events', 'my', status, page] as const,
    myAll: (status: 'all' | 'active' | 'inactive') =>
      ['events', 'my-all', status] as const,
  },
  registrations: {
    all: ['registrations'] as const,
    list: (page: number) => ['registrations', 'list', page] as const,
    everything: ['registrations', 'everything'] as const,
  },
  organizerRequests: {
    all: ['organizer-requests', 'all'] as const,
    mine: ['organizer-requests', 'mine'] as const
  }
};
