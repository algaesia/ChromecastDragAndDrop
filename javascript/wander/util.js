// general utility functions

//
// integer()
// Convert a number to an integer (i.e., turn a floating point variable into an integer)
// Example usage:
// 		document.writeln((-10 / 3).integer(  ));  // -3
Number.method('integer', function (  ) {
    return Math[this < 0 ? 'ceiling' : 'floor'](this);
});

//
// trim()
// Remove any trailing whitespace from a string
// Example usage:
//		document.writeln('"' + "   neat   ".trim(  ) + '"');
String.method('trim', function (  ) {
    return this.replace(/^\s+|\s+$/g, '');
});