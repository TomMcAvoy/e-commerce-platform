import { getConfig, setConfig } from './config';

test('getConfig returns default config', () => {
    const config = getConfig();
    expect(config).toEqual({}); // Assuming default config is an empty object
});

test('setConfig updates the config', () => {
    setConfig({ key: 'value' });
    const config = getConfig();
    expect(config).toEqual({ key: 'value' });
});