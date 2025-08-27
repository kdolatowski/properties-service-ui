import { ModelBase } from "../commons/model-base.model";

export interface SpaceModel extends ModelBase {
    propertyId: number;
    description?: string;
    size: number;
    typeId: number;
    spaceType?: string;
    id: number;
}
