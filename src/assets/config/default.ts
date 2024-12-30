interface DefaultConfig {
    mode: 'developing' | 'production';
    useLogRequest: boolean;
    clusterName?: string,
    logError: {
        message: boolean;
        data: boolean;
    };
};

const production = process.env.PRODUCTION == 'true';

let defaultConfig: DefaultConfig = production ? {
    useLogRequest: false,
    logError: {
        message: false,
        data: false
    },
    mode: 'production'
}  : {
    useLogRequest: true,
    logError: {
        message: true,
        data: true
    },
    mode: 'developing'
};

export default defaultConfig;