import { Type } from "class-transformer"
import { IsInt } from "class-validator"

export class Address {
    @IsInt()
    @Type(() => Number)
    id: number
    
    userId?: number
    label?: string
    fullName: string
    email?: string
    phone: string
    provinceId: string
    provinceName: string
    districtId: string
    districtName: string
    wardId: string
    wardName: string
    addressLine: string
    postalCode?: string
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
}

export class Province {
    provice_id: string;
    province_name: string;
    province_type: string;
}

export class District {
    district_id: string;
    district_name: string
    district_type: string;
}

export class Ward {
    ward_id: string;
    ward_name: string
    ward_type: string;
}

