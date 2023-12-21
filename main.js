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


// itération 3 select
V.addoption(personnes);


let C = {};
C.init = function () {

}


let data2 = [];
let prof = {};
let all = MmiAll; 
for (let intervenant of personnes) {
   prof[intervenant] = all.filter((event) => { return event.title.includes(intervenant) })
}



let allintervenant = function(ev) {
  let test2 = [];
  let profevent = all.filter((event) => {
    return event.title.includes(ev);
  });
console.log(profevent);
  let intervenantData = {
    name: ev,
    children: []
  };
  for (let i = 1; i <= 6; i++) {
    let semestreEvents = profevent.filter((event) => {
      return event.semestre.includes(i.toString());
    });

    let semestreData = {
      name: "semestre" + i,
      children: []
    };

    let ressources = [];
    semestreEvents.forEach(event => {
      if (ressources.indexOf(event.ressource) === -1) {
        ressources.push(event.ressource);
      }
    });
   
    for (let res of ressources) {
      let calcCM = 0;
      let calcTD = 0;
      let calcTP = 0;
      let calcOther = 0;
      let ressourceEvents = semestreEvents.filter((event) => {
        return event.ressource === res;
      });
      for (const event of ressourceEvents) {
        
        if (event.type == "CM") {
          calcCM += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "TD") {
          calcTD += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "TP") {
          calcTP += V.hourEnd(event) - V.hourStart(event);
        }
        else if (event.type == "OTHER") {
          calcOther += V.hourEnd(event) - V.hourStart(event);
        }
      
      }
      let ressourceData = {
        name: res,
        children: [
          {
            name: "CM",
            value: calcCM
          },
          {
            name: "TD",
            value:  calcTD
          },
          {
            name: "TP",
            value:  calcTP
          },
          {
            name: "OTHER",
            value:  calcOther
          },
        ]
      };

      semestreData.children.push(ressourceData);
    }

    intervenantData.children.push(semestreData);
  }

  test2.push(intervenantData);
  console.log(test2);  
  return test2;
}





// itération 2

am5.ready(function() {

  // Create chart
  var root = am5.Root.new("chartdiv2");
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panY",
    wheelY: "zoomY",
    paddingLeft: 0,
    layout: root.verticalLayout,
  }));
  
  chart.plotContainer.get("background").setAll({       
    stroke: am5.color("#2C3E50"),
    strokeOpacityOpacity: 1,                     
    fill: am5.color("#2C3E50"),
    fillOpacity: 1
  });


  // Add scrollbar
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  chart.set("scrollbarY", am5.Scrollbar.new(root, {
    orientation: "vertical",
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
  let affichageYaxis = function(data){
    yAxis.data.setAll(data);
  };
  

  
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

  chart.get("colors").set("colors", [
    am5.color("#E74C3C"),
    am5.color("#5dade2"),
    am5.color("#2a84bf"),
  ]);
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
    let affichageserie = function(data){
      series.data.setAll(data);
    };
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/

    
// itération 2
    let semestre = document.querySelector("#semestre");
    let handlersemestre = function (ev) {
      for (let intervenant of personnes) {
        let calcCM = 0;
        let calcTD = 0;
        let calcTP = 0;
        let calcOther = 0;
        if(ev.target.value === "0"){
          for (const event of prof[intervenant]) {
              if (event.type == "CM") {
                calcCM += V.hourEnd(event) - V.hourStart(event);
              }
              else if (event.type == "TD") {
                calcTD += V.hourEnd(event) - V.hourStart(event);
              }
              else if (event.type == "TP") {
                calcTP += V.hourEnd(event) - V.hourStart(event);
              }
              else {
                calcOther += V.hourEnd(event) - V.hourStart(event);
              }
          }
          let a = {
            "intervenant": intervenant,
            "CM": calcCM,
            "TD": calcTD,
            "TP": calcTP,
          };
          data2.push(a);
        }
      else{
        for (const event of prof[intervenant]) {
          if (ev.target.value === event.semestre[0]) {
            if (event.type == "CM") {
              calcCM += V.hourEnd(event) - V.hourStart(event);
            }
            else if (event.type == "TD") {
              calcTD += V.hourEnd(event) - V.hourStart(event);
            }
            else if (event.type == "TP") {
              calcTP += V.hourEnd(event) - V.hourStart(event);
            }
            else {
              calcOther += V.hourEnd(event) - V.hourStart(event);
            }
          }
        }
        let a = {
          "intervenant": intervenant,
          "CM": calcCM,
          "TD": calcTD,
          "TP": calcTP,
        };
        data2.push(a);
      }
      }
     console.log(data2)
     affichageserie(data2);
     affichageYaxis(data2);
      data2 = [];
    }
    semestre.addEventListener("change", handlersemestre);
    handlersemestre({ target: { value: "0" } })

    series.appear();

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
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




// itération 3


// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

var myTheme = am5.Theme.new(root);

myTheme.rule("ColorSet").set("colors", [
  am5.color("#57d6df"),
  am5.color("#385f88"),
  am5.color("#304557"),
  am5.color("#f4b044"),
  am5.color("#f16229"),
  am5.color("#E91E63"),
  am5.color("#795548"),
]);
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create wrapper container
var container = root.container.children.push(am5.Container.new(root, {
  width: am5.percent(100),
  height: am5.percent(100),
  layout: root.verticalLayout
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
var series = container.children.push(am5hierarchy.Sunburst.new(root, {
  singleBranchOnly: true,
  downDepth: 10,
  initialDepth: 10,
  valueField: "value",
  categoryField: "name",
  childDataField: "children"
}));


// Generate and set data
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data




let intervenant = document.querySelector("#intervenant");
let handlerintervenant = function(ev){
  let intervenant = ev.target.value;
  let cours = allintervenant(intervenant);
  affichagedonut(cours);    
}
intervenant.addEventListener("change", handlerintervenant);


let affichagedonut = function(data){
  series.data.setAll(data);
};

handlerintervenant({ target: { value: "MOUTAT Audrey" } });

series.set("selectedDataItem", series.dataItems[0]);

container.children.unshift(
  am5hierarchy.BreadcrumbBar.new(root, {
    series: series
  })
);





// itération 4





var root = am5.Root.new("chartdiv3");



// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "none",
  wheelY: "none",
  paddingLeft: 0,
  layout: root.verticalLayout
}));


// Create axes and their renderers
var yRenderer = am5xy.AxisRendererY.new(root, {
  visible: false,
  minGridDistance: 20,
  inversed: true,
  minorGridEnabled: true
});

yRenderer.grid.template.set("visible", false);

var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  renderer: yRenderer,
  categoryField: "weekday"
}));

var xRenderer = am5xy.AxisRendererX.new(root, {
  visible: false,
  minGridDistance: 30,
  opposite:true,
  minorGridEnabled: true
});

xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  renderer: xRenderer,
  categoryField: "hour"
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  calculateAggregates: true,
  stroke: am5.color(0xffffff),
  clustered: false,
  xAxis: xAxis,
  yAxis: yAxis,
  categoryXField: "hour",
  categoryYField: "weekday",
  valueField: "value"
}));

series.columns.template.setAll({
  tooltipText: "{value}",
  strokeOpacity: 1,
  strokeWidth: 2,
  width: am5.percent(100),
  height: am5.percent(100)
});

series.columns.template.events.on("pointerover", function(event) {
  var di = event.target.dataItem;
  if (di) {
    heatLegend.showValue(di.get("value", 0));
  }
});

series.events.on("datavalidated", function() {
  heatLegend.set("startValue", series.getPrivate("valueHigh"));
  heatLegend.set("endValue", series.getPrivate("valueLow"));
});


// Set up heat rules
// https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
series.set("heatRules", [{
  target: series.columns.template,
  min: am5.color(0xfffb77),
  max: am5.color(0xfe131a),
  dataField: "value",
  key: "fill"
}]);


// Add heat legend
// https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/
var heatLegend = chart.bottomAxesContainer.children.push(am5.HeatLegend.new(root, {
  orientation: "horizontal",
  endColor: am5.color(0xfffb77),
  startColor: am5.color(0xfe131a)
}));

let intersectByHour = function (hour, start, end) {

  let interStart = new Date(start);
  interStart.setHours(hour);
  interStart.setMinutes(0);
  let interEnd = new Date(end);
  interEnd.setHours(hour + 1);
  interEnd.setMinutes(0);

  // maintenant il faut déterminer s'il existe une intersection entre [interStart, interEnd] et les horaires du cours [start, end]

  if (interEnd <= start) // si l'heure de fin est avant l'heure de début du cours, pas d'intersection
    return 0;
  else if (interStart >= end) // si l'heure de début est après l'heure de fin du cours, pas d'intersection
    return 0;
  else { // il existe une intersection entre [interStart, interEnd] et les horaires du cours [start, end]
    return (Math.min(interEnd, end) - Math.max(interStart, start)) / 1000 / 3600;
    // on prend le minimum des deux heures de fin et le maximum des deux heures de début
    // et on retourne la durée de l'intersection en heures
  }

}

let test3 = {};
for (let intervenant of personnes) {
  test3[intervenant] = {};
  intervenant = all.filter((event) => {
    return event.title.includes(intervenant);
  });
 
 personnes.forEach(personne => {
  let evenementsPourCettePersonne = all.filter(event => {
    return event.title.toLowerCase().includes(personne.toLowerCase());
  });
  function getDayFromDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
  
  let evenementsParJour = {}; // Créer un objet pour stocker les événements par jour pour cette personne

  // Pour chaque jour de la semaine
  const joursSemaine = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  joursSemaine.forEach(jour => {
    // Filtrer les événements pour cette personne par jour
    let evenementsPourCeJour = evenementsPourCettePersonne.filter(event => {
      const eventDay = getDayFromDate(new Date(event.start));
      return eventDay === jour;
    });

    // Calculer l'intersection par heure pour les événements de ce jour
    let evenementsAvecIntersection = evenementsPourCeJour.map(event => {
      let Heure = {};
      for (let hour = 0; hour < 24; hour++) {
        let intersection = intersectByHour(hour, new Date(event.start), new Date(event.end));
        Heure[hour] = intersection;
      }
      return {
        event,
        Heure
      };
    });

    // Stocker les événements associés à cette personne avec intersection par heure pour ce jour
    evenementsParJour[jour] = evenementsAvecIntersection;
  });

  // Stocker les événements associés à cette personne par jour
  test3[personne] = evenementsParJour;
});

// Maintenant, test3 contient les événements associés à chaque personne avec intersection par heure, par jour
//console.log(test3);

}


// Set data
// https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data
var data = [{
  hour: "12pm",
  weekday: "Sunday",
  value: 2990
}, {
  hour: "1am",
  weekday: "Sunday",
  value: 2520
}, {
  hour: "2am",
  weekday: "Sunday",
  value: 2334
}, {
  hour: "3am",
  weekday: "Sunday",
  value: 2230
}, {
  hour: "4am",
  weekday: "Sunday",
  value: 2325
}, {
  hour: "5am",
  weekday: "Sunday",
  value: 2019
}, {
  hour: "6am",
  weekday: "Sunday",
  value: 2128
}, {
  hour: "7am",
  weekday: "Sunday",
  value: 2246
}, {
  hour: "8am",
  weekday: "Sunday",
  value: 2421
}, {
  hour: "9am",
  weekday: "Sunday",
  value: 2788
}, {
  hour: "10am",
  weekday: "Sunday",
  value: 2959
}, {
  hour: "11am",
  weekday: "Sunday",
  value: 3018
}, {
  hour: "12am",
  weekday: "Sunday",
  value: 3154
}, {
  hour: "1pm",
  weekday: "Sunday",
  value: 3172
}, {
  hour: "2pm",
  weekday: "Sunday",
  value: 3368
}, {
  hour: "3pm",
  weekday: "Sunday",
  value: 3464
}, {
  hour: "4pm",
  weekday: "Sunday",
  value: 3746
}, {
  hour: "5pm",
  weekday: "Sunday",
  value: 3656
}, {
  hour: "6pm",
  weekday: "Sunday",
  value: 3336
}, {
  hour: "7pm",
  weekday: "Sunday",
  value: 3292
}, {
  hour: "8pm",
  weekday: "Sunday",
  value: 3269
}, {
  hour: "9pm",
  weekday: "Sunday",
  value: 3300
}, {
  hour: "10pm",
  weekday: "Sunday",
  value: 3403
}, {
  hour: "11pm",
  weekday: "Sunday",
  value: 3323
}, {
  hour: "12pm",
  weekday: "Monday",
  value: 3346
}, {
  hour: "1am",
  weekday: "Monday",
  value: 2725
}, {
  hour: "2am",
  weekday: "Monday",
  value: 3052
}, {
  hour: "3am",
  weekday: "Monday",
  value: 3876
}, {
  hour: "4am",
  weekday: "Monday",
  value: 4453
}, {
  hour: "5am",
  weekday: "Monday",
  value: 3972
}, {
  hour: "6am",
  weekday: "Monday",
  value: 4644
}, {
  hour: "7am",
  weekday: "Monday",
  value: 5715
}, {
  hour: "8am",
  weekday: "Monday",
  value: 7080
}, {
  hour: "9am",
  weekday: "Monday",
  value: 8022
}, {
  hour: "10am",
  weekday: "Monday",
  value: 8446
}, {
  hour: "11am",
  weekday: "Monday",
  value: 9313
}, {
  hour: "12am",
  weekday: "Monday",
  value: 9011
}, {
  hour: "1pm",
  weekday: "Monday",
  value: 8508
}, {
  hour: "2pm",
  weekday: "Monday",
  value: 8515
}, {
  hour: "3pm",
  weekday: "Monday",
  value: 8399
}, {
  hour: "4pm",
  weekday: "Monday",
  value: 8649
}, {
  hour: "5pm",
  weekday: "Monday",
  value: 7869
}, {
  hour: "6pm",
  weekday: "Monday",
  value: 6933
}, {
  hour: "7pm",
  weekday: "Monday",
  value: 5969
}, {
  hour: "8pm",
  weekday: "Monday",
  value: 5552
}, {
  hour: "9pm",
  weekday: "Monday",
  value: 5434
}, {
  hour: "10pm",
  weekday: "Monday",
  value: 5070
}, {
  hour: "11pm",
  weekday: "Monday",
  value: 4851
}, {
  hour: "12pm",
  weekday: "Tuesday",
  value: 4468
}, {
  hour: "1am",
  weekday: "Tuesday",
  value: 3306
}, {
  hour: "2am",
  weekday: "Tuesday",
  value: 3906
}, {
  hour: "3am",
  weekday: "Tuesday",
  value: 4413
}, {
  hour: "4am",
  weekday: "Tuesday",
  value: 4726
}, {
  hour: "5am",
  weekday: "Tuesday",
  value: 4584
}, {
  hour: "6am",
  weekday: "Tuesday",
  value: 5717
}, {
  hour: "7am",
  weekday: "Tuesday",
  value: 6504
}, {
  hour: "8am",
  weekday: "Tuesday",
  value: 8104
}, {
  hour: "9am",
  weekday: "Tuesday",
  value: 8813
}, {
  hour: "10am",
  weekday: "Tuesday",
  value: 9278
}, {
  hour: "11am",
  weekday: "Tuesday",
  value: 10425
}, {
  hour: "12am",
  weekday: "Tuesday",
  value: 10137
}, {
  hour: "1pm",
  weekday: "Tuesday",
  value: 9290
}, {
  hour: "2pm",
  weekday: "Tuesday",
  value: 9255
}, {
  hour: "3pm",
  weekday: "Tuesday",
  value: 9614
}, {
  hour: "4pm",
  weekday: "Tuesday",
  value: 9713
}, {
  hour: "5pm",
  weekday: "Tuesday",
  value: 9667
}, {
  hour: "6pm",
  weekday: "Tuesday",
  value: 8774
}, {
  hour: "7pm",
  weekday: "Tuesday",
  value: 8649
}, {
  hour: "8pm",
  weekday: "Tuesday",
  value: 9937
}, {
  hour: "9pm",
  weekday: "Tuesday",
  value: 10286
}, {
  hour: "10pm",
  weekday: "Tuesday",
  value: 9175
}, {
  hour: "11pm",
  weekday: "Tuesday",
  value: 8581
}, {
  hour: "12pm",
  weekday: "Wednesday",
  value: 8145
}, {
  hour: "1am",
  weekday: "Wednesday",
  value: 7177
}, {
  hour: "2am",
  weekday: "Wednesday",
  value: 5657
}, {
  hour: "3am",
  weekday: "Wednesday",
  value: 6802
}, {
  hour: "4am",
  weekday: "Wednesday",
  value: 8159
}, {
  hour: "5am",
  weekday: "Wednesday",
  value: 8449
}, {
  hour: "6am",
  weekday: "Wednesday",
  value: 9453
}, {
  hour: "7am",
  weekday: "Wednesday",
  value: 9947
}, {
  hour: "8am",
  weekday: "Wednesday",
  value: 11471
}, {
  hour: "9am",
  weekday: "Wednesday",
  value: 12492
}, {
  hour: "10am",
  weekday: "Wednesday",
  value: 9388
}, {
  hour: "11am",
  weekday: "Wednesday",
  value: 9928
}, {
  hour: "12am",
  weekday: "Wednesday",
  value: 9644
}, {
  hour: "1pm",
  weekday: "Wednesday",
  value: 9034
}, {
  hour: "2pm",
  weekday: "Wednesday",
  value: 8964
}, {
  hour: "3pm",
  weekday: "Wednesday",
  value: 9069
}, {
  hour: "4pm",
  weekday: "Wednesday",
  value: 8898
}, {
  hour: "5pm",
  weekday: "Wednesday",
  value: 8322
}, {
  hour: "6pm",
  weekday: "Wednesday",
  value: 6909
}, {
  hour: "7pm",
  weekday: "Wednesday",
  value: 5810
}, {
  hour: "8pm",
  weekday: "Wednesday",
  value: 5151
}, {
  hour: "9pm",
  weekday: "Wednesday",
  value: 4911
}, {
  hour: "10pm",
  weekday: "Wednesday",
  value: 4487
}, {
  hour: "11pm",
  weekday: "Wednesday",
  value: 4118
}, {
  hour: "12pm",
  weekday: "Thursday",
  value: 3689
}, {
  hour: "1am",
  weekday: "Thursday",
  value: 3081
}, {
  hour: "2am",
  weekday: "Thursday",
  value: 6525
}, {
  hour: "3am",
  weekday: "Thursday",
  value: 6228
}, {
  hour: "4am",
  weekday: "Thursday",
  value: 6917
}, {
  hour: "5am",
  weekday: "Thursday",
  value: 6568
}, {
  hour: "6am",
  weekday: "Thursday",
  value: 6405
}, {
  hour: "7am",
  weekday: "Thursday",
  value: 8106
}, {
  hour: "8am",
  weekday: "Thursday",
  value: 8542
}, {
  hour: "9am",
  weekday: "Thursday",
  value: 8501
}, {
  hour: "10am",
  weekday: "Thursday",
  value: 8802
}, {
  hour: "11am",
  weekday: "Thursday",
  value: 9420
}, {
  hour: "12am",
  weekday: "Thursday",
  value: 8966
}, {
  hour: "1pm",
  weekday: "Thursday",
  value: 8135
}, {
  hour: "2pm",
  weekday: "Thursday",
  value: 8224
}, {
  hour: "3pm",
  weekday: "Thursday",
  value: 8387
}, {
  hour: "4pm",
  weekday: "Thursday",
  value: 8218
}, {
  hour: "5pm",
  weekday: "Thursday",
  value: 7641
}, {
  hour: "6pm",
  weekday: "Thursday",
  value: 6469
}, {
  hour: "7pm",
  weekday: "Thursday",
  value: 5441
}, {
  hour: "8pm",
  weekday: "Thursday",
  value: 4952
}, {
  hour: "9pm",
  weekday: "Thursday",
  value: 4643
}, {
  hour: "10pm",
  weekday: "Thursday",
  value: 4393
}, {
  hour: "11pm",
  weekday: "Thursday",
  value: 4017
}, {
  hour: "12pm",
  weekday: "Friday",
  value: 4022
}, {
  hour: "1am",
  weekday: "Friday",
  value: 3063
}, {
  hour: "2am",
  weekday: "Friday",
  value: 3638
}, {
  hour: "3am",
  weekday: "Friday",
  value: 3968
}, {
  hour: "4am",
  weekday: "Friday",
  value: 4070
}, {
  hour: "5am",
  weekday: "Friday",
  value: 4019
}, {
  hour: "6am",
  weekday: "Friday",
  value: 4548
}, {
  hour: "7am",
  weekday: "Friday",
  value: 5465
}, {
  hour: "8am",
  weekday: "Friday",
  value: 6909
}, {
  hour: "9am",
  weekday: "Friday",
  value: 7706
}, {
  hour: "10am",
  weekday: "Friday",
  value: 7867
}, {
  hour: "11am",
  weekday: "Friday",
  value: 8615
}, {
  hour: "12am",
  weekday: "Friday",
  value: 8218
}, {
  hour: "1pm",
  weekday: "Friday",
  value: 7604
}, {
  hour: "2pm",
  weekday: "Friday",
  value: 7429
}, {
  hour: "3pm",
  weekday: "Friday",
  value: 7488
}, {
  hour: "4pm",
  weekday: "Friday",
  value: 7493
}, {
  hour: "5pm",
  weekday: "Friday",
  value: 6998
}, {
  hour: "6pm",
  weekday: "Friday",
  value: 5941
}, {
  hour: "7pm",
  weekday: "Friday",
  value: 5068
}, {
  hour: "8pm",
  weekday: "Friday",
  value: 4636
}, {
  hour: "9pm",
  weekday: "Friday",
  value: 4241
}, {
  hour: "10pm",
  weekday: "Friday",
  value: 3858
}, {
  hour: "11pm",
  weekday: "Friday",
  value: 3833
}, {
  hour: "12pm",
  weekday: "Saturday",
  value: 3503
}, {
  hour: "1am",
  weekday: "Saturday",
  value: 2842
}, {
  hour: "2am",
  weekday: "Saturday",
  value: 2808
}, {
  hour: "3am",
  weekday: "Saturday",
  value: 2399
}, {
  hour: "4am",
  weekday: "Saturday",
  value: 2280
}, {
  hour: "5am",
  weekday: "Saturday",
  value: 2139
}, {
  hour: "6am",
  weekday: "Saturday",
  value: 2527
}, {
  hour: "7am",
  weekday: "Saturday",
  value: 2940
}, {
  hour: "8am",
  weekday: "Saturday",
  value: 3066
}, {
  hour: "9am",
  weekday: "Saturday",
  value: 3494
}, {
  hour: "10am",
  weekday: "Saturday",
  value: 3287
}, {
  hour: "11am",
  weekday: "Saturday",
  value: 3416
}, {
  hour: "12am",
  weekday: "Saturday",
  value: 3432
}, {
  hour: "1pm",
  weekday: "Saturday",
  value: 3523
}, {
  hour: "2pm",
  weekday: "Saturday",
  value: 3542
}, {
  hour: "3pm",
  weekday: "Saturday",
  value: 3347
}, {
  hour: "4pm",
  weekday: "Saturday",
  value: 3292
}, {
  hour: "5pm",
  weekday: "Saturday",
  value: 3416
}, {
  hour: "6pm",
  weekday: "Saturday",
  value: 3131
}, {
  hour: "7pm",
  weekday: "Saturday",
  value: 3057
}, {
  hour: "8pm",
  weekday: "Saturday",
  value: 3227
}, {
  hour: "9pm",
  weekday: "Saturday",
  value: 3060
}, {
  hour: "10pm",
  weekday: "Saturday",
  value: 2855
}, {
  hour: "11pm",
  weekday: "Saturday",
  value: 2625
}
]

series.data.setAll(data);

yAxis.data.setAll([
  { weekday: "Sunday" },
  { weekday: "Monday" },
  { weekday: "Tuesday" },
  { weekday: "Wednesday" },
  { weekday: "Thursday" },
  { weekday: "Friday" },
  { weekday: "Saturday" }
]);

xAxis.data.setAll([
  { hour: "12pm" },
  { hour: "1am" },
  { hour: "2am" },
  { hour: "3am" },
  { hour: "4am" },
  { hour: "5am" },
  { hour: "6am" },
  { hour: "7am" },
  { hour: "8am" },
  { hour: "9am" },
  { hour: "10am" },
  { hour: "11am" },
  { hour: "12am" },
  { hour: "1pm" },
  { hour: "2pm" },
  { hour: "3pm" },
  { hour: "4pm" },
  { hour: "5pm" },
  { hour: "6pm" },
  { hour: "7pm" },
  { hour: "8pm" },
  { hour: "9pm" },
  { hour: "10pm" },
  { hour: "11pm" }
]);


// Make stuff animate on load
series.appear(1000, 100);

}); // end am5.ready()
