#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
import shlex
import subprocess
import shutil
from functools import partial

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def send_ok_header(self, contentlen, contenttype="text/plain"):
        self.send_response(200)
        self.send_header("Content-type", contenttype)
        self.send_header("Content-Length", contentlen)
#         self.send_header("Access-Control-Allow-Origin", "*")
#         for k, v in self.extraHeaders.items():
#             self.send_header(k, v)
        self.end_headers()

    def log(self, *a):
        pass
    def log_message(self, format, *args):
        pass
    def do_POST(self):
        l = int(self.headers.get("Content-Length", 0))
        if l == 0:
            self.send_ok_header(0)
            return
        try:
            indata = self.rfile.read(l)
            commands = indata.decode()
            for com in commands.split("\n"):
                cmdArr = shlex.split(com)
                print("+", *cmdArr)
                subprocess.call(cmdArr)
        except:
            pass
        self.send_ok_header(0)


if __name__ == '__main__':
    rc = shutil.which("xdotool")
    if rc is None:
        print("Kindly install xdotool", file=sys.stderr)
        exit(2)
    test(partial(CORSRequestHandler, directory="html"), HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 9883)
