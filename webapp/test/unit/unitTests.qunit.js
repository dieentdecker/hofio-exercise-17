/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"at/clouddna/training/FioriDeepDive/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});