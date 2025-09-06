import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { HttpStatusCode } from 'axios';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Get('provinces')
  async getListProvinces() {
    return await this.addressService.getListProvinces()
  }

  @Get('districts/:provinceId')
  async getListDistricts(@Param('provinceId') provinceId: string) {
    return await this.addressService.getListDistrictsByProvinceId(provinceId)
  }

  @Get('wards/:districtId')
  async getListWards(@Param('districtId') districtId: string) {
    return await this.addressService.getListWardsByDistrictId(districtId)
  }

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto)
  }

  @Get('/user/:userId')
  async getListAddressByUserId(@Param('userId') userId: number) {
    return await this.addressService.getListAddressByUserId(userId)
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.addressService.findOne(+id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.addressService.remove(+id)
  }
}
