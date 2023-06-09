// The main.js file of your application
module.exports = function (app) {
    //this calls the home page. it passes the title and header to the template to dynamically change them.
    app.get("/", function (req, res) {
        res.render("home.html", {
            title: "Smart Home Connector",
            header: "Welcome to the Smart Home Connector App"
        });
    });

    //the about page
    app.get("/about", function (req, res) {
        res.render("about.html");
    });

    //the add new device page for selecting the device type
    app.get("/add", function (req, res) {
        // query database to get all the device names
        let sqlquery1 = "SELECT * FROM deviceList";
        
        // execute sql query
        db.query(sqlquery1, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("add.html", { availableDevice: result });
        });
        
    });

    //this is the second add device page for collecting the device settings
    app.post("/add-device", function (req, res) {
        // query database to get all the device names and join them to the corresponding available device settings
        //to build a dynamic form
        let sqlquery1 = "SELECT * FROM deviceList INNER JOIN deviceSettings ON deviceList.id = deviceSettings.deviceID";
        // execute sql query
        db.query(sqlquery1, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("add-device.html", { availableDevice: result, chosenDevice: req.body.device});
        });

    });

    //this is the 3rd and final add device page it saves the device settings in the database
    app.post("/add-results", function (req, res) {
        // saving data in database recieves the setting values and stores them, any value not recieved is stored as null
        let sqlquery = "INSERT INTO userDevices (deviceID, settingID, power, open, locked, volume, temperature, channel) VALUES (?,?,?,?,?,?,?,?)";
        // execute sql query
        let newrecord = [req.body.device,
            req.body.device,
            req.body.power,
            req.body.open,
            req.body.locked,
            req.body.volume,
            req.body.temperature,
            req.body.channel];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else
                res.render("deviceAdded.html");
        });
    });

    //displays all user added devices
    app.get("/status", function (req, res) {
        // query database to get all the device names and joins them to the corrisponding user devices
        let sqlquery = "SELECT * FROM deviceList INNER JOIN userDevices ON deviceList.id = userDevices.deviceID";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("status.html", { availableDevice: result, count: 0 });
        });
    });

    //the 2nd device status page dynamically builds a display of the selected device settings
    //also populates the option to update the device or delete it.
    app.post("/device-settings", function (req, res) {
        // query database to get all the device names and joins them to the corrisponding user devices
        let sqlquery = "SELECT * FROM deviceList INNER JOIN userDevices ON deviceList.id = userDevices.deviceID";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("device-settings.html", { availableDevice: result,deviceSettings:req.body.deviceSettings});
        });
    });

    //the update device page. dynamically builds a form to capture the new device settings
    app.post("/update", function (req, res) {
        // query database to get all the device names and joins them to the corrisponding user devices
        let sqlquery = "SELECT * FROM deviceList INNER JOIN userDevices ON deviceList.id = userDevices.deviceID";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("update.html", { availableDevice: result, updateDevice: req.body.deviceToUpdate });
        });
    });

    //the 2nd update device page. Updates the data and calls the deviceUpdated page to confirm the device has been updated
    app.post("/update-device", function (req, res) {
        // saving new device values in the database replacing the old ones in the same location
        let sqlquery = "UPDATE userDevices SET power=?, open=?, locked=?, volume=?, temperature=?, channel=? WHERE id = ?";
        // execute sql query
        let newrecord = [req.body.power,
        req.body.open,
        req.body.locked,
        req.body.volume,
        req.body.temperature,
        req.body.channel,
        req.body.id];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else
                res.render("deviceUpdated.html");
        });
    });

    //the remove device page
    app.post("/delete", function (req, res) {
        // query database to delete the device row the corresponds to the submitted ID
        let sqlquery = "DELETE FROM userDevices WHERE id = ?";
        // execute sql query
        db.query(sqlquery, req.body.deviceToDelete, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("delete.html", { deleteDevice: req.body });
        });
    });
    
}