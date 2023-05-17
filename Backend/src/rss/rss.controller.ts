/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RssService } from './rss.service';

import { UpdateRssDto } from './dto/update-rss.dto';

import { CreateRssDto } from './dto/create-rss.dto';

@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Post()
  async create(@Body() createRssDtoDB: CreateRssDto) {
    return this.rssService.create(createRssDtoDB);
  }

  @Get()
  findAll() {
    return this.rssService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rssService.findOne(id);
  }
  @Patch()
  updateAll(){
    return this.rssService.updateAll();
    
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRssDto: UpdateRssDto) {
    return this.rssService.update(+id, updateRssDto);
  }

  @Delete('')
  remove() {
    return this.rssService.remove();
  }

}
