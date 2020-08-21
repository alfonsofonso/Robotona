//// main.js
//////////////////////////////////////////     globales   //////////////////////////////

var notaBase=28;
var arr=[];
var rth=[4];
var nlg=[];
var tiempo=9000;// tempo 120
var canvi;/// interval

var espacio=.5;/// silencios
var energia=.5;// 
var memoria=.5;// de 0 a 1
var arritmia=false;
var MaxNotasFrase=16;
var historial=[];
var escalas=[
	[0,2,4,7,9],// 1
	[0,4,7,10,14], // 2
	[0,3,5,7,8,11,12],// 3
	[0,4,7,10,12,15], // 4
	[2,5,7,11,13,14] // 5 dominante
];
var escala=escalas[0];
//////////////////////////////////////////     instrumentos   //////////////////////////////
var sinte=new track();
var bajo= new track();
var trumpet=new track();
var bataca=new track();
var harmony=new group(bataca,sinte,bajo,trumpet);


//////////////////////////////////////////     start    //////////////////////////////

function empieza(){
	context.resume();
	creaBand();
	creaArr()
}

//////////////////////////////////////////     functions   //////////////////////////////

function creaArr(num){//n=num notas	
	let n=num||4;
	let arra=[];
	
	for (var i =0; i <n; i++) {
		arra.push(escala[Math.floor(Math.random()*escala.length)]+notaBase);
	}
	return arra;
}


function motivo(){// energy, memory, space
	
	arr=creaArr(rth.length)
	
	bajo.notes(arr).trans(12);
	sinte.notes(arr).trans(24);
	trumpet.notes(arr).trans(36);

	console.log("arr: ",arr);
}
function obstinato(long){

	let arra=creaArr(long);
	bajo.notes(arra).trans(12);
	console.log("bajo-12:",arra)
}

function armoni(long){

	let arra=creaArr(long);
	sinte.notes(arra).trans(24);
	console.log("Sinte:",arra)
}
function melodi(long){
	let arra=creaArr(long);
	trumpet.notes(arra).trans(36);
	console.log("trumpet:",arra)
}

function ritmo(e,s){// cambia ritmo 

	let en=e||energia; let sp=s||espacio;

	let ar=funk(en,sp)
	rth=ar[0];
	sinte.nl(ar[1]);
	sinte.beat(ar[0]);
	trumpet.nl(ar[1]);
	trumpet.beat(ar[0]);

}
function funk(e,s){
	let ener=e||energia; let spac=s||espacio;

	let ar=dameBeat(ener,spac)
	//ar=rememora(ar,memoria);

	bajo.nl(ar[1])
	bajo.beat(ar[0])

	console.log("bajo rit: "+ar[0])	
	return(ar)
}
function groove(e,s){
	let ener=e||energia; let spac=s||espacio;

	let ar=dameBeat(ener,spac)
	//ar=rememora(ar,memoria);

	sinte.nl(ar[1])
	sinte.beat(ar[0])

	console.log("sinte rit: "+ar[0])
	return(ar)
}
function jazz(e,s){
	let ener=e||energia; let spac=s||espacio;

	let ar=dameBeat(ener,spac);
	trumpet.nl(ar[1])
	trumpet.beat(ar[0])
	console.log("trumpet rit: "+ar[0])
	return(ar)
}


/////////////////////////////////////////////    BATACA    //////////////////

function creaBataca(){
	bombo=new track();charles=new track();caja=new track();
	bataca=new group(bombo,charles,caja)
	bombo.sample(drums[0])
	charles.sample(drums[2]);
	caja.sample(drums[1]);
	caja.delay(3);caja.dfb(0);
	charles.delay(1);charles.dfb(0)
	
}
function cambiaBataca(seq,beat){

	bombo.beat(4);
	charles.beat(4).shift(4);
	caja.beat(8,8).shift(6);

	console.log("bataca ")
	bataca.vol(.33)
}

////////////////////////// helpers

function genera(){creaBataca();cambiaBataca()}


creaBand=function(){/////////////////////////////////////
	bajo.adsr(.1 , 0.1 ,0.1 ,1 ).vol(.6).sine();
	sinte.adsr(0.1 , 0.4 , 0.6 , 0.1).vol(.4).tri();
	trumpet.adsr(0.06 , 3 , .9 , 0.01).vol(.1).saw();
	trumpet.reverb(5);
	//trumpet.pan( bounce(-1, 1, 16) )
	//sinte.pan( bounce(-1, 1, 32) )	
}


var drums = [];

loadSounds([
    'samples/drums/kick.mp3',
    'samples/drums/snare.mp3',
    'samples/drums/hat.mp3'
  ],
  function(list) {
    drums = list;
})
document.bgColor="black"


dameBeat=function(e,s){// genera un ritmo para la melodia
	let en=e||energia; let sp=s||espacio;

	let ar=[];
	let ar2=[]
	let pulsos=Math.floor(en*MaxNotasFrase);//numero máximo de golpes del ritmo

	for (var i = 0; i <= pulsos; i++) {
		let ptemp=Math.floor(Math.random()*pulsos);//golpe 
		if (ptemp<1){ptemp=1};
		ar.push(ptemp)
		pulsos=pulsos-ptemp;
		if(pulsos==0){pulsos=1}
		if(Math.random()>sp){
			ar2.push(ptemp)
		}else{
			ar2.push(1);
		}
	}	
	if(!arritmia){
		let total = ar.reduce((a, b) => a + b, 0);
		let resto;		

		if (32-total<1){

		}else if(total<4){
			resto=4-total;
			ar.push(resto);
			ar2.push(resto)

		}else if(total<8){
			resto=8-total;
			ar.push(resto);
			ar2.push(resto)

		}else if(total<16){
			resto=16-total
			ar.push(resto);
			ar2.push(resto)

		}else{
			resto=32-total;
			ar.push(resto);
			ar2.push(resto)
		//	console.log("total<32")
		}// para cuadrar a cuaternarios
	}
	console.log("beat: "+ar,"legato: "+ar2);
		return [ar,ar2]
}

