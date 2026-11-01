//#region imports
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEventForm } from './useEventForm';
//#endregion

const { mutateCreate } = vi.hoisted(() => ({
  mutateCreate: vi.fn().mockResolvedValue({})
}));

vi.mock('../api/queries/events/useEventMutations.ts', () => ({
  useCreateEvent: () => ({ mutateAsync: mutateCreate, isPending: false }),
  useUpdateEvent: () => ({ mutateAsync: vi.fn(), isPending: false })
}));
vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }));
vi.mock('../contexts/NotificationContext/useNotification.ts', () => ({
  useNotification: () => ({ showToast: vi.fn() })
}));

describe('useEventForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not submit an empty form', async () => {
    const { result } = renderHook(() => useEventForm(undefined, undefined));
    await act(async () => {
      await result.current.submission.handleSubmit({
        preventDefault: vi.fn()
      } as never);
    });
    expect(mutateCreate).not.toHaveBeenCalled();
  });

  it('updates the title', () => {
    const { result } = renderHook(() => useEventForm(undefined, undefined));
    act(() => result.current.onChange.setTitle('Meetup'));
    expect(result.current.values.title).toBe('Meetup');
  });
});
