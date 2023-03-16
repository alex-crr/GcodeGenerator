  function hideStuff(condition, element){
    condition ? element.style.display = 'none' : element.style.display = 'block'
}

//inputs

var xAxisSize = parseInt(document.getElementById('x-axis').value);
var yAxisSize = parseInt(document.getElementById('y-axis').value);

const purgeLineLengthNumberELT = document.getElementById('length-purge-line');
var purgeLineLengthNumber = parseInt(document.getElementById('length-purge-line').value);
var purgeLineLocationSelect = document.getElementById('purge-location').value;

// checkboxes
const nozzleTempSlicerCheckbox = document.getElementById('nozzle-temp-slicer');
const bedTempSlicerCheckbox = document.getElementById('bed-temp-slicer');

const bedLevelingCheckbox = document.getElementById('enable-mesh')
const loadMeshCheckbox = document.getElementById("load-mesh")
const performMeshCheckbox = document.getElementById("perform-mesh")
const purgeLineCheckbox = document.getElementById('purge-line')
const purgeBlobCheckbox = document.getElementById('purge-blob');

const customMessageCheckbox = document.getElementById('custom-message-checkbox')

//labels
const nozzleTempLabel = document.getElementById("nozzle-temp-settings-label");
const bedTempLabel = document.getElementById("bed-temp-settings-label");

const purgeBlobRelativeLabel = document.getElementById('purge-blob-location-relative-label');
const purgeBlobAbsoluteLabel = document.getElementById('purge-blob-location-absolute-label');

const customMessageLabel = document.getElementById('custom-message-label');



//sections
const levelingSection = document.getElementById('mesh-settings')
const meshSection = document.getElementById('perform-mesh-section')
const ablSection = document.getElementById('ABL-section')
const purgeLineSection = document.getElementById('purge-line-section')


//on the initial load
window.addEventListener('load', function() {
    // NOZZLE
    hideStuff(nozzleTempSlicerCheckbox.checked, nozzleTempLabel);

    //BED
    hideStuff(bedTempSlicerCheckbox.checked, bedTempLabel);

    //leveling section 
    hideStuff(! bedLevelingCheckbox.checked, levelingSection);

    //ABL
    hideStuff(loadMeshCheckbox.checked, ablSection);

    //load mesh
    hideStuff(performMeshCheckbox.checked, meshSection);

    hideStuff(! purgeLineCheckbox.checked, purgeLineSection)

    hideStuff( !purgeLineCheckbox.checked || !purgeBlobCheckbox.checked, purgeBlobRelativeLabel)

    hideStuff( purgeLineCheckbox.checked || !purgeBlobCheckbox.checked, purgeBlobAbsoluteLabel)

    hideStuff( !customMessageCheckbox.checked, customMessageLabel);

  });

// when nozzle changes
nozzleTempSlicerCheckbox.addEventListener('change', function() {
  hideStuff(this.checked, nozzleTempLabel);

});

// when bed changes
bedTempSlicerCheckbox.addEventListener('change', function() {
    hideStuff(this.checked, bedTempLabel);
});

// when ABL is defined
bedLevelingCheckbox.addEventListener('change', function(){
    hideStuff(! this.checked, levelingSection);
})

loadMeshCheckbox.addEventListener('change', function(){
  hideStuff(this.checked, ablSection);
})

performMeshCheckbox.addEventListener('change', function(){
  hideStuff(performMeshCheckbox.checked, meshSection);
})

//when purge line changes
purgeLineCheckbox.addEventListener('change', function(){
  hideStuff(! this.checked, purgeLineSection);

  hideStuff( !this.checked || !purgeBlobCheckbox.checked, purgeBlobRelativeLabel)

  hideStuff( this.checked || !purgeBlobCheckbox.checked, purgeBlobAbsoluteLabel)
})

//when purge blob changes
purgeBlobCheckbox.addEventListener('change', function(){

  hideStuff( !purgeLineCheckbox.checked || !this.checked, purgeBlobRelativeLabel)

  hideStuff( purgeLineCheckbox.checked || !this.checked, purgeBlobAbsoluteLabel)
})

//when custom message is selected
customMessageCheckbox.addEventListener('change', function(){
  hideStuff(! this.checked, customMessageLabel);
})