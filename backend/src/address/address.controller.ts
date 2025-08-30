import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { HttpStatusCode } from 'axios';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Get('provinces')
  async getListProvinces(@Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ data: await this.addressService.getListProvinces() });
    } catch (error) {
      return res.status(error.status || HttpStatusCode.InternalServerError).json({ message: error.message });
    }
  }

  @Get('districts/:provinceId')
  async getListDistricts(@Param('provinceId') provinceId: string, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ data: await this.addressService.getListDistrictsByProvinceId(provinceId) });
    } catch (error) {
      return res.status(error.status || HttpStatusCode.InternalServerError).json({ message: error.message });
    }
  }

  @Get('wards/:districtId')
  async getListWards(@Param('districtId') districtId: string, @Res() res) {
    try {
      return res.status(HttpStatus.OK).json({ data: await this.addressService.getListWardsByDistrictId(districtId) });
    } catch (error) {
      return res.status(error.status || HttpStatusCode.InternalServerError).json({ message: error.message });
    }
  }

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
