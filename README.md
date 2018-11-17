"# homebridge-yamaha_mc2" 
Based on the Yamaha Extended Control API Spec (https://github.com/samvdb/php-musiccast-api/blob/master/yxc-api-spec-advanced.pdf)
With this homebridge module you can control your Yamaha Networked devices, in my case MusicCast devices. 
This homebridge module is an alternative for homebridge-yamaha_mc. Since I configured it as a lightbulb you can also set the volume (brightness :) )
beside setting it on and off. This because the Apple Homekit does not support speakers yet. Just name your device as speaker or what you like, in Homekit.
And control your music by talking to Siri: "Set my amplifier to 25%", "Put off my speaker", "Set my speaker lower" (words used for lightbulbs...)
Enjoy!
 
 
Add this to the config.json, for each device you want to add. Just adjust the name and the IP address for each accessory. 
The zone 'main' in general should work, not to be confused with room names.
For my Yamaha RN-602 the maximum volume setting is 161, for the WX-030 and the WX-010 it is 60. 
Check the max volume setting by using this url in your homenetwork: http://192.168.1.220/YamahaExtendedControl/v1/main/getStatus (with your own Yamaha IP address of course, set it static via the http interface)
Find the value at "max_volume", in the JSON string result.
Add as much speakers you have as a new accessory:

"accessories": [
        {
          "accessory": "YamahaMC",
          "name": "Yamaha RN-602",
          "host": "192.168.1.210",
          "zone": "main",
		  "maxvol":161
        },
        {         
          "accessory": "YamahaMC",
          "name": "Yamaha WX-030",
          "host": "192.168.1.220",
          "zone": "main",
		  "maxvol":60
        }   
]
