import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MoneyPocketService } from './money-pocket.service';
import { CreateMoneyPocketDto } from './dto/create-money-pocket.dto';
import { UpdateMoneyPocketDto } from './dto/update-money-pocket.dto';

@Controller('moneyPocket')
export class MoneyPocketController {
  constructor(private readonly moneyPocketService: MoneyPocketService) {}

  @Post()
  async createPocket(@Body() createMoneyPocketDto: CreateMoneyPocketDto) {
    console.log('create dto', createMoneyPocketDto);
    return undefined;

    return await this.moneyPocketService.create(createMoneyPocketDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.moneyPocketService.findOne(id);
  }

  @Put(':id')
  async updatePocketInformation(
    @Param('id') id: string,
    @Body() updateMoneyPocketDto: UpdateMoneyPocketDto,
  ) {
    return await this.moneyPocketService.update(id, updateMoneyPocketDto);
  }

  @Delete(':id')
  async removePocket(@Param('id') id: string) {
    return await this.moneyPocketService.remove(id);
  }
}
