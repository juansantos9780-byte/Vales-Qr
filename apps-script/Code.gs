/**
 * Backend para el registro de Vales QR.
 * Este script debe pegarse en Extensiones > Apps Script de la Google Sheet
 * donde se quiere guardar la información (script "contenedor" ligado a esa hoja).
 *
 * Recibe: nombre, convenio (o empresa), movil, fecha y, opcionalmente, origen y destino.
 * Guarda cada registro en una pestaña con el nombre del convenio, ordenada por fecha.
 */

var ENCABEZADOS = ['Fecha', 'Nombre', 'Móvil', 'Convenio', 'Dirección donde se encontraba', 'Dirección a la que se dirige'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var nombre = (data.nombre || '').toString().trim();
    var convenio = (data.convenio || data.empresa || 'Sin Convenio').toString().trim() || 'Sin Convenio';
    var movil = (data.movil || '').toString().trim();
    var fecha = (data.fecha || '').toString().trim();
    var origen = (data.origen || '').toString().trim();
    var destino = (data.destino || '').toString().trim();

    if (!nombre || !fecha) {
      return jsonResponse({ ok: false, error: 'Faltan datos obligatorios.' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = sanitizeSheetName(convenio);
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(ENCABEZADOS);
      sheet.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([fecha, nombre, movil, convenio, origen, destino]);
    sortSheet(sheet);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function sortSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 2) return;
  var range = sheet.getRange(2, 1, lastRow - 1, ENCABEZADOS.length);
  range.sort([
    { column: 1, ascending: true }, // Fecha
    { column: 2, ascending: true }, // Nombre
    { column: 3, ascending: true }, // Móvil
    { column: 5, ascending: true }, // Dirección origen
    { column: 6, ascending: true }  // Dirección destino
  ]);
}

function sanitizeSheetName(name) {
  var clean = name.replace(/[\/\\\?\*\[\]:]/g, '').substring(0, 90);
  return clean || 'Sin Convenio';
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
