import { M } from "./js/model.js";
import { V } from "./js/view.js";

/*
   Ce fichier correspond au contrôleur de l'application. Il est chargé de faire le lien entre le modèle et la vue.
   Le modèle et la vue sont définis dans les fichiers js/model.js et js/view.js et importés (M et V, parties "publiques") dans ce fichier.
   Le modèle contient les données (les événements des 3 années de MMI).
   La vue contient tout ce qui est propre à l'interface et en particulier le composant Toast UI Calendar.
   Le principe sera toujours le même : le contrôleur va récupérer les données du modèle et les passer à la vue.
   Toute opération de filtrage des données devra être définie dans le modèle.
   Et en fonction des actions de l'utilisateur, le contrôleur pourra demander au modèle de lui retourner des données filtrées
   pour ensuite les passer à la vue pour affichage.

   Exception : Afficher 1, 2 ou les 3 années de formation sans autre filtrage peut être géré uniquement au niveau de la vue.
   */


// loadind data (and wait for it !)
await M.init();


// ~~~~IT 1~~~~

let MmiAll = [...M.getEvents('mmi1'), ...M.getEvents('mmi2'), ...M.getEvents('mmi3')];



// ~~~~IT 3~~~~

for (const elt of MmiAll) {
  elt.backgroundColor = V.colorMap[elt.calendarId][elt.type];
}


let Mmi1 = [];
let Mmi2 = [];
let Mmi3 = [];








let personnes = [
  "MOUTAT Audrey",
  "MORA Frédéric",
  "ADAMCZYK Natacha",
  "GUEDIRA Réda",
  "LAVEFVE Valérie",
  "SPRINGINSFELD Denis",
  "CRESPIN Benoit",
  "ADAM Fabrice",
  "AYMARD Adrien",
  "AYMARD Alain",
  "BABIN Valentin",
  "BONNAUD Lucile",
  "BERTHIER Hélène",
  "CHANTELOUP Amelin",
  "CREDEVILLE Maxime",
  "CHUPIN Suzanne",
  "DAL BELLO Marine",
  "DEMAISON Guillaume",
  "DULAC Benoit",
  "DUBREUIL Anne-Sophie",
  "FEYDI Philippe",
  "FIAMMETTI Deborah",
  "FLITTI Eric",
  "GERAUD Fabien",
  "GOUDARD Bérénice",
  "GRASSET Véronique",
  "JARDOU Thomas",
  "JAUFFRET Manon",
  "JOUY Maxime",
  "LAFONT Mathieu",
  "LASCAUD Raphaël",
  "LAZARE Jean-Cédric",
  "LE BAIL Emma",
  "LECOMTE Catherine",
  "MARTY Thomas",
  "MONDOLLOT Rémi",
  "MINIER Jules",
  "NENIN Cédric",
  "PAILLIER Stéphane",
  "PINAUD Anaïs",
  "PORRO Heinich",
  "PORTAL Nicolas",
  "SABOURIN Erwan",
  "SINCLAIR Diego",
  "THARAUD Sébastien",
  "TZVETKOVA Maria",
  "TURBELIN Pierre",
  "VALETTE Sophie",
  "LU Inès",
  "KABAB Simon",
  "VEILLON Pascal",
];

V.init = function(){
  let semestre = document.querySelector("#semestre");
  semestre.addEventListener("change" , C.handlersemestre)
}



let C = {};
C.init = function(){

}

let all = MmiAll;
var data = [];
let test = {};
let calcCM, calcTD, calcTP, calcOther, calcTotal;
for(let intervenant of personnes){
  calcTotal = 0;
  calcCM = 0;
  calcTD = 0;
  calcTP = 0;
  calcOther = 0;
  test[intervenant] = all.filter( (event) => {return event.title.includes(intervenant) })
  
  for (const event of test[intervenant]) {
    
    if (event.type == "CM") {
      calcCM += hourEnd(event) - hourStart(event);
    }
    else if (event.type == "TD") {
      calcTD += hourEnd(event) - hourStart(event);
    }
    else if (event.type == "TP") {
      calcTP += hourEnd(event) - hourStart(event);
    }
    else {
      calcOther += hourEnd(event) - hourStart(event);
    }

    calcTotal = calcCM + calcTD + calcTP + calcOther;
  }
  let a = {
      "intervenant": intervenant,
      "CM": calcCM,
      "TD": calcTD,
      "TP": calcTP,
  };
  data.push(a);
  


}




C.handlersemestre = function(ev){
  let valeursTest = Object.values(test);
  console.log(ev.target.value);
  calcTotal = 0;
  calcCM = 0;
  calcTD = 0;
  calcTP = 0;
  calcOther = 0;
  for (let valeur of valeursTest) {
    console.log(valeur);
var data = [];
let calcCM, calcTD, calcTP, calcOther, calcTotal;
   for (const event of valeur) {
    if(ev.target.value === event.semestre[0]){
    if (event.type == "CM") {
      calcCM += hourEnd(event) - hourStart(event);
    }
    else if (event.type == "TD") {
      calcTD += hourEnd(event) - hourStart(event);
    }
    else if (event.type == "TP") {
      calcTP += hourEnd(event) - hourStart(event);
    }
    else {
      calcOther += hourEnd(event) - hourStart(event);
    }

    calcTotal = calcCM + calcTD + calcTP + calcOther;
  }
  let a = {
      "intervenant": event.title,
      "CM": calcCM,
      "TD": calcTD,
      "TP": calcTP,
  };
  data.push(a);

}
console.log(data);
}
}



function hourStart(para) {
  let heure = para.start.toString();
  let test = heure.slice(16, -42);
  test = test.replaceAll(":", ".");
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
}
function hourEnd(para) {
  let heure = para.end.toString();
  let test = heure.slice(16, -42);
  test = test.replaceAll(":", ".");
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
}


/*let nbcours = {};
for(let intervenant of personnes){
  nbcours[intervenant] = test[intervenant].length;
}
console.log(nbcours);*/



am5.ready(function() {


  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("chartdiv");
  
  
  var myTheme = am5.Theme.new(root);
  
  myTheme.rule("Grid", ["base"]).setAll({
    strokeOpacity: 0.1
  });
  
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root),
    myTheme
  ]);
  
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panY",
    wheelY: "zoomY",
    paddingLeft: 0,
    layout: root.verticalLayout
  }));
  
  // Add scrollbar
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  chart.set("scrollbarY", am5.Scrollbar.new(root, {
    orientation: "vertical"
  }));
  
  
  
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var yRenderer = am5xy.AxisRendererY.new(root, {});
  var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "intervenant",
    renderer: yRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  yRenderer.grid.template.setAll({
    location: 1
  })
  
  yAxis.data.setAll(data);
  
  var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
    min: 0,
    maxPrecision: 0,
    renderer: am5xy.AxisRendererX.new(root, {
      minGridDistance: 40,
      strokeOpacity: 0.1
    })
  }));
  
  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  var legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));
  
  
  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  function makeSeries(name, fieldName) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      baseAxis: yAxis,
      valueXField: fieldName,
      categoryYField: "intervenant"
    }));
  
    series.columns.template.setAll({
      tooltipText: "{name}, {categoryY}: {valueX}",
      tooltipY: am5.percent(10)
    });
    series.data.setAll(data);
  
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
  

   

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: am5.p50,
          centerX: am5.p50,
          populateText: true
        })
      });
    });
  
    legend.data.push(series);
  }
  
  makeSeries("CM", "CM");
  makeSeries("TD", "TD");
  makeSeries("TP", "TP");
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 100);
  
  }); // end am5.ready()
  C.init();
  V.init();