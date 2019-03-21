new p5();

let canvas;
let myMap;
//список всіх координат в одному масиві
let allCoordinates = [];
// словник рік: масив координатів будинку
let buildings = [];

let building_by_year = {};


var data;
var myalpha = 0;

//var координати Києва
const options = {
  lat: 50.45466,
  lng: 30.5238,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

const mappa = new Mappa('Leaflet');

// ЗАВАНТАЖЕННЯ ДАНИХ з json
function preload(){
  data = loadJSON('./data/housesKiev.geojson');
}

// СТВОРЕННЯ ФУНКЦІЇ, яка буде малювати будинки того року, що стоїть в атрибуті
 function showOneYear(year){

            var one_year_buildings = building_by_year[year];   
            if(  !( typeof one_year_buildings === 'undefined'  )  ){
                for(let i = 0; i < one_year_buildings.length; i++){
                      var houseShape = one_year_buildings[i].polygon;
                  
                      //console.log(houseShape)
                      beginShape();
                      for (let k = 0; k < houseShape.length; k++){
                        if(  !isNaN(houseShape[k][1]) &&  !isNaN(houseShape[k][0]) ){
                          let pos = myMap.latLngToPixel(houseShape[k][1], houseShape[k][0])
                          vertex(pos.x, pos.y);
                        } 
                      } 
                      endShape(CLOSE);
                     
                }
            }   
        }


// СТВОРЕННЯ ФУНКЦІЇ SLEEP

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 10000000; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function  setup(){
  // змінює частоту зміни екранів
  frameRate(3000);
  canvas = createCanvas(1200,900);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
 

// СТВОРЕННЯ СЛОВНИКА {усі роки, усі будинки для кожного з років}
  for (var i = 0; i< data.features.length; i++){
    // витягаємо з кожного feature.properties.built_year відповідний рік
    var year = data.features[i].properties.built_year;
    // витягаємо з кожного feature.geometry.coordinates відповідний мисив з координатами одного будинку
    var coordinates = data.features[i].geometry.coordinates[0]
    //додаємо ці два значення до словника
    buildings.push({built_year: year, polygon: coordinates});
    //console.log(buildings)

  }


  for(let i = 0; i < buildings.length; i++){
   // зствореного словника беремо по одному масиву 

        var building = buildings[i];
        // з кожного витягаємо рік (year)
        var year = building.built_year;
//
        var one_year_buildings = building_by_year[year];
        if( typeof one_year_buildings === 'undefined' ){
          building_by_year[year] = [building]
        } else {
          one_year_buildings.push(building)
        }

  
  } 

  
// створюємо масив будинків для кожного року
// for (let i = 0; i < one_year_buildings.length; i++){
//        var one_year_buildings = building_by_year[year];

     


      //}    
 
}



function draw(){
  clear();
  noStroke();
  fill(255,255,255);
  //fill(255,255,255,myalpha++);
      //if (millis() > 30000){
        noLoop();
      //}

  // викликаємо фунцію в циклі, який проходиться по всіх роках
  for(var i = 1854; i < 2018; i++){
    
    showOneYear(i);
    sleep(1000);
   }
    
      

      
      
  
}


 // for(var k=0; k <= 255; k++){
 //  myalpha = k;
 //  redraw();
  //console.log(alpha);
// }
