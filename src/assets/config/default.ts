interface DefaultConfig {
    mode: 'developing' | 'production';
    useMorganLogRequest: boolean;
    clusterName?: string,
    logError: {
        message: boolean;
        data: boolean;
    };
};

const production = process.env.PRODUCTION == 'true';

let defaultConfig: DefaultConfig = production ? {
    useMorganLogRequest: false,
    logError: {
        message: false,
        data: false
    },
    mode: 'production'
}  : {
    useMorganLogRequest: true,
    logError: {
        message: true,
        data: true
    },
    mode: 'developing'
};

export default defaultConfig;