import time
import importlib.util
import json
from glob import glob
from http.server import BaseHTTPRequestHandler, HTTPServer
from cgi import parse_header, parse_multipart
from urllib.parse import parse_qs, urlparse

def load_plugins():

    plugin_dirs = glob("../plugins/*/")

    plugins = {}
    for dir in plugin_dirs:
        spec = importlib.util.spec_from_file_location(dir, dir + "/main.py")
        plugin = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(plugin)

        with open(dir + 'metadata.json') as metadata:
            md = json.load(metadata)
            graph_name = md['graphName']

        plugins[graph_name] = plugin

    return plugins

class PluginsController(BaseHTTPRequestHandler):

    PLUGINS = load_plugins()

    def do_GET(self):
        if '/api/plugins' in self.path:
            self.send_response(200)

            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            res = [*self.PLUGINS]
            res = json.dumps(res)

            self.wfile.write(res.encode(encoding='utf_8'))

    def do_POST(self):
        if '/api/autograph' in self.path:

            plugin_name = parse_qs(urlparse(self.path).query).get('plugin_name', None)[0]
            start_id_cnt = parse_qs(urlparse(self.path).query).get('start_id', None)[0]

            content_len = int(self.headers.get('Content-Length'))
            post_body = str(self.rfile.read(content_len), 'utf_8')

            response = self.PLUGINS[plugin_name].tag(post_body, start_id_cnt)

            self.send_response(200)

            self.send_header('Content-Type', 'application/json')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            print(response)
            self.wfile.write(response.encode(encoding='utf_8'))

if __name__ == '__main__':

    hostName = ""
    hostPort = 9000

    myServer = HTTPServer((hostName, hostPort), PluginsController)
    print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

    try:
        myServer.serve_forever()
    except KeyboardInterrupt:
        pass

    myServer.server_close()

    print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))