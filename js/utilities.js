'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* *********************************** FONCTIONS UTILITAIRES *********************************** */
/*************************************************************************************************/

// Demande de choisir entre les valeurs d'un tableau 'tab' (supposées connues)
function promptInTab(str, tab) {
	var v
	do {
		v = window.prompt(str).toLowerCase();
		if (!isNaN(parseInt(v))) {
			v = parseInt(v);
		}
	} while (tab.indexOf(v) === -1);
	return v
}
