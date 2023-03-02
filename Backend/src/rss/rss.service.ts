/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Parser from 'rss-parser';
import { CreateNoticiaDto } from 'src/noticias/dto/create-noticia.dto';
import { NoticiasService } from 'src/noticias/noticias.service';
import { CreateRssDto } from './dto/create-rss.dto';
import { UpdateRssDto } from './dto/update-rss.dto';
import { Rss, RssSchema } from './entities/rss.entity';
@Injectable()
export class RssService {
  constructor(
    @InjectModel(Rss.name)
    private readonly rssModel: Model<Rss>,
    private readonly noticiasService: NoticiasService
  ) {}
  async create(createRssDtoDB: CreateRssDto) {
    //Validar si existe la url está registrado
    const rssExiste = await this.rssModel.exists({ url: createRssDtoDB.url });
    if (rssExiste) {
      throw new BadRequestException('La url ya está registrada');
    }

    //Validamos que se pueda crear el rss
    
    try {
      //Se crea el objeto Parser y se parsea
      const parser = new Parser();
      const feed = await parser.parseURL(createRssDtoDB.url);
      //guardamos el title en el dto
      createRssDtoDB.name=feed.title;
      //Creamos el objeto
      const rssCreado = await this.rssModel.create(createRssDtoDB)
      
      //creamos el objet
    try {

      //const rssCreado = await this.rssModel.create(createRssDtoDB);
     // this.noticiasService.create(feed);
    
     feed.items.map(async item => {
      const noticiasExample = new CreateNoticiaDto();
      noticiasExample.idRss=rssCreado.id;
      noticiasExample.titulo = item.title;
      //cambiamos la fecha
      const formatoFecha = new Date(item.pubDate).toLocaleDateString();
      noticiasExample.fecha = formatoFecha
      noticiasExample.categorias = item.categories;
      
      
      if(item.summary===undefined){
        noticiasExample.descripcion = "Sin contenido";
      }else{
        noticiasExample.descripcion = item.summary;
      }
      
     console.log("xd")
      noticiasExample.url=  item.link;
      noticiasExample.html= item.content;
    //  noticiasExample.html2 = x;
      //console.log(item.content);

      this.noticiasService.create(noticiasExample);
      
      
    });
    
  
    } catch (error) {
      console.log(error);
      throw new BadRequestException('SE NOS CAE EL SERVER ');
    }



    return rssCreado;
      
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`${createRssDtoDB.url} no válida por el parser`);
    }
    
   
  }

  findAll() {
    return `This action returns all rss`;
  }

  findOne(id: string) {
   // this.noticiasService.findAll();
    return `This action returns a #${id} rss`;
  }

  update(id: number, updateRssDto: UpdateRssDto) {
    return `This action updates a #${id} rss`;
  }

  async remove() {
   await this.rssModel.deleteMany({});
   this.noticiasService.remove();
   return "base de datos borrada";
  }

  async updateAll(){
    /*
    const rss = await this.rssModel.find();
    rss.map(async actual =>{
      const parser = new Parser();
      const feed = await parser.parseURL(actual.url);
      
      feed.items.map( item=>{
        const noticiasExample = new CreateNoticiaDto();
        noticiasExample.idRss=actual.id;
      noticiasExample.titulo = item.title;
      //cambiamos la fecha
      const formatoFecha = new Date(item.pubDate).toLocaleDateString();
      noticiasExample.fecha = formatoFecha
      noticiasExample.categorias = item.categories;
      noticiasExample.descripcion = item.summary;
      noticiasExample.url= item.url;
      noticiasExample.html= item.content;
      //console.log(noticiasExample)
      this.noticiasService.create(noticiasExample);
    
    

      })
    })
    */
   const data = await this.rssModel.find({});
   return data;
  

  }


}
