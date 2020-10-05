# hbr

This is the default view engine of the most updated MVC web framework[xprezzo](https://github.com/xprezzo/xprezzo) using [handlebars.js](https://handlebarsjs.com/)


## Use ##

Using *hbr* as the default view engine requires just one line of code in your app setup. This will render `.hbr` files when `res.render` is called.

```javascript
app.set('view engine', 'hbr');
```

To use a different extension (i.e. html) for your template files:

```javascript
app.set('view engine', 'html');
app.engine('html', require('hbr').__express);
```

## Helpers and Partials ##

hbr exposes the `registerHelper` and `registerPartial` method from handlebars.

```javascript
var hbr = require('hbr');

hbr.registerHelper('helper_name', function(...) { ... });
hbr.registerPartial('partial_name', 'partial value');
```

For convenience, `registerPartials` provides a quick way to load all partials from a specific directory:

```javascript
var hbr = require('hbr');

hbr.registerPartials(__dirname + '/views/partials' [, callback]);
```

Partials that are loaded from a directory are named based on their filename, where spaces and hyphens are replaced with an underscore character:

```
template.html      -> {{> template}}
template 2.html    -> {{> template_2}}
login view.hbr     -> {{> login_view}}
template-file.html -> {{> template_file}}
```

See the [handlebars.js documentation](https://handlebarsjs.com/) for more
information.

**Note:** This method is async; meaning that the directory is walked in a non-blocking manner to app startup.

## Exposing locals as template data ##

hbr has the ability to expose the application and request locals within any context inside a view. To enable this functionality, simply call the `localsAsTemplateData` method and pass in your Express application instance.

```javascript
var hbr = require('hbr');
var xprezzo = require('xprezzo');

var app = xprezzo();
hbr.localsAsTemplateData(app);

app.locals.foo = "bar";
```

The local data can then be accessed using the `@property` syntax:

```
top level: {{@foo}}
{{#each items}}
  {{label}}: {{@foo}}
{{/each}}
```
Note: In partials and templates, local data can be accessed without using `@` prefix.

## handlebars ##

The handlebars require used by hbr can be accessed via the `handlebars` property on the `hbr` module.

If you wish to use handlebars methods like `SafeString` please do so on this property. Do not register helpers or partials in this way.

```
// hbr.handlebars is the handlebars module
hbr.handlebars === require('handlebars');
```

## Recipes ##

### more than one instance ###
You can create isolated instances of hbr using the `create()` function on the module object.

```
var hbr = require('handlegrip');

var instance1 = hbr.create();
var instance2 = hbr.create();

app.engine('html', instance1.__express);
app.engine('hbr', instance2.__express);
```

Each instance has the same methods/properties as the `hbr` module object. The module object is actually just an instance created for you automatically.

## People

Xprezzo is maintained by [Ben Ajenoui](mailto:info@seoher.io) and sponsored by [SEO Hero](https://www.seohero.io).
