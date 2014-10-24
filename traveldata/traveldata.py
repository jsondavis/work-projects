import json
from putdata import SendCourse


postCourse = SendCourse.SendCourse

datafile = open('./getdata/data.json', 'r')

courses = json.load(datafile)

# print len(courses)

for course in courses:
	post = postCourse(course)
	post.do_it()

print "%d courses posted" % postCourse.courses_posted
print "%d courses rejected" % len(postCourse.rejects)
print "%d courses failed" % len(postCourse.fails)