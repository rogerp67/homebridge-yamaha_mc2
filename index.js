var Service, Characteristic;

const request = require('request');
const url = require('url');
 
var yamaha;
var maxvol;



module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-yamaha_mc", "YamahaMC", Yamaha_mcAccessory);
}

function Yamaha_mcAccessory(log, config) {
  this.currentState = false;
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.zone = config["zone"];
  getLightBulbMaxVolCharacteristic(); // sets maxvol variabele dynamically by asking Yamaha device
}

Yamaha_mcAccessory.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Cambit")
      .setCharacteristic(Characteristic.Model, "Yamaha MC")
      .setCharacteristic(Characteristic.SerialNumber, "6710160330");
 
    let lightbulbService = new Service.Lightbulb("Amplifier");
    lightbulbService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getLightBulbOnCharacteristic.bind(this))
        .on('set', this.setLightBulbOnCharacteristic.bind(this));

    lightbulbService
      .getCharacteristic(Characteristic.Brightness) // Volume!!
        .on('get', this.getLightBulbBrightnessCharacteristic.bind(this))
        .on('set', this.setLightBulbBrightnessCharacteristic.bind(this));

    this.informationService = informationService;
    this.lightbulbService = lightbulbService;
    return [informationService, lightbulbService];
  },
  
  getLightBulbOnCharacteristic: function (next) {
    const me = this;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  me.log('HTTP GetStatus result:' + (att.power=='on' ? "On" : "Off"));
      return next(null, (att.power=='on'));
    });
  },
   
  setLightBulbOnCharacteristic: function (on, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (on ? 'on' : 'standby');
	const me = this;
    request({
      url: url  ,
      method: 'GET',
      body: ""
    },
    function (error, response) {
      if (error) {
        //me.log('error with HTTP url='+url);
        me.log(error.message);
        return next(error);
      }
	  //me.log('HTTP setPower succeeded with url:' + url);
      return next();
    });
  },
  
  // speaker characteristics
   getLightBulbMaxVolCharacteristic: function (next) {
    const me = this;
	var res;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  res = att.max_volume;
	  maxvol = att.max_volume;
	  me.log('HTTP GetStatus result:' + res);
      return next(null, res);
    });
  }, 
  
  getLightBulbBrightnessCharacteristic: function (next) {
    const me = this;
	var res;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  res = Math.floor(att.volume / maxvol * 100);
	  me.log('HTTP GetStatus result:' + res);
      return next(null, res);
    });
  },
   
  setLightBulbBrightnessCharacteristic: function (volume, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + Math.floor(volume/100 * maxvol);
	const me = this;
    request({
      url: url  ,
      method: 'GET',
      body: ""
    },
    function (error, response) {
      if (error) {
        //me.log('error with HTTP url='+url);
        me.log(error.message);
        return next(error);
      }
	  //me.log('HTTP setVolume succeeded with url:' + url);
      return next();
    });
  }
};
