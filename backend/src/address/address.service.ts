import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import axios from 'axios';

@Injectable()
export class AddressService {

  async getListProvinces() {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province`)).data;

  }

  async getListDistrictsByProvinceId(provinceId: string) {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province/district/${provinceId}`)).data;
  }

  async getListWardsByDistrictId(districtId: string) {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province/ward/${districtId}`)).data;
  }

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
