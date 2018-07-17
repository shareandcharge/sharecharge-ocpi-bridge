import { ILocation } from "@motionwerk/sharecharge-common/dist/common";

export default interface ISession {
    id: string;
    start_datetime: Date,
    end_datetime?: Date,
    kwh: number;
    auth_id: string;
    auth_method: 'AUTH_REQUEST' | 'WHITELIST';
    location: ILocation,
    meter_id?: string;
    currency: string;
    charging_periods?: {
            start_date_time: Date;
            dimensions: any;
    }[];
    total_cost: number;
    status: 'ACTIVE' | 'COMPLETE' | 'INVALID' | 'PENDING';
    last_updated: Date;
}