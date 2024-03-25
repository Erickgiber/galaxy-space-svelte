import type { TypeSelectService } from "../select-service.types";

export type TypeServiceList = {
    id: number;
    icon: string;
    name: string
    nameID: TypeSelectService['service']
}