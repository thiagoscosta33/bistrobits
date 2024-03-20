const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('capitalizeFirstLetter', function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  });
  

module.exports = Handlebars.helpers;
