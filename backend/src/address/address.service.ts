import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGES } from 'src/constantsAndMessage';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) { }

  async getListProvinces() {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province`)).data;
  }

  async getListDistrictsByProvinceId(provinceId: string) {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province/district/${provinceId}`)).data;
  }

  async getListWardsByDistrictId(districtId: string) {
    return (await axios.get(`${process.env.ADDRESS_DOMAIN}/province/ward/${districtId}`)).data;
  }

  async create(createAddressDto: CreateAddressDto) {
    if(createAddressDto.isDefault === true && (await this.prismaService.address.count({where: {isDefault: true}})) > 0){ 
      return await this.prismaService.$transaction([
        this.prismaService.address.updateMany({where: {isDefault: true}, data: {isDefault: false}}),

        this.prismaService.address.create({
          data: createAddressDto
        })
      ])
    }

    return await this.prismaService.address.create({
      data: createAddressDto
    })
  }

  async getListAddressByUserId(userId: number) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: Number(userId) } });
    if (!existUser) throw new BadRequestException(MESSAGES.USER.ERROR.NOT_FOUND);
    return await this.prismaService.address.findMany({
      where: { userId: Number(userId) },
      select: {
        id: true,
        fullName: true,
        phone: true,
        provinceName: true,
        districtName: true,
        wardName: true,
        addressLine: true,
        isDefault: true,
        label: true
      }
    });
  }

  findAll() {
    return `This action returns all address`;
  }

  async findOne(id: number) {
    return await this.prismaService.address.findUnique({ where: { id } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const existAddress = await this.prismaService.address.findUnique({ where: { id } })
    if (!existAddress) throw new BadGatewayException("Không tồn tại địa chỉ")

    if (updateAddressDto.isDefault !== existAddress.isDefault && updateAddressDto.isDefault === true) {
      return await this.prismaService.$transaction([
        this.prismaService.address.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),

        this.prismaService.address.update({
          where: { id }, data: {
            userId: updateAddressDto.userId,
            phone: updateAddressDto.phone,
            provinceId: updateAddressDto.provinceId,
            provinceName: updateAddressDto.provinceName,
            districtId: updateAddressDto.districtId,
            districtName: updateAddressDto.provinceName,
            wardId: updateAddressDto.wardId,
            wardName: updateAddressDto.wardName,
            addressLine: updateAddressDto.addressLine,
            fullName: updateAddressDto.fullName,
            isDefault: updateAddressDto.isDefault,
            label: updateAddressDto.label
          }
        })
      ])
    } else {
      return this.prismaService.address.update({
        where: { id }, data: {
          userId: updateAddressDto.userId,
          phone: updateAddressDto.phone,
          provinceId: updateAddressDto.provinceId,
          provinceName: updateAddressDto.provinceName,
          districtId: updateAddressDto.districtId,
          districtName: updateAddressDto.provinceName,
          wardId: updateAddressDto.wardId,
          wardName: updateAddressDto.wardName,
          addressLine: updateAddressDto.addressLine,
          fullName: updateAddressDto.fullName,
          isDefault: updateAddressDto.isDefault,
          label: updateAddressDto.label
        }
      })
    }
  }

  async remove(id: number) {
    const existUser = await this.prismaService.address.findUnique({ where: { id } })
    if (!existUser) throw new BadRequestException("Địa chỉ không tồn tại")
    return await this.prismaService.address.delete({ where: { id } });
  }
}
