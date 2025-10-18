import { App } from './app';

describe('App', () => {
  it('deve instanciar o App', () => {
    // Act
    const instance = new App();

    // Assert
    expect(instance).toBeInstanceOf(App);
  });
});
