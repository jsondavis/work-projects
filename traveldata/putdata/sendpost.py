import requests
import json


class SendCourse:
	'Common class for sending course data'
	
	headers = {'Content-Type': 'application/json'}
	url = 'http://travel.golfweek.com/course/api/courses/'

	courses = 0
	courses_posted = 0

	rejects = []

	def __init__(self, course_dict):
		self.course = course_dict


	def make_slug(self, name):
		return name.replace(" ", "-").lower()


	def check_course(self):
		if "name" not in self.course or self.course['name'] is "":
			SendCourse.rejects.append(self.course)
			return "No name", False
		if "name_slug" not in self.course or self.course['name_slug'] is "":
			self.course['name_slug'] = self.make_slug(self.course['name'])
		if "city" not in self.course or self.course['city'] is "":
			SendCourse.rejects.append(self.course)
			return "No city", False
		if "state" not in self.course or self.course['state'] is "":
			SendCourse.rejects.append(self.course)
			return "No state", False			
		if "zip" not in self.course or self.course['zip'] is "":
			SendCourse.rejects.append(self.course)
			return "No zip", False
		# maybe add something to fix the bad values
		return True


	def make_post(self):
		self.post = {}
		self.post['name'] = self.course['name']
		self.post['name_slug'] = self.course['name_slug']
		self.post['street'] = self.course['address']
		self.post['city'] = self.course['city']
		self.post['state_province'] = self.course['state']
		self.post['postal_code'] = self.course['zip']
		self.post['country'] = 'US'

		# self.post["course_par"] = ''
		# self.post["course_par_alt"] = ''
		# self.post["course_type"] = ""
		# self.post["course_yards"] = ''
		# self.post["created_date"] = "2014-10-20T11:05:48.225389"
		# self.post["designer"] = ""
		# self.post["display_date"] = "2014-10-20T11:05:48.225389"
		self.post["email_addr"] = self.course['email']
		# self.post["era"] = ""
		self.post["phone"] = self.course['phone number']
		# self.post["price_max"] = ''
		# self.post["price_min"] = ''
		# self.post["season"] = ""
		if self.course['twitter'] and self.course['twitter'][0] is '@':
			self.post["twitter"] = self.course['twitter']
		if self.course['facebook'] and self.course['facebook'] is not 'not listed on site':
			self.post["facebook"] = self.course['facebook']
		self.post["website"] = self.course['website']



	def send_post(self):
		print "Posting %s" % SendCourse.url
		self.post = json.dumps(self.post)
		print self.post
		r = requests.post(SendCourse.url, headers=SendCourse.headers, data=self.post)
		print r.status_code
		print r.text




testcourse = {"website": "http://www.aikengolfclub.com", "city": "Aiken", "twitter": "not listed on site", "name": "Aiken GC", "zip": "29801", "combined address": "Aiken", "par / yards": "", "phone number": "803.649.6029", "gps coordinates": "", "state": "SC", "facebook": "not listed on site", "price range /season": "", "email": "aikengc@gforcecable.com", "address": ""}


post = SendCourse(testcourse)

print post.check_course()
post.make_post()
# print post.post

#print json.dumps(post.post)

post.send_post()


# js test data
# var data = {'display_date': '2014-10-20T11:05:48.225389', 
# 'twitter': 'not listed on site', 
# 'street': '', 'postal_code': '29801', 
# 'course_par_alt': '', 'city': 'Aiken', 
# 'email_addr': 'aikengc@gforcecable.com', 
# 'price_min': '', 'website': 'http://www.aikengolfclub.com', 
# 'price_max': '', 'designer': '', 'season': '', 
# 'phone': '803.649.6029', 'facebook': 'not listed on site', 
# 'course_par': '', 'course_yards': '', 'state_province': 'SC', 
# 'name': 'Aiken GC', 'country': 'US', 
# 'course_type': '', 'name_slug': 'aiken-gc', 
# 'era': '', 'created_date': '2014-10-20T11:05:48.225389'
# }