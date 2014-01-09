// scdl-data-model-demo/index.js
// MIT by ChrisRus

// For writing output.json to the local filesystem.
var fs = require('fs');

// onm allows us to share data models via npm.
var onm = require('onm');

// onmd-scdl is an onm data model for something called SCDL.
var scdl = require('onmd-scdl');

// create an onm data model object for SCDL.
var scdlModel = new onm.Model(scdl.DataModel);

// create an onm data store object for SCDL.
var scdlStore = new onm.Store(scdlModel);

// Given the address of the root of an onm data component namespace,
// visit all of the component's extension point subnamespaces, create
// a new subcomponent instance in each extension point, and invoke this
// function recursively until there are no more extension points OR
// height_ >= limit_.
//
var createSubcomponents = function (address_, limit_, height_) {
    if (limit_ > height_) {
        address_.visitExtensionPointAddresses( function (address_) {
            var newComponentNamespace = scdlStore.createComponent(address_.createSubcomponentAddress());
            var newComponentAddress = newComponentNamespace.getResolvedAddress();
            console.log("+component: '" + newComponentAddress.getHashString() +"'");
            createSubcomponents(newComponentAddress, limit_, height_ + 1);
	});
    }
};

// Leverage onm data model introspection to "explode" the data
// component tree in scdlStore. See comments above.
createSubcomponents(scdlModel.createRootAddress(), 256/*limit*/, 0/*initial height*/);

// Serialize the test data to JSON and write to console.log.
scdlStoreJSON = scdlStore.toJSON(undefined, 2);

// Write the test data to file ./output.json
var filename = "./output.json";
fs.writeFile(filename, scdlStoreJSON, function (err) {
    if (err) return console.error("Failed to write file '" + filename + "'. Error: '" + err + "'");
    console.log(scdlStoreJSON);
    console.log("Created new SCDL data file: '" + filename + "'");
});

