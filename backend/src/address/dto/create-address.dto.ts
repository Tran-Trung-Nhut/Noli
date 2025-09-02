export class CreateAddressDto {
    userId?: number;
    phone: string
    provinceId: string
    provinceName: string
    districtId: string
    districtName: string
    wardId: string
    wardName: string
    addressLine: string
    phoneNumber: string
    fullName: string
    isDefault?: boolean
    label?: string
    postalCode?: string
}
