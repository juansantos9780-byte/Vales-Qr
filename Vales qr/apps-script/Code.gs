/**
 * Backend para el registro de Vales QR.
 * Este script debe pegarse en Extensiones > Apps Script de la Google Sheet
 * donde se quiere guardar la información (script "contenedor" ligado a esa hoja).
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var nombre = (data.nombre || '').toString().trim();
    var empresa = (data.empresa || 'Sin Empresa').toString().trim() || 'Sin Empresa';
    var fecha = (data.fecha || '').toString().trim();
    var origen = (data.origen || '').toString().trim();
    var destino = (data.destino || '').toString().trim();

    if (!nombre || !fecha || !origen || !destino) {
      return jsonResponse({ ok: false, error: 'Faltan datos obligatorios.' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = sanitizeSheetName(empresa);
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Fecha', 'Nombre', 'Dirección donde se encontraba', 'Dirección a la que se dirige', 'Empresa']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.autoResizeColumns(1, 5);
    }

    sheet.appendRow([fecha, nombre, origen, destino, empresa]);
    sortSheet(sheet);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function sortSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 2) return;
  var range = sheet.getRange(2, 1, lastRow - 1, 5);
  range.sort([
    { column: 1, ascending: true }, // Fecha
    { column: 2, ascending: true }, // Nombre
    { column: 3, ascending: true }, // Dirección origen
    { column: 4, ascending: true }  // Dirección destino
  ]);
}

function sanitizeSheetName(name) {
  var clean = name.replace(/[\/\\\?\*\[\]:]/g, '').substring(0, 90);
  return clean || 'Sin Empresa';
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
