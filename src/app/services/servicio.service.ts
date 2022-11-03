import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  //
  //url: string = 'http://localhost:3001/';
  url: string = 'https://roomreservationsystem-raulpineda-backend.azurewebsites.net';

  constructor(private http: HttpClient) { }

  //obtiene las Salas
  getSalas(){
    return this.http.get(this.url+'api');
  }

  //agrega una Sala
  addSala(sala:Sala){
    return this.http.get(this.url+'api/sala');
  }

   //elimina una sala
   deleteSala(id:number){
    return this.http.delete(this.url+'api/eliminar/'+id);
  }

  //para reservacion de sala
  updateSala(hrinicio: string, hrfinal: string, idsala: any){
    return this.http.put(this.url+'api/actualizar/'+idsala, {hrinicio, hrfinal});
  }

  //para liberar una sala
  Liberarsala(id:string, a1:string,a2:string){
    return this.http.put(this.url+'api/liberar/'+ id, {a1,a2});
  }
}

//interface de la Sala
export interface Sala{
  hrinicio?: string,
  hrfinal?: string,
  id: any
}