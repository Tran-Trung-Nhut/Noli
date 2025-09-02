export type AddressDto = {
    id: number,
    userId?: number,
    fullName: string,
    email?: string,
    phone: string,
    provinceId: string,
    provinceName: string,
    districtId: string,
    districtName: string,
    wardId: string,
    wardName: string,
    addressLine: string,
    isDefault?: boolean,
    label?: string,
    postalCode?: string
}

export type CreateAddressDto = Omit<AddressDto, 'id' | 'postalCode' >