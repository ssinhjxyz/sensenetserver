import crypt
import sys;

password = sys.argv[1];
encPass = crypt.crypt(password,"password")
print encPass;



