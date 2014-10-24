import requests
import json
import csv


class SendCourse:
	'Common class for sending course data'
	
	headers = {'Content-Type': 'application/json'}
	url = 'http://travel.golfweek.com/course/api/courses/'

	courses = 0
	courses_posted = 0

	rejects = []
	fails = []

	def __init__(self, course_dict):
		self.course = course_dict


	def make_slug(self, name):
		return name.replace(" ", "-").lower()


	def check_course(self):
		if "name" not in self.course or self.course['name'] is "":
			self.course['Reject Reason'] = 'No Name'
			SendCourse.rejects.append(self.course)
			return False
		if "name_slug" not in self.course or self.course['name_slug'] is "":
			self.course['name_slug'] = self.make_slug(self.course['name'])
		if "city" not in self.course or self.course['city'] is "":
			self.course['Reject Reason'] = 'No City'
			SendCourse.rejects.append(self.course)
			return False
		if "state" not in self.course or self.course['state'] is "":
			self.course['Reject Reason'] = 'No State'
			SendCourse.rejects.append(self.course)
			return False
		if "zip" not in self.course or self.course['zip'] is "":
			self.course['Reject Reason'] = 'No Zip'
			SendCourse.rejects.append(self.course)
			return False
		return True


	def make_post(self):
		self.post = {}
		try:
			self.post['name'] = self.course['name']
			self.post['name_slug'] = self.course['name_slug']
			self.post['street'] = self.course['address']
			self.post['city'] = self.course['city']
			self.post['state_province'] = self.course['state']
			self.post['postal_code'] = self.course['zip']
			self.post['country'] = 'US'
			self.post["email_addr"] = self.course['email']
			self.post["phone"] = self.course['phone number']

			if self.course['twitter'] and self.course['twitter'][0] is '@':
				self.post["twitter"] = self.course['twitter']
			if self.course['facebook'] and self.course['facebook'] is not 'not listed on site':
				self.post["facebook"] = self.course['facebook']
			self.post["website"] = self.course['website']
		except Exception:
			SendCourse.rejects.append(self.course)
			return False
		
		self.post = json.dumps(self.post)
		return True


	def send_post(self):
		r = requests.post(SendCourse.url, headers=SendCourse.headers, data=self.post)
		if r.status_code is not 201:
			SendCourse.fails.append(self.course)
			return False
		SendCourse.courses_posted += 1
		return True



	def make_fail_file(self):
		if len(SendCourse.fails) > 0:
			failFile = open('./fails.csv', 'wb')
			keys = [key for key in SendCourse.fails[0]]
			wr = csv.DictWriter(failFile, delimiter=',', fieldnames=keys)
			wr.writerows(SendCourse.fails)


	def make_reject_file(self):
		if len(SendCourse.rejects) > 0:
			rejectFile = open('./rejects.csv', 'wb')
			keys = [key for key in SendCourse.rejects[0]]
			wr = csv.DictWriter(rejectFile, delimiter=',', fieldnames=keys)		
			wr.writerows(SendCourse.rejects)


	def do_it(self):
		
		check = self.check_course()
		if check:
			make = self.make_post()
			if make:
				self.make_reject_file()
				self.make_fail_file()
				return self.send_post()


# testcourse = {"website": "http://www.aikengolfclub.com", "city": "Aiken", "twitter": "not listed on site", "name": "Aiken GC", "zip": "29801", "combined address": "Aiken", "par / yards": "", "phone number": "803.649.6029", "gps coordinates": "", "state": "SC", "facebook": "not listed on site", "price range /season": "", "email": "aikengc@gforcecable.com", "address": ""}


# post = SendCourse(testcourse)
# post.do_it()

# print post.check_course()
# post.make_post()
# print post.post

# print json.dumps(post.post)

# post.send_post()