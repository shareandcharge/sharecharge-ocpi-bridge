import { ILocation, ITariff } from "@motionwerk/sharecharge-common/dist/common";

export default interface ICDR {
    id: string;
    start_date_time: Date;
    stop_date_time: Date;
    auth_id: string;
    auth_method: 'AUTH_REQUEST' | 'WHITELIST';
    location: ILocation;
    meter_id: string;
    currency: string;
    tariffs: ITariff;
    charging_periods: {
        start_date_time: Date,
        dimensions: {
            type: 'ENERGY' | 'FLAT' | 'MAX_CURRENT' | 'MIN_CURRENT' | 'PARKING_TIME' | 'TIME'[];
            volume: number;
        } 
    }[];
    total_cost: number;
    total_energy: number;
    total_time: number;
    total_parking_time: number;
    remark: string;
    last_updated: Date;
}