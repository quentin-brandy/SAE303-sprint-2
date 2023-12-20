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

let semes = [
  "1",
  "2",
  "3",
  "4",
  "5",
];

/* V.init = function () {
  let semestre = document.querySelector("#semestre");
  semestre.addEventListener("change", handlersemestre)
} */



let C = {};
C.init = function () {

}

let all = MmiAll;
var data = [];
let test = {};
let calcCM, calcTD, calcTP, calcOther, calcTotal;
for (let intervenant of personnes) {
  calcTotal = 0;
  calcCM = 0;
  calcTD = 0;
  calcTP = 0;
  calcOther = 0;
  test[intervenant] = all.filter((event) => { return event.title.includes(intervenant) })

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



let test2 = {};
for (let intervenant of personnes) {
  test2[intervenant] = {};
  let profevent = all.filter((event) => {
    return event.title.includes(intervenant);
  });

  for (let i = 1; i <= 6; i++) {
    let semestreEvents = profevent.filter((event) => {
      return event.semestre.includes(i.toString());
    });
    test2[intervenant]["semestre" + i] = {};

    let ressources = [...new Set(semestreEvents.map(event => event.ressource))];

    for (let res of ressources) {
      let ressourceEvents = semestreEvents.filter((event) => {
        return event.ressource === res;
      });
      test2[intervenant]["semestre" + i][res] = {
        "OTHER": ressourceEvents.filter((event) => {
          return event.type.includes("OTHER");
        }),
        "CM": ressourceEvents.filter((event) => {
          return event.type.includes("CM");
        }),
        "TD": ressourceEvents.filter((event) => {
          return event.type.includes("TD");
        }),
        "TP": ressourceEvents.filter((event) => {
          return event.type.includes("TP");
        })
      };
      /* console.log(test2); */
    }
  }
}


function hourStart(para) {
  let test = para.start.getHours() + "." + para.start.getMinutes();
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
}
function hourEnd(para) {
  let test = para.end.getHours() + "." + para.end.getMinutes();
  test = test.replaceAll("30", "50");
  test = parseFloat(test);
  return test;
}


/**
* hour : un entier entre 0 et 23 qui détermine une tranche d'une heure (ex: 14 pour la tranche 14h-15h)
* start : un objet Date qui détermine l'heure de début d'un cours
* end : un objet Date qui détermine l'heure de fin d'un cours
* retourne la durée de l'intersection entre [start, end] et [hour, hour+1] en heures (0 si pas d'intersection)
*/
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
let euhf = [];
let profevent;

for (let intervenant of personnes) {
  euhf = 0

  test3[intervenant] = {};
  profevent = all.filter((event) => {
    return event.title.includes(intervenant);
  });

  console.log(profevent[0]);

  /* for (const elt of profevent) {
    
    for (let i = 1; i < 12; i++) {
      console.log(intersectByHour(i, elt.start, elt.end));
    }
    
  } */
  
}

/* for (const ev of MmiAll) {
  console.log(ev);
  console.log(ev.start.getHours());
  console.log(intersectByHour(ev.start.getHours(), ev.start, ev.end));
} */




am5.ready(function () {


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
    layout: root.verticalLayout,
  }));

  /*chart.plotContainer.get("background").setAll({
    stroke: am5.color(0x297373),
    strokeOpacity: 0.5,                               modificateur de couleur background
    fill: am5.color(0x297373),
    fillOpacity: 0.2
  });*/


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
    let affichageserie = function (data) {
      series.data.setAll(data);
    };
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/


    let semestre = document.querySelector("#semestre");

    let handlersemestre = function (ev) {
      let all = MmiAll;
      let test = {};
      let calcCM, calcTD, calcTP, calcOther, calcTotal;
      for (let intervenant of personnes) {
        calcTotal = 0;
        calcCM = 0;
        calcTD = 0;
        calcTP = 0;
        calcOther = 0;
        test[intervenant] = all.filter((event) => { return event.title.includes(intervenant) })

        for (const event of test[intervenant]) {
          if (ev.target.value === event.semestre[0]) {


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
        }
        let a = {
          "intervenant": intervenant,
          "CM": calcCM,
          "TD": calcTD,
          "TP": calcTP,
        };
        data2.push(a);

      }

      affichageserie(data2);
      data2 = [];
    }
    semestre.addEventListener("change", handlersemestre);


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



am5.ready(function() {


  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new("heatmap");
  
  
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
  
  
  // Set data
  // https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data
  var data = [{
    hour: "9h",
    weekday: "Lundi",
    value: 2990
  }, {
    hour: "9h",
    weekday: "Mardi",
    value: 2520
  }, {
    hour: "10h",
    weekday: "Mercredi",
    value: 2334
  }]
  
  series.data.setAll(data);
  
  yAxis.data.setAll([
    { weekday: "Lundi" },
    { weekday: "Mardi" },
    { weekday: "Mercredi" },
    { weekday: "Jeudi" },
    { weekday: "Vendredi" }
  ]);
  
  xAxis.data.setAll([
    { hour: "8h" },
    { hour: "9h" },
    { hour: "10h" },
    { hour: "11h" },
    { hour: "12h" },
    { hour: "13h" },
    { hour: "14h" },
    { hour: "15h" },
    { hour: "16h" },
    { hour: "17h" },
    { hour: "18h" },
    { hour: "19h" },
  ]);
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
  chart.appear(1000, 100);
  
  });


let data2 = [];





/* C.init();
V.init(); */