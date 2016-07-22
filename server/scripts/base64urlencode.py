import sys;
import base64;

string = sys.argv[1];
base64encString = base64.urlsafe_b64encode(string);
print base64encString;
