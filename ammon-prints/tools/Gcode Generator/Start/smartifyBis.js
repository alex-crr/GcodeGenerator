// Get input elements
const xAxisSizeInput = document.getElementById('x-axis');
const yAxisSizeInput = document.getElementById('y-axis');
const purgeLineLengthInput = document.getElementById('length-purge-line');
const purgeLocationSelect = document.getElementById('purge-location');
//const copyButton = document.getElementById('Copy');

// Define function to check purge line length
function checkPurgeLineLength() {
  // Get current values
  const xAxisSize = parseInt(xAxisSizeInput.value);
  const yAxisSize = parseInt(yAxisSizeInput.value);
  const purgeLineLength = parseInt(purgeLineLengthInput.value);
  const purgeLocation = purgeLocationSelect.value;
  
  // Check if purge line length is greater than axis size
  if ((purgeLocation === 'front' || purgeLocation === 'back') && purgeLineLength > xAxisSize) {
    // Highlight input in red
    purgeLineLengthInput.style.border = '1px solid red';
    // Disable copy button
    copyButton.disabled = true;
    // Add text to notify user of invalid input
    const warningText = document.createElement('span');
    warningText.textContent = 'Purge line length is greater than X axis size!';
    warningText.style.color = 'red';
    purgeLineLengthInput.parentNode.insertBefore(warningText, purgeLineLengthInput.nextSibling);
  } else if ((purgeLocation === 'left' || purgeLocation === 'right') && purgeLineLength > yAxisSize) {
    // Highlight input in red
    purgeLineLengthInput.style.border = '1px solid red';
    // Disable copy button
    copyButton.disabled = true;
    // Add text to notify user of invalid input
    const warningText = document.createElement('span');
    warningText.textContent = 'Purge line length is greater than Y axis size!';
    warningText.style.color = 'red';
    purgeLineLengthInput.parentNode.insertBefore(warningText, purgeLineLengthInput.nextSibling);
  } else {
    // Remove red border and warning text
    purgeLineLengthInput.style.border = '';
    const warningText = purgeLineLengthInput.nextSibling;
    if (warningText && warningText.textContent.includes('Purge line length is')) {
      warningText.remove();
    }
    // Enable copy button
    copyButton.disabled = false;
  }
}

// Call checkPurgeLineLength on input change
xAxisSizeInput.addEventListener('input', checkPurgeLineLength);
yAxisSizeInput.addEventListener('input', checkPurgeLineLength);
purgeLineLengthInput.addEventListener('input', checkPurgeLineLength);
purgeLocationSelect.addEventListener('change', checkPurgeLineLength);
