import { BadRequestException, Injectable } from '@nestjs/common';
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

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async remove(id: number) {
    const existUser = await this.prismaService.address.findUnique({where: {id}})
    if(!existUser) throw new BadRequestException("Địa chỉ không tồn tại")
    return await this.prismaService.address.delete({where: {id}});
  }
}
