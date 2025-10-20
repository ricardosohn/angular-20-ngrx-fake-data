import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new ToastService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve adicionar toast de sucesso com timeout padrão', () => {
    // Arrange
    expect(service.toasts().length).toBe(0);

    // Act
    service.success('ok');

    // Assert
    const list = service.toasts();
    expect(list.length).toBe(1);
    expect(list[0]).toMatchObject({ type: 'success', message: 'ok' });
  });

  it('deve adicionar toast de erro com timeout padrão 5000ms', () => {
    // Arrange
    // Act
    service.error('bad');

    // Assert
    const list = service.toasts();
    expect(list[0]).toMatchObject({ type: 'error', message: 'bad', timeout: 5000 });
  });

  it('deve remover um toast ao chamar dismiss', () => {
    // Arrange
    service.info('a', 0);
    service.info('b', 0);
    const [first, second] = service.toasts();

    // Act
    service.dismiss(first.id);

    // Assert
    const list = service.toasts();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(second.id);
  });

  it('deve limpar todos os toasts ao chamar clear', () => {
    // Arrange
    service.warning('w1', 0);
    service.warning('w2', 0);

    // Act
    service.clear();

    // Assert
    expect(service.toasts().length).toBe(0);
  });

  it('deve auto-dismiss após timeout', () => {
    // Arrange
    service.info('temp', 1000);
    expect(service.toasts().length).toBe(1);

    // Act
    jest.advanceTimersByTime(1000);

    // Assert
    expect(service.toasts().length).toBe(0);
  });
});
