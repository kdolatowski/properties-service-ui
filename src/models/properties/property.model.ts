import { ModelBase } from "../commons/model-base.model";
import { SpaceModel } from "../spaces/space.model";

export interface PropertyModel extends ModelBase {
    address: string;
    description?: string;
    typeName: string;
    typeId: number;
    price: number;
    spaces: SpaceModel[];
}
