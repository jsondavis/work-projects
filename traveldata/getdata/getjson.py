import csv
import json

csvfile = open('data.csv', 'r')
outfile = open('data.json', 'w')

#fields = ("Name ","Email","Phone Number","Address", "City"," State","Zip","Website","GPS Coordinates","Par / Yards","Price Range /season","Rank State by State","Rank Best Resort Courses","Rank Modern Courses","Classic Couses","Twitter","Facebook")

reader = csv.DictReader(csvfile)

out = []

for row in reader:
	out.append(row)


out = json.dumps(out[1:])





def lower_keys(x):
	if isinstance(x, list):
		return [lower_keys(v) for v in x]
	if isinstance(x, dict):
		return dict((k.strip().lower(), lower_keys(v)) for k, v in x.iteritems())
	return x

newout = []

for i in json.loads(out):
	newout.append(lower_keys(i))


outfile.write(json.dumps(newout))