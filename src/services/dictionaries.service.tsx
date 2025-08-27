import getRequestConfig, { apiRequest } from "./api-config";

import { HttpMethod } from "./api-service";

export const getPropertyTypes = () => {
    const config = getRequestConfig('/api/dictionaries/DictPropertyType', HttpMethod.GET);
    return apiRequest(config);
};

export const getSpaceTypes = () => {
    const config = getRequestConfig('/api/dictionaries/DictSpaceType', HttpMethod.GET);
    return apiRequest(config);
};
