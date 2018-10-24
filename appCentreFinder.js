// http://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a
	.filter(function (e) {
	    if (b.indexOf(e) !== -1) return true; })
	.filter(function (e, i, c) { 
	    return c.indexOf(e) === i;
	});
}

function globalIntersect(a,b,c,d){
    return intersect(a, intersect(b, intersect(c,d)));
}

// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('centreFinderApp', ['ui.bootstrap' ])

.filter('giveAddress', function() {
    return function(shortName, $scope) {
	return $scope.centreNameContact(shortName);
    };
})

// .filter('giveAddress', function() {
//     return function(shortName) {
// 	var out = "";
// 	if ( shortName == "IDS" ) {
// 	    out = "Institut für Sprache";
// 	} else {
// 	    out = shortName;
// 	}
// 	return out;
//     };
// })


// our controller for the matrix
// =============================================================================
.controller('centreFinderController',function($q, $scope, $http) {
    
    // we will store all of our matrix data in this object
    $scope.competenceModel = {

	"Gesprochene Sprache"      : ["Liaison", "BAS", "HZSK", "IDS"], //"MPI-PL",
	"Geschriebene Sprache"     : ["Liaison", "BBAW", "IDS", "BAS", "EKUT", "HZSK", "ASV", "UdS", "IMS"],
	"Multimodale Sprachdaten"  : ["Liaison", "BAS"],  // "MPI-PL"
	"Gebärdensprache"          : ["Liaison", "HZSK"], // "MPI-PL"

	"Öffentliche Lizenz"       : ["Liaison", "BBAW", "IDS", "BAS", "EKUT", "HZSK", "ASV", "UdS", "IMS"],  // "MPI-PL"
	"Nicht-Öffentliche Lizenz" : ["Liaison", "EKUT", "BAS", "IDS", "HZSK"], // "MPI-PL"

	"Mehrsprachige Daten"      : ["Liaison", "UdS", "HZSK"],	
	"Deutsche Sprache"         : ["Liaison", "BBAW", "IMS", "IDS", "BAS", "EKUT", "HZSK", "ASV"],
	"Andere Sprachen (nicht Deutsch)"   : ["Liaison", "UdS", "EKUT", "HZSK", "ASV", "IMS"], // "MPI-PL"
	"Varietaetensprache"       : ["Liaison", "IDS", "HZSK"], // "MPI-PL"
	"Bedrohte Sprache"         : ["Liaison", "HZSK"], // "MPI-PL"
	"Historische Sprache"      : ["Liaison", "BBAW"],
	"Gegenwartssprache"        : ["Liaison", "IDS", "ASV"],

	"Lexikon"                  : ["Liaison", "EKUT", "ASV", "BBAW" ],
	"Korpus"                   : ["BBAW", "IDS", "BAS", "EKUT", "HZSK", "ASV", "UdS", "IMS", "Liaison"], //"MPI-PL"
	"Baumbank"                 : ["Liaison", "EKUT", "IMS"],
	"Digitale Editionen"       : ["Liaison", "BBAW"],
	"Experimentaldaten"        : ["Liaison", "EKUT" ], // "MPI-PL"
	"Sprachtechnologische Daten"  : ["Liaison", "BAS"],
	"Andere Textdaten"         : ["Liaison"],
	"Software"                 : ["Liaison", "EKUT", "ASV", "IMS", "BAS"],
	"Optische Zeichenerkennung (OCR)"   : ["Liaison", "BBAW"],
	"Sprachstatistiken"        : ["Liaison", "BAS"],
	"Aussprache-Lexika"        : ["Liaison", "BAS"]
    };
    
    // filled in by user when selecting values (data for fields, see below)
    $scope.userSelection = {};

    // note that the values must coincide with the values used in the competenceModel
    $scope.typeOfData = [{"id":1, "value":"spoken",    "label_en":"Spoken",           "label_de":"Gesprochene Sprache"},
			 {"id":2, "value":"written",   "label_en":"Written",          "label_de":"Geschriebene Sprache"},
			 {"id":3, "value":"multimodal","label_en":"Multimodal",       "label_de":"Multimodale Sprachdaten"},
			 {"id":4, "value":"gesture",   "label_en":"GestureLanguage",  "label_de":"Gebärdensprache"}
			];

    $scope.licences   = [{"id":1, "value":"public",    "label_en":"Public Licence",     "label_de":"Öffentliche Lizenz"},
			 {"id":2, "value":"nonPublic", "label_en":"Non-Public Licence", "label_de":"Nicht-Öffentliche Lizenz"},
			];    

    $scope.languageData = [{"id":1, "value":"multilingual",       "label_en":"Multi-lingual data",  "label_de":"Mehrsprachige Daten"},
			   {"id":2, "value":"german",             "label_en":"German",              "label_de":"Deutsche Sprache"},			   
			   {"id":3, "value":"nonGerman",          "label_en":"non-German",          "label_de":"Andere Sprachen (nicht Deutsch)"},
			   {"id":4, "value":"varietyLanguage",    "label_en":"Variety Language",    "label_de":"Varietaetensprache"},
			   {"id":5, "value":"endangeredLanguage", "label_en":"Endangered Language", "label_de":"Bedrohte Sprache"},
			   {"id":6, "value":"oldLanguage",        "label_en":"Old Language",        "label_de":"Historische Sprache"},
			   {"id":7, "value":"modernLanguage",     "label_en":"Modern Language",     "label_de":"Gegenwartssprache"}
			  ];

    $scope.resourceTypes = [{"id":0, "value":"lexicon",          "label_en":"Lexicon",            "label_de":"Lexikon"},
			    {"id":1, "value":"corpus",           "label_en":"Corpus",             "label_de":"Korpus"},
			    {"id":2, "value":"treebank",         "label_en":"Treebank",           "label_de":"Baumbank"},
			    {"id":3, "value":"digitalEdition",   "label_en":"Digital Edition",    "label_de":"Digitale Editionen"},
			    {"id":4, "value":"experimentalData", "label_en":"Experimental Data",  "label_de":"Experimentaldaten"},
			    {"id":5, "value":"spokenData",       "label_en":"Speech Data",        "label_de":"Sprachtechnologische Daten"},
			    {"id":6, "value":"otherWrittenData", "label_en":"Other Textual Data", "label_de":"Andere Textdaten"},
			    {"id":7, "value":"software",         "label_en":"Software",           "label_de":"Software"},
			    {"id":8, "value":"ocr",              "label_en":"Optical Character Recognition", "label_de":"Optische Zeichenerkennung (OCR)"},			    
			    {"id":9, "value":"speechStatistics", "label_en":"Speech Statistics",  "label_de":"Sprachstatistiken"},
			    {"id":10, "value":"pronounciationLexicon",  "label_en":"Pronounciation Lexicon",   "label_de":"Aussprache-Lexika"}
			   ];

    // filled by http request
    $scope.clarind_centres = [];
    
    // all Clarin centres (when user describes his data)
    $scope.selectedClarinCentres = ["BBAW", "IDS", "BAS", "EKUT", "HZSK", "ASV", "UdS", "IMS", "Liaison"]; //"MPI-PL"

    // used to compute the intersection within a given facet
    $scope.resourceTypeIntersection = $scope.selectedClarinCentres;
    $scope.languageDataIntersection = $scope.selectedClarinCentres;
    $scope.licenceIntersection      = $scope.selectedClarinCentres;
    $scope.typeOfDataIntersection   = $scope.selectedClarinCentres;

    // used to compute the intersection between all facets, given values above
    $scope.globalIntersection = $scope.selectedClarinCentres;
        
    // demons
    // ------

    // $scope.$watch('userSelection.germanProvider', function(newVal) {
    // 	console.debug('$watcher for germanProvider has been called', newVal, $scope.userSelection.germanProvider);
    // });

    // typeOfData has changed
    $scope.$watchCollection('userSelection.typeOfData', function(newVal) {

	// reinitialize (stuff gets unselected)
	$scope.typeOfDataIntersection = $scope.selectedClarinCentres;
	
	for (var key in newVal) {
	    if (newVal.hasOwnProperty(key)) {
		if (! (newVal[key] == false )) {
		    $scope.typeOfDataIntersection = intersect( $scope.typeOfDataIntersection, $scope.competenceModel[newVal[key]]);
		} 
	    }
	}
	$scope.globalIntersection = globalIntersect( $scope.resourceTypeIntersection, $scope.languageDataIntersection, $scope.licenceIntersection, $scope.typeOfDataIntersection);		    
	
    });

    // languageData has changed
    $scope.$watchCollection('userSelection.languageData', function(newVal) {

	// reinitialize (stuff gets unselected)
	$scope.languageDataIntersection = $scope.selectedClarinCentres;
	
	for (var key in newVal) {
	    if (newVal.hasOwnProperty(key)) {
		if (! (newVal[key] == false )) {
		    $scope.languageDataIntersection = intersect( $scope.languageDataIntersection, $scope.competenceModel[newVal[key]]);
		} 
	    }
	}
	$scope.globalIntersection = globalIntersect( $scope.resourceTypeIntersection, $scope.languageDataIntersection, $scope.licenceIntersection, $scope.typeOfDataIntersection);
    });

    // licence has changed
    $scope.$watch('userSelection.licence', function(newVal) {
	// reinitialize (stuff gets unselected)
	$scope.licenceIntersection = $scope.selectedClarinCentres;
	if (newVal == undefined) return;
	
	if (newVal == "ja") {
	    $scope.licenceIntersection = $scope.competenceModel["Öffentliche Lizenz"];
	} else {
	    $scope.licenceIntersection = $scope.competenceModel["Nicht-Öffentliche Lizenz"];	    
	}
	$scope.globalIntersection = globalIntersect( $scope.resourceTypeIntersection, $scope.languageDataIntersection, $scope.licenceIntersection, $scope.typeOfDataIntersection);
    });

    // resourceType has changed
    $scope.$watchCollection('userSelection.resourceType', function(newVal) {
	// reinitialize (stuff gets unselected)
	$scope.resourceTypeIntersection = $scope.selectedClarinCentres;
	
	for (var key in newVal) {
	    if (newVal.hasOwnProperty(key)) {
		if (! (newVal[key] == false )) {
		    $scope.resourceTypeIntersection = intersect( $scope.resourceTypeIntersection, $scope.competenceModel[newVal[key]]);
		} 
	    }
	}
	$scope.globalIntersection =  globalIntersect( $scope.resourceTypeIntersection, $scope.languageDataIntersection, $scope.licenceIntersection, $scope.typeOfDataIntersection);
    });
    
    $http.get('https://centres.clarin.eu/api/model/Centre').
	success(function(centresData, status, headers, config) {
	    $scope.centres = centresData;
	    //	    console.log('all centres', $scope.centres);
	    for (var c in $scope.centres) {
//		console.debug('centres', $scope.centres[c].pk);
		if ($scope.centres[c].fields.consortium == 1) {
		    console.log("Found an Clarin-D institution:", $scope.centres[c].fields.name, $scope.centres[c].pk, $scope.centres[c].fields.shorthand);
		    var centreCompact = { name:       $scope.centres[c].fields.name,
					  shorthand:  $scope.centres[c].fields.shorthand,
					  ac:         $scope.centres[c].fields.administrative_contact,
					  tc:         $scope.centres[c].fields.technical_contact
					};
		    
		    console.debug('adding centreCompact', centreCompact.name, centreCompact.ac, centreCompact.tc);
		    
		    $scope.clarind_centres.push( centreCompact );
		    
		} else {
		    //console.debug("Found a Non-Clarin-D institution:", $scope.centres[c].fields.name);		    
		}
    	    }

	    // add LiaisonN
	    $scope.clarind_centres.push( { name: "Liaison Contact",
					   shorthand: "Liaison",
					   ac: 999,
					   tc: "Thorsten Trippel",
					 });
	    
	    console.debug('all clarind_centres', $scope.clarind_centres);
	}).
	error(function(centresData, status, headers, config) {
	    console.debug('Error fetching center data from CLARIN', status);
	});

    $scope.centreName = function( centre ) {
	for (var c in $scope.clarind_centres) {
	    if ($scope.clarind_centres[c].shorthand == centre) {
		return $scope.clarind_centres[c].name;
	    }
	}
    }

    $scope.centreNameContact = function( centre ) {
	for (var c in $scope.clarind_centres) {
	    if ($scope.clarind_centres[c].shorthand == centre) {
		return $scope.clarind_centres[c].name + ", " + $scope.contactResolution($scope.clarind_centres[c].ac);
	    }
	}
    }

    $scope.contactResolution = function( pk ) {
	if (pk == 999) return "Dr. Thorsten Trippel, thorsten.trippel@uni-tuebingen.de";
	    
	for (var c in $scope.contacts) {
	    if ($scope.contacts[c].pk == pk) {
		return $scope.contacts[c].fields.name + ", " + $scope.contacts[c].fields.email_address;
	    }
	}
    }
    
    // fetch centre registry contect model from Clarin
//    console.log('fetching CLARIN contact data');
    $http.get('https://centres.clarin.eu/api/model/Contact').
	success(function(contactData, status, headers, config) {
	    $scope.contacts = contactData;

	    console.log('all contacts', $scope.contacts);
	}).
	error(function(centresData, status, headers, config) {
	    console.debug('Error fetching contact data from CLARIN', status);
	});    

    // fetch the consortium information (to get country codes)
    $http.get('https://centres.clarin.eu/api/model/Consortium').
	success(function(consortiumData, status, headers, config) {
	    $scope.consortium = consortiumData;
	    console.log('all consortia', $scope.consortium);
	    // for (var c in $scope.consortium) {
	    // 	console.debug('consortium', $scope.consortium[c].fields.country_name);
	    // 	if ($scope.consortium[c].fields.country_name == "Germany") {
	    // 	    console.debug("Found Germany:", $scope.consortium[c].pk);
	    // 	    break;
	    // 	}
	    // }
	}).
	error(function(centresData, status, headers, config) {
	    console.debug('Error fetching consortium data from CLARIN', status);
	});    
});


