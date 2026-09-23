import { AlertBus } from '@application/alerts';

describe('AlertBus', () => {
  it('should notify all subscribers when publishing', () => {
    const bus = new AlertBus();
    const first = jest.fn();
    const second = jest.fn();

    bus.subscribe(first);
    bus.subscribe(second);

    bus.publish({ title: 'Erro', message: 'Failed' });

    expect(first).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed' });
    expect(second).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed' });
  });

  it('should stop notifying a subscriber after unsubscribing', () => {
    const bus = new AlertBus();
    const subscriber = jest.fn();

    const unsubscribe = bus.subscribe(subscriber);
    unsubscribe();

    bus.publish({ title: 'Erro', message: 'Failed' });

    expect(subscriber).not.toHaveBeenCalled();
  });

  it('should not notify when there are no subscribers', () => {
    const bus = new AlertBus();

    expect(() => bus.publish({ title: 'Erro', message: 'Failed' })).not.toThrow();
  });
});
