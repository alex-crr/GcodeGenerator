var gcode = "";
var copyButton = document.getElementById("Copy")
const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};

function generateGCODE() {
  var gcode = "";
  ///////////////////////////////////// RETRIEVE ALL INPUTS ////////////////////////////////////////////////////
  // machine settings
  var units = document.getElementById("units").checked;
  var xAxisSize = parseInt(document.getElementById('x-axis').value);
  var yAxisSize = parseInt(document.getElementById('y-axis').value);
  var nozzleSizeSelect = parseFloat(document.getElementById('nozzle-size').value);
  var layerHeightSelect = document.getElementById('layer-height').value;
  var layerHeight = parseFloat(document.getElementById('layer-height').value);
  var filamentDiameterSelect = parseFloat(document.getElementById('filament-diameter').value);
  var customMarginNumber = parseInt(document.getElementById('custom-margin').value);
  var retractionLengthNumber = parseFloat(document.getElementById('retraction-length').value);

  //thermal settings
  var nozzleTempSlicerCheckbox = document.getElementById('nozzle-temp-slicer').checked;
  var nozzleTempSettingNumber = parseInt(document.getElementById('nozzle-temp-settings').value);
  var bedTempSlicerCheckbox = document.getElementById('bed-temp-slicer').checked;
  var bedTempSettingNumber = parseInt(document.getElementById('bed-temp-settings').value);

  //bed alignment
  var g34Checkbox = document.getElementById("g34").checked;
  var enableMeshCheckbox = document.getElementById('enable-mesh').checked;
  var loadMeshCheckbox = document.getElementById('load-mesh').checked;
  var performMeshCheckbox = document.getElementById('perform-mesh').checked;

  //purge
  var purgeLineCheckbox = document.getElementById('purge-line').checked;
  var purgeLineLengthNumber = parseInt(document.getElementById('length-purge-line').value);
  var purgeLineNumber = parseInt(document.getElementById('number-purge-line').value);
  var purgeLineLocationSelect = document.getElementById('purge-location').value;

  var purgeBlobCheckbox = document.getElementById('purge-blob').checked;
  var purgeBlobRelativeSelect = document.getElementById('purge-blob-location-relative').value;
  var purgeBlobAbsoluteSelect = document.getElementById('purge-blob-location-absolute').value;

  //custom message

  var customMessageCheckbox = document.getElementById('custom-message-checkbox').checked;
  var customMessage = document.getElementById('custom-message').value;

  /////////////////////////////////////////GCODE GENERATION/////////////////////////////////////////////////////////////////////////////////////
  console.log("js");

  // settings
  gcode += ";\n";
  gcode += "; The following GCODE was developed using https://ammon-prints.netlify.app/\n";
  gcode += ";\n";
  gcode += "\n; Settings\n\n"
  gcode += "M82 ;absolute extrusion mode\n";
  units ? gcode += "G20 ;imperial values\n" : gcode += "G21 ;metric values\n" // Decides wich units system to use.
  gcode += "G90 ;absolute positioning\nM82 ;set extruder to absolute mode\nM107 ;start with the fan off\n";

  gcode += "G28 X0 Y0 ;move X/Y to min endstops\nG28 Z0 ;move Z to min endstop\n";

  // thermals
  gcode += "\n; Thermals\n\n"
  var bedHeat;
  var nozzleHeat;
  nozzleTempSlicerCheckbox ? nozzleHeat = "S{material_print_temperature_layer_0}" : nozzleHeat = "S" + nozzleTempSettingNumber;
  bedTempSlicerCheckbox ? bedHeat = "S{material_bed_temperature_layer_0}" : bedHeat = "S" + bedTempSettingNumber;

  gcode += "M140 " + bedHeat + " ; Set bed temperature\n";
  gcode += "M104 S150 ; Wait for hotend to reach low temperature\n";
  gcode += "M190 " + bedHeat + " ; Wait for bed temperature\n";
  gcode += "M109" + nozzleHeat + " ; Wait for hotend temperature\n";

  // Bed Prepping
  gcode += "\n; Bed Prepping\n\n"
  g34Checkbox ? gcode += "G34 ; Perform Z-alignment\n" : gcode;

  if (enableMeshCheckbox) {
    if (loadMeshCheckbox) {
      gcode += "M420 S1 ; loads previously saved mesh\n";
    }
    else if (performMeshCheckbox) {
      gcode += "G29 ; Proceeds to do ABL\n"
    }
  }

  // Purge line
  gcode += "\n; Purge Line\n\n"
  if (purgeLineCheckbox) {
    if ((purgeLineLocationSelect == "front" || purgeLineLocationSelect == "back") && purgeLineLengthNumber > xAxisSize - 2
      * customMarginNumber) {
      document.getElementById('length-purge-line').style.background = "red";
      throw ("Purge line: the purge line length cannot be greater than the length of the axis it is situated on, minus a 10mm margin on each side.")
    }
    else if ((purgeLineLocationSelect == "right" || purgeLineLocationSelect == "left") && purgeLineLengthNumber > yAxisSize - 2 * customMarginNumber) {
      document.getElementById('length-purge-line').style.background = "red";
      throw ("Purge line: the purge line length cannot be greater than the length of the axis it is situated on, minus a 10mm margin on each side.")
    }
    else {
      document.getElementById('length-purge-line').style.background = "white";
      var xStart;
      var yStart;
      var xEnd;
      var yEnd;

      switch (purgeLineLocationSelect) {
        case "front":
          xStart = customMarginNumber;
          yStart = customMarginNumber;
          xEnd = xStart + purgeLineLengthNumber;
          yEnd = yStart
          break;
        case "back":
          xStart = customMarginNumber;
          yStart = yAxisSize - customMarginNumber;
          xEnd = xStart + purgeLineLengthNumber;
          yEnd = yStart;
          break;
        case "right":
          xStart = xAxisSize - customMarginNumber;
          yStart = customMarginNumber;
          xEnd = xStart;
          yEnd = yStart + purgeLineLengthNumber;
          break;
        case "left":
          xStart = customMarginNumber;
          yStart = customMarginNumber;
          xEnd = xStart;
          yEnd = yStart + purgeLineLengthNumber;
          break;
        default:
          console.log("Purge line location: how the hell did you do that.");
          break;
      }

      var extrusionLength = (purgeLineLengthNumber * nozzleSizeSelect * layerHeight) / (Math.PI * Math.pow(filamentDiameterSelect / 2, 2));
      extrusionLength = parseFloat(extrusionLength.toFixed(2));

      gcode += `G0 X${xStart} Y${yStart} F9000; move to the purge line starter\n`;
      gcode += `G0 Z${layerHeight}; move to Z-heigth\n`;
      gcode += "G92 E0; zero the extruded length\n";
      gcode += `G0 X${xEnd} Y${yEnd} E${extrusionLength} F500; print purge line\n`
      gcode += "G92 E0; zero the extruded length\n";

      if (purgeLineNumber == 2) {
        [xStart, xEnd] = [xEnd, xStart];
        [yStart, yEnd] = [yEnd, yStart];
        switch (purgeLineLocationSelect) {
          case "front":
            yStart += nozzleSizeSelect;
            yEnd += nozzleSizeSelect;
            break;
          case "back":
            yStart -= nozzleSizeSelect;
            yEnd -= nozzleSizeSelect;
            break;
          case "right":
            xStart += nozzleSizeSelect;
            xEnd += nozzleSizeSelect;
            break;
          case "left":
            xStart -= nozzleSizeSelect;
            xEnd -= nozzleSizeSelect;
            break;
          default:
            console.log("Purge line location: how the hell did you do that.");
            break;
        }

        gcode += `G0 X${xStart} Y${yStart} F9000; move to the second purge line starter\n`;
        gcode += `G0 Z${layerHeight}; move to Z-heigth\n`;
        gcode += "G92 E0; zero the extruded length\n";
        gcode += `G0 X${xEnd} Y${yEnd} E${extrusionLength} F500; print purge line\n`
        gcode += "G92 E0; zero the extruded length\n";
      }
      
      gcode += `G1 E${retractionLengthNumber} F500 ; Retract a little\n`;

      var xMiddle = trunc(xAxisSize / 2);
      var yMiddle = trunc(yAxisSize / 2);

      dX = Math.abs(xMiddle - xEnd);
      dY = Math.abs(yMiddle - yEnd);

      
    }


    if (customMessageCheckbox) {
      gcode += "M117 " + customMessage + "; Custom message\n";
    }

    gcode += ";\n; End of the Start GCODE\n;\n"

    return gcode;
  }
}

copyButton.onclick = () => {
  // Retrieve the value you want to copy to clipboard
  try {
    const gcode = generateGCODE();

    // Call the copyToClipboard function
    copyToClipboard(gcode)
      .then(() => {
        console.log('GCODE copied to clipboard successfully');
      })
      .catch(err => {
        console.error('Failed to copy GCODE to clipboard: ', err);
      });
  }
  catch (e) {
    console.log(e);
  }
}