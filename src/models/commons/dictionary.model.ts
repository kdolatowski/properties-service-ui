import { ModelBase } from "./model-base.model";

export interface DictionaryBase extends ModelBase {
    name: string;
    isActive: boolean;
}