import getRequestConfig, { apiRequest } from "./api-config";

import { HttpMethod } from "./api-service";
import { PropertyModel } from "../models/properties/property.model";

export const getProperties = (searchCriteria: any): Promise<any> => {
    const config = getRequestConfig('/api/properties', HttpMethod.GET, searchCriteria);
    return apiRequest(config);

}

export const addProperty = (property: PropertyModel): Promise<any> => {
    const config = getRequestConfig('/api/properties', HttpMethod.POST, property);
    console.log(config);
    return apiRequest(config);
}