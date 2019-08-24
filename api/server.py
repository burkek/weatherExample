from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import json
import requests
import os

api_token = '173f5ac640013a0dbca32c1ba0334ead'
api_url_base = 'http://api.openweathermap.org/data/2.5/forecast/'

class WeatherHandler(RequestHandler):
    def set_default_headers(self):
        """Allow CORS in case the html file is being run via PHP
        """
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

    def get(self):
        """downloads the latest weather info from the Open Weather API
        then writes a JSON string containing the 'list' object returned
        by Open Weather. See Open Weather docs for more info
        """

        city_id = self.get_argument('city_id', None)

        # must supply a city id
        if city_id is None:
            self.set_status(400)
            self.write("please supply a City ID")
            return

        # setup the url for Open Weather API
        api_url = '{}?id={}&APPID={}'.format(api_url_base, city_id, api_token)
        # send a request to the api, expecting a JSON response
        headers = {'Content-Type': 'application/json'}
        response = requests.get(api_url, headers=headers)
        # all good, parse the response json
        if response.status_code == 200:
            weather_info = json.loads(response.content)
            self.set_header("Content-Type", 'application/json')
            # expected output is the list obnject from the response json
            self.write(json.dumps(weather_info['list']))
        else:
            # something went wrong, display Open Weathers message
            self.write(response.content)

  
if __name__ == '__main__':
    urls = [("/get_weather", WeatherHandler)]
    app =  Application(urls, debug=True)
    app.listen(3000)
    IOLoop.instance().start()