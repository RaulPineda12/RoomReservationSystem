import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

import * as moment from 'moment';
import { ServicioService, Sala } from '../../services/servicio.service'


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  ListarSalas: Sala[];
  auxListarSalas: Sala[];
  hractual: Date;
  isDisable = true;
  idSala: any;
  contador:number;
  //this.isDisable=false;


  sala: Sala={
    hrinicio:'',
    hrfinal:'',
    id:''
  }


  constructor(private servicio: ServicioService) { }

  ngOnInit(): void {
    this.listarSalas();
    
    //obtener la hora actual
    this.hractual = new Date();

    //actualiza la hora actual cada segundo
    setInterval(() => {
      this.hractual = new Date();
      this.verificarHora();
    }, 1000);

    
  }

  //esta funcion obtiene todas las salas que existan en la base de datos para mostrarlas
  listarSalas(){
    this.servicio.getSalas().subscribe(
      (resp) => {
        console.log("resp: ",resp);
        this.ListarSalas = <any>resp;
        this.contador=this.ListarSalas.length
      },
      (err) => console.log(err)
    );
  }

  //esta funcion libera la sala cuando el tiempo de la reservacion se cumpla
  verificarHora(){

    var x: any
    var auxhractual = moment(this.hractual).format('h:mm a')

     for(x=0; x<=this.contador;x++){
       if(this.ListarSalas[x].hrfinal === auxhractual){
         this.liberarSala(this.ListarSalas[x].id)
       }
     }
  }

  //esta funcion sirve para agregar una sala nueva
  agregarSala(){
    this.servicio.addSala(this.sala).subscribe((resp)=>{
      this.listarSalas();
    });
  }
  //esta funcion sirve para eliminar una sala nueva
  eliminarSala(id:number){
    this.servicio.deleteSala(id).subscribe(resp=>{
       console.log("Sala eliminada");
       this.listarSalas();
    },
      err=> console.log(err)
    );
  }

  //esta funcion sirve para obtener el id de la sala que vamos a reservar
  obtenerid(id:any){
    this.idSala=id;
  }

  //funcion para reservar salas
  reservar(hrinicio: string, hrfinal:string ){

    if(hrinicio=="" || hrfinal=="" ){
      Swal.fire({
        icon: 'error',
        title: '¡ERROR!',
        text: 'No ingreso hora de entrada y/o hora de salida',
      })
    }else{

      //separamos la hora de inicio en horas y minutos
      var parts = hrinicio.split(':');
      //separamos la hora final en horas y minutos
      var parts2 = hrfinal.split(':');
      //separamos la hora final en horas y minutos
      var parts3 = hrinicio.split(':');

      //aqui convertimos las horas a entero para sumarles 2, esto porque el tiempo maximo
      //para reservar una sala es de 2 hrs, asi que por ejemplo si la hora de inicio para apartarla es
      //a las 5:30pm quiere decir que maximo a las 7:30pm ya debe liberarse
      var hours= parseInt(parts[0])+2
      var minutes= parseInt(parts[1])


      //aqui obtenemos la hora de la hora final y tambien los minutos
      var hours2= parseInt(parts2[0])
      var minutes2= parseInt(parts2[1])

      //aqui obtenemos la hora de la hora inicip y tambien los minutos
      var hours3= parseInt(parts3[0])
      var minutes3= parseInt(parts3[1])

      //aqui declaramos un aux de tipo fecha que tendra la hora maxima para dejar la sala
      var hrmaxima= new Date()
      hrmaxima.setHours(hours);
      hrmaxima.setMinutes(minutes);

      //aqui declaramos un aux de tipo fecha que tendra la hora final que el usuario ingreso y le inserta la hora y minutos
      //que el usuario escogio en el input de hora final
      var hrauxfinal= new Date()
      hrauxfinal.setHours(hours2);
      hrauxfinal.setMinutes(minutes2);

      var hrauxinicio= new Date()
      hrauxinicio.setHours(hours3);
      hrauxinicio.setMinutes(minutes3);
      
      //esta condicion es para no permitir que la hora final en la que quieres reservar una sala exceda de 2 horas
      if(hrauxfinal > hrmaxima){
        Swal.fire({
          icon: 'error',
          title: '¡ERROR!',
          text: 'No se puede reservar porque excede el tiempo permitido (2 horas)',
        })
      }
      //esta condicion es para no permitir que se eliga una hora final menor a la hora de inicio cuando intentas reservar una sala
      else if(hrauxfinal < hrauxinicio){
        Swal.fire({
          icon: 'error',
          title: '¡ERROR!',
          text: 'La hora final no puede ser menor a la hora de inicio',
        })
      }

      //si todo sale bien en la reservacion convertimos el formato de la hora para enviarla correctamente a la base de datos
      //junto con su id correspondiente para actualizarla a reservada y con su horario escogido
      else{

        var auxinicio= hrauxinicio.toString();
        var auxfinal= hrauxfinal.toString();

        var a1 = moment(auxinicio).format('h:mm a')
        var a2 = moment(auxfinal).format('h:mm a')
        
          this.servicio.updateSala( a1, a2, this.idSala).subscribe(resp=>{
            console.log(resp)
            this.listarSalas();
            },
          err=> console.log(err));
          
        }
      }
  }

  //esta funcion es para liberar la sala manualmente
  liberarSala(id:any){
    var a1=""
    var a2=""
    this.servicio.Liberarsala(id, a1,a2).subscribe(resp=>{
       console.log("Sala liberada");
       this.listarSalas();
    },
      err=> console.log(err)
    );
  }

}
