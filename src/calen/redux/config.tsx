import { Config } from '../calendar';

const DefaultConfig: Config = {
    locale_code: 'en',
    showSeconds: false,
    showTimeZone: true,
    showAmPm: false
};

export function createFinalConfig(config: Config): Config {
    // handle configuration with default values
    let finalConfig = Object.assign({}, DefaultConfig);
    if (config) {
        finalConfig = Object.assign(finalConfig, config);
    }
    return finalConfig;
}