function findLargest() {
  // Get values from input fields
  let n1 = parseFloat(document.getElementById("num1").value);
  let n2 = parseFloat(document.getElementById("num2").value);
  let n3 = parseFloat(document.getElementById("num3").value);
  let n4 = parseFloat(document.getElementById("num4").value);
  let n5 = parseFloat(document.getElementById("num5").value);

  // Assume first number is largest
  let largest = n1;

  // Compare using if-else
  if (n2 > largest) {
    largest = n2;
  }
  if (n3 > largest) {
    largest = n3;
  }
  if (n4 > largest) {
    largest = n4;
  }
  if (n5 > largest) {
    largest = n5;
  }

  // Display result
  document.getElementById("result").innerHTML = "The largest number is: " + largest;
}
