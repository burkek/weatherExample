import unittest
import json
import datetime
from tornado.testing import AsyncHTTPClient, AsyncTestCase
from tornado.web import Application
from tornado import gen, httpclient
from tornado.testing import AsyncHTTPTestCase, gen_test

# This test uses coroutine make sure the gen_test descorator is used
class WeatherTestCase(AsyncTestCase):

    @gen_test
    def test_get_weather(self):
        client = AsyncHTTPClient()
        # first check to see we get a bad response when no city id passed
        try:
        	response = yield client.fetch("http://localhost:3000/get_weather")
        	# should never reach here but if it does, 
        	# the code should not be 200 (all good response)
        	self.assertNotEqual(200, response.code)
        # expect a 400 error response	
        except httpclient.HTTPClientError:
        	# we got it so ignore it
        	pass
        # try again, this time with a city ID
        response = yield client.fetch("http://localhost:3000/get_weather?city_id=6173331")
        self.assertEqual(200, response.code)
        weather_info = json.loads(response.body)

        # loop all weather updates in the response object
        # ensure each object has the keys the app will look for
        for update in weather_info:
        	self.assertIn("weather", update)
        	# ensure there is at least 1 weather object
        	self.assertTrue(len(update['weather']) > 0)
        	self.assertIn("main", update['weather'][0])
        	self.assertIn("icon", update['weather'][0])
        	self.assertIn("description", update['weather'][0])

        	self.assertIn("main", update)
        	self.assertIn("temp", update['main'])
        	self.assertIn("humidity", update['main'])

        	# test the date string
        	self.assertIn("dt_txt", update)
        	# should look like YYYY-MM-DD HH:MM:SS
        	try:
        		date_object = datetime.datetime.strptime(update['dt_txt'], "%Y-%m-%d %H:%M:%S")
        	except ValueError:
        		self.fail('date string format incorrect. %s '
        				'does not match YYYY-MM-DD HH:MM:SS' % update['dt_txt'])

        	self.assertTrue(isinstance(date_object, datetime.datetime))

if __name__ == '__main__':
    unittest.main()